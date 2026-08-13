import { useMemo } from 'react';
import { useStudyMap } from '../context/StudyMapContext';
import { useProgress } from '../context/ProgressContext';
import StudyDesk from '../components/desk/StudyDesk';

// Find the chronological "tip" node by leveraging JS Set insertion order.
function getChronologicalTip(courseNodes, completedNodes, inProgressNodes) {
  const isNonCore = (id) => {
    const n = courseNodes.find(node => node.id === id);
    return n && n.type !== 'core';
  };
  
  const inProgArr = Array.from(inProgressNodes).filter(isNonCore);
  if (inProgArr.length > 0) return inProgArr[inProgArr.length - 1];

  const compArr = Array.from(completedNodes).filter(isNonCore);
  if (compArr.length > 0) return compArr[compArr.length - 1];

  return null;
}

// Walk backward from deepest active node through courseEdges (max 4 items total)
function buildThread(courseNodes, courseEdges, completedNodes, inProgressNodes) {
  const tipId = getChronologicalTip(courseNodes, completedNodes, inProgressNodes);
  if (!tipId) return [];

  const tip = courseNodes.find((n) => n.id === tipId);
  if (!tip) return [];

  const chain = [tip];
  let cur = tip;
  for (let d = 0; d < 3; d++) {
    // Only follow ACTUAL graph relationships backwards
    const edge = courseEdges.find((e) => e.target === cur.id);
    if (!edge) break;
    const parent = courseNodes.find((n) => n.id === edge.source);
    if (!parent || parent.type === 'core') break;
    chain.unshift(parent);
    cur = parent;
  }
  return chain;
}

// Next concept: outbound edge from tip, else first available unstarted in course order
function findNext(courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus) {
  const tipId = getChronologicalTip(courseNodes, completedNodes, inProgressNodes);
  
  if (tipId) {
    const childEdges = courseEdges.filter((e) => e.source === tipId);
    for (const edge of childEdges) {
      const child = courseNodes.find((n) => n.id === edge.target && n.type !== 'core');
      if (child && !completedNodes.has(child.id) && !inProgressNodes.has(child.id)) {
        if (getNodeStatus(child.id) === 'available') {
          return child;
        }
      }
    }
  }

  const nonCore = courseNodes.filter((n) => n.type !== 'core');
  return nonCore.find((n) => 
    getNodeStatus(n.id) === 'available' && 
    !completedNodes.has(n.id) && 
    !inProgressNodes.has(n.id)
  ) ?? null;
}

// Current week: week of the active tip node
function deriveCurrentWeek(courseNodes, completedNodes, inProgressNodes) {
  const tipId = getChronologicalTip(courseNodes, completedNodes, inProgressNodes);
  if (tipId) {
    const node = courseNodes.find((n) => n.id === tipId);
    return node ? node.week : null;
  }
  return null;
}

// Per-lecture progress stats
function weekStats(lec, courseNodes, completedNodes, inProgressNodes) {
  const nodes = courseNodes.filter((n) => n.week === lec.week && n.type !== 'core');
  const explored = nodes.filter((n) => completedNodes.has(n.id) || inProgressNodes.has(n.id)).length;
  return { nodes, explored, total: nodes.length };
}

export default function Overview() {
  const { lectures } = useStudyMap();
  const { courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus } = useProgress();

  const currentWeek = useMemo(
    () => deriveCurrentWeek(courseNodes, completedNodes, inProgressNodes),
    [courseNodes, completedNodes, inProgressNodes]
  );

  const allStats = useMemo(
    () => lectures.map((lec) => ({ lec, ...weekStats(lec, courseNodes, completedNodes, inProgressNodes) })),
    [lectures, courseNodes, completedNodes, inProgressNodes]
  );

  const thread = useMemo(
    () => buildThread(courseNodes, courseEdges, completedNodes, inProgressNodes),
    [courseNodes, courseEdges, completedNodes, inProgressNodes]
  );

  const nextNode = useMemo(
    () => findNext(courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus),
    [courseNodes, courseEdges, completedNodes, inProgressNodes, getNodeStatus]
  );

  const nextLec = nextNode ? lectures.find((l) => l.lecture_id === nextNode.lectureId) : null;
  const nextSlide = nextNode?.slides?.[0] ?? null;

  return (
    // Set to overflow-y-auto to allow independent scrolling if desired, or let window scroll.
    // Given the request, the desk handles scrolling. We just make sure this container doesn't force hidden overflow.
    <div className="flex-1 w-full h-full flex flex-col overflow-y-auto overflow-x-auto min-w-0 bg-[#D1C2B0]">
      <StudyDesk 
        currentWeek={currentWeek}
        thread={thread}
        nextNode={nextNode}
        nextLec={nextLec}
        nextSlide={nextSlide}
        allStats={allStats}
      />
    </div>
  );
}
