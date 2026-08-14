import { LEARNING_STATE_COLORS } from './learningMapTokens';

/**
 * A concept node rendered as an annotated label on the knowledge map.
 * Strict 80% Neutral / 20% Semantic Color discipline.
 */
export default function ConceptNode({
  node,
  status,
  isCurrent,
  isSelected,
  isOnThread,
  hasSelection,
  isRelatedToSelected,
  x,
  y,
  onClick,
}) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available' || (!isLocked && !isCompleted && !isCurrent);

  // Semantic state token
  const stateToken = isCurrent
    ? LEARNING_STATE_COLORS.current
    : isCompleted
    ? LEARNING_STATE_COLORS.learned
    : isAvailable
    ? LEARNING_STATE_COLORS.available
    : LEARNING_STATE_COLORS.locked;

  // Title color: academic, legible, semantic tone
  const titleColor = isSelected
    ? '#1a1a1a'
    : isCurrent
    ? '#1a1a1a'
    : isOnThread
    ? '#222'
    : isCompleted
    ? '#384d3f'
    : isAvailable
    ? '#2a3b4c'
    : stateToken.text;

  // Opacity: Unrelated during selection stays 75-85% (never washed out). Locked is 0.60.
  let opacity = 1;
  if (isLocked) {
    opacity = 0.60;
  } else if (hasSelection && !isSelected && !isRelatedToSelected) {
    opacity = 0.80; // 75–85% restraint
  }

  // Container styling: strictly restrained
  const containerStyle = isSelected
    ? {
        background: '#FFFDF9',
        border: '1px solid #D5D1C8',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '5px 9px',
      }
    : isCurrent
    ? {
        background: '#FFFCF2',
        border: '1px solid #EBE4D0',
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(244,201,74,0.08)',
        padding: '5px 9px',
      }
    : {
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: '6px',
        boxShadow: 'none',
        padding: '5px 9px',
      };

  return (
    <button
      onClick={() => onClick(node.id)}
      className="absolute outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 rounded-md transition-all duration-200 group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        opacity,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        zIndex: isSelected ? 20 : isCurrent ? 15 : 10,
        minWidth: '110px',
        maxWidth: '210px',
        textAlign: 'left',
        ...containerStyle,
      }}
      aria-label={`${node.title} — ${stateToken.label}`}
      disabled={isLocked}
    >
      <div className="flex items-start gap-2">
        {/* Semantic status indicator */}
        <span
          className="text-xs leading-none mt-[3px] flex-shrink-0 font-bold"
          style={{ color: stateToken.primary }}
        >
          {stateToken.icon}
        </span>

        <div className="min-w-0 flex-1">
          {/* Concept Name */}
          <div
            className="text-[13.5px] font-semibold leading-tight tracking-[-0.01em]"
            style={{
              color: titleColor,
              fontFamily: "'Hanken Grotesk', sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            {node.title}
          </div>

          {/* Metadata */}
          <div
            className="text-[10px] mt-0.5"
            style={{
              color: isLocked ? '#A8A6A1' : '#777',
              fontFamily: "'Hanken Grotesk', sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            Week {String(node.week).padStart(2, '0')}
            {node.slides && node.slides.length > 0 && ` · Slide ${node.slides[0]}`}
          </div>

          {/* Current node marker */}
          {isCurrent && (
            <div
              className="text-[8.5px] font-bold tracking-widest mt-1 uppercase flex items-center gap-1"
              style={{ color: '#A08020', fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              YOU ARE HERE
            </div>
          )}
        </div>
      </div>

      {/* Current indicator — subtle yellow underline */}
      {isCurrent && (
        <div
          className="absolute -bottom-[2px] left-2 right-2 h-[2.5px] rounded-full"
          style={{ background: '#F4C94A' }}
        />
      )}

      {/* Hover effect for clickable available & learned concepts */}
      {!isSelected && !isLocked && (
        <div
          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
          style={{
            background: isAvailable
              ? 'rgba(92, 127, 163, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            borderBottom: isAvailable ? '1.5px solid #5C7FA3' : 'none',
          }}
        />
      )}
    </button>
  );
}
