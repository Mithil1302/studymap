import React, { useEffect, useState } from 'react';
import NotebookPage from './NotebookPage';

export default function PageTurner({ turningState, lecture, onAnimationEnd }) {
  const { direction, fromPage, toPage } = turningState;
  
  // We determine what content is on the front of the turning sheet, and what is on the back.
  // Next (Right to Left): 
  // Front of turning sheet is the current page (fromPage).
  // Back of turning sheet is the new left page (toPage).
  
  // Prev (Left to Right):
  // Front of turning sheet is the target page (toPage).
  // Back of turning sheet is the current page (fromPage).

  const isNext = direction === 'next';
  
  // The page that physically turns is:
  // - fromPage when going next
  // - toPage when going prev
  const turningSlideIndex = (isNext ? fromPage : toPage) - 1;
  const turningSlide = lecture.slides[turningSlideIndex];

  const [isAnimating, setIsAnimating] = useState(false);

  const isInvalid = !turningSlide;

  useEffect(() => {
    if (isInvalid) {
      // Skip to next slide immediately if no content to animate
      onAnimationEnd();
      return;
    }

    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
    
    // Animation duration should match the CSS (1.1s) plus a small buffer
    const endTimer = setTimeout(() => {
      onAnimationEnd();
    }, 1150);
    
    return () => {
      cancelAnimationFrame(timer);
      clearTimeout(endTimer);
    };
  }, [onAnimationEnd, isInvalid]);

  if (isInvalid) return null;

  const SheetContent = () => (
    <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
      {/* We render the turning NotebookPage. 
          When going Next, it starts at rotateY(0deg) and isFlipped=false.
          When going Prev, the CSS animations start it at rotateY(-180deg) but we still pass isFlipped=false
          so the internal CSS doesn't apply a double rotation. Our hinges handle the rotation! */}
      <NotebookPage slide={turningSlide} lecture={lecture} isVisualClone={true} isFlipped={false} zIndex={1} />
    </div>
  );

  return (
    <div className={`pt-container pt-dir-${direction} ${isAnimating ? 'is-animating' : ''}`}>
      {/* Hinge 1 (Spine, 33.333% width) */}
      <div className="pt-hinge pt-hinge-1">
        <div className="pt-clipper">
          <div className="pt-content-wrapper">
            <SheetContent />
          </div>
          <div className="pt-shadow pt-shadow-1"></div>
        </div>
        
        {/* Hinge 2 (Middle, 33.333% width) */}
        <div className="pt-hinge pt-hinge-2">
          <div className="pt-clipper">
            <div className="pt-content-wrapper pt-offset-2">
              <SheetContent />
            </div>
            <div className="pt-shadow pt-shadow-2"></div>
          </div>
          
          {/* Hinge 3 (Outer edge, 33.333% width) */}
          <div className="pt-hinge pt-hinge-3">
            <div className="pt-clipper">
              <div className="pt-content-wrapper pt-offset-3">
                <SheetContent />
              </div>
              <div className="pt-shadow pt-shadow-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
