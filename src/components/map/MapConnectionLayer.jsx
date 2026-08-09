
export default function MapConnectionLayer({ edges }) {
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
        `}
      </style>
      
      {edges.map((edge) => (
        <path 
          key={edge.id}
          className="connection-path" 
          d={edge.path} 
        />
      ))}
    </svg>
  );
}
