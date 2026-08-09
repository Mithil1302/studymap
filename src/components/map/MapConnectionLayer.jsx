
import { useProgress } from '../../context/ProgressContext';

export default function MapConnectionLayer({ edges }) {
  const { getNodeStatus } = useProgress();

  return (
    <svg 
      className="absolute inset-0 w-[2000px] h-[1500px] pointer-events-none z-0" 
      viewBox="0 0 2000 1500"
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="0" floodOpacity="0.2" />
        </filter>
      </defs>
      <style>
        {`
          .connection-path {
            fill: none;
            stroke: #0088e1;
            stroke-width: 4;
            stroke-linecap: round;
            stroke-linejoin: round;
            filter: url(#shadow);
          }
          .connection-path.locked {
            stroke: #e2e8f0;
            stroke-dasharray: 8 8;
            filter: none;
          }
          .connection-path.completed {
            stroke: #059669; /* green to match completed cards */
          }
        `}
      </style>
      
      {edges.map((edge) => {
        const targetStatus = getNodeStatus(edge.targetId);
        let pathClass = "connection-path";
        if (targetStatus === 'locked') pathClass += " locked";
        if (targetStatus === 'completed') pathClass += " completed";
        
        return (
          <path 
            key={edge.id}
            className={pathClass} 
            d={edge.path} 
          />
        );
      })}
    </svg>
  );
}
