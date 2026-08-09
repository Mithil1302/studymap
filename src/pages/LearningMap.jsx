import { useMemo } from 'react';
import { useStudyMap } from '../context/StudyMapContext';
import { generateMapLayout } from '../utils/mapLayoutEngine';
import MapCanvas from '../components/map/MapCanvas';
import MapToolbar from '../components/map/MapToolbar';
import MapConnectionLayer from '../components/map/MapConnectionLayer';
import MapNode from '../components/map/MapNode';

export default function LearningMap() {
  const { lectures, activeCitation } = useStudyMap();

  // Generate deterministic layout based on active course data
  const { nodes, edges } = useMemo(() => {
    return generateMapLayout(lectures, activeCitation);
  }, [lectures, activeCitation]);

  return (
    <main className="flex-1 overflow-hidden bg-surface dot-pattern relative flex flex-col">
      <MapToolbar />
      <MapCanvas>
        <MapConnectionLayer edges={edges} />
        {nodes.map(node => (
          <MapNode key={node.id} node={node} />
        ))}
      </MapCanvas>
    </main>
  );
}
