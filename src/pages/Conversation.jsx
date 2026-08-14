import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStudyMap } from '../context/StudyMapContext';
import ConversationSurface from '../components/conversation/ConversationSurface';

export default function Conversation() {
  const {
    currentConversation,
    setActiveCitation,
    lectures,
    sendMessage,
    cancelStream,
    retryMessage,
    activeStream,
  } = useStudyMap();

  const [searchParams, setSearchParams] = useSearchParams();
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  // Pre-fill from Learning Map: /conversation?topic=Chain%20Rule → "Explain Chain Rule"
  // The student must press Send — it does NOT auto-submit.
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) {
      setInputText(`Explain ${topic}`);
      searchParams.delete('topic');
      setSearchParams(searchParams, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ConversationSurface owns the scroll container and bottomRef.
  // Do NOT add a competing scroll here.

  /**
   * Citation click handler.
   *
   * citation format: { lecture: "Week 2 — Gradient Descent and Backpropagation", slide: 9 }
   *
   * Strategy:
   *  1. Set activeCitation in context (keeps the existing citation tracking).
   *  2. Resolve the lecture object from the citation's title.
   *  3. Navigate to /lectures/:lecture_id?slide=N so the notebook opens at the right page.
   */
  const handleCitationClick = (citation) => {
    // 1. Update context citation state
    setActiveCitation(citation);

    // 2. Find the lecture whose title matches the citation string.
    //    Citation lecture strings are formatted as "Week N — Lecture Title".
    //    Lecture objects have a `title` field (just the title, no week prefix).
    const matchedLecture = lectures.find((l) => {
      const canonical = `Week ${l.week} — ${l.title}`;
      return canonical === citation.lecture || l.title === citation.lecture;
    });

    if (!matchedLecture) return; // safety: don't navigate to an unknown lecture

    // 3. Navigate to the notebook reader at the exact slide
    navigate(`/lectures/${matchedLecture.lecture_id}?slide=${citation.slide}`);
  };

  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 bg-surface-container-low/50 relative">
        <ConversationSurface
          messages={currentConversation.messages}
          variant="full"
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={sendMessage}
          onCancelStream={cancelStream}
          onRetry={retryMessage}
          activeStream={activeStream}
          onCitationClick={handleCitationClick}
        />
      </main>
    </>
  );
}
