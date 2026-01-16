'use client';

import { useEffect } from 'react';
import { ServerErrorState, GenericErrorState } from '@/components/shared/error-state';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin section error:', error);
  }, [error]);

  // Check if error message suggests a server error
  const isServerError = error.message?.includes('500') ||
                        error.message?.includes('Server') ||
                        error.message?.includes('Internal');

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      {isServerError ? (
        <ServerErrorState
          onRetry={reset}
          onGoHome={() => (window.location.href = '/dashboard')}
        />
      ) : (
        <GenericErrorState
          title="Page Error"
          message={
            process.env.NODE_ENV === 'development'
              ? error.message || 'An error occurred while loading this page'
              : 'We encountered an error while loading this page. Please try again.'
          }
          onRetry={reset}
          onGoHome={() => (window.location.href = '/dashboard')}
        />
      )}
    </div>
  );
}
