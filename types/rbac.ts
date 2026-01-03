/**
 * Role-Based Access Control (RBAC) Types and Permissions
 * Defines user roles, permissions, and access control utilities
 */

// User roles in the system
export type UserRole =
  | 'admin'
  | 'customer_support'
  | 'operations'
  | 'sales'
  | 'marketing'
  | 'founder';

// Feature/page identifiers
export type Feature =
  | 'dashboard'
  | 'support-dashboard'
  | 'operations-dashboard'
  | 'sales-dashboard'
  | 'marketing-dashboard'
  | 'crm-dashboard'
  | 'users'
  | 'blog-posts'
  | 'listings'
  | 'bookings'
  | 'transactions'
  | 'kyc'
  | 'data-management'
  | 'founder-revenue'
  | 'founder-subscriptions'
  | 'founder-wallets'
  | 'founder-growth'
  | 'founder-properties'
  | 'founder-bookings'
  | 'founder-support'
  | 'founder-staff'
  | 'founder-overrides'
  | 'founder-discounts'
  | 'founder-reports';

// Permission levels
export type PermissionLevel = 'none' | 'view' | 'edit' | 'full';

// Permission configuration for each feature
export interface FeaturePermission {
  feature: Feature;
  level: PermissionLevel;
  description?: string;
}

// Role configuration
export interface RoleConfig {
  role: UserRole;
  displayName: string;
  description: string;
  defaultDashboard: string;
  permissions: FeaturePermission[];
}

/**
 * Role Permissions Configuration
 * Maps each role to their allowed features and permission levels
 */
