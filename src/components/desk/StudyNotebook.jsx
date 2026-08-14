import { useNavigate } from 'react-router-dom';

/**
 * StudyNotebook — The hero object on the desk.
 * Two-page open notebook with rich student note content.
 * Handwritten aesthetic with visual hierarchy.
 */
export default function StudyNotebook({ thread = [] }) {
  const navigate = useNavigate();
  const hasThread = thread && thread.length > 0;
  const activeNode = hasThread ? thread[thread.length - 1] : null;

  const studyChain = hasThread
    ? thread.slice(-4)
    : [
        { title: 'Gradient Descent', id: 'placeholder-1' },
        { title: 'Chain Rule', id: 'placeholder-2' },
        { title: 'Backpropagation', id: 'placeholder-3' },
        { title: 'Vanishing Gradient', id: 'placeholder-4' },
      ];

  return (
    <div
      className="relative w-full cursor-pointer group transition-transform duration-200 hover:-translate-y-1"
      style={{
        aspectRatio: '1.35', // Slightly wider than 4:3 for realism
        transform: 'rotate(-1.2deg)',
        filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
      }}
      onClick={() => {
        if (activeNode) navigate(`/lectures/${activeNode.lectureId}`);
      }}
      title={hasThread ? 'Continue studying' : 'Open notebook'}
    >
      {/* ── NOTEBOOK BASE (Cover edge peeking out) ── */}
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          background: '#242321', // Dark grey/black cover
          transform: 'translate(4px, 5px)',
          zIndex: 0,
        }}
      />
      {/* ── BINDING TAPE / BACKING ── */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-[#1f1e1c] shadow-inner"
        style={{ zIndex: 0 }}
      />

      {/* ── PAGES SPREAD ── */}
      <div
        className="absolute inset-0 flex rounded-sm overflow-hidden"
        style={{
          background: '#F9F8F4',
          border: '1px solid rgba(0,0,0,0.15)',
          zIndex: 1,
        }}
      >
        {/* ════ LEFT PAGE ════ */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            borderRight: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(to right, #FBF9F5, #F5F3EC)',
            boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.02)',
          }}
        >
          {/* Ruled lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #a3c2db 23px, #a3c2db 24px)',
              backgroundPositionY: '38px',
            }}
          />
          {/* Red margin line */}
          <div
            className="absolute top-0 bottom-0 left-12 w-px"
            style={{ background: '#db9b9b', opacity: 0.6 }}
          />

          <div className="absolute inset-0 pl-16 pr-5 pt-8 pb-6 flex flex-col">
            {/* Title */}
            <div className="mb-6 flex items-end">
              <span
                className="font-handwritten text-[#212121]"
                style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 800, transform: 'rotate(-2deg)' }}
              >
                CURRENT STUDY
              </span>
              <span className="ml-2 text-amber-500 font-bold" style={{ fontSize: 'clamp(14px, 1.8vw, 18px)' }}>★</span>
            </div>

            {/* Study chain flow */}
            <div className="flex flex-col flex-1 pl-2 relative">
              {studyChain.map((node, i) => {
                const isLast = i === studyChain.length - 1;
                const num = i + 1;
                return (
                  <div key={node.id || i} className="flex flex-col relative" style={{ marginBottom: isLast ? '0' : '-2px' }}>
                    
                    <div className="flex items-start gap-3 py-1 px-1 relative z-10">
                      <span
                        className="font-handwritten text-[#3a5a8c] mt-0.5"
                        style={{ fontSize: 'clamp(10px, 1vw, 13px)' }}
                      >
                        {num}.
                      </span>
                      <span
                        className="font-handwritten leading-tight"
                        style={{
                          fontSize: isLast ? 'clamp(16px, 1.8vw, 20px)' : 'clamp(14px, 1.6vw, 18px)',
                          color: isLast ? '#111' : '#444',
                          fontWeight: isLast ? 800 : 500,
                          // Highlight for the last node
                          background: isLast ? 'linear-gradient(104deg, rgba(254,235,100,0) 0.9%, rgba(254,235,100,0.85) 2.4%, rgba(254,235,100,0.5) 5.8%, rgba(254,235,100,0.4) 93%, rgba(254,235,100,0) 96%)' : 'transparent',
                          padding: '0 4px',
                          borderRadius: '2px',
                          transform: isLast ? 'rotate(-1deg)' : 'rotate(0.5deg)',
                          display: 'inline-block'
                        }}
                      >
                        {node.title}
                      </span>
                    </div>

                    {/* Hand-drawn Arrow connecting to next */}
                    {!isLast && (
                      <div className="pl-6 h-6 flex items-center">
                        <svg width="12" height="24" viewBox="0 0 12 24" fill="none" style={{ opacity: 0.5, stroke: '#3a5a8c' }}>
                          <path d="M6 0 C8 8, 4 16, 6 22 M3 18 L6 22 L9 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Scribble / Note in margin */}
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3"
                style={{ transform: 'rotate(5deg)' }}
              >
                <div className="font-handwritten text-red-600/80 text-[10px] leading-tight text-center">
                  ps2<br/>due fri!
                </div>
              </div>
            </div>
          </div>

          {/* Color tab sticking out */}
          <div 
            className="absolute -left-1 top-12 w-3 h-8 bg-blue-400 rounded-r shadow-sm"
            style={{ zIndex: 2 }}
          />
        </div>

        {/* ════ RIGHT PAGE ════ */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            background: 'linear-gradient(to left, #FBF9F5, #F5F3EC)',
            boxShadow: 'inset -4px 0 10px rgba(0,0,0,0.02)',
          }}
        >
          {/* Ruled lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #a3c2db 23px, #a3c2db 24px)',
              backgroundPositionY: '38px',
            }}
          />

          <div className="absolute inset-0 pl-6 pr-10 pt-8 pb-6 flex flex-col gap-4">
            {/* Heading */}
            <div>
              <div
                className="font-handwritten text-[#212121] mb-2"
                style={{
                  fontSize: 'clamp(14px, 1.8vw, 20px)',
                  fontWeight: 700,
                  transform: 'rotate(1deg)',
                  borderBottom: '2px solid rgba(33,33,33,0.8)',
                  display: 'inline-block',
                }}
              >
                Why it matters?
              </div>
              <p
                className="font-handwritten text-[#333] leading-relaxed mt-2"
                style={{ fontSize: 'clamp(12px, 1.4vw, 16px)' }}
              >
                When gradients shrink too much,{' '}
                <span className="font-handwritten font-bold text-red-700 underline decoration-red-700/50 decoration-2 underline-offset-2">
                  early layers stop learning.
                </span>
              </p>
            </div>

            {/* Diagram / Graph sketch */}
            <div className="pl-4 py-2 opacity-80" style={{ transform: 'rotate(-2deg)' }}>
              <svg width="100%" height="40" viewBox="0 0 140 40" fill="none">
                {/* Axes */}
                <path d="M10 5 L10 35 L120 35" stroke="#111" strokeWidth="1" strokeLinecap="round" />
                {/* Curve */}
                <path d="M12 30 C 40 28, 60 15, 115 5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <text x="125" y="38" className="font-handwritten text-[8px]" fill="#555">layers</text>
                <text x="0" y="8" className="font-handwritten text-[8px]" fill="#555">grad</text>
              </svg>
            </div>

            {/* Key Insight Box */}
            <div
              className="mt-1 p-3 relative"
              style={{
                border: '2px dashed #9e844f',
                background: 'rgba(254,235,100,0.1)',
                transform: 'rotate(0.5deg)',
              }}
            >
              <div
                className="absolute -top-3 left-4 bg-[#FBF9F5] px-1 font-handwritten text-[#9e844f] font-bold"
                style={{ fontSize: 'clamp(10px, 1vw, 12px)' }}
              >
                Key Insight
              </div>
              <div className="font-serif text-[#1e3a5f] font-semibold text-center my-1" style={{ fontSize: 'clamp(13px, 1.5vw, 18px)' }}>
                σ'(z) ≤ 0.25
              </div>
              <p className="font-handwritten text-center text-[#444]" style={{ fontSize: 'clamp(12px, 1.3vw, 15px)' }}>
                Signal shrinks <br/> exponentially!
              </p>
            </div>
          </div>
        </div>

        {/* ════ CENTER SPIRAL BINDING ════ */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none flex flex-col justify-evenly"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: '26px',
            zIndex: 10,
          }}
        >
          {/* Wire coils */}
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="relative w-full"
              style={{ height: '8px' }}
            >
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to bottom, #d4d4d4, #888, #444)',
                  boxShadow: '0 2px 3px rgba(0,0,0,0.4)',
                  transform: 'rotate(-2deg)',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Page shadow split */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: '50%',
            width: '60px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.1) 100%)',
            zIndex: 9,
          }}
        />
      </div>
    </div>
  );
}
