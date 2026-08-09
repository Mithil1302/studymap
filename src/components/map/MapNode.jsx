import { useNavigate } from 'react-router-dom';

export default function MapNode({ node }) {
  const navigate = useNavigate();

  const handleNodeClick = () => {
    if (node.metadata && node.metadata.lectureId) {
      // Navigate to the lecture detail. Could optionally pass the slide number via state.
      navigate(`/lectures/${node.metadata.lectureId}`);
    }
  };

  // Determine card style based on type
  let cardClass;
  let badgeClass = 'border border-primary px-2 py-0.5 rounded-sm bg-white text-primary';
  let annotation = null;

  switch (node.type) {
    case 'core':
      cardClass = 'card-green';
      badgeClass = 'bg-primary text-white px-2 py-0.5 rounded-sm border-none';
      annotation = (
        <div className="absolute -right-8 -bottom-4 text-right">
          <span className="marker-blue whitespace-nowrap handwritten-text text-xl transform -rotate-12 inline-block">Start here</span>
        </div>
      );
      break;
    case 'focus':
      cardClass = 'card-yellow';
      annotation = (
        <div className="absolute -top-6 -right-6 text-right">
          <span className="marker-pink whitespace-nowrap handwritten-text text-xl transform rotate-12 inline-block">Current Focus</span>
        </div>
      );
      break;
    case 'lecture':
      cardClass = 'card-white';
      break;
    case 'suggested':
      cardClass = 'card-white bg-blue-50/50'; // Light blue hint if no CSS class exists
      break;
    default:
      cardClass = 'card-white';
  }

  // Position styles
  const style = {
    left: `${node.x}px`,
    top: `${node.y}px`,
    transform: `translateX(-50%) rotate(${node.rotation}deg)`
  };

  return (
    <div 
      className="absolute z-10 w-[240px] cursor-pointer group" 
      style={style}
      onClick={handleNodeClick}
    >
      <div className={`card-node ${cardClass} hard-shadow-sm w-full !relative group-hover:-translate-y-1 transition-transform`}>
        
        {node.type === 'focus' && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/50 rounded-full blur-[1px]"></div>
        )}

        <div className="flex justify-between items-start mb-2">
          <span className={`text-label-caps font-label-caps ${badgeClass}`}>
            {node.subtitle}
          </span>
          {node.type === 'core' && <span className="material-symbols-outlined text-outline-variant text-sm">push_pin</span>}
          {node.type === 'focus' && <div className="w-3 h-3 rounded-full bg-warning-coral border border-primary"></div>}
        </div>
        
        <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight group-hover:underline decoration-secondary decoration-2 underline-offset-2">
          {node.title}
        </h3>
        
        <p className="font-annotation-sm text-on-surface-variant line-clamp-3">
          {node.description}
        </p>

        {node.type === 'lecture' && (
          <div className="mt-4 border-t-2 border-primary/20 pt-2 flex justify-between items-center text-primary group-hover:text-secondary">
            <span className="font-label-caps text-label-caps">View Lecture</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        )}
        
        {annotation}
      </div>
    </div>
  );
}
