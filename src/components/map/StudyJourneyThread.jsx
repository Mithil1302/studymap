import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudyJourneyThread({ pathNodes, currentNodeId }) {
  const navigate = useNavigate();

  if (!pathNodes || pathNodes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-outline-variant hard-shadow-sm h-full flex items-center justify-center text-center">
        <p className="text-on-surface-variant">Begin exploring to build your learning thread.</p>
      </div>
    );
  }

  const handleOpenLecture = (node) => {
    if (node.slides && node.slides.length > 0) {
      navigate(`/lectures/${node.lectureId}/slides/${node.slides[0]}`);
    } else {
      navigate(`/lectures/${node.lectureId}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant hard-shadow-sm h-full flex flex-col">
      <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-6">CURRENT LEARNING THREAD</h3>
      
      <div className="flex-1 flex flex-col justify-center">
        {pathNodes.map((node, index) => {
          const isCurrent = node.id === currentNodeId;
          const isLast = index === pathNodes.length - 1;
          
          return (
            <div key={node.id} className="relative flex flex-col">
              <div className="flex items-center gap-4">
                <div className={`w-8 flex justify-center ${isCurrent ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {isCurrent ? (
                    <span className="material-symbols-outlined text-[24px] font-bold">radio_button_checked</span>
                  ) : (
                    <span className="text-[14px]">○</span>
                  )}
                </div>
                
                <div className="flex-1 flex items-center justify-between">
                  <button 
                    onClick={() => handleOpenLecture(node)}
                    className={`text-left transition-colors ${
                      isCurrent ? 'text-primary text-xl font-bold font-display' : 'text-on-surface-variant font-medium hover:text-on-surface'
                    }`}
                  >
                    {node.title}
                  </button>

                  {isCurrent && (
                    <span className="ml-4 text-xs font-bold text-primary font-handwriting tracking-widest uppercase rotate-[-2deg]">
                      You are here →
                    </span>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex items-center gap-4 my-1">
                  <div className="w-8 flex justify-center">
                    <div className="h-6 w-px bg-outline-variant"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
