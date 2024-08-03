import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const router = useRouter();
  const currentRoute = router.pathname;

  const handleLinkClick = (href: string) => {
    setIsSidebarCollapsed(true);
    router.push(href);
  }

  return (
    <>
      {/* Overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarCollapsed(true)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
          } w-64`}
      >
        <aside className="flex flex-col h-full">
          <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-right">RP</h1>
              <span className="text-sm">Hypertrophy Beta</span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <div
              onClick={() => handleLinkClick('/workout')}
              className={`block px-2 py-2 text-sm font-semibold rounded cursor-pointer ${currentRoute === '/workout' ? 'bg-gray-700' : ''}`}
            >
              Current workout
            </div>
            <div
              onClick={() => handleLinkClick('/mesocycles')}
              className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/mesocycles' ? 'bg-gray-700' : ''}`}
            >
              Mesocycles
            </div>
            {/* <div 
              onClick={() => handleLinkClick('/templates')}
              className={`block px-2 py-2 text-sm font-semibold rounded cursor-pointer ${currentRoute === '/templates' ? 'bg-gray-700' : ''}`}
            >
              Templates
            </div> */}
            <div 
              onClick={() => handleLinkClick('/addcustomexercise')}
              className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/addcustomexercise' ? 'bg-gray-700' : ''}`}
            >
              Custom Exercises
            </div>
            <div 
              onClick={() => handleLinkClick('/new-mesocycle')}
              className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/new-mesocycle' ? 'bg-gray-700' : ''}`}
            >
              Create New Mesocycle
            </div>
          </nav>
          <div className="px-2 py-4 bg-gray-800">
            <Link href="/light-theme" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/light-theme' ? 'bg-gray-700' : ''}`}>Light Theme</div>
            </Link>
            <Link href="/profile" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/profile' ? 'bg-gray-700' : ''}`}>Profile</div>
            </Link>
            <Link href="/sign-out" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/sign-out' ? 'bg-gray-700' : ''}`}>Sign out</div>
            </Link>
          </div>
        </aside>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed top-4 left-4 bg-gray-700 text-white px-2 py-1 rounded z-50"
      >
        {isSidebarCollapsed ? (
          <i className="fas fa-chevron-right"></i>
        ) : (
          <i className="fas fa-chevron-left"></i>
        )}
      </button>
    </>
  );
};

export default Sidebar;