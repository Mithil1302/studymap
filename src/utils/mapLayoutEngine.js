export function generateMapLayout(lectures, activeCitation) {
  const nodes = [];
  const edges = [];

  // Simple deterministic pseudo-random for consistent rotations
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const getRotation = () => (random() * 6 - 3).toFixed(1);

  // Helper to construct a curved SVG path connecting two nodes
  const createEdge = (sourceNode, targetNode) => {
    // Connect from bottom of source to top of target
    const sx = sourceNode.x;
    const sy = sourceNode.y + 120; // approximate half height of a card
    const tx = targetNode.x;
    const ty = targetNode.y - 120;

    // Control points for a smooth vertical curve
    const cx1 = sx;
    const cy1 = sy + (ty - sy) / 2;
    const cx2 = tx;
    const cy2 = sy + (ty - sy) / 2;

    return {
      id: `edge-${sourceNode.id}-${targetNode.id}`,
      sourceId: sourceNode.id,
      targetId: targetNode.id,
      path: `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`
    };
  };

  // 1. ROOT NODE
  const rootNode = {
    id: 'root',
    type: 'core',
    title: 'Machine Learning Basics',
    subtitle: 'CS 4780 Core',
    description: 'Foundational concepts in supervised and unsupervised learning.',
    x: 600,
    y: 100,
    rotation: getRotation(),
    metadata: null
  };
  nodes.push(rootNode);

  // Check if active citation exists
  const isActive = (lecTitle, slideNum) => {
    if (!activeCitation) return false;
    // activeCitation.lecture might be "Week 01 — Linear Models..." or just "Linear Models"
    const matchLec = activeCitation.lecture.includes(lecTitle);
    const matchSlide = activeCitation.slide === slideNum;
    return matchLec && matchSlide;
  };

  // 2. LECTURE NODES
  // We'll spread them horizontally
  const startX = 250;
  const spacingX = 350;
  
  lectures.forEach((lecture, lIdx) => {
    const lx = startX + (lIdx * spacingX);
    const ly = 350;

    const lectureNode = {
      id: `lec-${lecture.lecture_id}`,
      type: 'lecture',
      title: lecture.title,
      subtitle: `Week ${lecture.week.toString().padStart(2, '0')}`,
      description: `${lecture.slides.length} slides available`,
      x: lx,
      y: ly,
      rotation: getRotation(),
      metadata: { lectureId: lecture.lecture_id, slideNumber: 1 }
    };
    nodes.push(lectureNode);
    edges.push(createEdge(rootNode, lectureNode));

    // 3. CONCEPT NODES (extracted from slides)
    // Filter slides to pick 3-4 substantive ones per lecture
    const excludedKeywords = ['summary', 'what a', 'when', 'comparing', 'why'];
    const conceptSlides = lecture.slides.filter(s => {
      const t = s.title.toLowerCase();
      if (excludedKeywords.some(kw => t.includes(kw))) return false;
      return true;
    }).slice(0, 3); // take up to 3 per lecture for balanced map

    let parentNode = lectureNode;

    conceptSlides.forEach((slide, sIdx) => {
      const isFocus = isActive(lecture.title, slide.slide_number);
      const cx = lx;
      const cy = ly + 250 + (sIdx * 250); // stack vertically
      
      const nodeType = isFocus ? 'focus' : (sIdx === 0 ? 'suggested' : 'concept');

      const conceptNode = {
        id: `slide-${lecture.lecture_id}-${slide.slide_number}`,
        type: nodeType,
        title: slide.title,
        subtitle: `Slide ${slide.slide_number}`,
        description: slide.notes || (slide.bullets && slide.bullets[0]) || '',
        x: cx,
        y: cy,
        rotation: getRotation(),
        metadata: { lectureId: lecture.lecture_id, slideNumber: slide.slide_number }
      };
      
      nodes.push(conceptNode);
      edges.push(createEdge(parentNode, conceptNode));
      
      // Chain the concepts down, or all attach to the lecture?
      // "Chain" makes it look more like a progression
      parentNode = conceptNode;
    });
  });

  return { nodes, edges };
}
