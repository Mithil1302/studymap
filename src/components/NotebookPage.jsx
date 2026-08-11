import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function NotebookPage({ slide, lecture, isFlipped, zIndex, isVisualClone = false }) {
  return (
    <div 
      className={`page-container ${isFlipped ? 'page-flipped' : ''}`}
      style={{ 
        zIndex,
        pointerEvents: isVisualClone ? 'none' : 'auto'
      }}
    >
      {/* FRONT FACE (Content) */}
      <div className={`page-face page-front bg-paper-white border-2 border-primary rounded-r-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] noise-bg flex flex-col ${isVisualClone ? 'overflow-hidden' : 'custom-scrollbar overflow-y-auto'}`}>
        
        {/* Page Content Container */}
        <div className="p-6 md:p-10 lg:p-12 relative flex-1">
          {/* Header */}
          <header className="mb-6 md:mb-10 border-b-2 border-primary pb-4 md:pb-6 relative">
            {/* Hand-written page marker */}
            <div className="absolute -top-2 right-0 handwritten-blue text-lg opacity-80">
              Week {lecture.week.toString().padStart(2, '0')} · Slide {slide.slide_number.toString().padStart(2, '0')}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display-lg text-primary leading-tight mb-2 md:mb-3 pr-24">{slide.title}</h2>
          </header>

          <div className="flex flex-col gap-6 md:gap-8 relative">
            {/* Main Content */}
            <div className="prose prose-base md:prose-lg text-base md:text-body-lg font-body-lg text-on-surface max-w-none space-y-4 md:space-y-6 notebook-line pt-1">
              {slide.bullets && slide.bullets.length > 0 && (
                <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 marker:text-primary">
                  {slide.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed"><MarkdownRenderer content={bullet} /></li>
                  ))}
                </ul>
              )}

              {/* Figure Description */}
              {slide.figure && (
                <div className="bg-surface-container-low border-2 border-dashed border-outline p-4 md:p-6 rounded-md text-center italic text-sm md:text-base text-on-surface-variant my-6">
                  [Figure: {slide.figure.description}]
                </div>
              )}

              {/* Formulas Block */}
              {slide.formulas && slide.formulas.length > 0 && (
                <div className="relative z-10 text-center flex flex-col items-center justify-center py-6 md:py-8 px-2 bg-surface-container-lowest border-2 border-primary rounded mt-6 md:mt-8 hard-shadow-sm">
                  <div className="absolute inset-0 opacity-10 dot-pattern"></div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 tape-strip rotate-2"></div>
                  {slide.formulas.map((formula, fIdx) => (
                    <div key={fIdx} className="text-xl sm:text-2xl md:text-3xl font-medium text-primary tracking-wide relative z-10 my-3 w-full overflow-x-auto custom-scrollbar">
                      <MarkdownRenderer content={`$$${formula}$$`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Professor's Annotation (Sticky Note) */}
            {slide.notes && (
              <div className="relative mt-8 md:mt-12 mb-4 self-end max-w-[90%] md:max-w-[80%] lg:max-w-[320px]">
                <div className="rotate-[-2deg] bg-[#fef08a] border-2 border-[#ca8a04] p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-col gap-2 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 tape-strip -rotate-3"></div>
                  <p className="handwritten-text text-primary text-xl lg:text-2xl leading-relaxed whitespace-pre-wrap">
                    {slide.notes}
                  </p>
                  <span className="material-symbols-outlined text-[#ca8a04] self-end mt-1 md:mt-2 text-xl">draw</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACK FACE (Paper back) */}
      <div className="page-face page-back bg-[#f8f7f5] border-2 border-primary rounded-l-lg shadow-[-4px_4px_0px_0px_rgba(0,0,0,0.2)] noise-bg flex items-center justify-center">
        <div className="opacity-10 pointer-events-none w-full h-full notebook-line"></div>
      </div>
    </div>
  );
}
