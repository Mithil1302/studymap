import React, { useState, useEffect } from 'react';
import NotebookPage from './NotebookPage';
import PageTurner from './PageTurner';

// ─── Per-week cover identity (matches LectureBookshelf notebooks) ────────────
const COVER_IDENTITIES = {
  1: {
    coverGradient: 'linear-gradient(145deg, #F6F1E7 0%, #EDE5D5 100%)',
    tabColor: '#4A90D9',
    sketch: (
      <svg width="80" height="64" viewBox="0 0 80 64" fill="none" style={{ opacity: 0.4 }}>
        <path d="M10 54 L10 8 M10 54 L74 54" stroke="#444" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14 48 C28 42, 42 26, 68 12" stroke="#4A90D9" strokeWidth="1.5" strokeLinecap="round" />
        <text x="66" y="58" fill="#777" fontSize="8" fontFamily="Caveat, cursive">x</text>
        <text x="3" y="10" fill="#777" fontSize="8" fontFamily="Caveat, cursive">y</text>
      </svg>
    ),
    formula: 'y = wx + b',
    marginNote: 'remember: minimize the loss!',
  },
  2: {
    coverGradient: 'linear-gradient(145deg, #FAF7EF 0%, #F0EBDF 100%)',
    tabColor: '#D4644A',
    sketch: (
      <svg width="72" height="56" viewBox="0 0 72 56" fill="none" style={{ opacity: 0.4 }}>
        <circle cx="10" cy="16" r="5" stroke="#666" strokeWidth="1" fill="none" />
        <circle cx="10" cy="40" r="5" stroke="#666" strokeWidth="1" fill="none" />
        <circle cx="36" cy="10" r="5" stroke="#666" strokeWidth="1" fill="none" />
        <circle cx="36" cy="28" r="5" stroke="#666" strokeWidth="1" fill="none" />
        <circle cx="36" cy="46" r="5" stroke="#666" strokeWidth="1" fill="none" />
        <circle cx="62" cy="28" r="5" stroke="#D4644A" strokeWidth="1.2" fill="none" />
        <line x1="15" y1="16" x2="31" y2="10" stroke="#bbb" strokeWidth="0.7" />
        <line x1="15" y1="16" x2="31" y2="28" stroke="#bbb" strokeWidth="0.7" />
        <line x1="15" y1="16" x2="31" y2="46" stroke="#bbb" strokeWidth="0.7" />
        <line x1="15" y1="40" x2="31" y2="10" stroke="#bbb" strokeWidth="0.7" />
        <line x1="15" y1="40" x2="31" y2="28" stroke="#bbb" strokeWidth="0.7" />
        <line x1="15" y1="40" x2="31" y2="46" stroke="#bbb" strokeWidth="0.7" />
        <line x1="41" y1="10" x2="57" y2="28" stroke="#bbb" strokeWidth="0.7" />
        <line x1="41" y1="28" x2="57" y2="28" stroke="#bbb" strokeWidth="0.7" />
        <line x1="41" y1="46" x2="57" y2="28" stroke="#bbb" strokeWidth="0.7" />
      </svg>
    ),
    formula: '∂L/∂w = ?',
    marginNote: 'chain rule is key',
  },
  3: {
    coverGradient: 'linear-gradient(145deg, #F3F0E8 0%, #EAE5D8 100%)',
    tabColor: '#6B9E5A',
    sketch: (
      <svg width="76" height="50" viewBox="0 0 76 50" fill="none" style={{ opacity: 0.4 }}>
        <path d="M8 44 L8 6" stroke="#444" strokeWidth="1" strokeLinecap="round" />
        <path d="M8 44 L72 44" stroke="#444" strokeWidth="1" strokeLinecap="round" />
        <path d="M10 14 C22 16, 38 28, 68 40" stroke="#D4644A" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
        <path d="M10 40 C28 36, 48 22, 68 10" stroke="#4A90D9" strokeWidth="1.2" strokeLinecap="round" />
        <text x="56" y="12" fill="#4A90D9" fontSize="7" fontFamily="Caveat, cursive">var</text>
        <text x="56" y="42" fill="#D4644A" fontSize="7" fontFamily="Caveat, cursive">bias²</text>
      </svg>
    ),
    formula: 'λ · ||w||²',
    marginNote: "don't overfit!",
  },
};

// ─── Spiral binding for open notebook ────────────────────────────────────────
function SpiralBinding() {
  return (
    <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-evenly items-center z-50 pointer-events-none" style={{ width: '40px', padding: '16px 0', transform: 'translateX(-50%)' }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="relative flex items-center justify-center w-full" style={{ height: '12px' }}>
          {/* Wire ring — thin dark metal */}
          <div 
            style={{ 
              width: '26px', 
              height: '5px', 
              borderRadius: '40%', 
              background: 'linear-gradient(to bottom, #555, #222, #333)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              transform: 'rotate(-3deg)',
              zIndex: 2
            }} 
          />
          {/* Left page hole */}
          <div className="absolute left-[2px] w-[6px] h-[6px] rounded-full bg-[#111] opacity-60" style={{ zIndex: 1 }} />
          {/* Right page hole */}
          <div className="absolute right-[2px] w-[6px] h-[6px] rounded-full bg-[#111] opacity-60" style={{ zIndex: 1 }} />
        </div>
      ))}
    </div>
  );
}

