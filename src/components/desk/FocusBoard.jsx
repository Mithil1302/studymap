import React from 'react';

export default function FocusBoard() {
  return (
    <div 
      className="relative w-64 h-48 md:w-72 md:h-56 bg-[#DBC2A4] rounded-sm transform -rotate-1 cursor-default"
      style={{
        boxShadow: '2px 4px 10px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.1)',
        // Cork texture implication
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `
      }}
    >
      {/* Wooden frame */}
      <div className="absolute inset-0 border-[6px] border-[#8C6B4A] rounded-sm" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }} />
      
      {/* Content wrapper */}
      <div className="absolute inset-0 p-4 flex flex-col pointer-events-none">
        
        {/* Pinned Note */}
        <div className="relative bg-[#F9F7E8] w-full max-w-[200px] mx-auto p-3 shadow-md transform rotate-1 mt-2 border border-black/10">
          {/* Push pin */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-red-800">
            <div className="absolute top-[2px] left-[2px] w-1 h-1 bg-white/40 rounded-full" />
          </div>

          <h4 className="font-label-caps tracking-widest text-[10px] text-black/50 mb-1 border-b border-black/10 pb-1">CURRENT FOCUS</h4>
          <h3 className="font-headline-md font-bold text-sm text-black/80 mb-2">Vanishing Gradient</h3>
          
          <div className="bg-white/50 border border-black/5 p-1 mb-2 text-center">
            <span className="font-serif text-[12px] italic text-blue-900/80">&sigma;'(z) &le; 0.25</span>
          </div>
          
          <p className="font-handwritten text-[13px] text-red-600/80 text-center leading-tight">
            understand before moving on
          </p>
        </div>

      </div>
      
      {/* Cast shadow onto desk */}
      <div className="absolute -bottom-2 -right-1 left-2 h-4 bg-black/20 blur-[6px] -z-10 rounded-full" />
    </div>
  );
}
