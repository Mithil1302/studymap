import ContextPanel from '../components/layout/ContextPanel';

export default function Overview() {
  return (
    <>
      <main className="flex-1 overflow-y-auto w-full relative flex flex-col">
        <div className="max-w-4xl mx-auto px-margin-page py-8 flex-1">
          {/* Hero Section */}
          <section className="mb-10 relative mt-4">
            <div className="absolute -top-8 -left-6 text-blue-ink handwritten-text text-3xl transform -rotate-6">
              Let's start with the basics →
            </div>
            <h1 className="text-5xl md:text-6xl font-display-lg font-black tracking-tight text-primary mb-4 relative z-10 leading-[1.1] uppercase">
              CS 4780 Machine Learning <br />for Engineers
            </h1>
            <p className="text-xl font-body-lg text-on-surface-variant max-w-2xl mt-4">
              Your professor's lectures, turned into an interactive study space.
            </p>
            {/* Decorative Highlighter stroke behind text */}
            <div className="absolute top-16 left-0 w-72 h-8 bg-secondary-container/40 -z-0 -rotate-1 rounded-sm mix-blend-multiply"></div>
          </section>

          {/* Cards Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-label-caps font-label-caps text-on-surface-variant tracking-widest uppercase">Your Course Notebook</h2>
              <div className="h-px bg-outline-variant flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 01 */}
              <div className="bg-[#fdfbf7] border-4 border-primary p-card-padding rounded-md relative hard-shadow hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group flex flex-col h-64 transform -rotate-1">
                <div className="absolute left-0 top-0 bottom-0 w-5 border-r-2 border-dashed border-outline/50 flex flex-col justify-evenly items-center bg-primary/5 rounded-l-sm">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                </div>
                <div className="pl-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-label-caps font-label-caps text-secondary bg-secondary-fixed/50 px-2 py-1 rounded-sm border border-secondary/20">01</span>
                    <span className="text-annotation-sm font-annotation-sm text-on-surface-variant">15 slides</span>
                  </div>
                  <h3 className="text-2xl font-headline-md font-bold text-primary mb-2 line-clamp-3 group-hover:underline decoration-secondary decoration-4 underline-offset-4">
                    Week 1: Linear Models and Loss Functions
                  </h3>
                  <div className="mt-auto border-t-2 border-primary/20 pt-4 flex justify-between items-center">
                    <span className="text-label-caps font-label-caps text-primary">Explore</span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 right-2 handwritten-text text-3xl text-blue-ink transform rotate-3">
                  Start here →
                </div>
              </div>

              {/* Card 02 */}
              <div className="bg-[#fdfbf7] border-4 border-primary p-card-padding rounded-md relative hard-shadow hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group flex flex-col h-64 transform rotate-1 mt-2">
                <div className="absolute left-0 top-0 bottom-0 w-5 border-r-2 border-dashed border-outline/50 flex flex-col justify-evenly items-center bg-primary/5 rounded-l-sm">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                </div>
                <div className="pl-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-label-caps font-label-caps text-outline px-2 py-1 rounded-sm border border-outline-variant">02</span>
                    <span className="text-annotation-sm font-annotation-sm text-on-surface-variant">15 slides</span>
                  </div>
                  <h3 className="text-2xl font-headline-md font-bold text-primary mb-2 line-clamp-3 group-hover:underline decoration-secondary decoration-4 underline-offset-4">
                    Week 2: Gradient Descent and Backpropagation
                  </h3>
                  <div className="mt-auto border-t-2 border-primary/20 pt-4 flex justify-between items-center">
                    <span className="text-label-caps font-label-caps text-primary">Explore</span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
                <div className="absolute top-0 -right-6 handwritten-text text-3xl text-blue-ink transform rotate-12 drop-shadow-sm">
                  optimization
                </div>
              </div>

              {/* Card 03 */}
              <div className="bg-[#fdfbf7] border-4 border-primary p-card-padding rounded-md relative hard-shadow hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group flex flex-col h-64 transform -rotate-2 mt-1">
                <div className="absolute left-0 top-0 bottom-0 w-5 border-r-2 border-dashed border-outline/50 flex flex-col justify-evenly items-center bg-primary/5 rounded-l-sm">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background"></div>
                </div>
                <div className="pl-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-label-caps font-label-caps text-outline px-2 py-1 rounded-sm border border-outline-variant">03</span>
                    <span className="text-annotation-sm font-annotation-sm text-on-surface-variant">15 slides</span>
                  </div>
                  <h3 className="text-2xl font-headline-md font-bold text-primary mb-2 line-clamp-3 group-hover:underline decoration-secondary decoration-4 underline-offset-4">
                    Week 3: Regularization and Generalization
                  </h3>
                  <div className="mt-auto border-t-2 border-primary/20 pt-4 flex justify-between items-center">
                    <span className="text-label-caps font-label-caps text-primary">Explore</span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 right-4 handwritten-text text-3xl text-blue-ink transform -rotate-6">
                  next →
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Composer */}
        <div className="sticky bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-background via-background/95 to-transparent flex justify-center z-20">
          <div className="w-full max-w-3xl relative mt-4">
            <div className="absolute -top-10 -left-4 handwritten-text text-3xl text-blue-ink transform -rotate-3 z-30 drop-shadow-sm">
              Start anywhere.
            </div>
            <div className="bg-[#fdfbf7] border-4 border-primary rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center p-3 transform hover:-translate-y-1 transition-transform duration-200">
              <span className="material-symbols-outlined text-primary ml-3 mr-4 text-3xl">search</span>
              <input className="flex-1 bg-transparent border-none outline-none font-body-lg text-xl text-primary placeholder:text-on-surface-variant/60 focus:ring-0" placeholder="Ask something about the course..." type="text" />
              <button className="bg-secondary-container border-2 border-primary w-12 h-12 rounded-lg flex items-center justify-center hover:bg-secondary-fixed transition-colors hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-primary text-xl font-bold">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <ContextPanel />
    </>
  );
}
