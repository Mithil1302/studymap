import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import lecture01 from '../../data/lectures/lecture-01-linear-models.json';
import lecture02 from '../../data/lectures/lecture-02-gradient-descent.json';
import lecture03 from '../../data/lectures/lecture-03-regularization.json';
import { streamResponse } from '../../data/mock-stream.mjs';
import { useProgress } from './ProgressContext';
import { courseNodes } from '../data/courseGraph';

const StudyMapContext = createContext();

export function StudyMapProvider({ children }) {
  const { markNodeInProgress, markNodeCompleted } = useProgress();
  const lectures = useMemo(() => [lecture01, lecture02, lecture03], []);

  // activeCitation format: { lecture: "Lecture Title", slide: number }
  const [activeCitation, setActiveCitation] = useState(null);
  
  // activeLecture: full lecture object when viewing LectureDetail
  const [activeLecture, setActiveLecture] = useState(lectures[0]);

  // Derived stats
  const totalLectures = lectures.length;
  const totalSlides = lectures.reduce((acc, lec) => acc + lec.slides.length, 0);

  // Helper to find specific slide
  const getSlideFromCitation = (citation) => {
    if (!citation) return null;
    const lecture = lectures.find(l => l.title === citation.lecture || `Week ${l.week} — ${l.title}` === citation.lecture);
    if (!lecture) return null;
    return {
      lecture,
      slide: lecture.slides.find(s => s.slide_number === citation.slide)
    };
  };

  const activeSlideData = getSlideFromCitation(activeCitation);

  // Streaming state, initialize from localStorage or empty default
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem('studymap_conversations_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sanitize messages: any stuck in 'thinking' or 'streaming' should be marked as 'error'
        Object.values(parsed).forEach(conv => {
          conv.messages = conv.messages.map(msg => {
            if (msg.status === 'thinking' || msg.status === 'streaming') {
              return { ...msg, status: 'error' };
            }
            return msg;
          });
        });
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    // ALWAYS start with a genuinely empty conversation on first launch
    return {
      'demo': {
        id: 'demo',
        messages: []
      }
    };
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    try {
      const stored = localStorage.getItem('studymap_active_conversation_id');
      const parsedConversations = localStorage.getItem('studymap_conversations_v3') ? JSON.parse(localStorage.getItem('studymap_conversations_v3')) : null;
      if (stored && parsedConversations && parsedConversations[stored]) {
        return stored;
      }
    } catch(e) {
      console.error(e);
    }
    return 'demo';
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studymap_conversations_v3', JSON.stringify(conversations));
    localStorage.setItem('studymap_active_conversation_id', activeConversationId);
  }, [conversations, activeConversationId]);

  // Derived active messages
  const messages = conversations[activeConversationId]?.messages || [];

  // Helper to update messages for the active conversation
  const setMessages = (updater) => {
    setConversations(prev => {
      const active = prev[activeConversationId];
      if (!active) return prev;
      const newMessages = typeof updater === 'function' ? updater(active.messages) : updater;
      return {
        ...prev,
        [activeConversationId]: {
          ...active,
          messages: newMessages
        }
      };
    });
  };

  const startNewConversation = () => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    setConversations(prev => ({
      ...prev,
      [newId]: { id: newId, messages: [] }
    }));
    setActiveConversationId(newId);
  };

  const [activeStream, setActiveStream] = useState({ isStreaming: false, abortController: null });

  // Scenario matching utility
  const matchScenario = (text) => {
    const t = text.trim().toLowerCase().replace(/[?.,!]/g, ''); // strip basic punctuation for matching
    
    // Explicit exact matching based on mock data prompts
    if (t === 'hi' || t === 'hello' || t === 'hi/hello' || t === 'hey') return 'greeting';
    if (t === 'what is the difference between supervised and unsupervised learning') return 'plain';
    if (t === 'show me how gradient descent is implemented') return 'code';
    if (t === 'why is the sigmoid derivative at most 025') return 'math';
    if (t === 'compare the regularization techniques we covered') return 'table';
    if (t === 'explain everything about backpropagation') return 'long';
    if (t === 'when is the final exam') return 'refusal';
    if (t === 'walk me through the midterm solutions') return 'error-midstream';
    if (t === 'summarise the whole course so far' || t === 'summarize the whole course so far') return 'slow';
    
    // Additional exact matches from the user's test script
    if (t === 'what is gradient descent') return 'code';
    if (t === 'what is backpropagation') return 'long';
    if (t === 'why is the chain rule important for backpropagation') return 'long';
    if (t === 'what is the difference between l1 and l2 regularization') return 'table';
    
    return 'fallback';
  };

  const sendMessage = async (text) => {
    if (activeStream.isStreaming) return;

    // 1. Add student message
    const userMsg = { id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), role: 'user', content: text };
    
    // 2. Add placeholder assistant message
    const assistantId = crypto.randomUUID ? crypto.randomUUID() : (Date.now() + 1).toString();
    const assistantMsg = { id: assistantId, role: 'assistant', content: '', status: 'thinking', citations: [] };
    
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    
    // 3. Start stream
    const scenarioId = matchScenario(text);
    const controller = new AbortController();
    setActiveStream({ isStreaming: true, abortController: controller });

    try {
      let isFirstChunk = true;
      let finalCitations = [];
      
      for await (const chunk of streamResponse(scenarioId, { signal: controller.signal })) {
        if (isFirstChunk) {
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, status: 'streaming' } : m));
          isFirstChunk = false;
        }
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
      }
      
      const { getScenario } = await import('../../data/mock-stream.mjs');
      const scenario = getScenario(scenarioId);
      finalCitations = scenario.citations || [];

      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, status: 'complete', citations: finalCitations } : m));
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, status: 'cancelled' } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, status: 'error' } : m));
      }
    } finally {
      setActiveStream({ isStreaming: false, abortController: null });
    }
  };

  const cancelStream = () => {
    if (activeStream.abortController) {
      activeStream.abortController.abort();
    }
  };

  // Provide a clean currentConversation object for Conversation.jsx to consume
  const liveConversation = { messages };

  // Wrapper for setActiveCitation to also track progress
  const handleSetActiveCitation = (citation) => {
    setActiveCitation(citation);
    const slideData = getSlideFromCitation(citation);
    if (slideData) {
      const conceptNode = courseNodes.find(n => n.lectureId === slideData.lecture.lecture_id && n.slides && n.slides.includes(citation.slide));
      if (conceptNode) {
        // Mark node in progress when user explicitly clicks the citation to view it
        markNodeInProgress(conceptNode.id);
      }
    }
  };

  return (
    <StudyMapContext.Provider
      value={{
        currentConversation: liveConversation,
        lectures,
        totalLectures,
        totalSlides,
        activeCitation,
        setActiveCitation: handleSetActiveCitation,
        activeLecture,
        setActiveLecture,
        activeSlideData,
        sendMessage,
        cancelStream,
        activeStream,
        startNewConversation
      }}
    >
      {children}
    </StudyMapContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStudyMap() {
  const context = useContext(StudyMapContext);
  if (!context) {
    throw new Error('useStudyMap must be used within a StudyMapProvider');
  }
  return context;
}
