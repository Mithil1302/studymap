import { useNavigate } from 'react-router-dom';
import { useStudyMap } from '../../context/StudyMapContext';

// ─── Per-notebook visual identity ─────────────────────────────────────────────
// Each represents a DIFFERENT section of the same student's course notes.
// Same student, same course, three distinct notebooks.
const NOTEBOOK_IDENTITIES = [
  {
    // Week 1 — warm cream
    coverColor: '#F6F1E7',
    coverGradient: 'linear-gradient(145deg, #F6F1E7 0%, #EDE5D5 100%)',
    pageEdgeColor: '#E8E0D2',
    rotation: '-1deg',
    yOffset: '0px',
    spineWidth: '14px',
    tabColor: '#4A90D9',
    tabTop: '18%',
    weekLabel: 'WEEK 01',
    titleLines: ['Linear Models', '& Loss Functions'],
    // Tiny student sketches for this topic
    renderSketches: () => (
      <div className="absolute bottom-8 right-6 opacity-50" style={{ transform: 'rotate(-3deg)' }}>
        {/* Mini coordinate graph */}
        <svg width="60" height="48" viewBox="0 0 60 48" fill="none">
          <path d="M8 40 L8 6 M8 40 L56 40" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10 36 C20 32, 30 20, 50 10" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" />
          <text x="50" y="44" fill="#666" fontSize="6" fontFamily="Caveat, cursive">x</text>
          <text x="2" y="8" fill="#666" fontSize="6" fontFamily="Caveat, cursive">y</text>
        </svg>
        <div className="font-handwritten text-[10px] text-[#555] mt-1" style={{ transform: 'rotate(1deg)' }}>
          y = wx + b
        </div>
      </div>
    ),
    annotation: 'lecture notes',
    highlightPhrase: 'Linear Models',
  },
  {
    // Week 2 — slightly warmer/yellower
    coverColor: '#FAF7EF',
    coverGradient: 'linear-gradient(145deg, #FAF7EF 0%, #F0EBDF 100%)',
    pageEdgeColor: '#E5E1D8',
    rotation: '0.5deg',
    yOffset: '-4px',
    spineWidth: '18px',
    tabColor: '#D4644A',
    tabTop: '35%',
    weekLabel: 'WEEK 02',
    titleLines: ['Gradient Descent', '& Backpropagation'],
    renderSketches: () => (
      <div className="absolute bottom-8 right-5 opacity-50" style={{ transform: 'rotate(2deg)' }}>
        {/* Tiny neural net */}
        <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
          {/* Input nodes */}
          <circle cx="8" cy="12" r="4" stroke="#555" strokeWidth="1" fill="none" />
          <circle cx="8" cy="32" r="4" stroke="#555" strokeWidth="1" fill="none" />
          {/* Hidden */}
          <circle cx="28" cy="8" r="4" stroke="#555" strokeWidth="1" fill="none" />
          <circle cx="28" cy="22" r="4" stroke="#555" strokeWidth="1" fill="none" />
          <circle cx="28" cy="36" r="4" stroke="#555" strokeWidth="1" fill="none" />
          {/* Output */}
          <circle cx="48" cy="22" r="4" stroke="#D4644A" strokeWidth="1.2" fill="none" />
          {/* Lines */}
          <line x1="12" y1="12" x2="24" y2="8" stroke="#999" strokeWidth="0.7" />
          <line x1="12" y1="12" x2="24" y2="22" stroke="#999" strokeWidth="0.7" />
          <line x1="12" y1="12" x2="24" y2="36" stroke="#999" strokeWidth="0.7" />
          <line x1="12" y1="32" x2="24" y2="8" stroke="#999" strokeWidth="0.7" />
          <line x1="12" y1="32" x2="24" y2="22" stroke="#999" strokeWidth="0.7" />
          <line x1="12" y1="32" x2="24" y2="36" stroke="#999" strokeWidth="0.7" />
          <line x1="32" y1="8" x2="44" y2="22" stroke="#999" strokeWidth="0.7" />
          <line x1="32" y1="22" x2="44" y2="22" stroke="#999" strokeWidth="0.7" />
          <line x1="32" y1="36" x2="44" y2="22" stroke="#999" strokeWidth="0.7" />
        </svg>
        <div className="font-handwritten text-[10px] text-[#555] mt-1" style={{ transform: 'rotate(-1deg)' }}>
          ∂L/∂w
        </div>
      </div>
    ),
    annotation: 'chain rule!',
    highlightPhrase: 'Gradient Descent',
  },
  {
    // Week 3 — cool cream
    coverColor: '#F3F0E8',
    coverGradient: 'linear-gradient(145deg, #F3F0E8 0%, #EAE5D8 100%)',
    pageEdgeColor: '#DDD8CC',
    rotation: '1deg',
    yOffset: '3px',
    spineWidth: '16px',
    tabColor: '#6B9E5A',
    tabTop: '55%',
    weekLabel: 'WEEK 03',
    titleLines: ['Regularization', '& Generalization'],
    renderSketches: () => (
      <div className="absolute bottom-8 right-6 opacity-50" style={{ transform: 'rotate(-1deg)' }}>
        {/* Bias-variance sketch */}
        <svg width="58" height="44" viewBox="0 0 58 44" fill="none">
          <path d="M6 38 L6 4" stroke="#333" strokeWidth="1" strokeLinecap="round" />
          <path d="M6 38 L54 38" stroke="#333" strokeWidth="1" strokeLinecap="round" />
          {/* Bias curve (decreasing) */}
          <path d="M8 10 C16 12, 28 24, 52 34" stroke="#D4644A" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
          {/* Variance curve (increasing) */}
          <path d="M8 34 C20 32, 36 20, 52 8" stroke="#4A90D9" strokeWidth="1.2" strokeLinecap="round" />
          <text x="42" y="10" fill="#4A90D9" fontSize="5.5" fontFamily="Caveat, cursive">var</text>
          <text x="42" y="36" fill="#D4644A" fontSize="5.5" fontFamily="Caveat, cursive">bias</text>
        </svg>
        <div className="font-handwritten text-[10px] text-[#555] mt-1" style={{ transform: 'rotate(2deg)' }}>
          λ = ?
        </div>
      </div>
    ),
    annotation: "don't overfit",
    highlightPhrase: 'Regularization',
  },
];

