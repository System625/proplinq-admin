/**
 * Centralized Error Handler
 * Provides global error handling with toast notifications and proper UI feedback
 */

import { toast } from 'sonner';
import { ApiError } from './api-error-handler';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  silent?: boolean;
  onAuthError?: () => void;
  onServerError?: () => void;
}

/**
 * Global error handler that displays appropriate toast messages
 * and handles different error types (401, 500, etc.)
 */
export function handleGlobalError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): void {
  const {
    showToast = true,
    silent = false,
    onAuthError,
    onServerError,
  } = options;

  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error handler:', error);
  }

  // Handle ApiError instances
  if (error instanceof ApiError) {
    if (!silent && showToast) {
      // Authentication errors (401, 403)
      if (error.isAuthError) {
        toast.error('Session Expired', {
          description: error.message,
          duration: 5000,
        });
        onAuthError?.();
        return;
      }

      // Server errors (500, 502, 503, 504)
      if (error.statusCode && error.statusCode >= 500) {
        toast.error('Server Error', {
          description: 'We are experiencing technical difficulties. Please try again later.',
          duration: 5000,
        });
        onServerError?.();
        return;
      }

      // Validation errors (422)
      if (error.statusCode === 422) {
        toast.error('Invalid Data', {
          description: error.message,
          duration: 4000,
        });
        return;
      }

      // Rate limiting (429)
      if (error.statusCode === 429) {
        toast.error('Too Many Requests', {
          description: error.message,
          duration: 5000,
        });
        return;
      }

      // Not found (404)
      if (error.statusCode === 404) {
        toast.error('Not Found', {
          description: error.message,
          duration: 4000,
        });
        return;
      }

      // Generic API error
      toast.error('Error', {
        description: error.message,
        duration: 4000,
      });
      return;
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    if (!silent && showToast) {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred.',
        duration: 4000,
      });
    }
    return;
  }

  // Handle network errors
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    (error as { message: string }).message === 'Network Error'
  ) {
    if (!silent && showToast) {
      toast.error('Network Error', {
        description: 'Unable to connect to the server. Please check your internet connection.',
        duration: 5000,
      });
    }
    return;
  }

  // Fallback for unknown errors
  if (!silent && showToast) {
    toast.error('Unexpected Error', {
      description: 'Something went wrong. Please try again.',
      duration: 4000,
    });
  }
}

/**
 * Create an error handler with pre-configured options
 */
export function createErrorHandler(defaultOptions: ErrorHandlerOptions = {}) {
  return (error: unknown, overrideOptions?: ErrorHandlerOptions) => {
    handleGlobalError(error, { ...defaultOptions, ...overrideOptions });
  };
}
