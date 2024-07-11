import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  return (
    <div className={`min-h-screen flex ${isSidebarCollapsed} bg-gray-900 text-white flex-col transition-all duration-300`}>
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
            <Link href="/workout" className="block px-2 py-2 text-sm font-semibold bg-gray-700 rounded">Current workout</Link>
            <Link href="/mesocycles" className="block px-2 py-2 text-sm">Mesocycles</Link>
            <Link href="/templates" className="block px-2 py-2 text-sm">Templates</Link>
            <Link href="/addcustomexercise" className="block px-2 py-2 text-sm">Custom exercises</Link>
            <Link href="/new-mesocycle" className="block px-2 py-2 text-sm">Plan a new mesocycle</Link>
          </nav>
          <div className="px-2 py-4 bg-gray-800">
            <Link href="/light-theme" className="block px-2 py-2 text-sm">Light Theme</Link>
            <Link href="/profile" className="block px-2 py-2 text-sm">Profile</Link>
            <Link href="/subscription" className="block px-2 py-2 text-sm">Subscription</Link>
            <Link href="/sign-out" className="block px-2 py-2 text-sm">Sign out</Link>
            <Link href="/help" className="block px-2 py-2 text-sm">Help</Link>
            <Link href="/review" className="block px-2 py-2 text-sm">Leave a review</Link>
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