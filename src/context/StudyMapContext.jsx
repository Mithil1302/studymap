import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import conversationData from '../../data/conversation.json';
import conversationEmptyData from '../../data/conversation-empty.json';
import lecture01 from '../../data/lectures/lecture-01-linear-models.json';
import lecture02 from '../../data/lectures/lecture-02-gradient-descent.json';
import lecture03 from '../../data/lectures/lecture-03-regularization.json';
import { streamResponse } from '../../data/mock-stream.mjs';
import { useProgress } from './ProgressContext';
import { courseNodes } from '../data/courseGraph';

const StudyMapContext = createContext();

export function StudyMapProvider({ children }) {
  // Default to empty conversation
  const [useEmptyState, setUseEmptyState] = useState(true);
  const { markNodeInProgress } = useProgress();
  
  const currentConversation = useEmptyState ? conversationEmptyData : conversationData;
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

  // Streaming state, initialize from localStorage or empty array
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('studymap_conversation');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  
  // Persist messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studymap_conversation', JSON.stringify(messages));
  }, [messages]);

  const [activeStream, setActiveStream] = useState({ isStreaming: false, abortController: null });

  // Scenario matching utility
  const matchScenario = (text) => {
    const t = text.toLowerCase();
    
    // Test A
    if (t.match(/^(hi|hello|hey|greetings)\b/)) return 'greeting';
    // Test B
    if (t.includes('gradient descent')) return 'code';
    // Test C (training error / unseen data / overfitting)
    if (t.includes('training error') || t.includes('unseen data') || t.includes('overfit')) return 'slow'; // or table? slow mentions test set
    // Test D
    if (t.includes('vanishing gradient')) return 'long';
    // Test E
    if (t.includes('l1') || t.includes('l2') || t.includes('regularization')) return 'table';

    // General keyword matching (more precise to avoid collisions)
    if (t.includes('supervised') || t.includes('unsupervised')) return 'plain';
    if (t.includes('implement') || t.includes('code')) return 'code';
    if (t.includes('math') || t.includes('sigmoid') || t.includes('derivative')) return 'math';
    if (t.includes('compare') || t.includes('table')) return 'table';
    if (t.includes('backpropagation') || t.includes('everything')) return 'long';
    if (t.includes('slow') || t.includes('summarise') || t.includes('summarize')) return 'slow';
    if (t.includes('exam') || t.includes('schedule')) return 'refusal';
    
    // Specifically require 'midterm' or 'solutions' for the error scenario, 
    // because 'error' is too common a word (e.g. 'training error')
    if (t.includes('midterm') || t.includes('solutions')) return 'error-midstream';
    
    return 'refusal';
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
      
      // Update graph progress based on citations
      finalCitations.forEach(citation => {
        const slideData = getSlideFromCitation(citation);
        if (slideData) {
          // Find if this slide is mapped to a concept node
          const conceptNode = courseNodes.find(n => n.lectureId === slideData.lecture.lecture_id && n.slides && n.slides.includes(citation.slide));
          if (conceptNode) {
            markNodeInProgress(conceptNode.id);
          }
        }
      });
      
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

  return (
    <StudyMapContext.Provider
      value={{
        currentConversation: liveConversation,
        lectures,
        totalLectures,
        totalSlides,
        activeCitation,
        setActiveCitation,
        activeLecture,
        setActiveLecture,
        activeSlideData,
        useEmptyState,
        setUseEmptyState,
        sendMessage,
        cancelStream,
        activeStream
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
