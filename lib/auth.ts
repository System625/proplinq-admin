interface JWTPayload {
  exp: number;
  [key: string]: unknown;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('proplinq_admin_token');
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('proplinq_admin_token', token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('proplinq_admin_token');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  // For Laravel Sanctum tokens (format: "ID|hash"), we can't decode expiration
  // The backend will return 401 if token is invalid/expired
  // So we'll assume the token is valid if it exists and has the right format
  
  if (!token) return true;
  
  // Check if it's a Laravel Sanctum token format (ID|hash)
  if (token.includes('|') && token.split('|').length === 2) {
    return false; // Sanctum tokens don't expire client-side
  }
  
  // If it's a JWT token, decode and check expiration
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}