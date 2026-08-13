import React from 'react';

export default function StudyPlanner({ allStats = [], currentWeek }) {
  return (
    <div 
      className="relative w-48 md:w-52 bg-[#F7F7F4] p-5 rounded-sm border border-[#D5D5D2] cursor-default transform -rotate-2 transition-transform hover:rotate-1"
      style={{
        // Medium shadow
        boxShadow: '4px 8px 20px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.03)'
      }}
    >
      {/* Top binding spiral */}
      <div className="absolute top-0 left-0 right-0 h-4 -mt-2 flex justify-evenly">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-1.5 h-4 bg-[#333] rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.5)] border border-black/20" />
        ))}
      </div>

      <div className="text-center border-b-2 border-black/15 pb-2 mb-4 mt-2">
        <h4 className="font-label-caps tracking-widest text-[11px] text-on-surface-variant">CS 4780</h4>
        <h3 className="font-headline-md text-sm font-bold mt-1 leading-none tracking-wide text-black/80">STUDY PLANNER</h3>
      </div>

      <div className="flex flex-col gap-2.5 px-2">
        {allStats.map((stat) => {
          const weekNum = stat.lec.week;
          const isCurrent = weekNum === currentWeek;
          const isComplete = stat.total > 0 && stat.explored === stat.total;
          
          let statusIcon = '○';
          let statusColor = 'text-on-surface-variant/40';
          let fontWeight = 'font-normal';
          
          if (isComplete) {
            statusIcon = '✓';
            statusColor = 'text-success-green';
            fontWeight = 'font-bold';
          } else if (isCurrent) {
            statusIcon = '●';
            statusColor = 'text-primary';
            fontWeight = 'font-bold';
          }

          return (
            <div key={weekNum} className="flex items-center gap-3 relative">
              <span className={`w-4 text-center text-sm ${statusColor}`}>{statusIcon}</span>
              <span className={`text-[13px] font-sans tracking-wide ${statusColor} ${fontWeight}`}>
                WEEK {String(weekNum).padStart(2, '0')}
              </span>
            </div>
          );
        })}
        
        {allStats.length === 0 && (
          <div className="text-xs text-on-surface-variant italic text-center py-2">
            No weeks available.
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-black/10 text-center">
        <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant block mb-1">CURRENT</span>
        <span className="font-handwritten text-lg text-primary font-bold">
          Week {String(currentWeek).padStart(2, '0')}
        </span>
      </div>
      
      {/* Thick paper edge shadow */}
      <div className="absolute inset-0 border border-white/50 rounded-sm pointer-events-none" />
    </div>
  );
}
