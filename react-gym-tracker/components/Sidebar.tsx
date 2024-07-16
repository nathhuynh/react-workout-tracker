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

  return (
    <div className={`min-h-screen flex ${isSidebarCollapsed ? 'collapsed-class' : ''} bg-gray-900 text-white flex-col transition-all duration-300`}>
      {/* Sidebar */}
      {isSidebarCollapsed ? null : (
        <aside className="flex flex-col flex-grow">
          <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-right">RP</h1>
              <span className="text-sm">Hypertrophy Beta</span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4">
            <Link href="/workout" passHref>
              <div className={`block px-2 py-2 text-sm font-semibold rounded cursor-pointer ${currentRoute === '/workout' ? 'bg-gray-700' : ''}`}>Current workout</div>
            </Link>
            <Link href="/mesocycles" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/mesocycles' ? 'bg-gray-700' : ''}`}>Mesocycles</div>
            </Link>
            <Link href="/templates" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/templates' ? 'bg-gray-700' : ''}`}>Templates</div>
            </Link>
            <Link href="/addcustomexercise" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/addcustomexercise' ? 'bg-gray-700' : ''}`}>Custom exercises</div>
            </Link>
            <Link href="/new-mesocycle" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/new-mesocycle' ? 'bg-gray-700' : ''}`}>Plan a new mesocycle</div>
            </Link>
          </nav>
          <div className="px-2 py-4 bg-gray-800">
            <Link href="/light-theme" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/light-theme' ? 'bg-gray-700' : ''}`}>Light Theme</div>
            </Link>
            <Link href="/profile" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/profile' ? 'bg-gray-700' : ''}`}>Profile</div>
            </Link>
            <Link href="/subscription" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/subscription' ? 'bg-gray-700' : ''}`}>Subscription</div>
            </Link>
            <Link href="/sign-out" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/sign-out' ? 'bg-gray-700' : ''}`}>Sign out</div>
            </Link>
            <Link href="/help" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/help' ? 'bg-gray-700' : ''}`}>Help</div>
            </Link>
            <Link href="/review" passHref>
              <div className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === '/review' ? 'bg-gray-700' : ''}`}>Leave a review</div>
            </Link>
          </div>
        </aside>
      )}

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
    </div>
  );
};

export default Sidebar;