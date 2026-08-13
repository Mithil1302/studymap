import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyMap } from '../context/StudyMapContext';
import { useProgress } from '../context/ProgressContext';

// Find the chronological "tip" node by leveraging JS Set insertion order.
function getChronologicalTip(courseNodes, completedNodes, inProgressNodes) {
  const isNonCore = (id) => {
    const n = courseNodes.find(node => node.id === id);
    return n && n.type !== 'core';
  };
  
  const inProgArr = Array.from(inProgressNodes).filter(isNonCore);
  if (inProgArr.length > 0) return inProgArr[inProgArr.length - 1];

  const compArr = Array.from(completedNodes).filter(isNonCore);
  if (compArr.length > 0) return compArr[compArr.length - 1];

  return null;
}

// Walk backward from deepest active node through courseEdges (max 4 items total)
function buildThread(courseNodes, courseEdges, completedNodes, inProgressNodes) {
  const tipId = getChronologicalTip(courseNodes, completedNodes, inProgressNodes);
  if (!tipId) return [];

  const tip = courseNodes.find((n) => n.id === tipId);
  if (!tip) return [];

  const chain = [tip];
  let cur = tip;
  for (let d = 0; d < 3; d++) {
    // Only follow ACTUAL graph relationships backwards
    const edge = courseEdges.find((e) => e.target === cur.id);
    if (!edge) break;
    const parent = courseNodes.find((n) => n.id === edge.source);
    if (!parent || parent.type === 'core') break;
    chain.unshift(parent);
    cur = parent;
  }
  return chain;
}

// Next concept: outbound edge from tip, else first available unstarted in course order
function findNext(courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus) {
  const tipId = getChronologicalTip(courseNodes, completedNodes, inProgressNodes);
  
  if (tipId) {
    const childEdges = courseEdges.filter((e) => e.source === tipId);
    for (const edge of childEdges) {
      const child = courseNodes.find((n) => n.id === edge.target && n.type !== 'core');
      if (child && !completedNodes.has(child.id) && !inProgressNodes.has(child.id)) {
        if (getNodeStatus(child.id) === 'available') {
          return child;
        }
      }
    }
  }

  const nonCore = courseNodes.filter((n) => n.type !== 'core');
  return nonCore.find((n) => 
    getNodeStatus(n.id) === 'available' && 
    !completedNodes.has(n.id) && 
    !inProgressNodes.has(n.id)
  ) ?? null;
}

// Current week: week of the active tip node
function deriveCurrentWeek(courseNodes, completedNodes, inProgressNodes) {
  const tipId = getChronologicalTip(courseNodes, completedNodes, inProgressNodes);
  if (tipId) {
    const node = courseNodes.find((n) => n.id === tipId);
    return node ? node.week : null;
  }
  return null;
}

// Per-lecture progress stats
function weekStats(lec, courseNodes, completedNodes, inProgressNodes) {
  const nodes = courseNodes.filter((n) => n.week === lec.week && n.type !== 'core');
  const explored = nodes.filter((n) => completedNodes.has(n.id) || inProgressNodes.has(n.id)).length;
  return { nodes, explored, total: nodes.length };
}

// CTA label for each week card
function ctaLabel(explored, total) {
  if (explored === 0) return 'Explore';
  if (explored === total && total > 0) return 'Review';
  return 'Continue';
}

