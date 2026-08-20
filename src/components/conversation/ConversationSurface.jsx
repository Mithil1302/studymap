import { useRef, useEffect } from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

export default function ConversationSurface({
  messages,
  variant = 'full',
  inputText = '',
  setInputText,
  onSendMessage,
  onCancelStream,
  activeStream = { isStreaming: false },
  onCitationClick
}) {
  const isLaptop = variant === 'laptop';
  const bottomRef = useRef(null);

  // Auto-scroll logic only really needed in full variant, but harmless
  useEffect(() => {
    if (!isLaptop) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLaptop]);

  // CSS mappings for scale based on variant
  // Full variant preserves EXACT original styling.
  // Laptop variant simply scales down sizes and padding.
  
  const s = {
    px: isLaptop ? 'px-2' : 'px-4 md:px-margin-page',
    pt: isLaptop ? 'pt-2' : 'pt-4 md:pt-margin-page',
    pb: isLaptop ? 'pb-2' : 'pb-8',
    gap: isLaptop ? 'gap-3' : 'gap-6 md:gap-8',
    emptyIcon: isLaptop ? 'w-8 h-8 text-lg' : 'w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl',
    emptyTitle: isLaptop ? 'text-lg' : 'text-3xl md:text-display-sm font-display-sm',
    emptySub: isLaptop ? 'text-xs mb-4' : 'text-base md:text-body-lg mb-8 md:mb-12',
    userMargin: isLaptop ? 'mb-2' : 'mb-2 md:mb-4',
    userPadding: isLaptop ? 'p-2' : 'p-3 md:p-4',
    userText: isLaptop ? 'text-[10px] leading-tight font-body-md' : 'text-sm md:text-body-md font-body-md',
    userBadge: isLaptop ? '-top-2 -right-2 w-4 h-4 text-[8px] border' : '-top-3 -right-3 w-6 h-6 text-xs border-2',
    tutorPadding: isLaptop ? 'p-3' : 'p-5 md:p-8',
    tutorMargin: isLaptop ? 'mb-4' : 'mb-8 md:mb-12',
    tutorLine: isLaptop ? 'left-2' : 'left-4 md:left-8',
    tutorContentPadding: isLaptop ? 'pl-2 min-h-[2rem]' : 'pl-3 md:pl-4 min-h-[4rem]',
    tutorText: isLaptop ? 'text-[10px] leading-relaxed prose-p:my-1' : 'prose-p:my-2',
    citationBottom: isLaptop ? '-bottom-3 right-3' : '-bottom-4 right-4 md:right-8',
    citationLabel: isLaptop ? 'text-[8px] mb-0.5 mr-1' : 'text-xs md:text-sm mb-1 mr-2',
    citationChip: isLaptop ? 'px-1.5 py-0.5 border text-[7px] gap-1' : 'px-2 md:px-3 py-1 md:py-1.5 border-2 text-[10px] md:text-label-caps gap-1 md:gap-2',
    citationIcon: isLaptop ? 'text-[10px]' : 'text-[12px] md:text-[14px]',
    composerWrap: isLaptop ? 'p-2' : 'p-4 md:p-6 lg:p-8',
    composerInner: isLaptop ? 'p-1 border' : 'p-1.5 md:p-2 border-2',
    composerIconBtn: isLaptop ? 'p-0.5' : 'p-1 md:p-2',
    composerIcon: isLaptop ? 'text-sm' : 'text-xl md:text-2xl',
    composerInput: isLaptop ? 'text-[10px]' : 'text-sm md:text-body-md font-body-md',
    composerSendBtn: isLaptop ? 'p-1 rounded-sm' : 'p-1.5 md:p-2 rounded-lg',
    composerSendIcon: isLaptop ? 'text-sm' : 'text-lg md:text-xl',
  };

  return (
    <div className={`flex-1 flex flex-col min-w-0 min-h-0 relative ${isLaptop ? 'h-full w-full pointer-events-none bg-[#f5f5f0]' : 'bg-surface-container-low/50'}`}>
      <div className={`flex-1 overflow-y-auto ${s.px} ${s.pt} ${s.pb}`}>
        <div className={`max-w-3xl mx-auto flex flex-col ${s.gap}`}>
          {messages.length === 0 ? (
            <div className={`flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up mt-12 md:mt-24 px-4 ${isLaptop ? 'opacity-70' : ''}`}>
              <div className={`bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6 border-2 border-primary border-dashed ${s.emptyIcon}`}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 'inherit' }}>school</span>
              </div>
              <h1 className={`text-primary mb-2 ${s.emptyTitle}`}>Ready when you are.</h1>
              <p className={`text-on-surface-variant max-w-md ${s.emptySub}`}>Ask your tutor anything from the course.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              msg.role === 'user' ? (
                /* Student Question */
                <div key={msg.id || idx} className={`flex justify-end ${s.userMargin} animate-fade-in-up`}>
                  <div className={`bg-white ${isLaptop ? 'border' : 'border-2'} border-primary rounded-lg rounded-tr-none ${s.userPadding} max-w-[90%] md:max-w-[80%] hard-shadow-sm relative`}>
                    <p className={`break-words ${s.userText}`}>{msg.content}</p>
                    <div className={`absolute bg-tertiary-container text-white rounded-full flex items-center justify-center font-bold border-primary ${s.userBadge}`}>
                      Me
                    </div>
                  </div>
                </div>
              ) : (
                /* Tutor Response (Notebook Style) */
                <div key={msg.id || idx} className={`bg-white ${isLaptop ? 'border' : 'border-2'} border-primary rounded-xl ${s.tutorPadding} hard-shadow relative ${s.tutorMargin} animate-fade-in-up w-full`}>
                  <div className={`absolute top-0 bottom-0 w-px bg-warning-coral/30 ${s.tutorLine}`}></div>
                  <div className={`relative z-10 notebook-line w-full max-w-full overflow-hidden ${s.tutorContentPadding}`}>
                    {msg.status === 'thinking' && (
                      <div className={`flex items-center gap-2 text-on-surface-variant italic font-body-md animate-pulse mt-2 ${isLaptop ? 'text-[10px]' : ''}`}>
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        Thinking...
                      </div>
                    )}
                    {(!msg.status || msg.status === 'streaming' || msg.status === 'complete' || msg.status === 'error' || msg.status === 'cancelled') && (
                      <div className={`max-w-full overflow-x-auto break-words ${s.tutorText}`}>
                        <div className={isLaptop ? "text-[10px] leading-relaxed" : ""}>
                          <MarkdownRenderer content={msg.content} />
                        </div>
                      </div>
                    )}
                    {msg.status === 'streaming' && (
                      <div className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></div>
                    )}
                    {msg.status === 'error' && (
                      <div className={`mt-4 p-3 bg-error/10 border border-error/20 rounded text-error flex items-center gap-2 ${isLaptop ? 'text-[10px]' : 'text-sm'}`}>
                        <span className="material-symbols-outlined text-sm shrink-0">error</span>
                        Something went wrong.
                      </div>
                    )}
                    {msg.status === 'cancelled' && (
                      <div className={`mt-4 p-3 bg-surface-container-low border border-outline rounded text-on-surface-variant flex items-center gap-2 italic ${isLaptop ? 'text-[10px]' : 'text-sm'}`}>
                        <span className="material-symbols-outlined text-sm shrink-0">stop_circle</span>
                        Response cancelled.
                      </div>
                    )}
                  </div>
                  
                  {/* Source Chips */}
                  {msg.citations && msg.citations.length > 0 && (!msg.status || msg.status === 'complete') && (
                    <div className={`absolute flex flex-col items-end ${s.citationBottom}`}>
                      <span className={`handwritten-blue ${s.citationLabel}`}>from the lecture</span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {msg.citations.map((cit, cIdx) => (
                          <button 
                            key={cIdx} 
                            onClick={(e) => {
                              if (onCitationClick) onCitationClick(cit);
                              e.stopPropagation(); // prevent clicking through on laptop
                            }}
                            className={`bg-surface-bright border-primary rounded-full flex items-center hover:bg-secondary-container transition-colors hard-shadow-sm font-label-caps font-bold text-[#2196F3] ${s.citationChip}`}
                          >
                            [ {cit.lecture.toUpperCase().substring(0, 7)} · SLIDE {cit.slide.toString().padStart(2, '0')} ]
                            <span className={`material-symbols-outlined ${s.citationIcon}`}>arrow_outward</span>
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
      <div className={`flex-shrink-0 z-20 ${s.composerWrap} ${isLaptop ? '' : 'bg-background/95 backdrop-blur-sm'}`}>
        <div className="max-w-3xl mx-auto w-full">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim() && !activeStream.isStreaming && onSendMessage) {
                onSendMessage(inputText.trim());
              }
            }}
            className={`${isLaptop ? 'bg-transparent' : 'bg-white hard-shadow'} border-primary rounded-xl flex items-center gap-2 w-full ${s.composerInner}`}
          >
            <button type="button" className={`text-on-surface-variant hover:text-primary transition-colors shrink-0 ${s.composerIconBtn}`}>
              <span className={`material-symbols-outlined ${s.composerIcon}`}>attach_file</span>
            </button>
            <input 
              className={`flex-grow min-w-0 border-none focus:ring-0 bg-transparent outline-none placeholder:text-on-surface-variant/70 placeholder:font-annotation-sm ${s.composerInput}`}
              placeholder="Ask something about the course..." 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText && setInputText(e.target.value)}
              disabled={isLaptop || activeStream.isStreaming}
              readOnly={isLaptop}
            />
            {activeStream.isStreaming ? (
              <button 
                type="button"
                onClick={(e) => {
                  if (onCancelStream) onCancelStream();
                  e.stopPropagation();
                }}
                className={`bg-error text-white hover:bg-error/80 transition-colors flex items-center justify-center shrink-0 ${s.composerSendBtn}`}
              >
                <span className={`material-symbols-outlined ${s.composerSendIcon}`}>stop</span>
              </button>
            ) : (
              <button 
                type="submit"
                disabled={isLaptop ? false : (!inputText.trim())} // allow laptop button to just be a visual prop
                onClick={(e) => {
                  if (isLaptop) e.preventDefault(); // allow outer click to handle navigation
                }}
                className={`bg-primary text-white hover:bg-tertiary-container transition-colors flex items-center justify-center shrink-0 ${isLaptop ? '' : 'disabled:opacity-50 disabled:cursor-not-allowed'} ${s.composerSendBtn}`}
              >
                <span className={`material-symbols-outlined ${s.composerSendIcon}`}>send</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
