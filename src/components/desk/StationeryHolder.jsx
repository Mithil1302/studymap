import React from 'react';

export default function StationeryHolder() {
  return (
    <div className="relative w-24 h-32 md:w-28 md:h-36 pointer-events-none transform rotate-0">
      {/* Container / Cup (Ceramic matte look) */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70px] h-20 bg-gradient-to-br from-[#E8E8E8] via-[#F4F4F4] to-[#C8C8C8] rounded-b-[16px] border border-[#B0B0B0] z-20"
        style={{
          boxShadow: 'inset 4px 0 8px rgba(255,255,255,0.8), inset -4px -4px 10px rgba(0,0,0,0.1), 4px 8px 15px rgba(0,0,0,0.2)'
        }}
      >
        {/* Cup Inner Rim */}
        <div className="absolute -top-1 left-0 right-0 h-[10px] bg-[#D4D4D4] rounded-[100%] border border-[#A0A0A0]" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
      </div>

      {/* Blue Pen */}
      <div className="absolute bottom-[70px] left-3 w-[10px] h-24 bg-gradient-to-r from-[#174A9C] to-[#2563EB] rounded-t-full transform -rotate-12 z-10 shadow-sm border border-black/10">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[4px] h-6 bg-white/25 rounded-full" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-[#A0A0A0] rounded-t-sm" />
      </div>

      {/* Pencil */}
      <div className="absolute bottom-[75px] left-7 w-[10px] h-[110px] bg-gradient-to-r from-[#FCD34D] to-[#F59E0B] rounded-t-[2px] transform -rotate-2 z-[15] shadow-md border-r border-[#D97706]/40">
        {/* Metal band */}
        <div className="absolute top-0 w-full h-[12px] bg-gradient-to-r from-[#9CA3AF] to-[#D1D5DB] border-y border-[#6B7280]" />
        {/* Eraser */}
        <div className="absolute -top-[10px] left-0 w-full h-[10px] bg-[#FCA5A5] rounded-t-[2px] border border-[#F87171]" />
        {/* Pencil body lines */}
        <div className="absolute top-[12px] bottom-0 left-1 w-px bg-black/10" />
      </div>

      {/* Yellow Highlighter (Thicker) */}
      <div className="absolute bottom-[65px] left-[55px] w-[16px] h-[95px] bg-gradient-to-r from-[#FEF08A] to-[#EAB308] rounded-t-md transform rotate-12 z-10 shadow-md border-r border-[#CA8A04]/30">
        <div className="absolute top-0 w-full h-8 bg-[#333] rounded-t-md border-t border-[#555]" />
        <div className="absolute top-8 left-0 right-0 h-1 bg-[#111]" />
      </div>

      {/* Black Pen */}
      <div className="absolute bottom-[68px] left-10 w-[10px] h-[85px] bg-gradient-to-r from-[#333] to-[#111] rounded-t-full transform rotate-6 z-[16] shadow-sm border border-black/50">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-white/10" />
        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-1 h-1.5 bg-[#888] rounded-t-sm" />
      </div>

      {/* Cast Shadow of the cup on the desk */}
      <div className="absolute bottom-[-2px] right-2 w-[70px] h-[12px] bg-black/30 rounded-full blur-[4px] -z-10 translate-x-2 translate-y-1" />
    </div>
  );
}
