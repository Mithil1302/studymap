import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/', icon: 'dashboard' },
    { name: 'Learning Map', path: '/learning-map', icon: 'map' },
    { name: 'Conversation', path: '/conversation', icon: 'forum' },
    { name: 'Lectures', path: '/lectures/week-02-slide-09', icon: 'menu_book' }, // Default mock route for now
  ];

  return (
    <nav className="w-sidebar-left h-full border-r-2 border-primary bg-background flex-col py-margin-page px-4 hidden md:flex flex-shrink-0">
      {/* Header Info */}
      <div className="mb-8 px-2">
        <h1 className="text-headline-md font-headline-md text-primary font-black mb-1">CS 4780</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">Machine Learning for Engineers</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary bg-surface-container-high overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <span className="text-label-caps font-label-caps text-on-surface-variant">CS 4780 Professor</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.name === 'Lectures' && location.pathname.startsWith('/lectures'));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container border-2 border-primary font-bold translate-x-1 hard-shadow relative'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:bg-surface-container-highest'
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-label-caps font-label-caps">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <button className="mt-auto bg-secondary-container border-2 border-primary px-4 py-3 font-label-caps text-label-caps text-primary hard-shadow-hover transition-transform rounded flex justify-center items-center gap-2">
        <span className="material-symbols-outlined text-sm">add</span>
        New Note
      </button>
    </nav>
  );
}
