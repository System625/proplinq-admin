import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/lib/axios';
import { getToken, setToken, removeToken, isTokenExpired } from '@/lib/auth';
import { User, ApiUser, LoginCredentials, ApiLoginResponse } from '@/types/api';
import { toast } from 'sonner';

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
        if (token && !isTokenExpired(token)) {
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
      }
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