export const ROLE_PERMISSIONS: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    displayName: 'Super Admin',
    description: 'Full system access',
    defaultDashboard: '/dashboard',
    permissions: [
      { feature: 'dashboard', level: 'full' },
      { feature: 'users', level: 'full' },
      { feature: 'blog-posts', level: 'full' },
      { feature: 'listings', level: 'full' },
      { feature: 'bookings', level: 'full' },
      { feature: 'transactions', level: 'full' },
      { feature: 'kyc', level: 'full' },
      { feature: 'data-management', level: 'full' },
      { feature: 'support-dashboard', level: 'full' },
      { feature: 'operations-dashboard', level: 'full' },
      { feature: 'sales-dashboard', level: 'full' },
      { feature: 'marketing-dashboard', level: 'full' },
      { feature: 'crm-dashboard', level: 'full' },
      // Founder features
      { feature: 'founder-revenue', level: 'full' },
      { feature: 'founder-subscriptions', level: 'full' },
      { feature: 'founder-wallets', level: 'full' },
      { feature: 'founder-growth', level: 'full' },
      { feature: 'founder-properties', level: 'full' },
      { feature: 'founder-bookings', level: 'full' },
      { feature: 'founder-support', level: 'full' },
      { feature: 'founder-staff', level: 'full' },
      { feature: 'founder-overrides', level: 'full' },
      { feature: 'founder-discounts', level: 'full' },
      { feature: 'founder-reports', level: 'full' },
    ],
  },

  customer_support: {
    role: 'customer_support',
    displayName: 'Customer Support',
    description: 'Handle support tickets, chats, and user inquiries',
    defaultDashboard: '/support-dashboard',
    permissions: [
      { feature: 'support-dashboard', level: 'full', description: 'Customer support dashboard' },
      { feature: 'users', level: 'view', description: 'View user profiles to confirm identity' },
      { feature: 'bookings', level: 'view', description: 'View bookings to assist users' },
      { feature: 'kyc', level: 'view', description: 'View KYC status' },
      { feature: 'crm-dashboard', level: 'view', description: 'View CRM data for customer context' },
    ],
  },

  operations: {
    role: 'operations',
    displayName: 'Operations & Admin',
    description: 'Manage subscriptions, finance, and operations',
    defaultDashboard: '/operations-dashboard',
    permissions: [
      { feature: 'operations-dashboard', level: 'full', description: 'Operations dashboard' },
      { feature: 'transactions', level: 'full', description: 'Full subscription and wallet control' },
      { feature: 'listings', level: 'full', description: 'Review and approve listings' },
      { feature: 'bookings', level: 'edit', description: 'Manage bookings' },
      { feature: 'kyc', level: 'edit', description: 'Handle flagged KYC cases' },
      { feature: 'data-management', level: 'view', description: 'View system data' },
      { feature: 'crm-dashboard', level: 'view', description: 'View CRM analytics' },
    ],
  },

  sales: {
    role: 'sales',
    displayName: 'Sales & Partnerships',
    description: 'Onboard hotels, realtors, and agents',
    defaultDashboard: '/sales-dashboard',
    permissions: [
      { feature: 'sales-dashboard', level: 'full', description: 'Sales dashboard' },
      { feature: 'users', level: 'full', description: 'Onboard and manage partners' },
      { feature: 'kyc', level: 'view', description: 'Track KYC completion' },
      { feature: 'blog-posts', level: 'edit', description: 'Create marketing content' },
      { feature: 'crm-dashboard', level: 'full', description: 'Full CRM access for lead and contact management' },
    ],
  },

  marketing: {
    role: 'marketing',
    displayName: 'Marketing & Growth',
    description: 'Track performance and analytics',
    defaultDashboard: '/marketing-dashboard',
    permissions: [
      { feature: 'marketing-dashboard', level: 'full', description: 'Marketing dashboard' },
      { feature: 'users', level: 'view', description: 'View user analytics' },
      { feature: 'bookings', level: 'view', description: 'View booking analytics' },
      { feature: 'kyc', level: 'view', description: 'View verification trends' },
      { feature: 'blog-posts', level: 'full', description: 'Manage marketing content' },
      { feature: 'crm-dashboard', level: 'view', description: 'View CRM analytics and lead metrics' },
    ],
  },

  founder: {
    role: 'founder',
    displayName: 'Founder',
    description: 'Full system access with executive dashboards and override capabilities',
    defaultDashboard: '/dashboard',
    permissions: [
      { feature: 'dashboard', level: 'full', description: 'Main dashboard overview' },
      { feature: 'founder-revenue', level: 'full', description: 'Revenue analytics and insights' },
      { feature: 'founder-subscriptions', level: 'full', description: 'Subscription management and metrics' },
      { feature: 'founder-wallets', level: 'full', description: 'Wallet and transaction analytics' },
      { feature: 'founder-growth', level: 'full', description: 'Growth metrics and trends' },
      { feature: 'founder-properties', level: 'full', description: 'Property analytics and performance' },
      { feature: 'founder-bookings', level: 'full', description: 'Booking analytics and trends' },
      { feature: 'founder-support', level: 'full', description: 'Support metrics and analytics' },
      { feature: 'founder-staff', level: 'full', description: 'Staff management and permissions' },
      { feature: 'founder-overrides', level: 'full', description: 'Override approvals and actions' },
      { feature: 'founder-discounts', level: 'full', description: 'Discount management' },
      { feature: 'founder-reports', level: 'full', description: 'Executive reports and insights' },
      { feature: 'users', level: 'full', description: 'Full user management' },
      { feature: 'blog-posts', level: 'full', description: 'Full content management' },
      { feature: 'listings', level: 'full', description: 'Full listing management' },
      { feature: 'bookings', level: 'full', description: 'Full booking management' },
      { feature: 'transactions', level: 'full', description: 'Full transaction control' },
      { feature: 'kyc', level: 'full', description: 'Full KYC control' },
      { feature: 'data-management', level: 'full', description: 'Full data management' },
      { feature: 'support-dashboard', level: 'full', description: 'Support dashboard access' },
      { feature: 'operations-dashboard', level: 'full', description: 'Operations dashboard access' },
      { feature: 'sales-dashboard', level: 'full', description: 'Sales dashboard access' },
      { feature: 'marketing-dashboard', level: 'full', description: 'Marketing dashboard access' },
      { feature: 'crm-dashboard', level: 'full', description: 'Full CRM dashboard access' },
    ],
  },
};

