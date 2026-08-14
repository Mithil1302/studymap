import { useRef, useEffect } from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

// ─── Citation formatting ─────────────────────────────────────────────────────
/**
 * Format a citation object for display.
 * Input:  { lecture: "Week 2 — Gradient Descent and Backpropagation", slide: 9 }
 * Output: "Week 2 · Slide 09"
 */
function formatCitation(cit) {
  // Lecture titles are always "Week N — Full Title"
  const weekPart = cit.lecture.split(' — ')[0] || cit.lecture;
  const slideStr = String(cit.slide).padStart(2, '0');
  return `${weekPart} · Slide ${slideStr}`;
}

// ─── Example prompts for empty state ─────────────────────────────────────────
// These prompts are verbatim from responses.json so every one has a real answer.
const EXAMPLE_PROMPTS = [
  'What is the difference between supervised and unsupervised learning?',
  'Show me how gradient descent is implemented.',
  'Why is the sigmoid derivative at most 0.25?',
  'Compare the regularization techniques we covered.',
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function ConversationSurface({
  messages,
  variant = 'full',
  inputText = '',
  setInputText,
  onSendMessage,
  onCancelStream,
  onRetry,
  activeStream = { isStreaming: false },
  onCitationClick,
}) {
  const isLaptop = variant === 'laptop';
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!isLaptop) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLaptop]);

  // ── Scale tokens by variant ────────────────────────────────────────────────
  const s = {
    px:               isLaptop ? 'px-2'                         : 'px-4 md:px-margin-page',
    pt:               isLaptop ? 'pt-2'                         : 'pt-4 md:pt-margin-page',
    pb:               isLaptop ? 'pb-2'                         : 'pb-8',
    gap:              isLaptop ? 'gap-3'                         : 'gap-6 md:gap-8',
    emptyIcon:        isLaptop ? 'w-8 h-8 text-lg'              : 'w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl',
    emptyTitle:       isLaptop ? 'text-sm leading-snug'         : 'text-2xl md:text-display-sm font-display-sm',
    emptySub:         isLaptop ? 'text-[9px] mb-2'              : 'text-sm md:text-body-lg mb-6 md:mb-8',
    emptyBadge:       isLaptop ? 'text-[7px] px-1 py-0.5'      : 'text-[10px] md:text-label-caps px-2 py-1',
    exampleBtn:       isLaptop ? 'hidden'                        : 'text-xs md:text-sm px-3 py-2',
    userMargin:       isLaptop ? 'mb-2'                         : 'mb-2 md:mb-4',
    userPadding:      isLaptop ? 'p-2'                          : 'p-3 md:p-4',
    userText:         isLaptop ? 'text-[10px] leading-tight'    : 'text-sm md:text-body-md font-body-md',
    userBadge:        isLaptop ? '-top-2 -right-2 w-4 h-4 text-[8px] border' : '-top-3 -right-3 w-6 h-6 text-xs border-2',
    tutorPadding:     isLaptop ? 'p-3'                          : 'p-5 md:p-8',
    tutorMargin:      isLaptop ? 'mb-4'                         : 'mb-8 md:mb-12',
    tutorLine:        isLaptop ? 'left-2'                        : 'left-4 md:left-8',
    tutorContentPad:  isLaptop ? 'pl-2 min-h-[2rem]'            : 'pl-3 md:pl-4 min-h-[4rem]',
    tutorText:        isLaptop ? 'text-[10px] leading-relaxed'  : '',
    citationBottom:   isLaptop ? '-bottom-3 right-3'            : '-bottom-4 right-4 md:right-8',
    citationLabel:    isLaptop ? 'text-[8px] mb-0.5 mr-1'      : 'text-xs md:text-sm mb-1 mr-2',
    citationChip:     isLaptop ? 'px-1.5 py-0.5 border text-[7px] gap-0.5' : 'px-2 md:px-3 py-1 md:py-1.5 border-2 text-[10px] md:text-label-caps gap-1 md:gap-2',
    citationIcon:     isLaptop ? 'text-[10px]'                  : 'text-[12px] md:text-[14px]',
    composerWrap:     isLaptop ? 'p-2'                          : 'p-4 md:p-6 lg:p-8',
    composerInner:    isLaptop ? 'p-1 border'                   : 'p-1.5 md:p-2 border-2',
    composerIconBtn:  isLaptop ? 'p-0.5'                        : 'p-1 md:p-2',
    composerIcon:     isLaptop ? 'text-sm'                      : 'text-xl md:text-2xl',
    composerInput:    isLaptop ? 'text-[10px]'                  : 'text-sm md:text-body-md font-body-md',
    composerSendBtn:  isLaptop ? 'p-1 rounded-sm'               : 'p-1.5 md:p-2 rounded-lg',
    composerSendIcon: isLaptop ? 'text-sm'                      : 'text-lg md:text-xl',
  };

  // ── Empty state ────────────────────────────────────────────────────────────
  const emptyState = (
    <div className={`flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up mt-8 md:mt-16 px-4 ${isLaptop ? 'opacity-70' : ''}`}>
      {/* Icon */}
      <div className={`bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-5 border-2 border-primary border-dashed ${s.emptyIcon}`}>
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 'inherit' }}>school</span>
      </div>

      {/* Identity */}
      <h1 className={`text-primary mb-1 ${s.emptyTitle}`}>StudyMap Tutor</h1>
      <p className={`text-on-surface-variant font-medium ${s.emptySub}`}>
        CS 4780 · Machine Learning for Engineers
      </p>

      {/* Course boundary badge */}
      {!isLaptop && (
        <span className={`inline-flex items-center gap-1 rounded-full bg-surface-container border border-outline font-label-caps font-bold text-on-surface-variant mb-6 md:mb-8 ${s.emptyBadge}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
          Course material only
        </span>
      )}

      {/* Description */}
      {!isLaptop && (
        <>
          <p className="text-on-surface-variant text-sm md:text-body-md max-w-md mb-1">
            Ask questions about the concepts, equations and examples from your professor's lectures.
          </p>
          <p className="text-on-surface-variant/70 text-xs md:text-sm max-w-md mb-8 md:mb-10">
            Every answer includes its source slide so you can trace it straight back to the lecture.
          </p>

          {/* Example prompts */}
          <p className="text-xs font-label-caps font-bold text-on-surface-variant/60 tracking-widest mb-3">
            TRY ASKING
          </p>
          <div className="flex flex-col gap-2 w-full max-w-lg">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputText && setInputText(prompt)}
                className={`text-left bg-white border-2 border-primary/20 hover:border-primary/60 hover:bg-primary/5 rounded-lg transition-all duration-150 hard-shadow-sm font-body-md text-on-surface group ${s.exampleBtn}`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors" style={{ fontSize: '14px' }}>
                    arrow_forward
                  </span>
                  {prompt}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col min-w-0 min-h-0 relative ${
      isLaptop
        ? 'h-full w-full pointer-events-none bg-[#f5f5f0]'
        : 'bg-surface-container-low/50'
    }`}>

      {/* ── Scrollable message list ── */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden ${s.px} ${s.pt} ${s.pb}`}>
        <div className={`max-w-3xl mx-auto flex flex-col ${s.gap}`}>

          {messages.length === 0 ? emptyState : (
            messages.map((msg, idx) =>
              msg.role === 'user'
                ? (
                /* ── Student question ── */
                <div key={msg.id || idx} className={`flex justify-end ${s.userMargin} animate-fade-in-up`}>
                  <div className={`bg-white ${isLaptop ? 'border' : 'border-2'} border-primary rounded-lg rounded-tr-none ${s.userPadding} max-w-[90%] md:max-w-[80%] hard-shadow-sm relative`}>
                    <p className={`break-words ${s.userText}`}>{msg.content}</p>
                    <div className={`absolute bg-tertiary-container text-white rounded-full flex items-center justify-center font-bold border-primary ${s.userBadge}`}>
                      Me
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Tutor response — notebook card ── */
                <div key={msg.id || idx} className={`bg-white ${isLaptop ? 'border' : 'border-2'} border-primary rounded-xl ${s.tutorPadding} hard-shadow relative ${s.tutorMargin} animate-fade-in-up w-full`}>
                  {/* Ruled-paper left line */}
                  <div className={`absolute top-0 bottom-0 w-px bg-warning-coral/30 ${s.tutorLine}`} />

                  <div className={`relative z-10 notebook-line w-full max-w-full overflow-hidden ${s.tutorContentPad}`}>
                    {/* Thinking state */}
                    {msg.status === 'thinking' && (
                      <div className={`flex items-center gap-2 text-on-surface-variant italic animate-pulse mt-2 ${isLaptop ? 'text-[10px]' : 'text-sm font-body-md'}`}>
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        Tutor is preparing your answer&hellip;
                      </div>
                    )}

                    {/* Content (streaming or complete or error/cancelled with partial) */}
                    {(!msg.status || msg.status === 'streaming' || msg.status === 'complete'
                      || msg.status === 'error' || msg.status === 'cancelled') && msg.content && (
                      <div className={`max-w-full overflow-x-auto break-words ${s.tutorText}`}>
                        {isLaptop
                          ? <div className="text-[10px] leading-relaxed">{msg.content}</div>
                          : <MarkdownRenderer content={msg.content} />
                        }
                      </div>
                    )}

                    {/* Streaming cursor */}
                    {msg.status === 'streaming' && (
                      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                    )}

                    {/* Cancelled notice */}
                    {msg.status === 'cancelled' && (
                      <div className={`mt-4 p-3 bg-surface-container-low border border-outline rounded-lg text-on-surface-variant flex items-center gap-2 italic ${isLaptop ? 'text-[10px]' : 'text-sm'}`}>
                        <span className="material-symbols-outlined text-sm shrink-0">stop_circle</span>
                        Response stopped.
                      </div>
                    )}

                    {/* Error notice + Retry */}
                    {msg.status === 'error' && (
                      <div className={`mt-4 ${isLaptop ? 'text-[10px]' : 'text-sm'}`}>
                        <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                          The tutor connection was interrupted.
                        </div>
                        {!isLaptop && onRetry && msg.scenarioId && (
                          <button
                            onClick={() => onRetry(msg.id)}
                            className="flex items-center gap-1.5 text-primary hover:text-primary/70 transition-colors font-label-caps font-bold tracking-wide"
                          >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Source citation chips ── */}
                  {msg.citations && msg.citations.length > 0 && msg.status === 'complete' && (
                    <div className={`absolute flex flex-col items-end ${s.citationBottom}`}>
                      <span className={`handwritten-blue ${s.citationLabel}`}>from the lecture</span>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {msg.citations.map((cit, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={(e) => {
                              if (onCitationClick) onCitationClick(cit);
                              e.stopPropagation();
                            }}
                            title={`Open ${cit.lecture}, slide ${cit.slide}`}
                            className={`bg-surface-bright border-primary rounded-full flex items-center hover:bg-secondary-container transition-colors hard-shadow-sm font-label-caps font-bold text-[#2196F3] ${s.citationChip}`}
                          >
                            {formatCitation(cit)}
                            <span className={`material-symbols-outlined ${s.citationIcon}`}>arrow_outward</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Floating composer ── */}
      <div className={`flex-shrink-0 z-20 ${s.composerWrap} ${isLaptop ? '' : 'bg-background/95 backdrop-blur-sm'}`}>
        <div className="max-w-3xl mx-auto w-full">
          {/* Course boundary label — only in full variant, above the composer */}
          {!isLaptop && (
            <div className="flex items-center justify-center gap-1.5 mb-2 text-on-surface-variant/50 text-[10px] font-label-caps tracking-widest select-none">
              <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>lock</span>
              CS 4780 · Machine Learning for Engineers · Course material only
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim() && !activeStream.isStreaming && onSendMessage) {
                onSendMessage(inputText.trim());
              }
            }}
            className={`${isLaptop ? 'bg-transparent' : 'bg-white hard-shadow'} border-primary rounded-xl flex items-center gap-2 w-full ${s.composerInner}`}
          >
            <button
              type="button"
              className={`text-on-surface-variant hover:text-primary transition-colors shrink-0 ${s.composerIconBtn}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <span className={`material-symbols-outlined ${s.composerIcon}`}>attach_file</span>
            </button>

            <input
              className={`flex-grow min-w-0 border-none focus:ring-0 bg-transparent outline-none placeholder:text-on-surface-variant/70 placeholder:font-annotation-sm ${s.composerInput}`}
              placeholder="Ask something about the course…"
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
                disabled={isLaptop ? false : !inputText.trim()}
                onClick={(e) => {
                  if (isLaptop) e.preventDefault();
                }}
                className={`bg-primary text-white hover:bg-tertiary-container transition-colors flex items-center justify-center shrink-0 ${
                  isLaptop ? '' : 'disabled:opacity-50 disabled:cursor-not-allowed'
                } ${s.composerSendBtn}`}
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
