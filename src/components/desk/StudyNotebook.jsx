import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudyNotebook({ thread = [] }) {
  const navigate = useNavigate();
  const hasThread = thread && thread.length > 0;

  return (
    <div 
      className="relative w-full aspect-[4/3] mx-auto cursor-pointer group transition-transform hover:-translate-y-1"
      onClick={() => {
        if (hasThread) {
          const activeNode = thread[thread.length - 1];
          navigate(`/lectures/${activeNode.lectureId}`);
        }
      }}
      title={hasThread ? "Continue studying" : "Open notebook"}
      style={{
        // Heavy contact shadow for notebook
        boxShadow: '0 24px 40px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.5), inset -1px 0 2px rgba(0,0,0,0.05)',
        borderRadius: '3px',
        transform: 'rotate(-1deg)'
      }}
    >
      {/* Notebook Cover Edge (Bottom underneath) */}
      <div className="absolute inset-0 bg-[#2C2B29] rounded-sm translate-y-[3px] translate-x-[2px] -z-10" />

      {/* Two Page Spread */}
      <div className="flex w-full h-full bg-[#FDFBF7] rounded-[2px] overflow-hidden border border-black/15 relative z-10">
        
        {/* LEFT PAGE */}
        <div className="flex-1 border-r border-black/10 relative notebook-line overflow-hidden p-6 pl-8">
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
          
          <h3 className="font-handwritten text-2xl font-bold text-primary mb-6 opacity-85">
            Current Study
          </h3>

          {!hasThread ? (
            <p className="font-handwritten text-lg text-primary/60">
              Select a concept from the map to begin studying.
            </p>
          ) : (
            <div className="flex flex-col">
              {thread.map((node, i) => {
                const isLast = i === thread.length - 1;
                return (
                  <div key={node.id} className="flex flex-col relative pl-2">
                    <div className="py-2">
                      <span 
                        className={`font-handwritten text-[1.2rem] leading-none ${isLast ? 'text-primary font-bold bg-yellow-100/50' : 'text-primary/75'}`}
                        style={{ display: 'inline-block', transform: `rotate(${Math.random() * 2 - 1}deg)` }}
                      >
                        {node.title} {isLast && '★'}
                      </span>
                    </div>
                    
                    {!isLast && (
                      <div className="pl-6 py-1">
                        <span className="font-handwritten text-lg text-primary/40 block translate-x-2">↓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT PAGE */}
        <div className="flex-1 relative notebook-line overflow-hidden p-6">
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
          
          {hasThread && (
            <div className="absolute top-[35%] left-4 transform -translate-y-1/2 rotate-3">
              <div className="border border-red-400/40 rounded-[100%] px-4 py-2 relative">
                <p className="font-handwritten text-red-500/80 text-[1rem] leading-tight text-center">
                  understand this <br/>before moving on
                </p>
                <svg className="absolute -left-6 top-1/2 w-8 h-5 overflow-visible" fill="none" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M 12,2 Q 6,2 0,6 L 4,1 M 0,6 L 3,10" />
                </svg>
              </div>
            </div>
          )}
          
          {hasThread && (
            <div className="absolute bottom-10 right-8 opacity-60 font-serif text-[1rem] text-blue-900/80 rotate-[-2deg]">
              &sigma;'(z) &le; 0.25
            </div>
          )}
        </div>
        
        {/* CENTER BINDING */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 flex flex-col justify-evenly pointer-events-none z-20 py-2">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="w-full h-1 bg-[#333] rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.6)] transform rotate-2" />
          ))}
        </div>
      </div>
      
    </div>
  );
}
