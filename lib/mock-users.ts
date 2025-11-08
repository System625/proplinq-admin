/**
 * Mock Users for RBAC Testing
 * These credentials can be used to login and test different roles
 * WITHOUT hitting the backend API
 */

import { ApiUser } from '@/types/api';
import { UserRole } from '@/types/rbac';

export interface MockLoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  displayName: string;
}

/**
 * Mock user credentials for testing
 * Use these to login and test different role permissions
 */
export const MOCK_USERS: MockLoginCredentials[] = [
  {
    email: 'admin@proplinq.com',
    password: 'Use the normal',
    role: 'admin',
    displayName: 'Super Admin',
  },
  {
    email: 'support@proplinq.com',
    password: 'support123',
    role: 'customer_support',
    displayName: 'Customer Support',
  },
  {
    email: 'operations@proplinq.com',
    password: 'operations123',
    role: 'operations',
    displayName: 'Operations & Admin',
  },
  {
    email: 'sales@proplinq.com',
    password: 'sales123',
    role: 'sales',
    displayName: 'Sales & Partnerships',
  },
  {
    email: 'marketing@proplinq.com',
    password: 'marketing123',
    role: 'marketing',
    displayName: 'Marketing & Growth',
  },
];

/**
 * Check if credentials match a mock user
 */
export function getMockUser(email: string, password: string): ApiUser | null {
  const mockUser = MOCK_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!mockUser) return null;

  // Create a mock API user object
  const apiUser: ApiUser = {
    id: Math.floor(Math.random() * 10000),
    full_name: mockUser.displayName,
    email: mockUser.email,
    email_verified_at: new Date().toISOString(),
    role: mockUser.role,
    phone_number: '+234 800 000 0000',
    phone_verified_at: new Date().toISOString(),
    location: 'Lagos, Nigeria',
    terms_accepted: true,
    is_suspended: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agency_name: 'PropLinq Admin',
    agent_type: 'admin',
    whatsapp_number: '+234 800 000 0000',
    google_id: null,
    apple_id: null,
  };

  return apiUser;
}

/**
 * Generate a mock token for a user
 */
export function generateMockToken(user: ApiUser): string {
  // Create a simple JWT-like token (not real JWT, just for dev testing)
  const payload = {
    user_id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  // Base64 encode the payload (NOT SECURE - only for dev testing)
  return 'mock_' + btoa(JSON.stringify(payload));
}

/**
 * Check if this is a mock token
 */
export function isMockToken(token: string): boolean {
  return token.startsWith('mock_');
}
