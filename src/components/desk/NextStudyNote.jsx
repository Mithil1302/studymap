import { useNavigate } from 'react-router-dom';

/**
 * NextStudyNote — Yellow sticky note in the front-right zone.
 * Shows next concept to study. Always has its own dedicated zone, never hidden behind anything.
 */
export default function NextStudyNote({ nextNode, nextLec, nextSlide }) {
  const navigate = useNavigate();

  if (!nextNode) return null;

  const weekStr = nextLec ? `Week ${String(nextLec.week).padStart(2, '0')}` : '';
  const slideStr = nextSlide ? ` · Slide ${nextSlide}` : '';

  return (
    <div
      className="relative cursor-pointer group transition-transform duration-200 hover:-translate-y-1"
      style={{
        width: 'clamp(140px, 13vw, 180px)',
        transform: 'rotate(3deg)',
      }}
      onClick={() => navigate(`/lectures/${nextNode.lectureId}`)}
      title={`Study next: ${nextNode.title}`}
    >
      {/* Tape strip at top */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
        style={{
          width: '48px',
          height: '18px',
          background: 'rgba(255,255,255,0.42)',
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(255,255,255,0.5)',
          transform: 'rotate(-2deg)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      />

      {/* Note body */}
      <div
        className="relative p-4 pt-3"
        style={{
          background: 'linear-gradient(160deg, #FEF08A 0%, #FBBF24 100%)',
          boxShadow:
            '2px 4px 14px rgba(0,0,0,0.18), inset 0 -2px 12px rgba(180,130,0,0.12)',
          borderRadius: '2px 2px 2px 2px',
          // Paper curl at bottom right
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
        }}
      >
        <div
          className="text-black/45 mb-2 pb-1.5"
          style={{
            fontSize: 'clamp(7px, 0.75vw, 10px)',
            fontFamily: 'var(--font-label)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          NEXT UP ✦
        </div>

        <div
          className="font-headline-md font-bold text-black/85 leading-tight mb-1.5"
          style={{ fontSize: 'clamp(11px, 1.1vw, 15px)' }}
        >
          {nextNode.title}
        </div>

        {(weekStr || slideStr) && (
          <div
            className="text-black/55 mb-3"
            style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', fontFamily: 'sans-serif' }}
          >
            {weekStr}{slideStr}
          </div>
        )}

        <div
          className="font-handwritten text-black/70 flex items-center gap-1 group-hover:text-black transition-colors"
          style={{ fontSize: 'clamp(10px, 1vw, 13px)' }}
        >
          Open lecture →
        </div>
      </div>

      {/* Paper curl shadow */}
      <div
        className="absolute bottom-0 right-0 -z-10"
        style={{
          width: '20px',
          height: '20px',
          background: 'rgba(0,0,0,0.15)',
          filter: 'blur(6px)',
          borderRadius: '50%',
          transform: 'translate(4px, 4px)',
        }}
      />
      {/* Overall cast shadow */}
      <div
        className="absolute -bottom-2 left-1 right-1 -z-10"
        style={{
          height: '12px',
          background: 'rgba(0,0,0,0.18)',
          filter: 'blur(8px)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
