import { useParams, Navigate, Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ContextPanel from '../components/layout/ContextPanel';
import { useStudyMap } from '../context/StudyMapContext';

export default function LectureDetail() {
  const { id } = useParams();
  const { lectures } = useStudyMap();
  
  const lecture = lectures.find(l => l.lecture_id === id);
  if (!lecture) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto min-w-0 bg-background">
        <div className="pt-6 md:pt-12 pb-12 md:pb-24 px-4 md:px-margin-page md:pl-24 max-w-5xl mx-auto flex flex-col gap-8 md:gap-16">
          {/* Breadcrumb / Context Header */}
          <div className="flex items-center gap-2 text-xs md:text-label-caps font-label-caps text-on-surface-variant mb-2 md:mb-4 uppercase tracking-widest flex-wrap">
            <Link to="/" className="hover:text-primary cursor-pointer transition-colors whitespace-nowrap">Lectures</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary font-bold whitespace-nowrap">Week {lecture.week.toString().padStart(2, '0')}</span>
          </div>

          <div className="mb-4 md:mb-8">
            <h1 className="text-4xl md:text-display-lg font-display-lg text-primary leading-tight mb-2">{lecture.title}</h1>
            <p className="text-base md:text-body-lg font-body-lg text-on-surface-variant">{lecture.course_code} — {lecture.course_title}</p>
          </div>

          {/* Render all slides */}
          {lecture.slides.map((slide, idx) => (
            <article key={slide.slide_number} id={`slide-${slide.slide_number}`} className="bg-paper-white border-2 border-primary rounded-xl p-6 md:p-10 lg:p-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-w-4xl mx-auto w-full">
              {/* Hand-drawn accent for some slides */}
              {idx % 2 === 0 && (
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-warning-coral/20 rounded-full border-2 border-primary flex items-center justify-center rotate-12 z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl">priority_high</span>
                </div>
              )}

              <header className="mb-6 md:mb-10 border-b-2 border-primary pb-4 md:pb-6">
                <p className="text-[10px] md:text-label-caps font-label-caps text-outline mb-2">WEEK {lecture.week.toString().padStart(2, '0')} · SLIDE {slide.slide_number.toString().padStart(2, '0')}</p>
                <h2 className="text-2xl md:text-headline-lg font-display-lg text-primary leading-tight mb-2 md:mb-3">{slide.title}</h2>
              </header>

              <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start relative">
                {/* Main Content Column */}
                <div className="flex-1 min-w-0 prose prose-base md:prose-lg text-base md:text-body-lg font-body-lg text-on-surface max-w-none space-y-4 md:space-y-6 w-full">
                  {slide.bullets && slide.bullets.length > 0 && (
                    <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3">
                      {slide.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}><MarkdownRenderer content={bullet} /></li>
                      ))}
                    </ul>
                  )}

                  {/* Figure Description */}
                  {slide.figure && (
                    <div className="bg-surface-container-low border-2 border-dashed border-outline p-4 md:p-6 rounded-md text-center italic text-sm md:text-base text-on-surface-variant">
                      [Figure: {slide.figure.description}]
                    </div>
                  )}

                  {/* Formulas Block */}
                  {slide.formulas && slide.formulas.length > 0 && (
                    <div className="relative z-10 text-center flex flex-col items-center justify-center py-6 md:py-10 px-2 bg-surface-container-lowest border-2 border-primary rounded mt-6 md:mt-8 overflow-x-auto">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
                      {slide.formulas.map((formula, fIdx) => (
                        <div key={fIdx} className="text-xl sm:text-2xl md:text-3xl font-medium text-primary tracking-wide relative z-10 my-3 md:my-4 w-full">
                          <MarkdownRenderer content={`$$${formula}$$`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Professor's Annotation */}
                {slide.notes && (
                  <aside className="w-full lg:w-[280px] xl:w-[320px] shrink-0 lg:-mr-12 xl:-mr-16 lg:mt-12 relative z-20 mt-4 lg:mt-0">
                    <div className="rotate-[-1deg] lg:rotate-[-3deg] bg-[#e6f3ff] border-2 border-[#0066cc] p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,102,204,0.3)] flex flex-col gap-2 relative w-full">
                      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-8 h-4 bg-[#cc0000]/20 rounded-full blur-[2px]"></div> {/* Tape effect */}
                      <p className="handwritten-text text-[#004488] text-xl lg:text-2xl leading-relaxed h-auto min-h-0 break-words whitespace-pre-wrap">
                        "{slide.notes}"
                      </p>
                      <span className="material-symbols-outlined text-[#004488] self-end mt-1 md:mt-2" style={{ fontSize: "24px" }}>star</span>
                    </div>
                  </aside>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* NavigationDrawer (Right Context Panel) */}
      <ContextPanel />
    </>
  );
}
