import { Fragment } from 'react';
import { LEARNING_STATE_COLORS } from './learningMapTokens';

export default function MapHeader({ explored, total, currentThread = [], currentId }) {
  const pct = total > 0 ? Math.round((explored / total) * 100) : 0;

  return (
    <header className="px-6 md:px-10 pt-5 pb-3 md:pt-6 md:pb-4 border-b border-[#ECE8DF] bg-[#FAF9F6]/90 backdrop-blur-sm z-30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Title & Subtitle & Legend */}
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-[#1a1a1a] tracking-tight mb-0.5"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            YOUR KNOWLEDGE MAP
          </h1>
          <p className="text-xs md:text-sm text-[#777] mb-2.5 font-medium">
            Machine Learning for Engineers
          </p>

          {/* Semantic Legend */}
          <div
            className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[10px] md:text-[11px] font-semibold tracking-wider uppercase"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            <span className="flex items-center gap-1 text-[#465D4C]">
              <span className="font-bold" style={{ color: LEARNING_STATE_COLORS.learned.primary }}>
                {LEARNING_STATE_COLORS.learned.icon}
              </span>{' '}
              {LEARNING_STATE_COLORS.learned.label}
            </span>
            <span className="flex items-center gap-1 text-[#2B2925]">
              <span className="font-bold" style={{ color: LEARNING_STATE_COLORS.current.primary }}>
                {LEARNING_STATE_COLORS.current.icon}
              </span>{' '}
              {LEARNING_STATE_COLORS.current.label}
            </span>
            <span className="flex items-center gap-1 text-[#3B5B7E]">
              <span className="font-bold" style={{ color: LEARNING_STATE_COLORS.available.primary }}>
                {LEARNING_STATE_COLORS.available.icon}
              </span>{' '}
              {LEARNING_STATE_COLORS.available.label}
            </span>
            <span className="flex items-center gap-1 text-[#8F8C87]">
              <span className="font-bold" style={{ color: LEARNING_STATE_COLORS.locked.primary }}>
                {LEARNING_STATE_COLORS.locked.icon}
              </span>{' '}
              {LEARNING_STATE_COLORS.locked.label}
            </span>
          </div>
        </div>

        {/* Progress & Current Thread Summary */}
        <div className="flex flex-col md:items-end gap-2">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span
              className="text-[11px] font-bold text-[#444] tracking-wider uppercase"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              {explored} / {total} concepts explored
            </span>
            <div className="w-[140px] md:w-[180px] h-1.5 bg-[#E6E1D8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: '#1a1a1a',
                }}
              />
            </div>
          </div>

          {/* Current Thread text annotation */}
          {currentThread.length > 0 && (
            <div
              className="text-[11px] text-[#777] flex flex-col md:items-end gap-1"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#999] mb-1">
                CURRENT THREAD
              </span>
              <div className="flex items-center flex-wrap gap-y-3">
                {currentThread.map((node, i) => {
                  const isCurrent = node.id === currentId;
                  return (
                    <Fragment key={node.id}>
                      <div className="relative flex flex-col items-center">
                        <span className={`font-medium ${isCurrent ? 'text-[#1a1a1a]' : 'text-[#555]'}`}>
                          {node.title}
                        </span>
                        {isCurrent && (
                          <div className="absolute top-full mt-0.5 flex flex-col items-center pointer-events-none">
                            <span className="text-[10px] text-[#D89F00] -mt-0.5" style={{ lineHeight: 1 }}>↑</span>
                            <span className="text-[7.5px] font-bold text-[#D89F00] whitespace-nowrap leading-none mt-0.5">YOU ARE HERE</span>
                          </div>
                        )}
                      </div>
                      {i < currentThread.length - 1 && (
                        <span className="mx-2 text-[#ccc]">→</span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
