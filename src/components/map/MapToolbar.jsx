
export default function MapToolbar() {
  return (
    <div className="sticky top-4 left-4 z-40 bg-white border-2 border-primary p-2 rounded-lg hard-shadow-sm inline-flex items-center gap-2 m-margin-page self-start">
      <span className="material-symbols-outlined text-primary ml-2">map</span>
      <span className="font-label-caps text-label-caps font-bold px-2 border-r-2 border-primary/20">Learning Map</span>
      <button className="p-1 hover:bg-surface-container rounded transition-colors" title="Zoom In">
        <span className="material-symbols-outlined text-[18px]">zoom_in</span>
      </button>
      <button className="p-1 hover:bg-surface-container rounded transition-colors" title="Zoom Out">
        <span className="material-symbols-outlined text-[18px]">zoom_out</span>
      </button>
    </div>
  );
}
