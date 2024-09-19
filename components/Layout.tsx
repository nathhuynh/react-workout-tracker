import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Hero from './Hero';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const publicRoutes = ['/signup', '/signin', '/forgot-password'];

  useEffect(() => {
    if (status !== 'loading') {
      const isPublicRoute = publicRoutes.includes(router.pathname);
      const isHomePage = router.pathname === '/';

      if (!isAuthenticated && !isPublicRoute && !isHomePage) {
        router.push('/signin');
      }
    }
  }, [isAuthenticated, router, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // For public routes and unauthenticated home page
  if (publicRoutes.includes(router.pathname) || (router.pathname === '/' && !isAuthenticated)) {
    return router.pathname === '/' ? <Hero /> : <>{children}</>;
  }

  // For authenticated users
  if (isAuthenticated) {
    return (
      <div className="flex">
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed} 
          setIsSidebarCollapsed={setIsSidebarCollapsed} 
        />
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  // This should never be reached due to the useEffect redirect, but included for completeness
  return null;
};

export default Layout;