import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import lecture01 from '../../data/lectures/lecture-01-linear-models.json';
import lecture02 from '../../data/lectures/lecture-02-gradient-descent.json';
import lecture03 from '../../data/lectures/lecture-03-regularization.json';
import { streamResponse, getScenario } from '../../data/mock-stream.mjs';
import { useProgress } from './ProgressContext';
import { courseNodes } from '../data/courseGraph';
import conversationFixture from '../../data/conversation.json';
import conversationEmpty from '../../data/conversation-empty.json';
import { resolveTutorScenario } from '../utils/resolveTutorScenario';

const StudyMapContext = createContext();

// ─── localStorage keys ───────────────────────────────────────────────────────
const CONVERSATIONS_KEY = 'studymap_conversations_v3';
const ACTIVE_ID_KEY     = 'studymap_active_conversation_id';

// ─── Fixture helpers ──────────────────────────────────────────────────────────
/** Build the demo conversation from the read-only fixture. */
function buildFixtureConversation() {
  return {
    id: conversationFixture.id,
    messages: conversationFixture.messages.map(msg => ({
      ...msg,
      // Pre-existing messages are complete; add runtime status in-memory only.
      ...(msg.role === 'assistant' ? { status: 'complete' } : {}),
    })),
    source: 'fixture',
  };
}

/** Build the empty-start conversation from the read-only fixture. */
function buildEmptyConversation() {
  const newId = conversationEmpty.id + '_' + Date.now();
  return {
    id: newId,
    messages: [],
    source: 'empty',
  };
}

// ─── localStorage initialization ──────────────────────────────────────────────
/**
 * Three conversation states:
 *
 *  A. FIRST-TIME USER  — no stored conversations with messages
 *     → initialize from conversation.json (shows the realistic demo fixture)
 *
 *  B. RETURNING USER   — stored conversations with at least one message
 *     → restore from localStorage
 *
 *  C. NEW CONVERSATION — user explicitly clicked "New Conversation"
 *     → initialized from conversation-empty.json (handled by startNewConversation)
 */
function initConversations() {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const hasMessages = Object.values(parsed).some(
        c => Array.isArray(c.messages) && c.messages.length > 0
      );
      if (hasMessages) {
        // B. Returning user: sanitize stuck streaming states and restore.
        Object.values(parsed).forEach(conv => {
          conv.messages = (conv.messages || []).map(msg => {
            if (msg.status === 'thinking' || msg.status === 'streaming') {
              return { ...msg, status: 'error' };
            }
            return msg;
          });
        });
        return { conversations: parsed, activeId: getStoredActiveId(parsed) };
      }
    }
  } catch (_) {
    console.error('[StudyMap] Failed to restore conversations.');
  }
  // A. First-time user: load fixture.
  const fixture = buildFixtureConversation();
  return {
    conversations: { [fixture.id]: fixture },
    activeId: fixture.id,
  };
}

