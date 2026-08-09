import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';

export default function MapNode({ node }) {
  const navigate = useNavigate();
  const { getNodeStatus, markNodeCompleted } = useProgress();
  
  const status = getNodeStatus(node.id);

  const handleNodeClick = () => {
    if (status === 'locked') return; // Cannot navigate to locked nodes
    
    // Mark as completed upon clicking/visiting
    markNodeCompleted(node.id);

    if (node.lectureId) {
      navigate(`/lectures/${node.lectureId}`);
    }
  };

  // Determine card style based on type and status
  let cardClass = 'card-white';
  let badgeClass = 'border border-primary px-2 py-0.5 rounded-sm bg-white text-primary';
  let annotation = null;
  
  // Status overrides
  if (status === 'locked') {
    cardClass = 'bg-surface-container border-2 border-outline-variant opacity-75';
    badgeClass = 'bg-surface-container-highest text-outline px-2 py-0.5 rounded-sm border-none';
  } else if (status === 'completed') {
    cardClass = 'card-green';
    badgeClass = 'bg-primary text-white px-2 py-0.5 rounded-sm border-none';
  } else if (status === 'in-progress' || node.type === 'focus') {
    cardClass = 'card-yellow';
  } else if (node.type === 'core') {
    cardClass = 'card-green'; // Core defaults to green if completed
    badgeClass = 'bg-primary text-white px-2 py-0.5 rounded-sm border-none';
    annotation = (
      <div className="absolute -right-8 -bottom-4 text-right">
        <span className="marker-blue whitespace-nowrap handwritten-text text-xl transform -rotate-12 inline-block">Start here</span>
      </div>
    );
  }

  // Focus annotation override
  if (node.type === 'focus') {
    annotation = (
      <div className="absolute -top-6 -right-6 text-right">
        <span className="marker-pink whitespace-nowrap handwritten-text text-xl transform rotate-12 inline-block">Current Focus</span>
      </div>
    );
  }

  // Position styles
  const style = {
    left: `${node.x}px`,
    top: `${node.y}px`,
    transform: `translateX(-50%) rotate(${node.rotation}deg)`
  };

  return (
    <div 
      className={`absolute z-10 w-[240px] group ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      style={style}
      onClick={handleNodeClick}
    >
      <div className={`card-node ${cardClass} ${status !== 'locked' ? 'hard-shadow-sm group-hover:-translate-y-1' : ''} w-full !relative transition-transform`}>
        
        {(status === 'in-progress' || node.type === 'focus') && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/50 rounded-full blur-[1px]"></div>
        )}

        <div className="flex justify-between items-start mb-2">
          <span className={`text-label-caps font-label-caps ${badgeClass}`}>
            Week {node.week}
          </span>
          {status === 'completed' && <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>}
          {status === 'locked' && <span className="material-symbols-outlined text-outline-variant text-sm">lock</span>}
          {(status === 'in-progress' || node.type === 'focus') && <div className="w-3 h-3 rounded-full bg-warning-coral border border-primary"></div>}
        </div>
        
        <h3 className={`font-headline-md font-bold mb-2 leading-tight ${status === 'locked' ? 'text-on-surface-variant' : 'text-primary group-hover:underline decoration-secondary decoration-2 underline-offset-2'}`}>
          {node.title}
        </h3>
        
        <p className="font-annotation-sm text-on-surface-variant line-clamp-3">
          {node.description}
        </p>

        {status !== 'locked' && node.lectureId && (
          <div className={`mt-4 border-t-2 pt-2 flex justify-between items-center ${status === 'completed' ? 'border-primary/20 text-primary group-hover:text-secondary' : 'border-outline-variant/30 text-on-surface-variant group-hover:text-primary'}`}>
            <span className="font-label-caps text-label-caps">Study Concept</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        )}
        
        {annotation}
      </div>
    </div>
  );
}
