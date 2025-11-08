/**
 * API Error Handler
 * Provides better error messages for different HTTP status codes
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isAuthError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API response errors with appropriate messages
 */
export async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  const statusCode = response.status;

  // Try to get error message from response
  let errorMessage = defaultMessage;
  try {
    const data = await response.json();
    errorMessage = data.message || data.error || defaultMessage;
  } catch {
    // If response is not JSON, use status-based messages
  }

  // Handle specific status codes
  switch (statusCode) {
    case 401:
      throw new ApiError(
        'Your session has expired or you are not authorized. Please log in again.',
        401,
        true
      );

    case 403:
      throw new ApiError(
        'You do not have permission to access this resource.',
        403,
        true
      );

    case 404:
      throw new ApiError(
        'The requested resource was not found.',
        404
      );

    case 422:
      throw new ApiError(
        errorMessage || 'Invalid data provided. Please check your input.',
        422
      );

    case 429:
      throw new ApiError(
        'Too many requests. Please try again later.',
        429
      );

    case 500:
    case 502:
    case 503:
    case 504:
      throw new ApiError(
        'Server error. Please try again later.',
        statusCode
      );

    default:
      throw new ApiError(errorMessage, statusCode);
  }
}

/**
 * Check if error is an authentication error (401 or 403)
 */
export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.isAuthError;
}

/**
 * Get user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