// Page-stack edge — thin stacked pages visible on right edge
function PageStackEdge({ count = 4 }) {
  return (
    <div className="absolute right-0 top-1 bottom-1 flex flex-row" style={{ gap: '1.5px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '2px',
            height: '100%',
            background: i % 2 === 0 ? '#F4EBDD' : '#E8DDD0',
            opacity: 1 - i * 0.1,
            borderRadius: '0 1px 1px 0',
            boxShadow: '1px 0 1px rgba(0,0,0,0.05)'
          }}
        />
      ))}
    </div>
  );
}

export default function Notebook({ lecture, initialPage = 0 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [turningState, setTurningState] = useState(null);
  
  useEffect(() => {
    setCurrentPage(0);
    setTurningState(null);
  }, [lecture.lecture_id]);

  const totalPages = lecture.slides.length;
  const identity = COVER_IDENTITIES[lecture.week] || COVER_IDENTITIES[1];

  const handleNext = () => {
    if (currentPage < totalPages && !turningState) {
      setTurningState({ direction: 'next', fromPage: currentPage, toPage: currentPage + 1 });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0 && !turningState) {
      setTurningState({ direction: 'prev', fromPage: currentPage, toPage: currentPage - 1 });
    }
  };

  const onTurnComplete = () => {
    setCurrentPage(turningState.toPage);
    setTurningState(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, turningState]);

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      
      {/* 3D Container */}
      <div 
        className="relative w-full max-w-6xl notebook-perspective my-4 md:my-8"
        style={{ 
          aspectRatio: '16/11',
          maxHeight: '85vh'
        }}
      >
        
        {/* Cover */}
        <div 
          className="page-container"
          style={{ 
            zIndex: currentPage > 0 ? 0 : 999,
            transform: currentPage > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            display: (turningState && (turningState.fromPage === 0 || turningState.toPage === 0)) ? 'none' : 'block'
          }}
        >
          {/* Front of Cover — warm student notebook */}
          <div 
            className="page-face page-front cursor-pointer group"
            onClick={handleNext}
            style={{
              background: identity.coverGradient,
              borderRadius: '4px 6px 6px 4px',
              boxShadow: 'inset -2px 0 8px rgba(0,0,0,0.04), inset 0 0 15px rgba(0,0,0,0.03), 0 8px 28px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.15), 4px 0 6px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.002)'; 
              e.currentTarget.style.boxShadow = 'inset -2px 0 8px rgba(0,0,0,0.04), inset 0 0 15px rgba(0,0,0,0.03), 0 12px 36px rgba(0,0,0,0.25), 0 5px 12px rgba(0,0,0,0.18), 6px 0 8px rgba(0,0,0,0.1)'; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.transform = ''; 
              e.currentTarget.style.boxShadow = 'inset -2px 0 8px rgba(0,0,0,0.04), inset 0 0 15px rgba(0,0,0,0.03), 0 8px 28px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.15), 4px 0 6px rgba(0,0,0,0.08)'; 
            }}
          >
            {/* Paper texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply rounded-sm"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'
              }}
            />

            {/* Spiral binding */}
            <SpiralBinding />
            
            {/* Page-stack edges */}
            <PageStackEdge count={5} />
            
            {/* Tab */}
            <div
              className="absolute -right-2 w-6 h-12 rounded-r-sm shadow-sm z-20"
              style={{ top: '20%', background: identity.tabColor, opacity: 0.75 }}
            />
            
            {/* Cover content — handwritten student feel */}
            <div 
              className="absolute inset-0 flex flex-col pl-12 pr-10 z-10"
              style={{ paddingTop: '8%', paddingBottom: '8%' }}
            >
              {/* Top Section: Course & Week */}
              <div>
                <div 
                  className="font-sans font-bold text-[#555] mb-2"
                  style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', letterSpacing: '0.05em' }}
                >
                  CS 4780
                </div>
                
                {/* Week label — slightly highlighted */}
                <div className="relative inline-block w-fit mb-8">
                  <span 
                    className="absolute inset-0 -mx-2 rounded-sm"
                    style={{ background: 'rgba(254,235,100,0.3)', transform: 'rotate(0.5deg) skewX(-2deg)' }}
                  />
                  <span 
                    className="font-handwritten text-[#333] relative z-10 px-1"
                    style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}
                  >
                    Week {lecture.week.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />
              
              {/* Center Section: Main Title */}
              <div style={{ transform: 'rotate(-0.5deg)' }}>
                <div 
                  className="font-handwritten leading-tight text-[#1a1a1a]"
                  style={{ 
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 700,
                  }}
                >
                  {lecture.title}
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom Section: Academic sketch & notes */}
              <div className="flex items-end justify-between mt-auto">
                {/* Tiny formula scribble & margin note */}
                <div style={{ transform: 'rotate(-1.5deg)' }}>
                  <div 
                    className="font-handwritten text-[#444]" 
                    style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)' }}
                  >
                    {identity.formula}
                  </div>
                  <div
                    className="font-handwritten text-[#888] mt-1"
                    style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)', transform: 'rotate(1deg)' }}
                  >
                    — {identity.marginNote}
                  </div>
                </div>
                
                {/* Tiny diagram */}
                <div style={{ transform: 'rotate(1.5deg)' }}>
                  {identity.sketch}
                </div>
              </div>
              
              {/* Open affordance */}
              <div 
                className="font-handwritten absolute bottom-6 right-10 text-[#aaa] opacity-60 group-hover:opacity-100 transition-opacity z-10"
                style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
              >
                ▸ open
              </div>
            </div>

            {/* Subtle corner wear */}
            <div 
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                width: '30px', height: '30px',
                background: 'radial-gradient(circle at bottom right, rgba(0,0,0,0.06) 0%, transparent 70%)',
                borderRadius: '0 0 4px 0'
              }}
            />
          </div>
          
          {/* Back of Cover — warm paper reverse */}
          <div 
            className="page-face page-back"
            style={{ 
              background: identity.coverGradient,
            }}
          >
            <div 
              className="font-handwritten absolute bottom-12 right-12 opacity-10 rotate-[-45deg]"
              style={{ color: '#333', fontSize: '5rem' }}
            >
              {lecture.course_code}
            </div>
          </div>
        </div>

        {/* Static Pages */}
        {lecture.slides.map((slide, index) => {
          const pageNumber = index + 1;
          const isFlipped = currentPage > pageNumber;
          const zIndex = isFlipped ? pageNumber : (totalPages - pageNumber + 10);
          const isTurningThisPage = turningState && (
            (turningState.direction === 'next' && pageNumber === turningState.fromPage) ||
            (turningState.direction === 'prev' && pageNumber === turningState.toPage)
          );
          
          return (
            <div 
              key={slide.slide_number} 
              style={{ display: isTurningThisPage ? 'none' : 'block' }}
            >
              <NotebookPage 
                slide={slide}
                lecture={lecture}
                isFlipped={isFlipped}
                zIndex={zIndex}
                isVisualClone={false}
              />
            </div>
          );
        })}

        {/* Dynamic Page Turner */}
        {turningState && (
          <PageTurner 
            turningState={turningState}
            lecture={lecture}
            onAnimationEnd={onTurnComplete}
          />
        )}
      </div>

      {/* Navigation Controls — paper-label style */}
      <div className="flex items-center justify-center gap-4 md:gap-6 mt-3 md:mt-5 pb-6 z-10">
        {/* Previous */}
        <button 
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5 transition-all disabled:opacity-30"
          style={{
            backgroundColor: currentPage === 0 ? 'transparent' : '#F4EBDD',
            border: '1px solid rgba(0,0,0,0.15)',
            padding: '8px 18px',
            borderRadius: '1px',
            cursor: currentPage === 0 ? 'default' : 'pointer',
            boxShadow: currentPage === 0 ? 'none' : '1px 2px 4px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.04)',
            fontFamily: 'Caveat, cursive',
            fontSize: '1.3rem',
            color: '#2a2825',
            letterSpacing: '0.02em',
            transform: 'rotate(-1deg)'
          }}
          aria-label="Previous Page"
        >
          ← Prev
        </button>
        
        {/* Page counter */}
        <div 
          className="handwritten-text min-w-[90px] text-center"
          style={{ color: '#555045', fontSize: '1.4rem' }}
        >
          {currentPage === 0 ? 'Cover' : `Pg ${currentPage} / ${totalPages}`}
        </div>
        
        {/* Next */}
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 transition-all disabled:opacity-30"
          style={{
            backgroundColor: currentPage === totalPages ? 'transparent' : '#F5D76E',
            border: '1px solid rgba(0,0,0,0.15)',
            padding: '8px 18px',
            borderRadius: '1px',
            cursor: currentPage === totalPages ? 'default' : 'pointer',
            boxShadow: currentPage === totalPages ? 'none' : '2px 3px 6px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
            fontFamily: 'Caveat, cursive',
            fontSize: '1.3rem',
            color: '#2a2825',
            letterSpacing: '0.02em',
            transform: 'rotate(1deg)'
          }}
          aria-label="Next Page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
