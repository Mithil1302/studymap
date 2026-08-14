import { useParams, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Notebook from '../components/Notebook';
import { useStudyMap } from '../context/StudyMapContext';
import { useProgress } from '../context/ProgressContext';

export default function LectureDetail() {
  const { id } = useParams();
  const { lectures } = useStudyMap();
  const { courseNodes, markNodeCompleted } = useProgress();
  const [searchParams] = useSearchParams();
  
  const lecture = lectures.find(l => l.lecture_id === id);

  // Deep-link: ?slide=N → find the page index for that slide
  const initialPage = (() => {
    const slideParam = searchParams.get('slide');
    if (!slideParam || !lecture) return 0;
    const slideNum = parseInt(slideParam, 10);
    if (isNaN(slideNum)) return 0;
    // Slides are 1-indexed in data; page 0 is cover, page i is slides[i-1]
    const slideIndex = lecture.slides.findIndex(s => s.slide_number === slideNum);
    return slideIndex >= 0 ? slideIndex + 1 : 0; // +1 to skip cover
  })();

  const navigate = useNavigate();

  useEffect(() => {
    if (lecture) {
      const node = courseNodes.find(n => n.lectureId === lecture.lecture_id);
      if (node) {
        markNodeCompleted(node.id);
      }
    }
  }, [lecture, courseNodes, markNodeCompleted]);

  // Escape → back to bookshelf
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') navigate('/lectures');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  if (!lecture) {
    return <Navigate to="/lectures" replace />;
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto min-w-0 bg-background">
        <div className="pt-6 md:pt-12 pb-12 md:pb-24 px-4 md:px-margin-page md:pl-24 w-[95%] md:w-[90%] max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-16">
          {/* Breadcrumb / Context Header */}
          <div className="flex items-center gap-2 text-xs md:text-label-caps font-label-caps text-on-surface-variant mb-2 md:mb-4 uppercase tracking-widest flex-wrap">
            <Link to="/lectures" className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">Lectures</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary font-bold whitespace-nowrap">Week {lecture.week.toString().padStart(2, '0')}</span>
          </div>

          <div className="mb-4 md:mb-8">
            <h1 className="text-4xl md:text-display-lg font-display-lg text-primary leading-tight mb-2">{lecture.title}</h1>
            <p className="text-base md:text-body-lg font-body-lg text-on-surface-variant">{lecture.course_code} — {lecture.course_title}</p>
          </div>

          {/* Render Notebook Experience */}
          <Notebook lecture={lecture} initialPage={initialPage} />
        </div>
      </main>
    </>
  );
}
