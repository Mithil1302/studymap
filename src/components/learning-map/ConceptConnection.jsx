import { CONNECTION_COLORS } from './learningMapTokens';

/**
 * SVG bezier curve connecting two concept nodes.
 * Draws a gentle vertical S-curve from source to target with semantic hierarchy.
 */
export default function ConceptConnection({
  x1, y1,
  x2, y2,
  isOnThread,
  isCurrentToNext,
  isRelatedToSelected,
  sourceStatus,
  targetStatus
}) {
  const y2Adj = isCurrentToNext ? y2 - 28 : y2;
  const dx = x2 - x1;
  const dy = y2Adj - y1;
  const absDx = Math.abs(dx);
  
  let d;
  if (absDx < 1) {
    d = `M ${x1} ${y1} L ${x2} ${y2Adj}`;
  } else {
    // Orthogonal with rounded corners
    const r = Math.min(15, absDx / 2, dy / 2);
    const dirX = dx > 0 ? 1 : -1;
    const midY = y1 + dy / 2;
    d = `
      M ${x1} ${y1}
      L ${x1} ${midY - r}
      Q ${x1} ${midY} ${x1 + r * dirX} ${midY}
      L ${x2 - r * dirX} ${midY}
      Q ${x2} ${midY} ${x2} ${midY + r}
      L ${x2} ${y2Adj}
    `;
  }

  const isLocked = sourceStatus === 'locked' || targetStatus === 'locked';

  // Semantic hierarchy
  let stroke = CONNECTION_COLORS.normal.stroke;
  let strokeWidth = CONNECTION_COLORS.normal.strokeWidth;
  let strokeDasharray = CONNECTION_COLORS.normal.dasharray;

  if (isOnThread) {
    // Current learning thread: clear, intentional, solid charcoal
    stroke = CONNECTION_COLORS.activeThread.stroke;
    strokeWidth = CONNECTION_COLORS.activeThread.strokeWidth;
    strokeDasharray = CONNECTION_COLORS.activeThread.dasharray;
  } else if (isRelatedToSelected) {
    // Prereq or downstream edge of currently inspected node
    stroke = CONNECTION_COLORS.selected.stroke;
    strokeWidth = CONNECTION_COLORS.selected.strokeWidth;
    strokeDasharray = CONNECTION_COLORS.selected.dasharray;
  } else if (isLocked) {
    // Locked relationship
    stroke = CONNECTION_COLORS.locked.stroke;
    strokeWidth = CONNECTION_COLORS.locked.strokeWidth;
    strokeDasharray = CONNECTION_COLORS.locked.dasharray;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeLinecap="round"
      markerEnd={isCurrentToNext ? 'url(#thread-arrow)' : 'none'}
      className="transition-all duration-300"
    />
  );
}
