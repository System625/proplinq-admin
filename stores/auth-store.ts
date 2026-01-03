import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/lib/axios';
import { getToken, setToken, removeToken, isTokenExpired } from '@/lib/auth';
import { User, ApiUser, LoginCredentials, ApiLoginResponse } from '@/types/api';
import { toast } from 'sonner';
import {
  UserRole,
  Feature,
  PermissionLevel,
  hasFeaturePermission,
  canAccessRoute,
  getPermissionLevel,
  getAccessibleFeatures,
  getDefaultDashboard,
  getRoleDisplayName,
  isValidRole,
} from '@/types/rbac';
import { getMockUser, generateMockToken, isMockToken } from '@/lib/mock-users';

interface AuthState {
  user: User | ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  setUser: (user: User | ApiUser) => void;
  initAuth: () => void;
  clearAllAuth: () => void;

  // RBAC methods
  getUserRole: () => UserRole | null;
  hasPermission: (feature: Feature, requiredLevel?: PermissionLevel) => boolean;
  canAccess: (path: string) => boolean;
  getPermission: (feature: Feature) => PermissionLevel;
  getAccessibleFeatures: () => Feature[];
  getDefaultDashboard: () => string;
  getRoleDisplayName: () => string;

  // Dev/testing methods
  mockSetRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          // Check if this is a mock user first (for RBAC testing)
          const mockUser = getMockUser(credentials.email, credentials.password);

          if (mockUser) {
            // Mock user login - no API call
            const mockToken = generateMockToken(mockUser);

            setToken(mockToken);
            set({
              user: mockUser,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
            });

            const firstName = mockUser.full_name?.split(' ')[0] || 'User';
            toast.success(`Welcome back, ${firstName}! (Test Account)`);
            return;
          }

          // Not a mock user - proceed with real API login
          const response = await apiService.login(credentials);
          console.log('Login response:', response); // Debug log

          // Handle the actual API response structure
          const token = response.data.token;
          const user = response.data.user;

          console.log('Extracted token:', token); // Debug log
          console.log('Extracted user:', user); // Debug log

          if (!token) {
            throw new Error('No token received from server');
          }

          setToken(token);
          set({
            user: user || null,
            token,
            isAuthenticated: true,
            isLoading: false
          });

          // Safe access to user properties - API returns full_name, not firstName
          const firstName = user.full_name?.split(' ')[0] || 'User';
          toast.success(`Welcome back, ${firstName}!`);
        } catch (error: any) {
          console.error('Login error:', error); // Debug log
          set({ isLoading: false });
          toast.error(error.message || 'Login failed. Please try again.');
          throw error;
        }
      },

      logout: () => {
        removeToken();
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        
        // Clear persisted storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('proplinq-auth-storage');
        }
        
        toast.success('Successfully logged out');
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      checkAuth: () => {
        try {
          const token = getToken();
          console.log('Checking auth - token:', token); // Debug log

          if (!token) {
            console.log('No token found - clearing auth state'); // Debug log
            // Clear state without showing toast (silent logout)
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
            removeToken();
            return false;
          }

          // Mock tokens don't expire (for testing)
          if (isMockToken(token)) {
            console.log('Mock token detected - skipping expiry check'); // Debug log
            set({
              token,
              isAuthenticated: true
            });
            return true;
          }

          const isExpired = isTokenExpired(token);
          console.log('Token expired check:', isExpired); // Debug log

          if (isExpired) {
            console.log('Token is expired - logging out'); // Debug log
            toast.error('Your session has expired. Please log in again.');
            get().logout();
            return false;
          }

          console.log('Auth check passed - setting authenticated state'); // Debug log
          set({
            token,
            isAuthenticated: true
          });
          return true;
        } catch (error) {
          console.error('Auth check error:', error);
          // Clear state on error
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
          removeToken();
          return false;
        }
      },

      setUser: (user: User | ApiUser) => {
        set({ user });
      },

      initAuth: () => {
        const token = getToken();

        // Mock tokens don't expire
        if (token && (isMockToken(token) || !isTokenExpired(token))) {
          set({
            token,
            isAuthenticated: true
          });
        } else {
          // Clear any invalid stored state
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
          removeToken();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('proplinq-auth-storage');
          }
        }
      },

      clearAllAuth: () => {
        // Force clear all authentication data
        removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });

        if (typeof window !== 'undefined') {
          localStorage.removeItem('proplinq-auth-storage');
          localStorage.removeItem('proplinq_admin_token');
        }

        console.log('All authentication data cleared');
      },

      // RBAC methods
      getUserRole: () => {
        const { user } = get();
        if (!user) return null;

        // Type guard to check if user has role property
        const userRole = (user as ApiUser).role;

        // Map backend roles to frontend RBAC roles
        if (userRole) {
          // Map super_admin/superadmin to founder role
          if (userRole.toLowerCase() === 'super_admin' || userRole.toLowerCase() === 'superadmin') {
            console.log('Mapping super admin role to founder');
            return 'founder';
          }

          // Validate and return role if it exists in RBAC
          if (isValidRole(userRole)) {
            return userRole as UserRole;
          }
        }

        // Default to admin for backward compatibility
        return 'admin';
      },

      hasPermission: (feature: Feature, requiredLevel: PermissionLevel = 'view') => {
        const userRole = get().getUserRole();
        if (!userRole) return false;

        return hasFeaturePermission(userRole, feature, requiredLevel);
      },

      canAccess: (path: string) => {
        const userRole = get().getUserRole();
        if (!userRole) return false;

        return canAccessRoute(userRole, path);
      },

      getPermission: (feature: Feature) => {
        const userRole = get().getUserRole();
        if (!userRole) return 'none';

        return getPermissionLevel(userRole, feature);
      },

      getAccessibleFeatures: () => {
        const userRole = get().getUserRole();
        if (!userRole) return [];

        return getAccessibleFeatures(userRole);
      },

      getDefaultDashboard: () => {
        const userRole = get().getUserRole();
        if (!userRole) return '/dashboard';

        return getDefaultDashboard(userRole);
      },

      getRoleDisplayName: () => {
        const userRole = get().getUserRole();
        if (!userRole) return 'Unknown';

        return getRoleDisplayName(userRole);
      },

      // Dev/testing method to switch roles without re-login
      mockSetRole: (role: UserRole) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              role,
            } as ApiUser,
          });
          toast.success(`Role switched to ${getRoleDisplayName(role)}`);
        }
      },
    }),
    {
      name: 'proplinq-auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);