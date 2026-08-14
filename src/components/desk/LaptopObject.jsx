import { useNavigate } from 'react-router-dom';
import ConversationSurface from '../conversation/ConversationSurface';
import { useStudyMap } from '../../context/StudyMapContext';
import { useProgress } from '../../context/ProgressContext';
import { getPreviewMessages } from '../../utils/conversationPreview';
/**
 * LaptopObject — A complete, physically believable laptop.
 * Screen visually mirrors the real Conversation UI design language.
 * Clicking navigates to /conversation.
 * 
 * Layout:
 *   [screen lid]
 *   [hinge]
 *   [keyboard deck + keyboard + trackpad]
 *   [bottom chassis edge]
 */
export default function LaptopObject() {
  const navigate = useNavigate();
  const { currentConversation } = useStudyMap();
  const { inProgressNodes } = useProgress();
  
  const previewMessages = getPreviewMessages(currentConversation.messages, inProgressNodes);

  return (
    <div
      className="relative cursor-pointer group"
      style={{ width: 'clamp(300px, 32vw, 460px)' }}
      onClick={() => navigate('/conversation')}
      title="Open Tutor Conversation"
    >
      {/* ── SCREEN LID ── */}
      <div
        className="relative w-full overflow-hidden transition-all duration-300 group-hover:-translate-y-0.5"
        style={{
          // Slightly wider top than base — perspective trick
          height: 'clamp(160px, 17vw, 240px)',
          borderRadius: '10px 10px 0 0',
          background: 'linear-gradient(135deg, #2a2a2c 0%, #1a1a1c 100%)',
          boxShadow: '0 -2px 0 0 #111, 0 -8px 20px rgba(0,0,0,0.5)',
          border: '5px solid #1a1a1c',
          borderBottom: '3px solid #111',
        }}
      >
        {/* Webcam dot */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1e1e1e] border border-white/10 z-30">
          <div className="absolute inset-0.5 rounded-full bg-[#0a0a0a]" />
        </div>

        {/* Screen bezel inner glow */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4)',
          }}
        />

          {/* ── SCREEN CONTENT — mirrors the real Conversation UI ── */}
          <div className="absolute inset-0 pointer-events-none">
            <ConversationSurface variant="laptop" messages={previewMessages} />
          </div>
          
          {/* Screen glare overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
            }}
          />
      </div>

      {/* ── HINGE ── */}
      <div
        className="relative w-full"
        style={{
          height: '10px',
          background: 'linear-gradient(to bottom, #0a0a0a, #232325)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.7)',
        }}
      >
        {/* Hinge screw dots */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#111] border border-white/10" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#111] border border-white/10" />
      </div>

      {/* ── KEYBOARD DECK ── */}
      <div
        className="relative w-full"
        style={{
          height: 'clamp(95px, 11vw, 150px)',
          background: 'linear-gradient(170deg, #c9cdd0 0%, #a8acaf 100%)',
          borderRadius: '0 0 12px 12px',
          boxShadow:
            '0 18px 40px rgba(0,0,0,0.55), 0 6px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {/* Keyboard area */}
        <div
          className="absolute top-3 left-4 right-4"
          style={{ height: '48%' }}
        >
          <div
            className="w-full h-full rounded-sm"
            style={{
              background: '#1a1a1a',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.95)',
            }}
          >
            {/* Key grid texture */}
            <div
              className="w-full h-full opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '8px 7px',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>

        {/* Trackpad */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2"
          style={{
            width: '40%',
            height: '34%',
            background: 'linear-gradient(160deg, #b8bcbf, #9fa3a6)',
            borderRadius: '4px',
            boxShadow:
              'inset 0 1px 3px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.4)',
            border: '1px solid rgba(0,0,0,0.15)',
          }}
        />

        {/* Side edge reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
          style={{
            borderRadius: '0 0 12px 12px',
            background: 'rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* ── DESK SHADOW ── */}
      <div
        className="absolute -bottom-4 left-4 right-4 -z-10"
        style={{
          height: '24px',
          background: 'rgba(0,0,0,0.45)',
          filter: 'blur(18px)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
