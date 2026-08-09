import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          onOpenContext={() => setIsContextPanelOpen(true)}
        />
        <div className="flex-1 overflow-hidden relative flex flex-row">
          <Outlet context={{ isContextPanelOpen, closeContextPanel: () => setIsContextPanelOpen(false) }} />
        </div>
      </div>
    </div>
  );
}
