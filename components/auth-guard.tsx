'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { checkAuth, initAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        initAuth();
        
        if (!checkAuth()) {
          console.log('Authentication failed - redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('Authentication successful');
        setShouldRenderChildren(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuth, initAuth, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!shouldRenderChildren) {
    return null;
  }

  return <>{children}</>;
}