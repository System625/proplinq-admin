/**
 * API Interceptor
 * Wraps fetch calls with centralized error handling
 */

import { handleApiError } from './api-error-handler';
import { handleGlobalError } from './error-handler';

export interface FetchOptions extends RequestInit {
  skipErrorHandler?: boolean;
  showToast?: boolean;
  onAuthError?: () => void;
}

/**
 * Enhanced fetch wrapper with automatic error handling
 */
export async function fetchWithErrorHandling(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    skipErrorHandler = false,
    showToast = true,
    onAuthError,
    ...fetchOptions
  } = options;

  try {
    const response = await fetch(url, fetchOptions);

    // If response is not OK and we're not skipping error handler
    if (!response.ok && !skipErrorHandler) {
      // Clone the response to read it without consuming the original
      const clonedResponse = response.clone();

      try {
        // Attempt to handle the error via handleApiError
        await handleApiError(clonedResponse, 'Request failed');
      } catch (error) {
        // handleApiError throws an ApiError, catch it and use global error handler
        handleGlobalError(error, {
          showToast,
          onAuthError,
        });

        // Re-throw for the caller to handle if needed
        throw error;
      }
    }

    return response;
  } catch (error) {
    // Network errors or other fetch failures
    if (!skipErrorHandler) {
      handleGlobalError(error, {
        showToast,
        onAuthError,
      });
    }

    throw error;
  }
}

/**
 * Get authorization headers with current token
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('proplinq_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}
