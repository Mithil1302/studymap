import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { LEARNING_STATE_COLORS } from './learningMapTokens';

export default function ConceptInspector({ nodeId, onClose }) {
  const navigate = useNavigate();
  const { courseNodes, courseEdges, getNodeStatus, inProgressNodes } = useProgress();

  const node = courseNodes.find(n => n.id === nodeId);
  if (!node) return null;

  const rawStatus = getNodeStatus(nodeId);
  const inProg = courseNodes.filter(n => inProgressNodes.has(n.id)).sort((a, b) => b.week - a.week);
  const currentId = inProg.length > 0 ? inProg[0].id : null;
  const isCurrent = nodeId === currentId;

  const stateToken = isCurrent
    ? LEARNING_STATE_COLORS.current
    : rawStatus === 'completed'
    ? LEARNING_STATE_COLORS.learned
    : rawStatus === 'available'
    ? LEARNING_STATE_COLORS.available
    : LEARNING_STATE_COLORS.locked;

  // Prereqs (builds on)
  const prereqs = courseEdges
    .filter(e => e.target === nodeId)
    .map(e => courseNodes.find(n => n.id === e.source))
    .filter(Boolean);

  // Leads to
  const leadsTo = courseEdges
    .filter(e => e.source === nodeId)
    .map(e => courseNodes.find(n => n.id === e.target))
    .filter(Boolean);

  const slideRef = node.slides && node.slides.length > 0 ? node.slides[0] : null;

  const handleOpenLecture = () => {
    const url = slideRef
      ? `/lectures/${node.lectureId}?slide=${slideRef}`
      : `/lectures/${node.lectureId}`;
    navigate(url);
  };

  const handleAskTutor = () => {
    const topic = encodeURIComponent(node.title);
    navigate(`/conversation?topic=${topic}`);
  };

  return (
    <aside
      className="bg-[#FAF9F6] border-l border-[#E8E4DC] flex flex-col overflow-y-auto h-full"
      style={{ width: '100%', fontFamily: "'Hanken Grotesk', sans-serif" }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#ECE8DF]">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold"
            style={{ color: stateToken.primary }}
          >
            {stateToken.icon}
          </span>
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: stateToken.primary }}
          >
            {stateToken.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#EAE6DD] transition-colors text-[#888] hover:text-[#222]"
          aria-label="Close inspector"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5 flex-1">
        {/* Title + Metadata */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a] leading-snug mb-1">
            {node.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#777]">
            <span>Week {String(node.week).padStart(2, '0')}</span>
            {slideRef && <span>· Slide {String(slideRef).padStart(2, '0')}</span>}
          </div>
        </div>

        {/* Why it matters (Description) */}
        {node.description && (
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#999] mb-1.5">
              Why It Matters
            </h3>
            <p className="text-sm text-[#383633] leading-relaxed">
              {node.description}
            </p>
          </div>
        )}

        {/* Builds on */}
        {prereqs.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#999] mb-1.5">
              Builds On
            </h3>
            <div className="flex flex-col gap-1">
              {prereqs.map(p => (
                <div key={p.id} className="text-xs text-[#444] flex items-center gap-1.5">
                  <span className="text-[#999]">←</span>
                  <span className="font-medium">{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads to */}
        {leadsTo.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#999] mb-1.5">
              Leads To
            </h3>
            <div className="flex flex-col gap-1">
              {leadsTo.map(l => (
                <div key={l.id} className="text-xs text-[#444] flex items-center gap-1.5">
                  <span className="text-[#999]">→</span>
                  <span className="font-medium">{l.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#999] mb-1.5">
            Source
          </h3>
          <p className="text-xs text-[#555]">
            Week {String(node.week).padStart(2, '0')}
            {slideRef && ` · Slide ${String(slideRef).padStart(2, '0')}`}
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#ECE8DF]">
          <button
            onClick={handleOpenLecture}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333]"
          >
            Open in Notebook
            <span>→</span>
          </button>
          <button
            onClick={handleAskTutor}
            className="w-full py-2.5 px-4 text-xs font-semibold text-[#444] bg-white border border-[#D5D1C8] rounded-lg hover:bg-[#F4F1EA] transition-colors flex items-center justify-center gap-2"
          >
            Ask Tutor About This
            <span>→</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
