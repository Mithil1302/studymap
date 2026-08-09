export default function LectureDetail() {
  return (
    <>
      <main className="flex-1 overflow-y-auto min-w-0 bg-background">
        <div className="pt-12 pb-24 px-margin-page md:pl-24 max-w-5xl mx-auto">
        {/* Breadcrumb / Context Header */}
        <div className="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant mb-8 uppercase tracking-widest">
          <span className="hover:text-primary cursor-pointer transition-colors">Lectures</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Week 02</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">Slide 09</span>
        </div>

        {/* The "Slide" Content Area (Paper Canvas) */}
        <article className="bg-paper-white border-2 border-primary rounded-xl p-10 md:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-w-4xl mx-auto">
          {/* Hand-drawn accent */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-warning-coral/20 rounded-full border-2 border-primary flex items-center justify-center rotate-12 z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-primary">priority_high</span>
          </div>

          <header className="mb-10 border-b-2 border-primary pb-6">
            <p className="text-label-caps font-label-caps text-outline mb-2">WEEK 02 · SLIDE 09</p>
            <h1 className="text-display-lg font-display-lg text-primary leading-tight mb-3">The Vanishing Gradient Problem</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Understanding the limitations of deep feedforward networks.</p>
          </header>

          <div className="prose prose-lg text-body-lg font-body-lg text-on-surface max-w-none space-y-6">
            <p>
              When training artificial neural networks with gradient-based learning methods and backpropagation, the gradients of the loss function can approach zero, making the network hard to train.
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>This occurs primarily when using activation functions like the <span className="paper-highlight font-bold px-1">sigmoid</span> or hyperbolic tangent (tanh).</li>
              <li>Because the chain rule multiplies derivatives across layers, if these derivatives are less than 1, their product decreases <span className="paper-highlight font-bold px-1">exponentially</span> with the number of layers.</li>
              <li>Result: Early layers (closest to the input) train extremely slowly compared to later layers.</li>
            </ul>

            {/* Visual / Math Block */}
            <div className="relative z-10 text-center flex flex-col items-center justify-center py-10 bg-surface-container-lowest border-2 border-primary rounded mt-8 overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
              <p className="text-annotation-sm font-annotation-sm text-outline-variant mb-4 uppercase tracking-widest relative z-10">Chain Rule for Deep Networks</p>
              <div className="text-2xl md:text-3xl font-medium text-primary tracking-wide relative z-10">
                ∂L / ∂w<sub>1</sub> = (∂L / ∂a<sub>L</sub>) · ∏<sub>i=1</sub><sup>L-1</sup> (∂a<sub>i+1</sub> / ∂a<sub>i</sub>) · (∂a<sub>1</sub> / ∂w<sub>1</sub>)
              </div>
            </div>
          </div>

          {/* Professor's Annotation */}
          <div className="absolute -bottom-6 -left-6 md:-left-12 rotate-[-3deg] bg-[#e6f3ff] border-2 border-[#0066cc] p-4 max-w-[280px] shadow-[4px_4px_0px_0px_rgba(0,102,204,0.3)] z-20 flex flex-col gap-2">
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-8 h-4 bg-[#cc0000]/20 rounded-full blur-[2px]"></div> {/* Tape effect */}
            <p className="handwritten-text text-[#004488] text-2xl leading-snug">
              "This is the single most important slide in the lecture. If you understand this product of derivatives, you understand why we need ResNets."
            </p>
            <span className="material-symbols-outlined text-[#004488] self-end" style={{ fontSize: "24px" }}>star</span>
          </div>
        </article>
        </div>
      </main>

      {/* NavigationDrawer (Right Context Panel) */}
      <aside className="w-sidebar-right h-full border-l-2 border-primary bg-surface flex-col pt-8 pb-margin-page px-gutter hidden lg:flex flex-shrink-0">
        <div className="mb-6 border-b-2 border-primary pb-4">
          <h2 className="text-headline-md font-headline-md text-primary">Context & Sources</h2>
          <p className="text-label-caps font-label-caps text-secondary mt-1">Reference Materials</p>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {/* Context Card 1: Lecture Info */}
          <div className="bg-paper-white border-2 border-primary rounded-lg overflow-hidden group">
            <div className="bg-secondary-container border-b-2 border-primary px-3 py-1.5 flex justify-between items-center">
              <span className="text-label-caps font-label-caps text-on-secondary-container">Lecture Metadata</span>
              <span className="material-symbols-outlined text-on-secondary-container text-sm">info</span>
            </div>
            <div className="p-3">
              <p className="font-body-md font-bold mb-1">Week 02: Optimization</p>
              <p className="font-annotation-sm text-on-surface-variant">Professor XYZ • Fall 2026</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
