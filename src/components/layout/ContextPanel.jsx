export default function ContextPanel() {
  return (
    <aside className="w-sidebar-right h-full border-l-2 border-primary bg-surface flex-col py-margin-page px-gutter hidden lg:flex flex-shrink-0">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-label-caps font-label-caps text-secondary tracking-widest uppercase mb-2 font-bold">Context & Sources</h2>
        <h3 className="text-headline-md font-headline-md text-primary font-black">Your Course</h3>
        <p className="text-body-md font-body-md text-on-surface-variant">Reference Materials</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border-2 border-primary p-4 bg-paper-white rounded-md flex flex-col items-center justify-center hard-shadow">
            <span className="text-5xl font-display-lg text-primary font-black">3</span>
            <span className="text-label-caps font-label-caps text-on-surface-variant text-center mt-1">Lectures</span>
          </div>
          <div className="border-2 border-primary p-4 bg-paper-white rounded-md flex flex-col items-center justify-center hard-shadow">
            <span className="text-5xl font-display-lg text-primary font-black">45</span>
            <span className="text-label-caps font-label-caps text-on-surface-variant text-center mt-1">Slides</span>
          </div>
        </div>

        {/* List of materials */}
        <div className="space-y-4">
          <h4 className="text-label-caps font-label-caps text-on-surface-variant border-b-2 border-primary/20 pb-2 font-bold">Recent Materials</h4>
          
          <div className="flex items-start gap-3 p-3 bg-notebook-lavender/10 border-2 border-outline-variant rounded-md hover:border-primary hover:bg-notebook-lavender/20 transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-primary mt-1">picture_as_pdf</span>
            <div>
              <p className="font-body-md text-body-md text-primary font-bold group-hover:underline">Week 1 Slides.pdf</p>
              <p className="font-annotation-sm text-annotation-sm text-on-surface-variant">Added 2 days ago</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-surface-container border-2 border-outline-variant rounded-md hover:border-primary transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-primary mt-1">picture_as_pdf</span>
            <div>
              <p className="font-body-md text-body-md text-primary font-bold group-hover:underline">Week 2 Slides.pdf</p>
              <p className="font-annotation-sm text-annotation-sm text-on-surface-variant">Added 2 days ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-surface-container border-2 border-outline-variant rounded-md hover:border-primary transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-primary mt-1">picture_as_pdf</span>
            <div>
              <p className="font-body-md text-body-md text-primary font-bold group-hover:underline">Week 3 Slides.pdf</p>
              <p className="font-annotation-sm text-annotation-sm text-on-surface-variant">Added 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
