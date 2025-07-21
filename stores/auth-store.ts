import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/lib/axios';
import { getToken, setToken, removeToken, isTokenExpired } from '@/lib/auth';
import { User, LoginCredentials, LoginResponse } from '@/types/api';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  setUser: (user: User) => void;
  initAuth: () => void;
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
          const { token, user } = await apiService.login(credentials);
          
          setToken(token);
          set({ 
            user, 
            token, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          toast.success(`Welcome back, ${user.firstName}!`);
        } catch (error: any) {
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
        toast.success('Successfully logged out');
      },

      checkAuth: () => {
        const token = getToken();
        
        if (!token) {
          get().logout();
          return false;
        }

        if (isTokenExpired(token)) {
          toast.error('Your session has expired. Please log in again.');
          get().logout();
          return false;
        }

        set({ 
          token, 
          isAuthenticated: true 
        });
        return true;
      },

      setUser: (user: User) => {
        set({ user });
      },

      initAuth: () => {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
          set({ 
            token, 
            isAuthenticated: true 
          });
        }
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