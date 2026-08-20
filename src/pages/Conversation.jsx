import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStudyMap } from '../context/StudyMapContext';
import ConversationSurface from '../components/conversation/ConversationSurface';

export default function Conversation() {
  const { currentConversation, setActiveCitation, sendMessage, cancelStream, activeStream } = useStudyMap();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef(null);

  // Pre-fill from Knowledge Map: ?topic=Chain%20Rule → "Explain Chain Rule"
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) {
      setInputText(`Explain ${topic}`);
      // Clear the param so it doesn't re-trigger
      searchParams.delete('topic');
      setSearchParams(searchParams, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom on new messages or chunks
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation.messages]);

  // No longer redirect on empty messages to allow the empty state to render.

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
          activeStream={activeStream}
          onCitationClick={setActiveCitation}
        />
      </main>
    </>
  );
}
