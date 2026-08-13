import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NextStudyNote({ nextNode, nextLec, nextSlide }) {
  const navigate = useNavigate();

  if (!nextNode) return null;

  return (
    <div 
      className="relative w-44 bg-[#FEEB6E] p-4 cursor-pointer group transition-transform hover:-translate-y-1 transform rotate-3"
      onClick={() => navigate(`/lectures/${nextNode.lectureId}`)}
      title="Study Next Concept"
      style={{
        // Medium shadow + tiny paper curl shadow
        boxShadow: '2px 4px 12px rgba(0,0,0,0.15), inset 0 -2px 10px rgba(220,190,0,0.15)',
        borderBottomRightRadius: '24px 4px',
        borderTopLeftRadius: '2px',
        borderTopRightRadius: '2px',
        borderBottomLeftRadius: '2px'
      }}
    >
      {/* Tape piece - translucent */}
      <div className="absolute -top-3 left-[40%] -translate-x-1/2 w-14 h-6 bg-white/30 backdrop-blur-sm transform -rotate-3 border border-white/40 z-10" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} />

      <h4 className="font-label-caps tracking-widest text-[10px] text-black/50 mb-3 border-b border-black/10 pb-1 inline-block">NEXT UP</h4>
      
      <h3 className="font-headline-md text-[15px] font-bold text-black/85 leading-tight mb-2">
        {nextNode.title}
      </h3>
      
      {nextLec && nextSlide && (
        <p className="text-black/60 text-[11px] font-sans mb-4 tracking-wide">
          Week {String(nextLec.week).padStart(2, '0')} &middot; Slide {nextSlide}
        </p>
      )}

      <div className="flex items-center gap-1 text-black/80 font-handwritten font-bold text-[15px] group-hover:text-black transition-colors">
        <span>Open notebook</span>
        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
      </div>

      {/* Shadow for the curled corner */}
      <div className="absolute bottom-0 right-0 w-10 h-10 bg-black/15 rounded-full blur-[6px] -z-10 translate-x-2 translate-y-2" />
    </div>
  );
}
