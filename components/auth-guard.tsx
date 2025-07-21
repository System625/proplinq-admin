'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, checkAuth, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    
    if (!checkAuth()) {
      router.push('/login');
      return;
    }
  }, [checkAuth, initAuth, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}