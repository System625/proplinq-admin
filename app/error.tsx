'use client';

import { useEffect } from 'react';
import { ServerErrorState, GenericErrorState } from '@/components/shared/error-state';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  // Check if error message suggests a server error
  const isServerError = error.message?.includes('500') ||
                        error.message?.includes('Server') ||
                        error.message?.includes('Internal');

  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
          {isServerError ? (
            <ServerErrorState
              onRetry={reset}
              onGoHome={() => (window.location.href = '/dashboard')}
            />
          ) : (
            <GenericErrorState
              title="Application Error"
              message={
                process.env.NODE_ENV === 'development'
                  ? error.message || 'An unexpected error occurred'
                  : 'We encountered an unexpected error. Please try again.'
              }
              onRetry={reset}
              onGoHome={() => (window.location.href = '/dashboard')}
            />
          )}
        </div>
      </body>
    </html>
  );
}
