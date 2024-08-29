import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const { data: session } = useSession();

  const handleLinkClick = (href: string) => {
    setIsSidebarCollapsed(true);
    router.push(href);
  };

  const handleAuthAction = async () => {
    if (session) {
      await signOut({ redirect: false });
      router.push('/signin'); // Redirect to sign-in page after signing out
    } else {
      router.push('/signin');
    }
    setIsSidebarCollapsed(true);
  };

  const menuItems = [
    { name: 'Current Workout', href: '/workout' },
    { name: 'Mesocycles', href: '/mesocycles' },
    { name: 'Custom Exercises', href: '/custom-exercises' },
    { name: 'Create New Mesocycle', href: '/new-mesocycle' },
  ];

  const bottomItems = [
    { name: 'Light Theme', href: '/light-theme' },
    session && {
      name: (
        <>
          <FontAwesomeIcon icon={faUser} />
          <span className="ml-2">{session.user.username}</span>
        </>
      ),
      href: '/profile'
    },
    { name: session ? 'Sign out' : 'Sign in', action: handleAuthAction },
  ].filter(Boolean);

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
        className={`fixed top-0 left-0 h-full bg-gray-100 text-gray-800 transition-all duration-300 z-50 ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
          } w-64 shadow-lg`}
      >
        <aside className="flex flex-col h-full">
          <div className="px-4 py-2 bg-indigo-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-800 pt-2 pl-10 pb-2">RP</h1>
              <span className="text-sm text-indigo-600 font-semi">Hypertrophy Beta</span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleLinkClick(item.href)}
                className={`block px-2 py-2 text-sm font-semibold rounded cursor-pointer ${currentRoute === item.href ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-indigo-50'
                  }`}
              >
                {item.name}
              </div>
            ))}
          </nav>
          <div className="px-2 py-4 bg-indigo-100">
            {bottomItems.map((item, index) =>
              item && (
                <div
                  key={index}
                  onClick={item.action || (() => handleLinkClick(item.href!))}
                  className={`block px-2 py-2 text-sm cursor-pointer ${currentRoute === item.href ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-indigo-50'
                    }`}
                >
                  {item.name}
                </div>
              )
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
