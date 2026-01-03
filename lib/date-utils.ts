/**
 * Date utility functions for API requests
 * Provides helpers for formatting dates and calculating date ranges
 */

/**
 * Get date N days ago in YYYY-MM-DD format
 * @param days - Number of days ago
 * @returns Date string in YYYY-MM-DD format
 */
export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format duration from seconds to "Xm Ys" format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "2m 45s")
 */
export function formatDuration(seconds: number): string {
  // Handle invalid values
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return '0m 0s';
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
}

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get first day of current month in YYYY-MM-DD format
 * @returns First day of month
 */
export function getFirstDayOfMonth(): string {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().split('T')[0];
}

/**
 * Get last day of current month in YYYY-MM-DD format
 * @returns Last day of month
 */
export function getLastDayOfMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.toISOString().split('T')[0];
}
