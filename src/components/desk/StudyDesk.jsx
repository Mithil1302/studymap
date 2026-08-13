import React from 'react';
import DeskSurface from './DeskSurface';
import FocusBoard from './FocusBoard';
import LaptopObject from './LaptopObject';
import TextbookStack from './TextbookStack';
import StudyPlanner from './StudyPlanner';
import StudyNotebook from './StudyNotebook';
import NextStudyNote from './NextStudyNote';
import StationeryHolder from './StationeryHolder';

export default function StudyDesk({ 
  currentWeek, 
  thread, 
  nextNode, 
  nextLec, 
  nextSlide, 
  allStats 
}) {
  return (
    <DeskSurface>
      {/* 
        Responsive layout: 
        On mobile, flex-col stack ("study tray").
        On md+, relative positioning for a top-down desk arrangement.
        We establish a container with a generous min-width/max-width to ensure objects don't crush together.
      */}
      <div className="relative w-full max-w-[1400px] min-w-0 md:min-w-[1150px] mx-auto flex flex-col md:block gap-12 md:gap-0 mt-4 md:mt-0 min-h-[850px] overflow-x-hidden md:overflow-x-visible">
        
        {/* BACK LEFT: Focus Board */}
        {/* Width: ~288px */}
        <div className="desk-focus md:absolute md:top-[40px] md:left-[30px] lg:left-[60px] md:z-10 w-full md:w-auto order-none flex justify-center">
          <FocusBoard />
        </div>
        
        {/* BACK CENTER: Laptop */}
        {/* Width: ~380-420px */}
        <div className="desk-laptop md:absolute md:top-[40px] md:left-[50%] md:-translate-x-1/2 md:z-20 w-full md:w-auto order-2 md:order-none flex justify-center">
          <LaptopObject />
        </div>

        {/* BACK RIGHT: Books */}
        {/* Width: ~256px */}
        <div className="desk-books md:absolute md:top-[40px] md:right-[30px] lg:right-[60px] md:z-10 w-full md:w-auto order-1 md:order-none flex justify-center">
          <TextbookStack />
        </div>

        {/* CENTER HERO: Notebook */}
        {/* Scale reduced to ~38-42% of desk width. Max ~500px. Overlaps laptop base max 10-15%. */}
        {/* Laptop is ~320px high, top is 40. Bottom is 360. Notebook top is 300, overlaps by 60px (~15% of laptop). */}
        <div className="desk-notebook md:absolute md:top-[300px] md:left-[50%] md:-translate-x-1/2 md:z-30 w-full md:w-[480px] lg:w-[500px] order-3 md:order-none flex justify-center">
          <StudyNotebook thread={thread} />
        </div>

        {/* FRONT LEFT: Planner */}
        {/* Width: ~208px */}
        {/* Notebook left edge is ~50% - 250px = ~350px on a 1200px screen. Planner right edge is 60+208=268px. No overlap! */}
        <div className="desk-planner md:absolute md:top-[500px] md:left-[30px] lg:left-[60px] md:z-20 w-full md:w-auto order-4 md:order-none flex justify-center">
          <StudyPlanner allStats={allStats} currentWeek={currentWeek} />
        </div>

        {/* FRONT RIGHT: Next Up Note */}
        {/* Width: ~176px */}
        {/* Notebook right edge is ~50% + 250px = ~850px on 1200px. Note left edge is 1200-200-176=824px? Let's use right-[160px] -> 1200-160-176=864px. No overlap! */}
        <div className="desk-next md:absolute md:top-[440px] md:right-[150px] lg:right-[180px] md:z-20 w-full md:w-auto mt-4 md:mt-0 order-5 md:order-none flex justify-center">
          <NextStudyNote nextNode={nextNode} nextLec={nextLec} nextSlide={nextSlide} />
        </div>

        {/* FRONT RIGHT (Far edge): Stationery */}
        {/* Width: ~112px */}
        {/* Placed safely to the right of the Next Up Note */}
        <div className="desk-stationery md:absolute md:top-[540px] md:right-[20px] lg:right-[40px] md:z-[25] hidden md:flex justify-center">
          <StationeryHolder />
        </div>
        
      </div>
    </DeskSurface>
  );
}
