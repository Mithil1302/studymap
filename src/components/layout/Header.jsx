export default function Header({ onOpenMenu, onOpenContext }) {
  return (
    <header className="h-16 w-full border-b-2 border-primary bg-background flex justify-between items-center px-4 md:px-margin-page flex-shrink-0 z-40 relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMenu}
          className="md:hidden flex items-center justify-center p-1 hover:bg-surface-container-high rounded transition-colors text-primary"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div className="font-headline-lg text-2xl md:text-headline-lg italic text-primary font-black">StudyMap</div>
      </div>
      <div className="flex gap-3 md:gap-4 items-center">
        <button 
          onClick={onOpenContext}
          className="lg:hidden flex items-center justify-center p-1 hover:bg-surface-container-high rounded transition-colors text-primary"
          aria-label="Open context panel"
        >
          <span className="material-symbols-outlined text-2xl">menu_open</span>
        </button>
      </div>
    </header>
  );
}
