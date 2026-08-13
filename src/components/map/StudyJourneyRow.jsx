import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';

export default function StudyJourneyRow({ node }) {
  const { getNodeStatus, courseEdges, courseNodes } = useProgress();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const status = getNodeStatus(node.id);
  
  // Prereqs (BUILDS ON)
  const prereqs = courseEdges
    .filter(e => e.target === node.id)
    .map(e => courseNodes.find(n => n.id === e.source))
    .filter(Boolean);

  // Next steps (LEADS TO)
  const leadsTo = courseEdges
    .filter(e => e.source === node.id)
    .map(e => courseNodes.find(n => n.id === e.target))
    .filter(Boolean);

  const handleOpenLecture = (e) => {
    e.stopPropagation();
    if (node.slides && node.slides.length > 0) {
      navigate(`/lectures/${node.lectureId}/slides/${node.slides[0]}`);
    } else {
      navigate(`/lectures/${node.lectureId}`);
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'completed': return '✓';
      case 'in-progress': return '◐';
      default: return '○';
    }
  };

  const getStatusColor = () => {
    switch(status) {
      case 'completed': return 'text-on-surface-variant';
      case 'in-progress': return 'text-primary'; 
      default: return 'text-outline';
    }
  };

  const getContainerStyle = () => {
    if (expanded) return 'bg-white hard-shadow border-outline-variant';
    
    switch(status) {
      case 'completed': return 'border-transparent hover:bg-black/5 opacity-80';
      case 'in-progress': return 'bg-primary-container/30 border-primary/20 hard-shadow-sm';
      case 'locked': return 'border-transparent opacity-50';
      default: return 'border-transparent hover:bg-black/5';
    }
  };

  return (
    <div className={`mb-2 border rounded-xl overflow-hidden transition-all duration-200 ${getContainerStyle()}`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left px-4 py-3 flex items-start gap-3 ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={status === 'locked'}
      >
        <span className={`text-lg font-bold mt-0.5 ${getStatusColor()}`}>
          {getStatusIcon()}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className={`font-bold ${
              status === 'locked' || status === 'completed' ? 'text-on-surface-variant font-medium' : 'text-on-surface text-lg'
            }`}>
              {node.title}
            </h4>
            {status === 'in-progress' && (
              <span className="text-xs font-bold text-white font-handwriting bg-primary-container px-2 py-0.5 rounded rotate-[-2deg]">
                You are here
              </span>
            )}
          </div>
          
          {!expanded && (
            <p className="text-xs text-on-surface-variant mt-1 font-medium">
              {status === 'completed' && `Completed · Week ${node.week}`}
              {status === 'locked' && prereqs.length > 0 && `Locked · Complete ${prereqs[0]?.title} first`}
              {status === 'available' && 'Ready to start'}
            </p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-outline-variant bg-surface-container-lowest">
          <p className="text-sm text-on-surface-variant italic mb-4 leading-relaxed">
            {node.description || "No description available."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <h5 className="text-label-caps font-label-caps text-on-surface-variant mb-2">BUILDS ON</h5>
              {prereqs.length > 0 ? (
                <ul className="space-y-1">
                  {prereqs.map(p => (
                    <li key={p.id} className="text-sm text-on-surface">← {p.title}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-outline">None</span>
              )}
            </div>
            <div>
              <h5 className="text-label-caps font-label-caps text-on-surface-variant mb-2">LEADS TO</h5>
              {leadsTo.length > 0 ? (
                <ul className="space-y-1">
                  {leadsTo.map(l => (
                    <li key={l.id} className="text-sm text-on-surface">→ {l.title}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-outline">None</span>
              )}
            </div>
          </div>

          <button 
            onClick={handleOpenLecture}
            className="w-full py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Open in Notebook <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
