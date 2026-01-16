/**
 * Global Error Provider
 * Provides centralized error handling context and auto-redirects for auth errors
 */

'use client';

import { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { handleGlobalError } from '@/lib/error-handler';

interface ErrorProviderProps {
  children: ReactNode;
}

interface ErrorContextValue {
  handleError: (error: unknown, options?: { silent?: boolean; showToast?: boolean }) => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function ErrorProvider({ children }: ErrorProviderProps) {
  const router = useRouter();

  const handleError = useCallback((error: unknown, options?: { silent?: boolean; showToast?: boolean }) => {
    handleGlobalError(error, {
      ...options,
      onAuthError: () => {
        // Clear auth data and redirect to login on auth errors
        if (typeof window !== 'undefined') {
          localStorage.removeItem('proplinq_admin_token');
          localStorage.removeItem('proplinq_admin_user');
        }
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      },
      onServerError: () => {
        // Could add logging or analytics here
        console.error('Server error occurred');
      },
    });
  }, [router]);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      handleError(event.reason);
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError]);

  const value: ErrorContextValue = {
    handleError,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

/**
 * Hook to access error handling context
 */
export function useErrorHandler() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useErrorHandler must be used within ErrorProvider');
  }

  return context;
}
