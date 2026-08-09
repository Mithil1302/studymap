export default function Header() {
  return (
    <header className="h-16 w-full border-b-2 border-primary bg-background flex justify-between items-center px-margin-page flex-shrink-0">
      <div className="font-headline-lg text-headline-lg italic text-primary font-black">StudyMap</div>
      <div className="flex gap-4">
        <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">settings</span>
        <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">account_circle</span>
      </div>
    </header>
  );
}
