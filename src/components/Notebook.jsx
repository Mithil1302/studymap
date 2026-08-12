import React, { useState, useEffect } from 'react';
import NotebookPage from './NotebookPage';
import PageTurner from './PageTurner';

// Spiral ring rendering — CSS-only rings that look metallic
function SpiralBinding() {
  const rings = Array.from({ length: 10 });
  return (
    <div 
      className="absolute left-0 top-0 bottom-0 z-30 flex flex-col justify-center items-center"
      style={{ width: '28px', gap: '10px', paddingTop: '18px', paddingBottom: '18px' }}
    >
      {rings.map((_, i) => (
        <div
          key={i}
          style={{
            width: '24px',
            height: '16px',
            borderRadius: '50%',
            border: '2.5px solid #9a9590',
            background: 'linear-gradient(135deg, #d6d2cc 0%, #a8a5a0 40%, #7a7875 70%, #b5b2ad 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
            flexShrink: 0
          }}
        />
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
            width: '3px',
            height: '100%',
            background: i % 2 === 0 ? '#e8ddd0' : '#d4c9b8',
            opacity: 1 - i * 0.15,
            borderRadius: '0 1px 1px 0'
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* 3D Container */}
      <div 
        className="relative w-full max-w-3xl notebook-perspective my-4 md:my-8"
        style={{ 
          aspectRatio: '3/4',
          maxHeight: '78vh'
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
          {/* Front of Cover — physical notebook */}
          <div 
            className="page-face page-front cursor-pointer group"
            onClick={handleNext}
            style={{
              background: '#2a2825',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.06\'/%3E%3C/svg%3E")',
              borderRadius: '4px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25), 2px 0 4px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)'; }}
          >
            {/* Spiral binding on cover */}
            <SpiralBinding />
            
            {/* Page-stack edges */}
            <PageStackEdge count={5} />
            
            {/* Cover content — restrained, handwritten feel */}
            <div 
              className="absolute inset-0 flex flex-col justify-center pl-12 pr-8"
              style={{ paddingTop: '15%', paddingBottom: '12%' }}
            >
              {/* Small label at top */}
              <div 
                className="handwritten-text mb-8"
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', letterSpacing: '0.05em' }}
              >
                {lecture.course_code}
              </div>
              
              {/* Main title */}
              <div>
                <div 
                  className="handwritten-text leading-tight"
                  style={{ 
                    color: 'rgba(255,255,255,0.88)', 
                    fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                    fontWeight: 600
                  }}
                >
                  {lecture.title}
                </div>
                <div 
                  style={{
                    height: '1.5px',
                    background: 'rgba(245, 215, 110, 0.5)',
                    marginTop: '8px',
                    width: '60%',
                    borderRadius: '1px'
                  }}
                />
              </div>
              
              {/* Week label */}
              <div 
                className="handwritten-text mt-5"
                style={{ color: 'rgba(245, 215, 110, 0.7)', fontSize: '1rem' }}
              >
                Week {lecture.week.toString().padStart(2, '0')}
              </div>
              
              {/* Open affordance — bottom right */}
              <div 
                className="handwritten-text absolute bottom-6 right-8 opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}
              >
                ▸ open
              </div>
            </div>

            {/* Worn corner edge */}
            <div 
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                width: '40px', height: '40px',
                background: 'radial-gradient(circle at bottom right, rgba(0,0,0,0.35) 0%, transparent 70%)',
                borderRadius: '0 0 4px 0'
              }}
            />
          </div>
          
          {/* Back of Cover */}
          <div 
            className="page-face page-back"
            style={{ background: '#1e1c1a' }}
          >
            <div 
              className="handwritten-text absolute bottom-8 right-8 opacity-10 rotate-[-45deg]"
              style={{ color: 'white', fontSize: '4rem' }}
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
            border: '1px solid rgba(0,0,0,0.2)',
            padding: '6px 14px',
            borderRadius: '2px',
            cursor: currentPage === 0 ? 'default' : 'pointer',
            boxShadow: currentPage === 0 ? 'none' : '1px 1px 3px rgba(0,0,0,0.1)',
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: '0.8rem',
            color: '#202020',
            letterSpacing: '0.02em'
          }}
          aria-label="Previous Page"
        >
          ← Previous
        </button>
        
        {/* Page counter */}
        <div 
          className="handwritten-text min-w-[90px] text-center"
          style={{ color: '#555045', fontSize: '1rem' }}
        >
          {currentPage === 0 ? 'Cover' : `Page ${currentPage} / ${totalPages}`}
        </div>
        
        {/* Next */}
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 transition-all disabled:opacity-30"
          style={{
            backgroundColor: currentPage === totalPages ? 'transparent' : '#F5D76E',
            border: '1px solid rgba(0,0,0,0.2)',
            padding: '6px 14px',
            borderRadius: '2px',
            cursor: currentPage === totalPages ? 'default' : 'pointer',
            boxShadow: currentPage === totalPages ? 'none' : '1px 2px 4px rgba(0,0,0,0.12)',
            fontFamily: 'Hanken Grotesk, sans-serif',
            fontSize: '0.8rem',
            color: '#202020',
            letterSpacing: '0.02em'
          }}
          aria-label="Next Page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

