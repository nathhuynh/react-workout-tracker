import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    // List of public routes that don't require authentication
    const publicRoutes = ['/signup', '/signin', '/forgot-password'];

    useEffect(() => {
      if (typeof window !== 'undefined') {
        if (status === 'loading') return; // Wait for the session to load

        if (!isAuthenticated && !publicRoutes.includes(router.pathname)) {
          // Only redirect if not authenticated and not on a public route
          router.replace('/signin');
        }
      }
    }, [isAuthenticated, router, status]);

    if (typeof window !== 'undefined' && status === 'loading') {
      return <div>Loading...</div>; // Or a loading spinner
    }

    // For public routes or authenticated users, render the component
    if (publicRoutes.includes(router.pathname) || isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // When rendering on server or waiting for redirect, return null
    return null;
  };

  return WithAuth;
};

export default withAuth;