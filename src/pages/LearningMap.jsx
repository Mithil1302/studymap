import { useState, useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useNavigate } from 'react-router-dom';
import MapHeader from '../components/learning-map/MapHeader';
import KnowledgeMap from '../components/learning-map/KnowledgeMap';
import ConceptInspector from '../components/learning-map/ConceptInspector';
import { LEARNING_STATE_COLORS } from '../components/learning-map/learningMapTokens';

export default function LearningMap() {
  const { courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus } = useProgress();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const totalConcepts = courseNodes.length;
  const exploredConcepts = useMemo(() => {
    return courseNodes.filter(n => completedNodes.has(n.id) || inProgressNodes.has(n.id)).length;
  }, [courseNodes, completedNodes, inProgressNodes]);

  // ─── Empty state check ──────────────────────────────────────────────────────
  const hasAnyProgress = exploredConcepts > 1; // ml-basics is always completed

  // ─── Compute current thread for both desktop header & mobile list ────────────
  const { threadNodes, currentId } = useMemo(() => {
    // Find current concept
    const inProg = courseNodes
      .filter(n => inProgressNodes.has(n.id))
      .sort((a, b) => b.week - a.week);
    const current = inProg.length > 0
      ? inProg[0]
      : courseNodes.filter(n => completedNodes.has(n.id)).sort((a, b) => b.week - a.week)[0] || null;

    if (!current) return { threadNodes: [], currentId: null };

    // Walk backwards recursively to build the ancestor chain
    const ancestors = [];
    let curr = current;
    const visited = new Set([curr.id]);

    while (curr) {
      ancestors.unshift(curr);
      // Find the first prerequisite that is also completed/in-progress
      const prereqEdges = courseEdges.filter(e => e.target === curr.id);
      const prereqNodes = prereqEdges
        .map(e => courseNodes.find(n => n.id === e.source))
        .filter(n => n && (completedNodes.has(n.id) || inProgressNodes.has(n.id)) && !visited.has(n.id));

      if (prereqNodes.length > 0) {
        // Prioritize the one with the highest week, or just take the first
        const nextAncestor = prereqNodes.sort((a, b) => b.week - a.week)[0];
        curr = nextAncestor;
        visited.add(curr.id);
      } else {
        curr = null;
      }
    }
    
    // ancestors now contains the path from a root down to current
    const thread = [...ancestors];

    // Walk forward one step to the next immediate available target
    const nexts = courseEdges
      .filter(e => e.source === current.id)
      .map(e => courseNodes.find(n => n.id === e.target))
      .filter(Boolean);
      
    if (nexts.length > 0) {
       // Pick the one that appears first in the course topology
       thread.push(nexts.sort((a, b) => a.week - b.week)[0]);
    }

    return { threadNodes: thread, currentId: current.id };
  }, [courseNodes, courseEdges, completedNodes, inProgressNodes]);

  // Group concepts by state for mobile vertical journey
  const groupedConcepts = useMemo(() => {
    const learned = [];
    const ready = [];
    const locked = [];

    courseNodes.forEach(node => {
      const status = getNodeStatus(node.id);
      const isCurr = node.id === currentId;
      if (isCurr) return; // Shown in Current Thread
      if (status === 'completed') {
        learned.push(node);
      } else if (status === 'available') {
        ready.push(node);
      } else {
        locked.push(node);
      }
    });

    return { learned, ready, locked };
  }, [courseNodes, getNodeStatus, currentId]);

  // ─── Mobile Layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#FAF9F6]">
        <MapHeader explored={exploredConcepts} total={totalConcepts} currentThread={threadNodes} currentId={currentId} />

        {!hasAnyProgress ? (
          <MobileEmptyState onStart={() => navigate('/lectures/lec_01')} />
        ) : (
          <div className="px-5 py-6 flex flex-col gap-6" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            {/* 1. CURRENT THREAD */}
            {threadNodes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#888]">
                    CURRENT THREAD
                  </span>
                  <div className="flex-1 h-px bg-[#E8E4DC]" />
                </div>
                <div className="flex flex-col">
                  {threadNodes.map((node, i) => {
                    const status = getNodeStatus(node.id);
                    const isCurr = node.id === currentId;
                    const isLast = i === threadNodes.length - 1;
                    return (
                      <div key={node.id}>
                        <MobileConceptRow
                          node={node}
                          status={status}
                          isCurrent={isCurr}
                          isSelected={selectedId === node.id}
                          onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
                        />
                        {selectedId === node.id && (
                          <div className="my-2 bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm">
                            <ConceptInspector nodeId={selectedId} onClose={() => setSelectedId(null)} />
                          </div>
                        )}
                        {!isLast && (
                          <div className="ml-4 w-px h-3.5 bg-[#D5D1C8]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. READY NEXT */}
            {groupedConcepts.ready.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: LEARNING_STATE_COLORS.available.primary }}>
                    READY NEXT ({groupedConcepts.ready.length})
                  </span>
                  <div className="flex-1 h-px bg-[#E8E4DC]" />
                </div>
                <div className="flex flex-col gap-1">
                  {groupedConcepts.ready.map(node => (
                    <div key={node.id}>
                      <MobileConceptRow
                        node={node}
                        status="available"
                        isCurrent={false}
                        isSelected={selectedId === node.id}
                        onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
                      />
                      {selectedId === node.id && (
                        <div className="my-2 bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm">
                          <ConceptInspector nodeId={selectedId} onClose={() => setSelectedId(null)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. LEARNED */}
            {groupedConcepts.learned.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: LEARNING_STATE_COLORS.learned.primary }}>
                    LEARNED ({groupedConcepts.learned.length})
                  </span>
                  <div className="flex-1 h-px bg-[#E8E4DC]" />
                </div>
                <div className="flex flex-col gap-1">
                  {groupedConcepts.learned.map(node => (
                    <div key={node.id}>
                      <MobileConceptRow
                        node={node}
                        status="completed"
                        isCurrent={false}
                        isSelected={selectedId === node.id}
                        onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
                      />
                      {selectedId === node.id && (
                        <div className="my-2 bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm">
                          <ConceptInspector nodeId={selectedId} onClose={() => setSelectedId(null)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. LOCKED */}
            {groupedConcepts.locked.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#A8A6A1]">
                    LOCKED ({groupedConcepts.locked.length})
                  </span>
                  <div className="flex-1 h-px bg-[#E8E4DC]" />
                </div>
                <div className="flex flex-col gap-1">
                  {groupedConcepts.locked.map(node => (
                    <MobileConceptRow
                      key={node.id}
                      node={node}
                      status="locked"
                      isCurrent={false}
                      isSelected={false}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    );
  }

  // ─── Desktop Layout ─────────────────────────────────────────────────────────
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#FAF9F6]">
      <MapHeader explored={exploredConcepts} total={totalConcepts} currentThread={threadNodes} currentId={currentId} />

      {!hasAnyProgress ? (
        <DesktopEmptyState onStart={() => navigate('/lectures/lec_01')} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Knowledge Map DAG */}
          <KnowledgeMap
            selectedId={selectedId}
            onSelect={setSelectedId}
            threadNodes={threadNodes}
          />

          {/* Inspector — docked on right when concept selected */}
          {selectedId && (
            <div
              className="flex-shrink-0 overflow-y-auto transition-all duration-300 bg-[#FAF9F6] shadow-md z-30"
              style={{ width: '32%', minWidth: '300px', maxWidth: '380px' }}
            >
              <ConceptInspector nodeId={selectedId} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}

// ─── Mobile concept row ─────────────────────────────────────────────────────
function MobileConceptRow({ node, status, isCurrent, isSelected, onClick }) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available';

  const stateToken = isCurrent
    ? LEARNING_STATE_COLORS.current
    : isCompleted
    ? LEARNING_STATE_COLORS.learned
    : isAvailable
    ? LEARNING_STATE_COLORS.available
    : LEARNING_STATE_COLORS.locked;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className="w-full text-left flex items-center gap-3 py-2 px-3 rounded-lg transition-colors border"
      style={{
        background: isSelected
          ? '#FFFDF9'
          : isCurrent
          ? '#FFFCF2'
          : 'transparent',
        borderColor: isSelected
          ? '#D5D1C8'
          : isCurrent
          ? '#EBE4D0'
          : 'transparent',
        opacity: isLocked ? 0.60 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        className="text-xs flex-shrink-0 font-bold"
        style={{ color: stateToken.primary }}
      >
        {stateToken.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className="text-xs font-semibold truncate"
          style={{
            color: isCurrent || isSelected ? '#1a1a1a' : isCompleted ? '#384d3f' : isAvailable ? '#2a3b4c' : '#8F8C87',
            fontFamily: "'Hanken Grotesk', sans-serif",
          }}
        >
          {node.title}
        </div>
        <div
          className="text-[10px] truncate text-[#888]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          Week {String(node.week).padStart(2, '0')}
          {node.slides && node.slides.length > 0 && ` · Slide ${node.slides[0]}`}
          {isCurrent && ' · YOU ARE HERE'}
        </div>
      </div>
    </button>
  );
}

// ─── Empty states ───────────────────────────────────────────────────────────
function DesktopEmptyState({ onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div
        className="w-14 h-14 rounded-full border-2 border-dashed border-[#ccc] flex items-center justify-center mb-5"
      >
        <span className="material-symbols-outlined text-2xl text-[#aaa]">explore</span>
      </div>
      <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">
        Start Your Knowledge Map
      </h2>
      <p className="text-sm text-[#888] max-w-md mb-6">
        Your map will grow as you explore concepts through lectures and conversations.
      </p>
      <button
        onClick={onStart}
        className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors bg-[#1a1a1a] hover:bg-[#333]"
      >
        Explore Week 01 →
      </button>
    </div>
  );
}

function MobileEmptyState({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div
        className="w-12 h-12 rounded-full border-2 border-dashed border-[#ccc] flex items-center justify-center mb-4"
      >
        <span className="material-symbols-outlined text-xl text-[#aaa]">explore</span>
      </div>
      <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">
        Start Your Knowledge Map
      </h2>
      <p className="text-sm text-[#888] max-w-sm mb-5">
        Your map will grow as you explore concepts.
      </p>
      <button
        onClick={onStart}
        className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-[#1a1a1a]"
      >
        Explore Week 01 →
      </button>
    </div>
  );
}
