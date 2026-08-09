export default function Conversation() {
  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 bg-surface-container-low/50 relative">
        <div className="flex-1 overflow-y-auto px-margin-page pt-margin-page pb-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {/* Student Question */}
            <div className="flex justify-end mb-4 animate-fade-in-up">
              <div className="bg-white border-2 border-primary rounded-lg rounded-tr-none p-4 max-w-[80%] hard-shadow-sm relative">
                <p className="text-body-md font-body-md">I'm stuck on problem set 2. What's the vanishing gradient problem?</p>
                <div className="absolute -top-3 -right-3 bg-tertiary-container text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-primary">
                  Me
                </div>
              </div>
            </div>

            {/* Tutor Response (Notebook Style) */}
            <div className="bg-white border-2 border-primary rounded-xl p-8 hard-shadow relative mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="absolute top-0 bottom-0 left-8 w-px bg-warning-coral/30"></div>
              <div className="relative z-10 pl-4 notebook-line pb-4">
                <h2 className="text-headline-md font-headline-md mb-6 border-b-2 border-primary pb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-notebook-lavender">school</span>
                  The Vanishing Gradient Problem
                </h2>
                <div className="paper-highlight py-2 px-1 mb-6 rounded-sm">
                  <p className="mb-4">
                    Great question. In deep neural networks, particularly those using sigmoid or tanh activation functions, gradients are calculated using the <span className="highlighter">chain rule</span> during backpropagation.
                  </p>
                  <p>
                    Because the derivative of a sigmoid function is always less than 0.25, multiplying many of these small derivatives together across multiple layers causes the gradient to decrease exponentially. The earlier layers receive almost no update, effectively "vanishing" and stopping the network from learning.
                  </p>
                </div>
                {/* Math Block */}
                <div className="my-8 relative">
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-sm handwritten-blue whitespace-nowrap z-20">
                    move AGAINST the gradient
                  </div>
                  <div className="bg-surface-container-high border-2 border-primary p-4 rounded-lg flex items-center justify-center overflow-x-auto">
                    <code className="text-body-lg font-body-lg font-mono tracking-wider">
                      θ ← θ − η∇L(θ)
                    </code>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-8 mt-12">
                  <div className="flex-1">
                    <h3 className="text-label-caps font-label-caps text-on-surface-variant mb-2">L1 vs L2 Regularization</h3>
                    <div className="border-2 border-primary rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-left">
                        <thead className="bg-surface-variant border-b-2 border-primary">
                          <tr>
                            <th className="p-3 font-label-caps text-label-caps">Feature</th>
                            <th className="p-3 border-l-2 border-primary font-label-caps text-label-caps">L1 (Lasso)</th>
                            <th className="p-3 border-l-2 border-primary font-label-caps text-label-caps">L2 (Ridge)</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b-2 border-primary">
                            <td className="p-3 font-bold border-r-2 border-primary">Penalty</td>
                            <td className="p-3 border-r-2 border-primary">Absolute value of weights</td>
                            <td className="p-3">Squared magnitude of weights</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold border-r-2 border-primary">Sparsity</td>
                            <td className="p-3 border-r-2 border-primary">Produces sparse models (feature selection)</td>
                            <td className="p-3">Pushes weights close to zero, but rarely exactly zero</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Chip */}
              <div className="absolute -bottom-4 right-8 flex flex-col items-end">
                <span className="text-sm handwritten-blue mb-1 mr-2">from the lecture</span>
                <button className="bg-surface-bright border-2 border-primary px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-secondary-container transition-colors hard-shadow-sm font-label-caps text-label-caps font-bold text-[#2196F3]">
                  [ WEEK 02 · SLIDE 09 ]
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Question Composer */}
        <div className="p-6 md:p-8 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border-2 border-primary p-2 rounded-xl hard-shadow flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input className="flex-grow border-none focus:ring-0 text-body-md font-body-md bg-transparent outline-none placeholder:text-annotation-sm placeholder:font-annotation-sm placeholder:text-on-surface-variant" placeholder="Ask something about the course..." type="text" />
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-tertiary-container transition-colors">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT ZONE: Context & Sources */}
      <aside className="w-sidebar-right h-full border-l-2 border-primary bg-surface flex-col py-margin-page px-gutter hidden lg:flex flex-shrink-0">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-headline-md font-headline-md text-primary mb-1">Context & Sources</h2>
            <p className="text-annotation-sm font-annotation-sm text-on-surface-variant">Reference Materials</p>
          </div>
          <span className="text-label-caps font-label-caps text-secondary">CS 4780</span>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-8 custom-scrollbar">
          {/* Source Item 1 */}
          <div className="p-4 bg-notebook-lavender/20 border-2 border-primary text-primary font-bold rounded-lg relative cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 duration-200 transition-all">
            <div className="flex items-start gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
              <div>
                <h4 className="text-body-md font-body-md font-bold leading-tight">Week 02 Slides</h4>
                <span className="text-annotation-sm font-annotation-sm text-on-surface-variant font-normal">Slide 09 - Optimization</span>
              </div>
            </div>
          </div>
          
          {/* Source Item 2 */}
          <div className="p-4 text-on-surface-variant border-b border-outline-variant hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 duration-200 transition-all cursor-pointer bg-white border-2 border-transparent hover:border-primary rounded-lg">
            <div className="flex items-start gap-3 mb-2">
              <span className="material-symbols-outlined text-on-surface-variant">menu_book</span>
              <div>
                <h4 className="text-body-md font-body-md font-bold text-on-surface leading-tight">Deep Learning Book</h4>
                <span className="text-annotation-sm font-annotation-sm text-on-surface-variant font-normal">Chapter 8.2 - Poor Conditioning</span>
              </div>
            </div>
          </div>

          {/* Concept Card */}
          <div className="mt-6 border-2 border-primary bg-white rounded-lg p-4 relative">
            <div className="absolute -top-3 left-4 bg-secondary-container px-2 border-2 border-primary rounded text-label-caps font-label-caps font-bold">Concept Review</div>
            <h4 className="text-body-md font-body-md font-bold mt-2 border-b border-outline-variant pb-2 mb-2">Gradient Descent</h4>
            <p className="text-annotation-sm font-annotation-sm text-on-surface-variant">An iterative optimization algorithm for finding a local minimum of a differentiable function.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
