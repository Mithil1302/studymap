export default function LearningMap() {
  return (
    <main className="flex-1 overflow-auto bg-surface dot-pattern relative flex flex-col">
      {/* Header controls */}
      <div className="sticky top-4 left-4 z-40 bg-white border-2 border-primary p-2 rounded-lg hard-shadow-sm inline-flex items-center gap-2 m-margin-page self-start">
        <span className="material-symbols-outlined text-primary ml-2">map</span>
        <span className="font-label-caps text-label-caps font-bold px-2 border-r-2 border-primary/20">Learning Map</span>
        <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[18px]">zoom_in</span></button>
        <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[18px]">zoom_out</span></button>
      </div>

      <div className="flex-1 w-full min-w-[1200px] overflow-visible pb-32">
        <div className="relative w-[1200px] h-[900px] mx-auto mt-12">
          {/* SVG Connections Canvas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 900">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="2" dy="2" stdDeviation="0" floodOpacity="0.2" />
              </filter>
            </defs>
            <style>
              {`
                .connection-path {
                  fill: none;
                  stroke: #0088e1;
                  stroke-width: 4;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  filter: url(#shadow);
                }
              `}
            </style>
            
            {/* Root to Linear Models */}
            <path className="connection-path" d="M 600 150 C 600 220, 350 200, 350 280" />
            
            {/* Root to Gradient Descent */}
            <path className="connection-path" d="M 600 150 C 600 220, 850 200, 850 280" />
            
            {/* Gradient Descent to Backprop */}
            <path className="connection-path" d="M 850 410 C 850 480, 650 460, 650 530" />
            
            {/* Gradient Descent to Regularization */}
            <path className="connection-path" d="M 850 410 C 850 480, 1050 460, 1050 530" />

            {/* Backprop to Vanishing Gradient */}
            <path className="connection-path" d="M 650 630 C 650 690, 650 680, 650 730" />
          </svg>

          {/* CONCEPT NODES */}
          
          {/* Root Concept */}
          <div className="absolute left-[600px] top-[20px] -translate-x-1/2 z-10 w-[240px]">
            <div className="card-node card-white hard-shadow-sm rotate-1 w-full !relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps bg-primary text-white px-2 py-0.5 rounded-sm">Core</span>
                <span className="material-symbols-outlined text-outline-variant text-sm">push_pin</span>
              </div>
              <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight">Machine Learning Basics</h3>
              <p className="font-annotation-sm text-on-surface-variant line-clamp-2">Supervised vs Unsupervised learning paradigms.</p>
              <div className="absolute -right-8 -bottom-4 text-right">
                <span className="marker-blue whitespace-nowrap handwritten-text text-xl transform -rotate-12 inline-block">Start here</span>
              </div>
            </div>
          </div>

          {/* Level 2: Left (Linear Models) */}
          <div className="absolute left-[350px] top-[280px] -translate-x-1/2 z-10 w-[240px]">
            <div className="card-node card-white hard-shadow-sm -rotate-2 w-full !relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps border border-primary px-2 py-0.5 rounded-sm">Week 01</span>
              </div>
              <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight">Linear Models</h3>
              <p className="font-annotation-sm text-on-surface-variant line-clamp-2">Linear regression and classification boundaries.</p>
            </div>
          </div>

          {/* Level 2: Right (Gradient Descent) */}
          <div className="absolute left-[850px] top-[280px] -translate-x-1/2 z-10 w-[240px]">
            <div className="card-node card-yellow hard-shadow-sm rotate-2 w-full !relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps border border-primary px-2 py-0.5 rounded-sm bg-white">Week 02</span>
                <div className="w-3 h-3 rounded-full bg-warning-coral border border-primary"></div>
              </div>
              <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight">Gradient Descent</h3>
              <p className="font-annotation-sm text-on-surface-variant line-clamp-2">Optimization algorithm for finding local minimum.</p>
              <div className="mt-4 border-t-2 border-primary/20 pt-2 flex justify-between items-center cursor-pointer hover:text-secondary group">
                <span className="font-label-caps text-label-caps">3 Lectures</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Level 3: Left (Backpropagation) */}
          <div className="absolute left-[650px] top-[530px] -translate-x-1/2 z-10 w-[240px]">
            <div className="card-node card-white hard-shadow-sm -rotate-1 w-full !relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps border border-primary px-2 py-0.5 rounded-sm">Week 04</span>
              </div>
              <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight">Neural Networks & Backprop</h3>
              <p className="font-annotation-sm text-on-surface-variant line-clamp-2">Multi-layer perceptrons and calculating gradients via the chain rule.</p>
            </div>
          </div>

          {/* Level 3: Right (Regularization) */}
          <div className="absolute left-[1050px] top-[530px] -translate-x-1/2 z-10 w-[240px]">
            <div className="card-node card-white hard-shadow-sm rotate-3 w-full !relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps border border-primary px-2 py-0.5 rounded-sm">Week 03</span>
              </div>
              <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight">Regularization</h3>
              <p className="font-annotation-sm text-on-surface-variant line-clamp-2">L1, L2, and preventing overfitting in complex models.</p>
            </div>
          </div>

          {/* Level 4: Vanishing Gradient */}
          <div className="absolute left-[650px] top-[730px] -translate-x-1/2 z-10 w-[240px]">
            <div className="card-node card-green hard-shadow-sm -rotate-2 w-full !relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/50 rounded-full blur-[1px]"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps border border-primary px-2 py-0.5 rounded-sm bg-white">Week 05</span>
              </div>
              <h3 className="font-headline-md text-primary font-bold mb-2 leading-tight">Vanishing Gradient</h3>
              <p className="font-annotation-sm text-on-surface-variant line-clamp-2">Issues with deep networks and sigmoids.</p>
              <div className="mt-4 text-center">
                <span className="marker-pink handwritten-text text-xl">Crucial concept!</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
