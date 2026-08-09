import { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ContextPanel from '../components/layout/ContextPanel';
import { useStudyMap } from '../context/StudyMapContext';

export default function Conversation() {
  const { currentConversation, setActiveCitation, sendMessage, cancelStream, activeStream } = useStudyMap();
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages or chunks
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation.messages]);

  if (!currentConversation || currentConversation.messages.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 bg-surface-container-low/50 relative">
        <div className="flex-1 overflow-y-auto px-margin-page pt-margin-page pb-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {currentConversation.messages.map((msg, idx) => (
              msg.role === 'user' ? (
                /* Student Question */
                <div key={msg.id || idx} className="flex justify-end mb-4 animate-fade-in-up">
                  <div className="bg-white border-2 border-primary rounded-lg rounded-tr-none p-4 max-w-[80%] hard-shadow-sm relative">
                    <p className="text-body-md font-body-md">{msg.content}</p>
                    <div className="absolute -top-3 -right-3 bg-tertiary-container text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-primary">
                      Me
                    </div>
                  </div>
                </div>
              ) : (
                /* Tutor Response (Notebook Style) */
                <div key={msg.id || idx} className="bg-white border-2 border-primary rounded-xl p-8 hard-shadow relative mb-12 animate-fade-in-up">
                  <div className="absolute top-0 bottom-0 left-8 w-px bg-warning-coral/30"></div>
                  <div className="relative z-10 pl-4 notebook-line pb-4 min-h-[4rem]">
                    {msg.status === 'thinking' && (
                      <div className="flex items-center gap-2 text-on-surface-variant italic font-body-md animate-pulse mt-2">
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        Thinking through your course material...
                      </div>
                    )}
                    {(msg.status === 'streaming' || msg.status === 'complete' || msg.status === 'error' || msg.status === 'cancelled') && (
                      <MarkdownRenderer content={msg.content} />
                    )}
                    {msg.status === 'streaming' && (
                      <div className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></div>
                    )}
                    {msg.status === 'error' && (
                      <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded text-error flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-sm">error</span>
                        Something went wrong while generating this answer.
                      </div>
                    )}
                    {msg.status === 'cancelled' && (
                      <div className="mt-4 p-3 bg-surface-container-low border border-outline rounded text-on-surface-variant flex items-center gap-2 text-sm italic">
                        <span className="material-symbols-outlined text-sm">stop_circle</span>
                        Response cancelled by user.
                      </div>
                    )}
                  </div>
                  
                  {/* Source Chips */}
                  {msg.citations && msg.citations.length > 0 && msg.status === 'complete' && (
                    <div className="absolute -bottom-4 right-8 flex flex-col items-end">
                      <span className="text-sm handwritten-blue mb-1 mr-2">from the lecture</span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {msg.citations.map((cit, cIdx) => (
                          <button 
                            key={cIdx} 
                            onClick={() => setActiveCitation(cit)}
                            className="bg-surface-bright border-2 border-primary px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-secondary-container transition-colors hard-shadow-sm font-label-caps text-label-caps font-bold text-[#2196F3]"
                          >
                            [ {cit.lecture.toUpperCase().substring(0, 7)} · SLIDE {cit.slide.toString().padStart(2, '0')} ]
                            <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ))}
            <div ref={bottomRef} />
          </div>
        </div>



        {/* Floating Question Composer */}
        <div className="p-6 md:p-8 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (inputText.trim() && !activeStream.isStreaming) {
                  sendMessage(inputText.trim());
                  setInputText('');
                }
              }}
              className="bg-white border-2 border-primary p-2 rounded-xl hard-shadow flex items-center gap-2"
            >
              <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input 
                className="flex-grow border-none focus:ring-0 text-body-md font-body-md bg-transparent outline-none placeholder:text-annotation-sm placeholder:font-annotation-sm placeholder:text-on-surface-variant" 
                placeholder="Ask something about the course..." 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={activeStream.isStreaming}
              />
              {activeStream.isStreaming ? (
                <button 
                  type="button"
                  onClick={cancelStream}
                  className="bg-error text-white p-2 rounded-lg hover:bg-error/80 transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">stop</span>
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-tertiary-container transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              )}
            </form>
          </div>
        </div>
      </main>

      <ContextPanel />
    </>
  );
}
