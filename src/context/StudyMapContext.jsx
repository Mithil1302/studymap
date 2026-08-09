import { createContext, useContext, useState, useMemo } from 'react';
import conversationData from '../../data/conversation.json';
import conversationEmptyData from '../../data/conversation-empty.json';
import lecture01 from '../../data/lectures/lecture-01-linear-models.json';
import lecture02 from '../../data/lectures/lecture-02-gradient-descent.json';
import lecture03 from '../../data/lectures/lecture-03-regularization.json';
import { streamResponse } from '../../data/mock-stream.mjs';

const StudyMapContext = createContext();

export function StudyMapProvider({ children }) {
  // For testing empty state vs populated, we will keep a boolean toggle or just provide both.
  // We'll default to the populated conversation to satisfy the initial prompt requirement to render conversation.json.
  const [useEmptyState, setUseEmptyState] = useState(false);
  
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

  // Streaming state
  const [messages, setMessages] = useState(currentConversation.messages || []);
  const [activeStream, setActiveStream] = useState({ isStreaming: false, abortController: null });

  // Scenario matching utility
  const matchScenario = (text) => {
    const t = text.toLowerCase();
    if (t.includes('code') || t.includes('implement')) return 'code';
    if (t.includes('math') || t.includes('sigmoid') || t.includes('derivative')) return 'math';
    if (t.includes('table') || t.includes('regularization') || t.includes('compare')) return 'table';
    if (t.includes('long') || t.includes('backpropagation') || t.includes('everything')) return 'long';
    if (t.includes('slow') || t.includes('summarise') || t.includes('summarize')) return 'slow';
    if (t.includes('refusal') || t.includes('exam') || t.includes('schedule')) return 'refusal';
    if (t.includes('error') || t.includes('midterm') || t.includes('solutions')) return 'error-midstream';
    return 'plain';
  };

  const sendMessage = async (text) => {
    if (activeStream.isStreaming) return;

    // 1. Add student message
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    
    // 2. Add placeholder assistant message
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg = { id: assistantId, role: 'assistant', content: '', status: 'thinking', citations: [] };
    
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    
    // 3. Start stream
    const scenarioId = matchScenario(text);
    const controller = new AbortController();
    setActiveStream({ isStreaming: true, abortController: controller });

    try {
      let isFirstChunk = true;
      let finalCitations = [];
      
      // Attempt to get citations directly if possible from the module, 
      // but streamResponse doesn't yield citations, it only yields string chunks.
      // We can fetch the scenario object to grab citations.
      // Wait, mock-stream.mjs exports getScenario. Let's import it.
      
      for await (const chunk of streamResponse(scenarioId, { signal: controller.signal })) {
        if (isFirstChunk) {
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, status: 'streaming' } : m));
          isFirstChunk = false;
        }
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
      }
      
      // Dynamic import to avoid circular dep if any, or just import getScenario at the top
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

  // Override currentConversation to use local state
  const liveConversation = { ...currentConversation, messages };

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
