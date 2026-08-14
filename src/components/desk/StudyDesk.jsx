import DeskSurface from './DeskSurface';
import FocusBoard from './FocusBoard';
import LaptopObject from './LaptopObject';
import TextbookStack from './TextbookStack';
import StudyPlanner from './StudyPlanner';
import StudyNotebook from './StudyNotebook';
import NextStudyNote from './NextStudyNote';

export default function StudyDesk({
  currentWeek,
  thread,
  nextNode,
  nextLec,
  nextSlide,
  allStats,
}) {
  return (
    <DeskSurface>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT (≥1024px)
          True CSS Grid spatial composition
         ══════════════════════════════════════════ */}
      <div
        className="hidden lg:grid w-full max-w-[1500px] mx-auto px-8"
        style={{
          // 3 columns: Left | Center | Right
          gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(400px, 2fr) minmax(280px, 1.2fr)',
          gridTemplateRows: 'auto 60px auto 40px auto', // Row 1 (Back) | Gap | Row 3 (Notebook) | Gap | Row 5 (Front)
          columnGap: 'clamp(32px, 4vw, 80px)',
        }}
      >
        {/* ─ ROW 1: BACK (z-index 10) ─ */}
        <div className="flex items-end justify-start relative z-10" style={{ gridColumn: '1', gridRow: '1' }}>
          <FocusBoard thread={thread} />
        </div>

        <div className="flex items-end justify-center relative z-10" style={{ gridColumn: '2', gridRow: '1' }}>
          <LaptopObject />
        </div>

        <div className="flex items-end justify-end relative z-10" style={{ gridColumn: '3', gridRow: '1' }}>
          <TextbookStack />
        </div>

        {/* ─ ROW 3: CENTER / NOTEBOOK (z-index 20) ─ */}
        <div className="flex items-start justify-center relative z-20" style={{ gridColumn: '2', gridRow: '3', marginTop: '10px' }}>
          <div style={{ width: 'min(44vw, 560px)' }}>
            <StudyNotebook thread={thread} />
          </div>
        </div>

        {/* ─ ROW 5: FRONT (z-index 30) ─ */}
        <div className="flex items-start justify-start relative z-30 pt-4" style={{ gridColumn: '1', gridRow: '3 / 6' }}>
          <StudyPlanner allStats={allStats} currentWeek={currentWeek} />
        </div>

        <div className="flex items-start justify-end relative z-30 pt-16" style={{ gridColumn: '3', gridRow: '3 / 6' }}>
          <NextStudyNote nextNode={nextNode} nextLec={nextLec} nextSlide={nextSlide} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TABLET LAYOUT (768–1023px)
          Stacked but maintaining logical separation
         ══════════════════════════════════════════ */}
      <div className="hidden md:flex lg:hidden flex-col items-center w-full gap-16 max-w-[900px] mx-auto pb-12">
        <div className="flex justify-center w-full relative z-10">
          <FocusBoard thread={thread} />
        </div>
        <div className="flex flex-row justify-center items-end gap-16 w-full flex-wrap relative z-10">
          <LaptopObject />
          <TextbookStack />
        </div>
        <div className="flex justify-center w-full px-4 relative z-20 mt-4">
          <div style={{ width: 'min(80vw, 540px)' }}>
            <StudyNotebook thread={thread} />
          </div>
        </div>
        <div className="flex flex-row justify-center items-start gap-16 w-full flex-wrap relative z-30 mt-4">
          <StudyPlanner allStats={allStats} currentWeek={currentWeek} />
          <NextStudyNote nextNode={nextNode} nextLec={nextLec} nextSlide={nextSlide} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE LAYOUT (<768px)
          Pure vertical stack, no clipping
         ══════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col items-center w-full gap-12 pb-16 px-4">
        <div className="flex justify-center w-full">
          <FocusBoard thread={thread} />
        </div>
        <div className="flex justify-center w-full">
          <LaptopObject />
        </div>
        <div className="flex justify-center w-full">
          <TextbookStack />
        </div>
        <div className="flex justify-center w-full">
          <div style={{ width: 'min(92vw, 440px)' }}>
            <StudyNotebook thread={thread} />
          </div>
        </div>
        <div className="flex justify-center w-full">
          <StudyPlanner allStats={allStats} currentWeek={currentWeek} />
        </div>
        <div className="flex justify-center w-full">
          <NextStudyNote nextNode={nextNode} nextLec={nextLec} nextSlide={nextSlide} />
        </div>
      </div>

    </DeskSurface>
  );
}
