import React, { useState, useEffect } from 'react';
import NotebookPage from './NotebookPage';
import PageTurner from './PageTurner';

export default function Notebook({ lecture, initialPage = 0 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [turningState, setTurningState] = useState(null); // { direction, fromPage, toPage }
  
  // Reset page when lecture changes
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in chat or input
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
      <div className="relative w-full max-w-3xl aspect-[3/4] md:aspect-[4/5] lg:aspect-[1/1.2] notebook-perspective my-4 md:my-8 max-h-[75vh] md:max-h-[85vh]">
        
        {/* Cover */}
        <div 
          className="page-container"
          style={{ 
            zIndex: currentPage > 0 ? 0 : 999,
            transform: currentPage > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            display: (turningState && (turningState.fromPage === 0 || turningState.toPage === 0)) ? 'none' : 'block'
          }}
        >
          {/* Front of Cover */}
          <div className="page-face page-front bg-primary border-2 border-primary rounded-r-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] noise-bg flex items-center justify-center p-6 md:p-12 relative cursor-pointer group" onClick={handleNext}>
            <div className="border-4 border-paper-white/20 w-full h-full p-6 md:p-8 flex flex-col justify-center bg-primary/80 backdrop-blur-sm relative z-10 transition-transform group-hover:scale-[1.01]">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display-lg text-paper-white text-center leading-tight">
                {lecture.title}
              </h1>
              <div className="mt-8 md:mt-12 text-center text-paper-white/80 font-label-caps text-sm md:text-lg uppercase tracking-[0.2em]">
                {lecture.course_code}
              </div>
              <div className="mt-auto text-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="bg-paper-white text-primary px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:scale-105 transition-transform hard-shadow-sm text-sm md:text-base"
                >
                  Open Notebook
                </button>
              </div>
            </div>
            {/* Spine detail */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-black/20 border-r-2 border-black/40 z-20 shadow-[inset_-4px_0_12px_rgba(0,0,0,0.3)]"></div>
          </div>
          
          {/* Back of Cover (inside cover) */}
          <div className="page-face page-back bg-[#1a1a1a] border-2 border-primary rounded-l-xl flex items-center justify-center noise-bg shadow-[-8px_8px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="text-paper-white/10 font-display-lg text-7xl md:text-9xl rotate-[-45deg] opacity-20">
              {lecture.course_code}
            </div>
          </div>
        </div>

        {/* Static Pages */}
        {lecture.slides.map((slide, index) => {
          const pageNumber = index + 1;
          const isFlipped = currentPage > pageNumber;
          
          // Calculate Z-Index:
          const zIndex = isFlipped ? pageNumber : (totalPages - pageNumber + 10);
          
          // Hide this page if it is currently turning
          // If turning next: fromPage is the one turning over to the left.
          // If turning prev: toPage is the one turning back to the right.
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

        {/* Dynamic Page Turner (Overlay) */}
        {turningState && (
          <PageTurner 
            turningState={turningState}
            lecture={lecture}
            onAnimationEnd={onTurnComplete}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-8 mt-4 md:mt-8 pb-8 z-10 bg-background/80 px-6 py-2 rounded-full backdrop-blur-sm">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto gap-2 text-primary font-label-caps hover:bg-surface-container-high md:px-4 md:py-2 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous Page"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="hidden md:inline">Previous</span>
        </button>
        
        <div className="font-label-caps text-on-surface-variant font-bold tracking-[0.1em] text-xs md:text-sm min-w-[100px] text-center">
          {currentPage === 0 ? 'COVER' : `PAGE ${currentPage.toString().padStart(2, '0')} / ${totalPages.toString().padStart(2, '0')}`}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto gap-2 text-primary font-label-caps hover:bg-surface-container-high md:px-4 md:py-2 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next Page"
        >
          <span className="hidden md:inline">Next</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
