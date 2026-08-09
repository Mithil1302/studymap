import { courseNodes, courseEdges } from '../data/courseGraph';

export function generateMapLayout(lectures, activeCitation) {
  const nodes = [];
  const edges = [];

  // Deterministic layout configuration
  const startX = 250;
  const startY = 150;
  const colWidth = 350;
  const rowHeight = 220;

  // Group nodes by week to assign columns
  const nodesByWeek = {
    1: courseNodes.filter(n => n.week === 1),
    2: courseNodes.filter(n => n.week === 2),
    3: courseNodes.filter(n => n.week === 3)
  };

  // Simple deterministic pseudo-random for consistent rotations
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const getRotation = () => (random() * 6 - 3).toFixed(1);

  // Position nodes
  const nodePositions = {};
  
  [1, 2, 3].forEach(week => {
    const weekNodes = nodesByWeek[week];
    if (!weekNodes) return;
    
    // Position the week nodes in a vertical column
    weekNodes.forEach((node, idx) => {
      // Special offset for the root node to make it stand out
      const isCore = node.type === 'core';
      const x = startX + ((week - 1) * colWidth) + (isCore ? 0 : 50);
      const y = startY + (idx * rowHeight);
      
      const positionedNode = {
        ...node,
        x,
        y,
        rotation: getRotation()
      };
      
      nodePositions[node.id] = positionedNode;
      nodes.push(positionedNode);
    });
  });

  // Create edges with smooth SVG paths based on actual node positions
  courseEdges.forEach(edge => {
    const sourceNode = nodePositions[edge.source];
    const targetNode = nodePositions[edge.target];
    
    if (sourceNode && targetNode) {
      // Nodes are roughly 240px wide and 150px tall
      // Anchor source at bottom center, target at top center
      const sx = sourceNode.x;
      const sy = sourceNode.y + 100;
      const tx = targetNode.x;
      const ty = targetNode.y - 100;
      
      // Control points for a cubic bezier curve to make lines flow nicely
      // If same column (vertical flow), bow out slightly
      // If across columns, s-curve horizontally
      let cx1, cy1, cx2, cy2;
      
      if (Math.abs(tx - sx) < 50) {
        // Vertical connection
        cx1 = sx + 50;
        cy1 = sy + (ty - sy) / 2;
        cx2 = tx + 50;
        cy2 = sy + (ty - sy) / 2;
      } else {
        // Horizontal connection
        cx1 = sx;
        cy1 = sy + (ty - sy) / 2;
        cx2 = tx;
        cy2 = sy + (ty - sy) / 2;
      }

      edges.push({
        id: `edge-${edge.source}-${edge.target}`,
        sourceId: edge.source,
        targetId: edge.target,
        path: `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`
      });
    }
  });

  // Assign focus type based on active citation
  if (activeCitation) {
    const focusLecture = lectures.find(l => l.title === activeCitation.lecture || `Week ${l.week} — ${l.title}` === activeCitation.lecture);
    if (focusLecture) {
      // Find a node that references this slide
      const focusNode = nodes.find(n => n.lectureId === focusLecture.lecture_id && n.slides && n.slides.includes(activeCitation.slide));
      if (focusNode) {
        focusNode.type = 'focus';
      }
    }
  }

  return { nodes, edges };
}
