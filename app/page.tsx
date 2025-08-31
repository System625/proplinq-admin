'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function Home() {
  const router = useRouter();
  const { checkAuth, initAuth } = useAuthStore();

  useEffect(() => {
    const handleRouting = async () => {
      try {
        initAuth();
        
        if (checkAuth()) {
          console.log('User authenticated - redirecting to dashboard');
          router.push('/dashboard');
        } else {
          console.log('User not authenticated - redirecting to login');
          router.push('/login');
        }
      } catch (error) {
        console.error('Routing error:', error);
        router.push('/login');
      }
    };

    handleRouting();
  }, [checkAuth, initAuth, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