// ─── Spiral binding for closed notebook ──────────────────────────────────────
function NotebookSpiral() {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-evenly items-center pointer-events-none"
      style={{ width: '22px', paddingTop: '14px', paddingBottom: '14px' }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="relative flex items-center justify-center w-full" style={{ height: '8px' }}>
          <div
            style={{
              width: '14px',
              height: '4px',
              borderRadius: '40%',
              background: 'linear-gradient(to bottom, #555, #222, #333)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
              transform: 'rotate(-2deg)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Single physical notebook ────────────────────────────────────────────────
function LectureNotebook({ lecture, identity, isCurrent, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Open ${lecture.title} — Week ${lecture.week}`}
      className="group relative flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-sm"
      style={{
        width: 'clamp(200px, 20vw, 280px)',
        height: 'clamp(280px, 28vw, 380px)',
        transform: `translateY(${identity.yOffset}) rotate(${identity.rotation})`,
        transition: 'transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = `translateY(calc(${identity.yOffset} - 6px)) rotate(0deg)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = `translateY(${identity.yOffset}) rotate(${identity.rotation})`;
      }}
    >
      {/* ── CONTACT SHADOW ── */}
      <div
        className="absolute -bottom-2 left-4 right-2 pointer-events-none transition-all duration-300 group-hover:opacity-50"
        style={{
          height: '16px',
          background: 'rgba(0,0,0,0.2)',
          filter: 'blur(10px)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      {/* ── PAGE BLOCK (stacked pages visible at right edge and bottom) ── */}
      <div
        className="absolute rounded-sm"
        style={{
          top: '3px',
          left: '22px',
          right: '-5px',
          bottom: '-4px',
          background: `repeating-linear-gradient(to bottom, #FDFAF3, #FDFAF3 1px, ${identity.pageEdgeColor} 1px, ${identity.pageEdgeColor} 2px)`,
          boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.06)',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          zIndex: 1,
        }}
      />

      {/* ── PAPER TAB (color-coded) ── */}
      <div
        className="absolute -right-2 w-5 h-10 rounded-r-sm shadow-sm"
        style={{
          top: identity.tabTop,
          background: identity.tabColor,
          opacity: 0.8,
          zIndex: 3,
        }}
      />

      {/* ── NOTEBOOK COVER ── */}
      <div
        className="absolute inset-0 rounded-sm flex overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{ zIndex: 2 }}
      >
        {/* Spiral binding zone */}
        <div className="relative flex-shrink-0" style={{ width: '22px' }}>
          <div
            className="absolute inset-0 rounded-l-sm"
            style={{
              background: identity.coverGradient,
              borderLeft: '1px solid rgba(0,0,0,0.06)',
            }}
          />
          <NotebookSpiral />
        </div>

        {/* Front cover surface */}
        <div
          className="flex-1 h-full rounded-r-sm relative overflow-hidden"
          style={{
            background: identity.coverGradient,
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.03), 2px 3px 8px rgba(0,0,0,0.12)',
            borderTop: '1px solid rgba(255,255,255,0.5)',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {/* Subtle paper texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'
            }}
          />

          {/* Cover content */}
          <div className="absolute inset-0 pl-6 pr-5 pt-8 pb-6 flex flex-col z-10">

            {/* Top Section */}
            <div>
              <div
                className="font-sans font-bold text-[#555] mb-2"
                style={{ fontSize: 'clamp(9px, 1vw, 11px)', letterSpacing: '0.05em' }}
              >
                CS 4780
              </div>

              {/* Week label */}
              <div className="relative inline-block w-fit mb-6">
                <span 
                  className="absolute inset-0 -mx-1 rounded-sm"
                  style={{ background: 'rgba(254,235,100,0.25)', transform: 'rotate(0.5deg) skewX(-2deg)' }}
                />
                <span 
                  className="font-handwritten text-[#333] relative z-10 px-1"
                  style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}
                >
                  Week {lecture.week.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex-1" />

            {/* Topic title — handwritten */}
            <div style={{ transform: 'rotate(-0.5deg)' }}>
              {identity.titleLines.map((line, i) => (
                <div
                  key={i}
                  className="font-handwritten font-bold leading-tight text-[#1a1a1a]"
                  style={{
                    fontSize: 'clamp(18px, 2.2vw, 24px)',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div className="flex-1" />

            {/* Tiny handwritten annotation */}
            <div
              className="font-handwritten text-[#777] mt-auto"
              style={{ fontSize: 'clamp(10px, 1vw, 12px)', transform: 'rotate(1.5deg)' }}
            >
              — {identity.annotation}
            </div>

            {/* Currently-studying indicator */}
            {isCurrent && (
              <div className="mt-2">
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5"
                  style={{
                    background: 'rgba(74,144,217,0.08)',
                    border: '1px solid rgba(74,144,217,0.25)',
                    borderRadius: '2px',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4A90D9]" />
                  <span className="font-sans text-[#4A90D9] font-bold uppercase" style={{ fontSize: '8px', letterSpacing: '0.1em' }}>
                    Current
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Topic-specific student sketches */}
          {identity.renderSketches()}

          {/* Open affordance */}
          <div
            className="absolute bottom-4 right-5 font-handwritten text-[#999] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}
          >
            open →
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main bookshelf component ────────────────────────────────────────────────
export default function LectureBookshelf({ currentLectureId }) {
  const navigate = useNavigate();
  const { lectures } = useStudyMap();

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      <div className="relative z-10 flex flex-col items-center px-6 sm:px-10 lg:px-16 py-16 sm:py-24 w-full max-w-[1200px] mx-auto">

        {/* ── PAGE HEADING ── */}
        <div className="text-center mb-20 sm:mb-28">
          <div
            className="font-handwritten text-[#888] mb-3"
            style={{ fontSize: 'clamp(13px, 1.2vw, 16px)', transform: 'rotate(-0.5deg)' }}
          >
            CS 4780 — Machine Learning
          </div>
          <h1
            className="font-handwritten font-bold leading-none mb-4"
            style={{
              fontSize: 'clamp(36px, 5vw, 52px)',
              color: '#1a1a1a',
              transform: 'rotate(0.3deg)',
            }}
          >
            Lecture Notes
          </h1>
          <p
            className="font-handwritten text-[#777]"
            style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', transform: 'rotate(-0.3deg)' }}
          >
            pick a notebook and start studying
          </p>
        </div>

        {/* ── THREE NOTEBOOKS ── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-12 lg:gap-20 w-full">
          {lectures.map((lecture, index) => (
            <LectureNotebook
              key={lecture.lecture_id}
              lecture={lecture}
              identity={NOTEBOOK_IDENTITIES[index]}
              isCurrent={lecture.lecture_id === currentLectureId}
              onClick={() => navigate(`/lectures/${lecture.lecture_id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
