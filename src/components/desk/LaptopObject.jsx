import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LaptopObject() {
  const navigate = useNavigate();

  return (
    <div 
      className="relative w-[300px] h-[230px] md:w-[380px] md:h-[290px] xl:w-[420px] xl:h-[320px] cursor-pointer group transform transition-transform hover:-translate-y-1"
      onClick={() => navigate('/conversation')}
      title="Ask the Tutor"
    >
      {/* Laptop Screen (Lid) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[78%] bg-[#121212] rounded-t-xl border-[5px] border-[#222] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 -1px 8px rgba(0,0,0,0.5), inset 0 0 0 1px #000'
        }}
      >
        <div className="absolute inset-0 border border-white/5 pointer-events-none z-20" />
        
        {/* Tiny Tutor Interface */}
        <div className="flex-1 bg-[#0f0f0f] p-3 flex flex-col relative z-10 justify-center">
          <div className="text-white/30 text-[9px] font-bold tracking-[0.2em] text-center mb-4">STUDYMAP TUTOR</div>
          
          <div className="flex flex-col gap-3">
            <div className="self-end max-w-[85%] bg-primary/20 border border-primary/30 rounded px-2 py-1.5 shadow-sm">
              <p className="text-[8px] text-white/90 leading-tight font-sans">Why does the gradient vanish?</p>
            </div>
            
            <div className="self-start max-w-[90%] bg-[#1c1c1c] border border-[#2a2a2a] rounded px-2 py-1.5 shadow-sm">
              <p className="text-[8px] text-white/80 leading-snug font-sans">
                Because derivatives are repeatedly multiplied through the network layers, causing them to shrink exponentially.
              </p>
            </div>
          </div>
          
          <div className="mt-4 h-4 rounded-full border border-white/10 bg-white/[0.03] w-full flex items-center px-2">
             <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none z-20" />
      </div>

      {/* Hinge */}
      <div className="absolute top-[78%] left-1/2 -translate-x-1/2 w-[65%] h-2 bg-[#0A0A0A] rounded-full z-10 shadow-inner" />

      {/* Laptop Base (Keyboard Deck) */}
      <div 
        className="absolute top-[78%] left-0 w-full h-[22%] bg-[#B4B6B9] rounded-b-[14px] border border-white/30 flex flex-col items-center pt-2 px-8"
        style={{
          background: 'linear-gradient(to bottom, #cfd1d3, #9fa1a4)',
          // Heavy contact shadow and cast shadow
          boxShadow: '0 24px 30px rgba(0,0,0,0.5), 0 8px 12px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.7)'
        }}
      >
        <div 
          className="w-full h-1/2 bg-[#1A1A1A] rounded-sm mb-1.5 opacity-90 border border-black/40"
          style={{ boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.9)' }}
        >
          <div 
            className="w-full h-full opacity-15"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent 1px, #fff 1px), linear-gradient(transparent 1px, #fff 1px)',
              backgroundSize: '9px 9px'
            }}
          />
        </div>
        
        <div 
          className="w-20 h-1/2 bg-[#A0A2A5] rounded-sm"
          style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.4)' }}
        />
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-black/15 rounded-t-full" />
      </div>
    </div>
  );
}
