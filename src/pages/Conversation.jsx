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

  // No longer redirect on empty messages to allow the empty state to render.

  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 bg-surface-container-low/50 relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-margin-page pt-4 md:pt-margin-page pb-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-6 md:gap-8">
            {currentConversation.messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up mt-12 md:mt-24 px-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6 border-2 border-primary border-dashed">
                  <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">school</span>
                </div>
                <h1 className="text-3xl md:text-display-sm font-display-sm text-primary mb-2">Ready when you are.</h1>
                <p className="text-base md:text-body-lg text-on-surface-variant mb-8 md:mb-12 max-w-md">Ask your tutor anything from the course.</p>
                
                <div className="flex flex-col gap-3 w-full max-w-sm text-left">
                  <p className="text-label-caps font-label-caps text-on-surface-variant text-center mb-2">Try asking:</p>
                  <button 
                    onClick={() => { setInputText('What is gradient descent?'); }}
                    className="bg-white border-2 border-primary p-3 rounded-lg text-sm md:text-body-md hover:bg-primary/5 transition-colors hard-shadow-sm text-left flex justify-between items-center group"
                  >
                    What is gradient descent?
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm">arrow_forward</span>
                  </button>
                  <button 
                    onClick={() => { setInputText('Explain the vanishing gradient problem'); }}
                    className="bg-white border-2 border-primary p-3 rounded-lg text-sm md:text-body-md hover:bg-primary/5 transition-colors hard-shadow-sm text-left flex justify-between items-center group"
                  >
                    Explain the vanishing gradient problem
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm">arrow_forward</span>
                  </button>
                  <button 
                    onClick={() => { setInputText('Compare L1 and L2 regularization'); }}
                    className="bg-white border-2 border-primary p-3 rounded-lg text-sm md:text-body-md hover:bg-primary/5 transition-colors hard-shadow-sm text-left flex justify-between items-center group"
                  >
                    Compare L1 and L2 regularization
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ) : (
              currentConversation.messages.map((msg, idx) => (
                msg.role === 'user' ? (
                  /* Student Question */
                  <div key={msg.id || idx} className="flex justify-end mb-2 md:mb-4 animate-fade-in-up">
                    <div className="bg-white border-2 border-primary rounded-lg rounded-tr-none p-3 md:p-4 max-w-[90%] md:max-w-[80%] hard-shadow-sm relative">
                      <p className="text-sm md:text-body-md font-body-md break-words">{msg.content}</p>
                      <div className="absolute -top-3 -right-3 bg-tertiary-container text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-primary">
                        Me
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tutor Response (Notebook Style) */
                  <div key={msg.id || idx} className="bg-white border-2 border-primary rounded-xl p-5 md:p-8 hard-shadow relative mb-8 md:mb-12 animate-fade-in-up w-full">
                    <div className="absolute top-0 bottom-0 left-4 md:left-8 w-px bg-warning-coral/30"></div>
                    <div className="relative z-10 pl-3 md:pl-4 notebook-line pb-4 min-h-[4rem] w-full max-w-full overflow-hidden">
                      {msg.status === 'thinking' && (
                        <div className="flex items-center gap-2 text-on-surface-variant italic font-body-md animate-pulse mt-2">
                          <span className="material-symbols-outlined text-sm">psychology</span>
                          Thinking through your course material...
                        </div>
                      )}
                      {(msg.status === 'streaming' || msg.status === 'complete' || msg.status === 'error' || msg.status === 'cancelled') && (
                        <div className="max-w-full overflow-hidden break-words prose-p:my-2">
                          <MarkdownRenderer content={msg.content} />
                        </div>
                      )}
                      {msg.status === 'streaming' && (
                        <div className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></div>
                      )}
                      {msg.status === 'error' && (
                        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded text-error flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-sm shrink-0">error</span>
                          Something went wrong while generating this answer.
                        </div>
                      )}
                      {msg.status === 'cancelled' && (
                        <div className="mt-4 p-3 bg-surface-container-low border border-outline rounded text-on-surface-variant flex items-center gap-2 text-sm italic">
                          <span className="material-symbols-outlined text-sm shrink-0">stop_circle</span>
                          Response cancelled by user.
                        </div>
                      )}
                    </div>
                    
                    {/* Source Chips */}
                    {msg.citations && msg.citations.length > 0 && msg.status === 'complete' && (
                      <div className="absolute -bottom-4 right-4 md:right-8 flex flex-col items-end">
                        <span className="text-xs md:text-sm handwritten-blue mb-1 mr-2">from the lecture</span>
                        <div className="flex gap-2 flex-wrap justify-end">
                          {msg.citations.map((cit, cIdx) => (
                            <button 
                              key={cIdx} 
                              onClick={() => setActiveCitation(cit)}
                              className="bg-surface-bright border-2 border-primary px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 md:gap-2 hover:bg-secondary-container transition-colors hard-shadow-sm font-label-caps text-[10px] md:text-label-caps font-bold text-[#2196F3]"
                            >
                              [ {cit.lecture.toUpperCase().substring(0, 7)} · SLIDE {cit.slide.toString().padStart(2, '0')} ]
                              <span className="material-symbols-outlined text-[12px] md:text-[14px]">arrow_outward</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>



        {/* Floating Question Composer */}
        <div className="p-4 md:p-6 lg:p-8 flex-shrink-0 bg-background/95 backdrop-blur-sm z-20">
          <div className="max-w-3xl mx-auto w-full">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (inputText.trim() && !activeStream.isStreaming) {
                  sendMessage(inputText.trim());
                  setInputText('');
                }
              }}
              className="bg-white border-2 border-primary p-1.5 md:p-2 rounded-xl hard-shadow flex items-center gap-2 w-full"
            >
              <button type="button" className="p-1 md:p-2 text-on-surface-variant hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">attach_file</span>
              </button>
              <input 
                className="flex-grow min-w-0 border-none focus:ring-0 text-sm md:text-body-md font-body-md bg-transparent outline-none placeholder:text-annotation-sm placeholder:font-annotation-sm placeholder:text-on-surface-variant/70" 
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
                  className="bg-error text-white p-1.5 md:p-2 rounded-lg hover:bg-error/80 transition-colors flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">stop</span>
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-primary text-white p-1.5 md:p-2 rounded-lg hover:bg-tertiary-container transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <span className="material-symbols-outlined text-lg md:text-xl">send</span>
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
