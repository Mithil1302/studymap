import { Link, useOutletContext } from 'react-router-dom';
import MarkdownRenderer from '../MarkdownRenderer';
import { useStudyMap } from '../../context/StudyMapContext';
import { useProgress } from '../../context/ProgressContext';

export default function ContextPanel() {
  const { totalLectures, totalSlides, activeSlideData } = useStudyMap();
  const { studyTrail, courseNodes } = useProgress();
  const outletContext = useOutletContext();
  const isOpen = outletContext?.isContextPanelOpen || false;
  const onClose = outletContext?.closeContextPanel || (() => {});

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:flex lg:flex-shrink-0
        w-[85vw] max-w-[360px] lg:w-sidebar-right h-full 
        border-l-2 border-primary bg-surface flex flex-col py-margin-page px-gutter
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 left-4 p-2 text-primary hover:bg-surface-container-high rounded"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="mb-8 mt-8 lg:mt-0">
          <h2 className="text-label-caps font-label-caps text-secondary tracking-widest uppercase mb-2 font-bold">Context & Sources</h2>
          <h3 className="text-headline-md font-headline-md text-primary font-black">Your Course</h3>
          <p className="text-body-md font-body-md text-on-surface-variant">Reference Materials</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {!activeSlideData ? (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border-2 border-primary p-4 bg-paper-white rounded-md flex flex-col items-center justify-center hard-shadow">
                  <span className="text-5xl font-display-lg text-primary font-black">{totalLectures}</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant text-center mt-1">Lectures</span>
                </div>
                <div className="border-2 border-primary p-4 bg-paper-white rounded-md flex flex-col items-center justify-center hard-shadow">
                  <span className="text-5xl font-display-lg text-primary font-black">{totalSlides}</span>
                  <span className="text-label-caps font-label-caps text-on-surface-variant text-center mt-1">Slides</span>
                </div>
              </div>

              {/* Study Trail */}
              <div className="space-y-4">
                <h4 className="text-label-caps font-label-caps text-on-surface-variant border-b-2 border-primary/20 pb-2 font-bold">Study Trail</h4>
                
                {studyTrail.map((nodeId, index) => {
                  const node = courseNodes.find(n => n.id === nodeId);
                  if (!node) return null;
                  
                  return (
                    <div key={`${nodeId}-${index}`} className="flex flex-col gap-2 relative">
                      {/* Connection line between nodes */}
                      {index < studyTrail.length - 1 && (
                        <div className="absolute top-8 bottom-[-16px] left-[15px] w-0.5 bg-primary/20 z-0"></div>
                      )}
                      <div className="flex items-start gap-3 p-3 bg-surface-container border-2 border-outline-variant rounded-md hover:border-primary transition-colors cursor-pointer group relative z-10">
                        <div className="w-8 h-8 rounded-full border-2 border-primary bg-secondary-container flex items-center justify-center shrink-0 mt-1">
                          <span className="text-label-caps font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-body-md text-body-md text-primary font-bold group-hover:underline leading-tight">{node.title}</p>
                          <p className="font-annotation-sm text-annotation-sm text-on-surface-variant mt-1">Week {node.week}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Link 
                to={`/lectures/${activeSlideData.lecture.lecture_id}`}
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className="p-4 bg-notebook-lavender/20 border-2 border-primary text-primary rounded-lg relative cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 duration-200 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="text-body-md font-body-md font-bold leading-tight">{activeSlideData.lecture.title}</h4>
                  <span className="text-annotation-sm font-annotation-sm font-normal">Slide {activeSlideData.slide.slide_number}</span>
                </div>
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>

              <div className="mt-4 border-2 border-primary bg-white rounded-lg p-4 relative">
                <div className="absolute -top-3 left-4 bg-secondary-container px-2 border-2 border-primary rounded text-label-caps font-label-caps font-bold">Slide Content</div>
                <h4 className="text-body-md font-body-md font-bold mt-2 border-b border-outline-variant pb-2 mb-2">
                  {activeSlideData.slide.title}
                </h4>
                <ul className="list-disc pl-4 space-y-2 mb-4 text-body-sm font-body-sm text-on-surface">
                  {activeSlideData.slide.bullets?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                {activeSlideData.slide.formulas && (
                  <div className="mb-4 bg-surface-container p-2 rounded border border-outline-variant overflow-x-auto">
                    {activeSlideData.slide.formulas.map((f, i) => (
                      <MarkdownRenderer key={i} content={`$$${f}$$`} />
                    ))}
                  </div>
                )}
                {activeSlideData.slide.notes && (
                  <div className="mt-4 pt-4 border-t border-outline-variant">
                    <span className="text-sm handwritten-blue block mb-1">Prof's Note:</span>
                    <p className="text-annotation-sm font-annotation-sm text-on-surface-variant italic">
                      {activeSlideData.slide.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
