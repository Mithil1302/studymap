import { useNavigate } from 'react-router-dom';

/**
 * FocusBoard — Cork pinboard in the back-left zone.
 * Shows the current difficult concept. Clicking navigates to that lecture.
 * Visually distinct from dashboard cards: cork texture, wooden frame, pin.
 */
export default function FocusBoard({ thread }) {
  const navigate = useNavigate();
  const activeNode = thread && thread.length > 0 ? thread[thread.length - 1] : null;
  const focusTitle = activeNode ? activeNode.title : 'Vanishing Gradient';

  return (
    <div
      className={`relative ${activeNode ? 'cursor-pointer' : 'cursor-default'} transition-transform duration-200 hover:-translate-y-0.5`}
      style={{
        width: 'clamp(200px, 18vw, 280px)',
        height: 'clamp(160px, 15vw, 220px)',
        transform: 'rotate(-1.2deg)',
      }}
      onClick={() => {
        if (activeNode) navigate(`/lectures/${activeNode.lectureId}`);
      }}
      title={activeNode ? `Review: ${activeNode.title}` : 'Focus Board'}
    >
      {/* Wooden outer frame */}
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          background: 'linear-gradient(135deg, #7B5534 0%, #5C3D20 50%, #7B5534 100%)',
          boxShadow:
            '3px 5px 16px rgba(0,0,0,0.45), 1px 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: '7px',
        }}
      >
        {/* Cork surface */}
        <div
          className="w-full h-full rounded-sm relative overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, #D4A96A 0%, #C49355 40%, #B8834A 100%)',
          }}
        >
          {/* Cork texture dots */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(0,0,0,0.15) 1px, transparent 1px),
                radial-gradient(circle at 60% 45%, rgba(0,0,0,0.12) 1px, transparent 1px),
                radial-gradient(circle at 80% 75%, rgba(0,0,0,0.10) 1px, transparent 1px),
                radial-gradient(circle at 35% 70%, rgba(0,0,0,0.13) 1px, transparent 1px),
                radial-gradient(circle at 72% 18%, rgba(0,0,0,0.11) 1px, transparent 1px)
              `,
              backgroundSize: '22px 22px, 18px 18px, 26px 26px, 14px 14px, 20px 20px',
            }}
          />

          {/* Pinned note — slightly offset for physical feel */}
          <div
            className="absolute"
            style={{
              top: '16%',
              left: '10%',
              right: '10%',
              bottom: '12%',
            }}
          >
            {/* The note paper */}
            <div
              className="w-full h-full flex flex-col p-3 relative"
              style={{
                background: '#FDFBF4',
                boxShadow: '2px 3px 10px rgba(0,0,0,0.3)',
                transform: 'rotate(0.5deg)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {/* Red push pin */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2"
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #e74c3c, #c0392b)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                  zIndex: 20,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.4)',
                    top: '2px',
                    left: '2px',
                  }}
                />
              </div>

              {/* Note content */}
              <div
                className="font-label-caps text-black/40 mb-1.5"
                style={{
                  fontSize: 'clamp(7px, 0.75vw, 10px)',
                  letterSpacing: '0.12em',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  paddingBottom: '4px',
                }}
              >
                CURRENT FOCUS
              </div>

              <div
                className="font-headline-md font-bold text-black/85 leading-tight mb-2"
                style={{ fontSize: 'clamp(11px, 1.1vw, 15px)' }}
              >
                {focusTitle}
              </div>

              <div
                className="font-serif text-blue-900/80 mb-2"
                style={{
                  fontSize: 'clamp(10px, 1vw, 13px)',
                  background: 'rgba(254,235,100,0.4)',
                  padding: '2px 6px',
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                  borderRadius: '2px',
                }}
              >
                σ'(z) ≤ 0.25
              </div>

              <div
                className="font-handwritten text-red-600/75 leading-tight mt-auto"
                style={{ fontSize: 'clamp(9px, 0.9vw, 12px)' }}
              >
                understand before
                <br />
                moving on →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast shadow */}
      <div
        className="absolute -bottom-3 left-2 right-2 -z-10"
        style={{
          height: '16px',
          background: 'rgba(0,0,0,0.35)',
          filter: 'blur(10px)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