export default function Overview() {
  const { lectures, sendMessage, activeStream, cancelStream } = useStudyMap();
  const { courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus } = useProgress();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const currentWeek = useMemo(
    () => deriveCurrentWeek(courseNodes, completedNodes, inProgressNodes),
    [courseNodes, completedNodes, inProgressNodes]
  );

  const allStats = useMemo(
    () => lectures.map((lec) => ({ lec, ...weekStats(lec, courseNodes, completedNodes, inProgressNodes) })),
    [lectures, courseNodes, completedNodes, inProgressNodes]
  );

  const thread = useMemo(
    () => buildThread(courseNodes, courseEdges, completedNodes, inProgressNodes),
    [courseNodes, courseEdges, completedNodes, inProgressNodes]
  );

  const nextNode = useMemo(
    () => findNext(courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus),
    [courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus]
  );

  const nextLec = nextNode ? lectures.find((l) => l.lecture_id === nextNode.lectureId) : null;
  const nextSlide = nextNode?.slides?.[0] ?? null;

  const totalNonCore = courseNodes.filter((n) => n.type !== 'core').length;
  const totalExplored = courseNodes.filter(
    (n) => n.type !== 'core' && (completedNodes.has(n.id) || inProgressNodes.has(n.id))
  ).length;
  const isComplete = totalExplored >= totalNonCore && totalNonCore > 0;

  return (
    <main className="flex-1 overflow-y-auto w-full flex flex-col min-w-0 custom-scrollbar" style={{ backgroundColor: '#FDFBF7' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 w-full py-8">

        {/* ── COURSE IDENTITY ── */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span
                className="font-label-caps text-on-surface-variant"
                style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
              >
                CS 4780
              </span>
            </div>
            <h1
              className="font-display-lg font-black tracking-tight text-primary leading-none mb-1"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'Chivo, sans-serif' }}
            >
              Machine Learning for Engineers
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant" style={{ fontSize: '0.9rem' }}>
              Your course, at a glance.
            </p>
          </div>
          <div className="text-right">
            <span
              className="font-label-caps text-on-surface-variant"
              style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
            >
              {totalExplored} / {totalNonCore} CONCEPTS EXPLORED
            </span>
          </div>
        </header>

        {/* ── COURSE PATH ── */}
        <section className="mb-14 relative">
          <DividerLabel>Your course path</DividerLabel>

          {/* Desktop */}
          <div className="hidden md:flex items-start justify-between relative mt-6">
            <div
              className="absolute top-[13px] left-[15%] right-[15%] h-[1px] bg-outline-variant pointer-events-none"
            />
            {allStats.map(({ lec, explored, total }) => (
              <PathStop
                key={lec.lecture_id}
                week={lec.week}
                explored={explored}
                total={total}
                isCurrent={currentWeek === lec.week}
                isDone={explored === total && total > 0}
                onClick={() => navigate('/lectures/' + lec.lecture_id)}
              />
            ))}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden gap-2 mt-4">
            {allStats.map(({ lec, explored, total }) => {
              const cur = currentWeek === lec.week;
              return (
                <button
                  key={lec.lecture_id}
                  onClick={() => navigate('/lectures/' + lec.lecture_id)}
                  className={
                    'flex-1 border py-2.5 text-center transition-colors ' +
                    (cur ? 'border-primary bg-[#fdfbf7]' : 'border-outline-variant bg-transparent')
                  }
                  style={{ borderRadius: '1px' }}
                >
                  <div
                    className={'font-label-caps ' + (cur ? 'text-primary' : 'text-on-surface-variant')}
                    style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}
                  >
                    WK {lec.week}
                  </div>
                  <div className="text-annotation-sm font-annotation-sm text-on-surface-variant mt-0.5" style={{ fontSize: '0.75rem' }}>
                    {explored}/{total}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Desk Note */}
          {currentWeek && (
            <div 
              className="hidden md:block absolute -right-4 -bottom-6 bg-[#FEF9E6] border border-primary p-2"
              style={{ 
                transform: 'rotate(2deg)',
                boxShadow: '1px 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
            >
              <div className="w-4 h-1.5 bg-[#f5d76e]/50 absolute -top-1 left-1/2 -translate-x-1/2" />
              <p className="font-handwritten text-primary leading-tight" style={{ fontSize: '0.85rem' }}>
                Currently exploring<br/>Week {String(currentWeek).padStart(2, '0')}
              </p>
            </div>
          )}
        </section>

        {/* ── WEEK CARDS ── */}
        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allStats.map(({ lec, explored, total }, idx) => {
              const isCurrent = currentWeek === lec.week;
              const cta = ctaLabel(explored, total);
              const tilt = idx === 0 ? 'md:-rotate-[1deg]' : idx === 1 ? 'md:rotate-[0.5deg]' : 'md:-rotate-[0.5deg]';
              const fillRatio = total > 0 ? (explored / total) * 100 : 0;

              return (
                <div key={lec.lecture_id} className="relative">
                  {/* YOU ARE HERE TAB */}
                  {isCurrent && (
                    <div 
                      className="absolute -top-3 left-4 z-20 bg-[#F5D76E] border border-primary px-2 py-0.5"
                      style={{ 
                        transform: 'rotate(-2deg)',
                        boxShadow: '1px 1px 0 rgba(0,0,0,1)'
                      }}
                    >
                      <span className="font-handwritten text-primary font-bold" style={{ fontSize: '0.8rem' }}>
                        you are here
                      </span>
                    </div>
                  )}

                  <div
                    onClick={() => navigate('/lectures/' + lec.lecture_id)}
                    className={'relative bg-[#FFFCF6] border border-primary p-6 cursor-pointer group transition-transform duration-150 hover:-translate-y-1 ' + tilt}
                    style={{
                      borderRadius: '0px',
                      boxShadow: '2px 3px 0 rgba(0,0,0,0.85)',
                      minHeight: '220px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Top yellow edge if current */}
                    {isCurrent && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#F5D76E]" />
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <span
                        className="font-label-caps text-on-surface-variant"
                        style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
                      >
                        WEEK {String(lec.week).padStart(2, '0')}
                      </span>
                      <span className="text-annotation-sm font-annotation-sm text-on-surface-variant" style={{ fontSize: '0.75rem' }}>
                        {lec.slides.length} slides
                      </span>
                    </div>

                    <h3
                      className="font-headline-md font-bold text-primary leading-snug mb-auto group-hover:underline decoration-secondary-container decoration-2 underline-offset-2"
                      style={{ fontSize: '1.1rem', fontFamily: 'Chivo, sans-serif' }}
                    >
                      {lec.title}
                    </h3>

                    <div className="mt-6 mb-2 relative h-1.5 bg-[#E6E4DF] w-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 bottom-0 bg-primary transition-all duration-500" 
                        style={{ width: `${fillRatio}%` }}
                      />
                    </div>
                    
                    <p className="text-annotation-sm font-annotation-sm text-on-surface-variant mb-4" style={{ fontSize: '0.8rem' }}>
                      {explored} / {total} explored
                    </p>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #E6E4DF' }}>
                      <span className="font-label-caps text-primary group-hover:underline" style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                        {cta}
                      </span>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform" style={{ fontSize: '16px' }}>
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── THREAD + NEXT ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">

          {/* Current Learning Thread */}
          <section>
            <DividerLabel>Current learning thread</DividerLabel>
            <div className="mt-4 px-2">
              {thread.length === 0 ? (
                <div className="py-6">
                  <p className="font-handwritten text-on-surface-variant text-lg">
                    Explore a concept to build<br />your learning thread.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col relative">
                  <div className="absolute left-[5px] top-[14px] bottom-[14px] w-px bg-outline-variant" />
                  {thread.map((node, i) => {
                    const isLast = i === thread.length - 1;
                    return (
                      <div 
                        key={node.id} 
                        className="flex items-center gap-4 py-2.5 relative z-10 cursor-pointer group"
                        onClick={() => navigate('/lectures/' + node.lectureId)}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 border-2"
                          style={{
                            background: isLast ? '#000' : '#FDFBF7',
                            borderColor: isLast ? '#000' : '#8A8D8D',
                          }}
                        />
                        <span
                          className="font-body-md flex-1 group-hover:underline decoration-outline-variant underline-offset-2"
                          style={{
                            fontSize: '0.95rem',
                            color: isLast ? '#000' : '#5C5F5F',
                            fontWeight: isLast ? '700' : '400',
                          }}
                        >
                          {node.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Next to Explore */}
          <section>
            <DividerLabel>Next to explore</DividerLabel>
            <div className="mt-4">
              {isComplete ? (
                <div className="py-4">
                  <p className="font-headline-md font-bold text-primary mb-1" style={{ fontSize: '1.1rem' }}>Course complete</p>
                  <p className="text-annotation-sm font-annotation-sm text-on-surface-variant mb-4" style={{ fontSize: '0.8rem' }}>
                    {totalNonCore} / {totalNonCore} concepts explored
                  </p>
                  <button
                    onClick={() => navigate('/learning-map')}
                    className="font-label-caps text-primary hover:underline"
                    style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
                  >
                    Review Learning Map &rarr;
                  </button>
                </div>
              ) : nextNode ? (
                <div 
                  className="bg-[#FEF9E6] border border-primary p-5 flex flex-col relative transform md:rotate-[0.5deg]"
                  style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.85)' }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#F5D76E]/60 rotate-2" />
                  
                  <div className="mb-4">
                    <h4
                      className="font-headline-md font-bold text-primary leading-tight mb-2"
                      style={{ fontSize: '1.15rem' }}
                    >
                      {nextNode.title}
                    </h4>
                    {nextLec && nextSlide && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '14px' }}>menu_book</span>
                        <span
                          className="text-on-surface-variant"
                          style={{ fontSize: '0.78rem', fontFamily: 'Hanken Grotesk, sans-serif' }}
                        >
                          Week {nextLec.week} &middot; Slide {nextSlide}
                        </span>
                      </div>
                    )}
                    <p className="font-handwritten text-on-surface-variant text-lg leading-tight mb-1">
                      Continue the current thread.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => navigate('/lectures/' + nextNode.lectureId)}
                    className="w-full bg-primary text-white py-3 px-4 font-label-caps font-bold flex items-center justify-between group hover:bg-ink-dark transition-colors"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.06em' }}
                  >
                    <span>Open in notebook</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '16px' }}>
                      arrow_forward
                    </span>
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <p className="font-handwritten text-on-surface-variant text-lg">
                    Start exploring to unlock your next concept.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── ASK THE TUTOR ── */}
        <section className="mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !activeStream.isStreaming) {
                sendMessage(input.trim());
                navigate('/conversation');
              }
            }}
            className="bg-[#FFFCF6] border border-primary flex items-center p-2 hover:-translate-y-0.5 transition-transform duration-150 max-w-xl"
            style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.85)' }}
          >
            <span className="material-symbols-outlined text-on-surface-variant ml-2 mr-3 shrink-0" style={{ fontSize: '20px' }}>
              search
            </span>
            <input
              className="flex-1 min-w-0 bg-transparent border-none outline-none font-body-md text-base text-primary placeholder:text-on-surface-variant/50 focus:ring-0"
              placeholder="Ask something about this course..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={activeStream.isStreaming}
            />
            {activeStream.isStreaming ? (
              <button
                type="button"
                onClick={cancelStream}
                className="bg-error text-white w-9 h-9 flex items-center justify-center hover:bg-error/80 transition-colors shrink-0 ml-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-primary text-white w-9 h-9 flex items-center justify-center hover:bg-ink-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ml-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_upward</span>
              </button>
            )}
          </form>
        </section>

        <div className="h-16" />
      </div>
    </main>
  );
}

// ── Micro-components ──

function DividerLabel({ children }) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <span
        className="text-on-surface-variant uppercase font-bold"
        style={{ fontSize: '0.65rem', letterSpacing: '0.12em', fontFamily: 'Hanken Grotesk, sans-serif' }}
      >
        {children}
      </span>
      <div className="h-px bg-outline-variant/50 flex-1" />
    </div>
  );
}

function PathStop({ week, isCurrent, isDone, onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-2 flex-1 cursor-pointer group"
      onClick={onClick}
    >
      {/* Circle */}
      <div
        className={
          'relative w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-transform group-hover:scale-110 ' +
          (isDone
            ? 'bg-primary border-primary'
            : isCurrent
            ? 'bg-[#FDFBF7] border-primary'
            : 'bg-[#FDFBF7] border-outline-variant')
        }
      >
        {isDone && (
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        )}
        {isCurrent && !isDone && (
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        )}
      </div>

      <span
        className={'font-label-caps mt-2 ' + (isCurrent ? 'text-primary' : 'text-on-surface-variant')}
        style={{ fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: isCurrent ? '700' : '400' }}
      >
        {'WEEK ' + String(week).padStart(2, '0')}
      </span>
    </div>
  );
}
