import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { DashboardStats } from '@/types/api';
import { toast } from 'sonner';
import { ApiError, getErrorMessage } from '@/lib/api-error-handler';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  setStats: (stats: DashboardStats) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Fetching dashboard stats...'); // Debug log
      const stats = await apiService.getDashboardStats();
      console.log('Dashboard stats received:', stats); // Debug log
      set({ 
        stats, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Dashboard stats fetch error:', error); // Debug log

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      set({
        error: errorMessage,
        isLoading: false
      });

      if (isAuthError) {
        toast.error(errorMessage, {
          description: 'You may need to log in again',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login',
          },
        });
      } else {
        toast.error(`Dashboard Error: ${errorMessage}`);
      }
    }
  },

  refreshStats: async () => {
    await get().fetchStats();
    toast.success('Dashboard stats refreshed');
  },

  setStats: (stats: DashboardStats) => {
    set({ stats, isLoading: false, error: null });
  },
}));