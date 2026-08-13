import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TextbookStack() {
  const navigate = useNavigate();

  return (
    <div 
      className="relative w-56 h-72 md:w-64 md:h-[320px] cursor-pointer group transition-transform hover:-translate-y-1"
      onClick={() => navigate('/learning-map')}
      title="Open Course Map"
    >
      {/* Bottom Book (Large, slightly rotated left) */}
      <div 
        className="absolute bottom-0 left-2 w-[90%] h-[92%] bg-[#1E293B] rounded-r-lg border border-black/30"
        style={{
          transform: 'rotate(-2deg)',
          transformOrigin: 'bottom left',
          boxShadow: '16px 20px 30px rgba(0,0,0,0.5), inset -2px 0 6px rgba(0,0,0,0.4)'
        }}
      >
        <div className="absolute left-3 top-0 bottom-0 w-px bg-black/40" />
        <div className="absolute left-4 top-0 bottom-0 w-5 bg-white/5" />
        <div className="absolute top-[3px] bottom-[3px] right-0 w-2.5 bg-[#E8E4D9] rounded-r-md border-l border-black/20 shadow-inner" />
        
        {/* Cover texture / label */}
        <div className="absolute inset-0 pl-10 pt-6 opacity-30">
          <div className="text-white font-serif text-sm">Reference</div>
        </div>
      </div>

      {/* Middle Book (Thinner, rotated right) */}
      <div 
        className="absolute bottom-5 left-4 w-[85%] h-[88%] bg-[#6B2C2C] rounded-r-md border border-black/30"
        style={{
          transform: 'rotate(1deg)',
          transformOrigin: 'bottom left',
          boxShadow: '8px 12px 25px rgba(0,0,0,0.5), inset -1px 0 4px rgba(0,0,0,0.2)'
        }}
      >
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-black/30" />
        <div className="absolute left-[4px] top-0 bottom-0 w-1.5 bg-white/10" />
        <div className="absolute top-[2px] bottom-[2px] right-0 w-2 bg-[#F2F0E6] rounded-r-sm border-l border-black/20" />
        
        <div className="absolute inset-0 pl-8 pt-4 opacity-40">
          <div className="text-white font-sans text-xs tracking-wider">Mathematics</div>
        </div>
      </div>

      {/* Top Book (Main course book, thickest) */}
      <div 
        className="absolute bottom-9 left-2 w-[88%] h-[85%] bg-[#0F352C] rounded-r-lg border border-black/40 overflow-hidden"
        style={{
          transform: 'rotate(-1deg)',
          transformOrigin: 'bottom left',
          boxShadow: '4px 8px 16px rgba(0,0,0,0.6), inset -2px 0 8px rgba(0,0,0,0.3)'
        }}
      >
        <div className="absolute left-4 top-0 bottom-0 w-px bg-black/50" />
        <div className="absolute left-4 top-0 bottom-0 w-2 bg-black/20" />
        <div className="absolute left-[4px] top-0 bottom-0 w-1.5 bg-white/10" />
        
        <div className="absolute top-[2px] bottom-[2px] right-0 w-2 bg-[#FCFAF5] rounded-r-sm border-l border-black/15" />

        {/* Cover Content */}
        <div className="absolute inset-0 pl-8 pr-5 py-10 flex flex-col justify-between pointer-events-none">
          <div>
            <div className="text-white/60 font-label-caps text-[11px] tracking-widest mb-3">CS 4780</div>
            <h2 className="text-white/90 font-headline-md leading-tight text-2xl font-bold" style={{ fontFamily: 'Chivo, sans-serif' }}>
              Machine Learning
              <br />
              for Engineers
            </h2>
          </div>
          
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-80">
            <div className="w-5 h-5 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
      
      {/* Global shadow cast by the entire stack */}
      <div className="absolute -bottom-4 -right-2 left-8 h-12 bg-black/50 blur-[24px] -z-10 rounded-full" />
    </div>
  );
}