function getStoredActiveId(parsed) {
  try {
    const stored = localStorage.getItem(ACTIVE_ID_KEY);
    if (stored && parsed[stored]) return stored;
  } catch (e) { /* ignore */ }
  return Object.keys(parsed)[0] || null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function StudyMapProvider({ children }) {
  const { markNodeInProgress } = useProgress();
  const lectures = useMemo(() => [lecture01, lecture02, lecture03], []);

  // activeCitation format: { lecture: "Lecture Title", slide: number }
  const [activeCitation, setActiveCitation] = useState(null);

  // activeLecture: full lecture object when viewing LectureDetail
  const [activeLecture, setActiveLecture] = useState(lectures[0]);

  // Derived stats
  const totalLectures = lectures.length;
  const totalSlides = lectures.reduce((acc, lec) => acc + lec.slides.length, 0);

  // Helper to find specific slide from a citation object
  const getSlideFromCitation = (citation) => {
    if (!citation) return null;
    const lecture = lectures.find(
      l => l.title === citation.lecture || `Week ${l.week} — ${l.title}` === citation.lecture
    );
    if (!lecture) return null;
    return {
      lecture,
      slide: lecture.slides.find(s => s.slide_number === citation.slide),
    };
  };

  const activeSlideData = getSlideFromCitation(activeCitation);

  // ── Conversation state ────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/use-memo
  const { conversations: initConvs, activeId: initActiveId } = useMemo(() => initConversations(), []);

  const [conversations, setConversations] = useState(initConvs);
  const [activeConversationId, setActiveConversationId] = useState(initActiveId);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    localStorage.setItem(ACTIVE_ID_KEY, activeConversationId);
  }, [conversations, activeConversationId]);

  // Derived active messages list
  const messages = conversations[activeConversationId]?.messages || [];

  // Helper to update messages for the active conversation
  const setMessages = (updater) => {
    setConversations(prev => {
      const active = prev[activeConversationId];
      if (!active) return prev;
      const newMessages = typeof updater === 'function'
        ? updater(active.messages)
        : updater;
      return {
        ...prev,
        [activeConversationId]: { ...active, messages: newMessages },
      };
    });
  };

  /** C. Start a new empty conversation (from conversation-empty.json state). */
  const startNewConversation = () => {
    const empty = buildEmptyConversation();
    setConversations(prev => ({ ...prev, [empty.id]: empty }));
    setActiveConversationId(empty.id);
  };

  // ── Streaming state ───────────────────────────────────────────────────────
  const [activeStream, setActiveStream] = useState({
    isStreaming: false,
    abortController: null,
  });

  // ── Extract concepts from query to update Learning Map ───────────────────
  const extractConceptsFromQuery = (text, nodes) => {
    const normalized = text.trim().toLowerCase().replace(/[?.,!]/g, '');
    const matched = [];
    for (const node of nodes) {
      if (node.type === 'core') continue;
      let match = normalized.includes(node.title.toLowerCase());
      if (!match && node.aliases) {
        match = node.aliases.some(a => normalized.includes(a.toLowerCase()));
      }
      if (match) matched.push(node.id);
    }
    return matched;
  };

  // ── Core stream execution (shared by sendMessage and retryMessage) ────────
  async function runStream(scenarioId, assistantId, controller) {
    try {
      let isFirstChunk = true;
      for await (const chunk of streamResponse(scenarioId, { signal: controller.signal })) {
        if (isFirstChunk) {
          setMessages(prev =>
            prev.map(m => m.id === assistantId ? { ...m, status: 'streaming' } : m)
          );
          isFirstChunk = false;
        }
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
        );
      }

      // Fetch citations from the statically-imported getScenario
      const scenario = getScenario(scenarioId);
      const finalCitations = scenario.citations || [];

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, status: 'complete', citations: finalCitations }
            : m
        )
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, status: 'cancelled' } : m)
        );
      } else {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, status: 'error' } : m)
        );
      }
    } finally {
      setActiveStream({ isStreaming: false, abortController: null });
    }
  }

  // ── Send a new message ────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    if (activeStream.isStreaming) return;

    // Mark concepts as in-progress on the Learning Map
    const conceptIds = extractConceptsFromQuery(text, courseNodes);
    conceptIds.forEach(id => markNodeInProgress(id));

    // Resolve the scenario deterministically from responses.json metadata
    const scenarioId = resolveTutorScenario(text);

    // 1. Append the student's message
    const userMsg = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      role: 'user',
      content: text,
    };

    // 2. Append the assistant placeholder (with scenarioId stored for Retry)
    const assistantId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 1);
    const assistantMsg = {
      id: assistantId,
      role: 'assistant',
      content: '',
      status: 'thinking',
      citations: [],
      scenarioId, // ← stored so Retry can re-run exactly the same scenario
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);

    // 3. Start stream
    const controller = new AbortController();
    setActiveStream({ isStreaming: true, abortController: controller });
    await runStream(scenarioId, assistantId, controller);
  };

  // ── Cancel the active stream ──────────────────────────────────────────────
  const cancelStream = () => {
    if (activeStream.abortController) {
      activeStream.abortController.abort();
    }
  };

  // ── Retry a failed/error message ──────────────────────────────────────────
  const retryMessage = async (messageId) => {
    if (activeStream.isStreaming) return;

    const currentMsgs = conversations[activeConversationId]?.messages || [];
    const failedMsg = currentMsgs.find(m => m.id === messageId);
    if (!failedMsg || !failedMsg.scenarioId) return;

    const { scenarioId } = failedMsg;

    // Reset the failed message: clear content, restore thinking state
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, content: '', status: 'thinking' } : m
      )
    );

    const controller = new AbortController();
    setActiveStream({ isStreaming: true, abortController: controller });
    await runStream(scenarioId, messageId, controller);
  };

  // ── Wrapper for setActiveCitation (also marks node progress) ─────────────
  const handleSetActiveCitation = (citation) => {
    setActiveCitation(citation);
    const slideData = getSlideFromCitation(citation);
    if (slideData) {
      const conceptNode = courseNodes.find(
        n =>
          n.lectureId === slideData.lecture.lecture_id &&
          n.slides &&
          n.slides.includes(citation.slide)
      );
      if (conceptNode) markNodeInProgress(conceptNode.id);
    }
  };

  return (
    <StudyMapContext.Provider
      value={{
        currentConversation: { messages },
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
        retryMessage,
        activeStream,
        startNewConversation,
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
