import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [location] = useLocation();
  const [activeRoute, setActiveRoute] = useState('/dashboard');
  
  useEffect(() => {
    if (location === '/') {
      setActiveRoute('/dashboard');
    } else {
      setActiveRoute(location);
    }
  }, [location]);

  // Navigation links data
  const navLinks = [
    { path: '/dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
    { path: '/configuration', icon: 'cogs', label: 'Configuration' },
    { path: '/economy', icon: 'coins', label: 'Economy System' },
    { path: '/levels', icon: 'chart-line', label: 'Level System' },
    { path: '/music', icon: 'music', label: 'Music Player' },
    { path: '/games', icon: 'gamepad', label: 'Games' },
    { path: '/commands', icon: 'terminal', label: 'Commands' },
    { path: '/analytics', icon: 'chart-bar', label: 'Analytics' }
  ];

  // Helper function to generate icon JSX
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'tachometer-alt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <path d="M12 2v2" /><path d="M12 14v8" /><path d="M22 12h-2" /><path d="M2 12h2" />
            <path d="M20 20 18 18" /><path d="M20 4 18 6" /><path d="M4 20 6 18" /><path d="M4 4 6 6" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        );
      case 'cogs':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'coins':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
            <path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
          </svg>
        );
      case 'chart-line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <path d="m22 12-4-4-7 7-2-2-7 7" />
            <path d="M22 18H2" />
          </svg>
        );
      case 'music':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case 'gamepad':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="8" y1="10" x2="8" y2="14" />
            <circle cx="15" cy="13" r="1" />
            <circle cx="17" cy="11" r="1" />
            <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
          </svg>
        );
      case 'terminal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );
      case 'chart-bar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
        );
      case 'sign-out-alt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        );
      default:
        return <span className="w-5 h-5 mr-3"></span>;
    }
  };

  const sidebarClasses = `lg:flex lg:flex-col w-64 bg-discord-dark fixed h-full lg:h-screen transition-all duration-300 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`;
  
  return (
    <aside id="sidebar" className={sidebarClasses}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" 
            alt="Bot logo" 
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h2 className="font-bold text-white">DisBotAdmin</h2>
            <span className="text-xs text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Online
            </span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link href={link.path} 
                className={`flex items-center p-3 rounded-md ${activeRoute === link.path ? 'bg-[#5865F2] text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                {getIcon(link.icon)}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="relative flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" 
              alt="Admin avatar" 
              className="h-10 w-10 rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-discord-dark"></span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Server Admin</p>
          </div>
        </div>
        <a href="#logout" className="flex items-center p-2 text-gray-400 hover:text-white rounded-md">
          {getIcon('sign-out-alt')}
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
