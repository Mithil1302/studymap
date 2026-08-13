import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import StudyJourneyRow from '../components/map/StudyJourneyRow';
import StudyJourneyThread from '../components/map/StudyJourneyThread';

export default function LearningMap() {
  const { courseNodes, courseEdges, inProgressNodes, completedNodes, getNodeStatus } = useProgress();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalConcepts = courseNodes.length;
  const exploredConcepts = completedNodes.size + inProgressNodes.size;

  // 1. Determine "Current Concept"
  const currentConcept = useMemo(() => {
    const inProg = courseNodes.filter(n => inProgressNodes.has(n.id)).sort((a, b) => b.week - a.week);
    if (inProg.length > 0) return inProg[0];
    
    const comp = courseNodes.filter(n => completedNodes.has(n.id)).sort((a, b) => b.week - a.week);
    if (comp.length > 0) return comp[0];

    return courseNodes[0];
  }, [courseNodes, inProgressNodes, completedNodes]);

  // 2. Determine Current Week
  const currentWeek = currentConcept ? currentConcept.week : 1;

  // 3. Compute Current Learning Thread (Max 4 nodes)
  const currentThread = useMemo(() => {
    if (!currentConcept) return [];
    
    let path = [currentConcept];
    let curr = currentConcept;
    
    for (let i = 0; i < 3; i++) {
      const prereqs = courseEdges
        .filter(e => e.target === curr.id)
        .map(e => courseNodes.find(n => n.id === e.source))
        .filter(n => n && (completedNodes.has(n.id) || inProgressNodes.has(n.id)));
      
      if (prereqs.length > 0) {
        path.unshift(prereqs[0]);
        curr = prereqs[0];
      } else {
        break;
      }
    }
    
    if (path.length < 4) {
      const nexts = courseEdges
        .filter(e => e.source === currentConcept.id)
        .map(e => courseNodes.find(n => n.id === e.target))
        .filter(Boolean);
      if (nexts.length > 0) {
        path.push(nexts[0]);
      }
    }
    
    return path.slice(0, 4);
  }, [currentConcept, courseEdges, courseNodes, completedNodes, inProgressNodes]);

  // 4. Compute Next Stop
  const nextStop = useMemo(() => {
    if (!currentConcept) return null;
    
    const children = courseEdges
      .filter(e => e.source === currentConcept.id)
      .map(e => courseNodes.find(n => n.id === e.target));
      
    const availableChild = children.find(c => c && getNodeStatus(c.id) === 'available');
    if (availableChild) return availableChild;
    
    return courseNodes.find(n => getNodeStatus(n.id) === 'available') || null;
  }, [currentConcept, courseEdges, courseNodes, getNodeStatus]);

  // 5. Group nodes by week
  const nodesByWeek = useMemo(() => {
    const weeks = { 1: [], 2: [], 3: [] }; // Pre-fill weeks 1-3
    courseNodes.forEach(n => {
      if (!weeks[n.week]) weeks[n.week] = [];
      weeks[n.week].push(n);
    });
    return weeks;
  }, [courseNodes]);

  const weekTitles = {
    1: "FOUNDATIONS",
    2: "OPTIMIZATION",
    3: "GENERALIZATION"
  };

  const getWeekStats = (weekNumber) => {
    const nodes = nodesByWeek[weekNumber] || [];
    const explored = nodes.filter(n => completedNodes.has(n.id) || inProgressNodes.has(n.id)).length;
    return { explored, total: nodes.length };
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F9F4EE] paper-texture flex flex-col items-center py-8 px-6">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        
        {/* COURSE ORIENTATION HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8">
          <div>
            <h1 className="text-4xl font-bold text-on-surface tracking-tight font-display mb-2">
              YOUR STUDY JOURNEY
            </h1>
            <p className="text-xl text-on-surface-variant font-medium">
              Machine Learning for Engineers
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm font-bold text-on-surface-variant tracking-widest uppercase mb-2">
              {exploredConcepts} / {totalConcepts} concepts explored
            </p>
            <div className="h-1.5 w-full md:w-64 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${(exploredConcepts / totalConcepts) * 100}%` }}
              />
            </div>
          </div>
        </header>

        {/* HERO SECTION: THREAD + NEXT STOP */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudyJourneyThread pathNodes={currentThread} currentNodeId={currentConcept?.id} />
          </div>
          
          <div className="lg:col-span-1">
            {nextStop ? (
              <div className="bg-white p-6 rounded-2xl border border-outline-variant hard-shadow-sm h-full flex flex-col">
                <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-6 uppercase tracking-widest">NEXT STOP</h3>
                
                <div className="flex-1 border-l-2 border-primary pl-4 py-1 my-2">
                  <h4 className="text-2xl font-bold text-on-surface mb-2 font-display">
                    → {nextStop.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-4">
                    Week {nextStop.week} {nextStop.slides && `· Slide ${nextStop.slides[0]}`}
                  </p>
                  
                  {/* Prereq logic for Next Stop */}
                  {courseEdges.filter(e => e.target === nextStop.id).length > 0 && (
                    <p className="text-sm text-on-surface font-medium mb-2 italic">
                      Builds on {courseNodes.find(n => n.id === courseEdges.find(e => e.target === nextStop.id).source)?.title}.
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => navigate(nextStop.slides ? `/lectures/${nextStop.lectureId}/slides/${nextStop.slides[0]}` : `/lectures/${nextStop.lectureId}`)}
                  className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-black/80 transition-colors flex items-center justify-center gap-2 mt-auto"
                >
                  Continue in Notebook <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div className="bg-surface p-6 rounded-2xl border border-outline-variant hard-shadow-sm h-full flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">task_alt</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">Course Complete</h3>
                <p className="text-on-surface-variant">You have explored all concepts in the study map.</p>
              </div>
            )}
          </div>
        </section>

        {/* COURSE PATH TIMELINE */}
        <section className="mt-8">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-8 text-center">YOUR COURSE PATH</h3>
          
          <div className="relative flex justify-between items-center px-4 md:px-12">
            {/* Timeline Line */}
            <div className="absolute left-12 right-12 top-4 h-[2px] bg-outline-variant -z-10" />

            {[1, 2, 3].map((week) => {
              const isCurrent = week === currentWeek;
              const stats = getWeekStats(week);
              const isCompleted = stats.explored === stats.total;
              
              return (
                <div key={week} className="flex flex-col items-center relative bg-[#F9F4EE] px-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-4 transition-colors ${
                    isCurrent 
                      ? 'bg-primary border-primary text-on-primary' 
                      : isCompleted 
                        ? 'bg-surface border-outline text-on-surface'
                        : 'bg-[#F9F4EE] border-outline-variant text-outline'
                  }`}>
                    {isCompleted ? <span className="material-symbols-outlined text-[16px]">check</span> : <span className="font-bold text-sm">{week}</span>}
                  </div>
                  
                  <h4 className="font-bold text-on-surface uppercase text-sm tracking-widest text-center">
                    WEEK {String(week).padStart(2, '0')}
                  </h4>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 text-center">
                    {weekTitles[week]}
                  </p>
                  
                  {isCurrent && (
                    <div className="absolute -bottom-8 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-primary font-handwriting uppercase tracking-widest whitespace-nowrap rotate-[-3deg]">you are here</span>
                      <span className="material-symbols-outlined text-[16px] text-primary -mt-1">arrow_upward</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* THREE STUDY ZONES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((week) => {
            const isCurrent = week === currentWeek;
            
            return (
              <div 
                key={week} 
                className={`flex flex-col rounded-2xl border transition-all duration-300 relative ${
                  isCurrent 
                    ? 'border-primary bg-[#fdfaf6] hard-shadow-sm scale-[1.01]' 
                    : 'border-outline-variant bg-transparent'
                }`}
                style={!isCurrent ? { transform: `rotate(${week === 1 ? '-0.5deg' : '0.5deg'})` } : {}}
              >
                {/* Zone Header */}
                <div className={`p-4 border-b rounded-t-2xl flex flex-col gap-1 ${
                  isCurrent ? 'bg-primary-container/20 border-primary/20' : 'border-outline-variant'
                }`}>
                  <h3 className="font-display font-bold text-xl text-on-surface">
                    WEEK {String(week).padStart(2, '0')}
                  </h3>
                  <h4 className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
                    {weekTitles[week]}
                  </h4>
                  
                  {isCurrent && (
                    <div className="absolute -top-3 -right-3 rotate-12">
                      <div className="w-6 h-12 bg-black/10 rounded-full blur-sm absolute" />
                      <div className="w-4 h-10 bg-primary/20 rounded-full border border-primary/40 backdrop-blur-sm relative shadow-sm" />
                    </div>
                  )}
                </div>

                {/* Zone Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {(nodesByWeek[week] || []).map(node => (
                    <StudyJourneyRow key={node.id} node={node} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </main>
  );
}