/**
 * Feature to route path mapping
 */
export const FEATURE_ROUTES: Record<Feature, string> = {
  'dashboard': '/dashboard',
  'support-dashboard': '/support-dashboard',
  'operations-dashboard': '/operations-dashboard',
  'sales-dashboard': '/sales-dashboard',
  'marketing-dashboard': '/marketing-dashboard',
  'crm-dashboard': '/crm-dashboard',
  'users': '/users',
  'blog-posts': '/blog-posts',
  'listings': '/listings',
  'bookings': '/bookings',
  'transactions': '/transactions',
  'kyc': '/kyc',
  'data-management': '/data-management',
  'founder-revenue': '/founder-revenue',
  'founder-subscriptions': '/founder-subscriptions',
  'founder-wallets': '/founder-wallets',
  'founder-growth': '/founder-growth',
  'founder-properties': '/founder-properties',
  'founder-bookings': '/founder-bookings',
  'founder-support': '/founder-support',
  'founder-staff': '/founder/staff',
  'founder-overrides': '/founder/overrides',
  'founder-discounts': '/founder/discounts',
  'founder-reports': '/founder/reports',
};

/**
 * Get route path from feature name
 */
export function getFeatureRoute(feature: Feature): string {
  return FEATURE_ROUTES[feature];
}

/**
 * Get feature name from route path
 */
export function getFeatureFromRoute(path: string): Feature | null {
  // Remove leading/trailing slashes and get first segment
  const cleanPath = path.replace(/^\/|\/$/g, '');
  const feature = Object.entries(FEATURE_ROUTES).find(
    ([_, route]) => route.replace(/^\/|\/$/g, '') === cleanPath
  );
  return feature ? (feature[0] as Feature) : null;
}

/**
 * Check if user has permission to access a feature
 */
export function hasFeaturePermission(
  userRole: UserRole | string,
  feature: Feature,
  requiredLevel: PermissionLevel = 'view'
): boolean {
  const roleConfig = ROLE_PERMISSIONS[userRole as UserRole];
  if (!roleConfig) return false;

  const permission = roleConfig.permissions.find(p => p.feature === feature);
  if (!permission) return false;

  // Permission level hierarchy: full > edit > view > none
  const levels: PermissionLevel[] = ['none', 'view', 'edit', 'full'];
  const userLevelIndex = levels.indexOf(permission.level);
  const requiredLevelIndex = levels.indexOf(requiredLevel);

  return userLevelIndex >= requiredLevelIndex;
}

/**
 * Check if user can access a route path
 */
export function canAccessRoute(userRole: UserRole | string, path: string): boolean {
  const feature = getFeatureFromRoute(path);
  if (!feature) return false;

  return hasFeaturePermission(userRole, feature, 'view');
}

/**
 * Get permission level for a feature
 */
export function getPermissionLevel(
  userRole: UserRole | string,
  feature: Feature
): PermissionLevel {
  const roleConfig = ROLE_PERMISSIONS[userRole as UserRole];
  if (!roleConfig) return 'none';

  const permission = roleConfig.permissions.find(p => p.feature === feature);
  return permission?.level || 'none';
}

/**
 * Get all accessible features for a role
 */
export function getAccessibleFeatures(userRole: UserRole | string): Feature[] {
  const roleConfig = ROLE_PERMISSIONS[userRole as UserRole];
  if (!roleConfig) return [];

  return roleConfig.permissions
    .filter(p => p.level !== 'none')
    .map(p => p.feature);
}

/**
 * Get default dashboard route for a role
 */
export function getDefaultDashboard(userRole: UserRole | string): string {
  const roleConfig = ROLE_PERMISSIONS[userRole as UserRole];
  return roleConfig?.defaultDashboard || '/dashboard';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(userRole: UserRole | string): string {
  const roleConfig = ROLE_PERMISSIONS[userRole as UserRole];
  return roleConfig?.displayName || 'Unknown Role';
}

/**
 * Check if role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return role in ROLE_PERMISSIONS;
}
