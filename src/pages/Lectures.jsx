import { useMemo } from 'react';
import LectureBookshelf from '../components/lectures/LectureBookshelf';
import { useProgress } from '../context/ProgressContext';
import { useStudyMap } from '../context/StudyMapContext';

/**
 * Derives which lecture is currently "active" so the bookshelf can mark it.
 * Logic: find the lecture whose nodes have the most recent in-progress/completed activity.
 */
function deriveCurrentLectureId(lectures, courseNodes, completedNodes, inProgressNodes) {
  // Look for in-progress nodes first, then completed ones
  const allActive = [
    ...Array.from(inProgressNodes),
    ...Array.from(completedNodes),
  ];

  for (const nodeId of [...allActive].reverse()) {
    const node = courseNodes.find(n => n.id === nodeId && n.type !== 'core');
    if (node?.lectureId) {
      return node.lectureId;
    }
  }
  return null;
}

export default function Lectures() {
  const { lectures } = useStudyMap();
  const { courseNodes, completedNodes, inProgressNodes } = useProgress();

  const currentLectureId = useMemo(
    () => deriveCurrentLectureId(lectures, courseNodes, completedNodes, inProgressNodes),
    [lectures, courseNodes, completedNodes, inProgressNodes]
  );

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
      <LectureBookshelf currentLectureId={currentLectureId} />
    </main>
  );
}
