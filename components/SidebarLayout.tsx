import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="relative">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Toggle button */}
        {(
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-indigo-700 px-2 py-1 rounded ml-2 mt-4 z-50 self-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;