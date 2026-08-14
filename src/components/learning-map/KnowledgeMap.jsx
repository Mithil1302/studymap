import { useMemo, useRef, useEffect, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import ConceptNode from './ConceptNode';
import ConceptConnection from './ConceptConnection';
// ─── Deterministic DAG layout ───────────────────────────────────────────────
function computeLayout(nodes, edges, canvasWidth) {
  // 1. Build adjacency
  const children = {};
  const parents = {};
  nodes.forEach(n => {
    children[n.id] = [];
    parents[n.id] = [];
  });
  edges.forEach(e => {
    if (children[e.source] && parents[e.target]) {
      children[e.source].push(e.target);
      parents[e.target].push(e.source);
    }
  });

  // 2. Compute depth = longest path from any root
  const depth = {};
  nodes.forEach(n => { depth[n.id] = 0; });
  const roots = nodes.filter(n => parents[n.id].length === 0);
  
  const inDegree = {};
  nodes.forEach(n => { inDegree[n.id] = parents[n.id].length; });
  const topoOrder = [];
  const q = [...roots.map(r => r.id)];
  while (q.length > 0) {
    const curr = q.shift();
    topoOrder.push(curr);
    for (const child of children[curr]) {
      depth[child] = Math.max(depth[child], depth[curr] + 1);
      inDegree[child]--;
      if (inDegree[child] === 0) {
        q.push(child);
      }
    }
  }

  // 3. Group by depth layer
  const layers = {};
  let maxDepth = 0;
  topoOrder.forEach(id => {
    const d = depth[id];
    if (!layers[d]) layers[d] = [];
    layers[d].push(id);
    maxDepth = Math.max(maxDepth, d);
  });

  // 4. Assign (x, y) positions with tightened, meaningful density
  const positions = {};
  const startY = 30; // Closer to top
  const verticalGap = 95; // Compact 70-110px range
  const NODE_WIDTH = 140;
  const minGap = 160; // px between node centers (ensures 20px physical gap)

  for (let d = 0; d <= maxDepth; d++) {
    const layer = layers[d] || [];
    
    // Sort nodes in the layer to minimize crossings:
    layer.sort((a, b) => {
      const getAvgParentX = (id) => {
         const p = parents[id].filter(pid => positions[pid]);
         if (p.length === 0) return canvasWidth / 2;
         return p.reduce((sum, pid) => sum + positions[pid].x, 0) / p.length;
      };
      return getAvgParentX(a) - getAvgParentX(b);
    });

    // Assign initial X based on parents
    layer.forEach((id, i) => {
      const p = parents[id].filter(pid => positions[pid]);
      let x;
      if (p.length > 0) {
        x = p.reduce((sum, pid) => sum + positions[pid].x, 0) / p.length;
      } else {
        const layerWidth = canvasWidth - 160;
        const nodeSpacing = layerWidth / (layer.length + 1);
        x = 80 + nodeSpacing * (i + 1);
      }
      positions[id] = { x, y: startY + d * verticalGap };
    });

    // Resolve overlaps symmetrically
    if (layer.length > 1) {
      for (let pass = 0; pass < 30; pass++) {
        let moved = false;
        for (let i = 0; i < layer.length - 1; i++) {
          const curr = positions[layer[i]];
          const next = positions[layer[i + 1]];
          const overlap = minGap - (next.x - curr.x);
          if (overlap > 0) {
            curr.x -= overlap / 2;
            next.x += overlap / 2;
            moved = true;
          }
        }
        if (!moved) break;
      }
    }
  }

  // 5. Global horizontal centering and hard bounds checking
  let minX = Infinity, maxX = -Infinity;
  Object.values(positions).forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
  });
  
  const graphVisualWidth = (maxX - minX) + NODE_WIDTH;
  const minSafeCenter = (NODE_WIDTH / 2) + 20; // Ensure left edge is at least 20px from screen edge
  
  // Center graph if it fits, otherwise lock to minSafeCenter and let it overflow to the right
  const targetMinX = Math.max(minSafeCenter, (canvasWidth - graphVisualWidth) / 2 + (NODE_WIDTH / 2));
  const shiftX = targetMinX - minX;

  Object.values(positions).forEach(p => {
    p.x += shiftX;
  });

  const totalHeight = startY + maxDepth * verticalGap + 100;
  return { positions, totalHeight, graphWidth: graphVisualWidth + 40 };
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function KnowledgeMap({ selectedId, onSelect, threadNodes = [] }) {
  const { courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus } = useProgress();
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: 850, h: 650 });

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: Math.max(650, rect.width), h: Math.max(520, rect.height) });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Compute layout
  const { positions, totalHeight } = useMemo(
    () => computeLayout(courseNodes, courseEdges, canvasSize.w),
    [courseNodes, courseEdges, canvasSize.w]
  );

  // Thread set & current ID
  const threadIds = useMemo(() => new Set(threadNodes.map(n => n.id)), [threadNodes]);
  const currentId = useMemo(() => {
    const inProg = courseNodes.filter(n => inProgressNodes.has(n.id)).sort((a, b) => b.week - a.week);
    if (inProg.length > 0) return inProg[0].id;
    const comp = courseNodes.filter(n => completedNodes.has(n.id)).sort((a, b) => b.week - a.week);
    return comp.length > 0 ? comp[0].id : null;
  }, [courseNodes, inProgressNodes, completedNodes]);

  // Thread edges set
  const threadEdgeSet = useMemo(() => {
    const set = new Set();
    courseEdges.forEach(e => {
      if (threadIds.has(e.source) && threadIds.has(e.target)) {
        set.add(`${e.source}→${e.target}`);
      }
    });
    return set;
  }, [threadIds, courseEdges]);

  // Edges related to selected node
  const selectedRelatedIds = useMemo(() => {
    if (!selectedId) return new Set();
    const related = new Set();
    courseEdges.forEach(e => {
      if (e.source === selectedId) related.add(e.target);
      if (e.target === selectedId) related.add(e.source);
    });
    return related;
  }, [selectedId, courseEdges]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-auto bg-[#FAF9F6]"
    >

      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={canvasSize.w}
        height={Math.max(totalHeight, canvasSize.h)}
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id="thread-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4.5"
            markerHeight="4.5"
            orient="auto"
          >
            <path d="M 0 1.5 L 5 5 L 0 8.5 z" fill="#5A5750" />
          </marker>
        </defs>
        {courseEdges.map(edge => {
          const from = positions[edge.source];
          const to = positions[edge.target];
          if (!from || !to) return null;
          const key = `${edge.source}→${edge.target}`;
          
          const sourceStatus = getNodeStatus(edge.source);
          const targetStatus = getNodeStatus(edge.target);

          const isOnThread = threadEdgeSet.has(key);
          const isCurrentToNext = isOnThread && edge.source === currentId;

          return (
            <ConceptConnection
              key={key}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              isOnThread={isOnThread}
              isCurrentToNext={isCurrentToNext}
              sourceStatus={sourceStatus}
              targetStatus={targetStatus}
              isRelatedToSelected={
                selectedId && (edge.source === selectedId || edge.target === selectedId)
              }
            />
          );
        })}
      </svg>

      {/* Node layer */}
      <div
        className="relative"
        style={{
          width: `${canvasSize.w}px`,
          height: `${Math.max(totalHeight, canvasSize.h)}px`,
          zIndex: 2,
        }}
      >
        {courseNodes.map(node => {
          const pos = positions[node.id];
          if (!pos) return null;
          const status = getNodeStatus(node.id);

          return (
            <ConceptNode
              key={node.id}
              node={node}
              status={status}
              isCurrent={node.id === currentId}
              isSelected={node.id === selectedId}
              isOnThread={threadIds.has(node.id)}
              hasSelection={!!selectedId}
              isRelatedToSelected={selectedRelatedIds.has(node.id)}
              x={pos.x}
              y={pos.y}
              onClick={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
