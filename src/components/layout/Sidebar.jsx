import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStudyMap } from '../../context/StudyMapContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { startNewConversation } = useStudyMap();

  const navItems = [
    { name: 'Overview', path: '/', icon: 'dashboard' },
    { name: 'Learning Map', path: '/learning-map', icon: 'map' },
    { name: 'Conversation', path: '/conversation', icon: 'forum' },
    { name: 'Lectures', path: '/lectures/week-02-slide-09', icon: 'menu_book' }, // Default mock route for now
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <nav className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:flex md:flex-shrink-0
        w-[80vw] max-w-[320px] md:w-sidebar-left h-full 
        border-r-2 border-primary bg-background flex flex-col py-margin-page px-4
        overflow-y-auto overflow-x-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 text-primary hover:bg-surface-container-high rounded"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header Info */}
        <div className="mb-8 px-2 mt-8 md:mt-0">
          <h1 className="text-headline-md font-headline-md text-primary font-black mb-1">CS 4780</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">Machine Learning for Engineers</p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.name === 'Lectures' && location.pathname.startsWith('/lectures'));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => { if(window.innerWidth < 768) onClose(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container border-2 border-primary font-bold translate-x-1 hard-shadow relative'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:bg-surface-container-highest'
                }`}
              >
                <span 
                  className="material-symbols-outlined shrink-0" 
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-label-caps font-label-caps">{item.name}</span>
              </Link>
            );
          })}
        </div>

      </nav>
    </>
  );
}
