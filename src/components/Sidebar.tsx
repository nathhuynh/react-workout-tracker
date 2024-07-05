import React from 'react';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {isSidebarCollapsed ? null : (
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-right">RP</h1>
              <span className="text-sm">Hypertrophy Beta</span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4">
            <a href="/workout" className="block px-2 py-2 text-sm font-semibold bg-gray-700 rounded">Current workout</a>
            <a href="#" className="block px-2 py-2 text-sm">Mesocycles</a>
            <a href="#" className="block px-2 py-2 text-sm">Templates</a>
            <a href="/addcustomexercise" className="block px-2 py-2 text-sm">Custom exercises</a>
            <a href="/new-mesocycle" className="block px-2 py-2 text-sm">Plan a new mesocycle</a>
          </nav>
          <div className="px-2 py-4 bg-gray-800">
            <a href="#" className="block px-2 py-2 text-sm">Light Theme</a>
            <a href="#" className="block px-2 py-2 text-sm">Profile</a>
            <a href="#" className="block px-2 py-2 text-sm">Subscription</a>
            <a href="#" className="block px-2 py-2 text-sm">Sign out</a>
            <a href="#" className="block px-2 py-2 text-sm">Help</a>
            <a href="#" className="block px-2 py-2 text-sm">Leave a review</a>
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