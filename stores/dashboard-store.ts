import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { DashboardStats } from '@/types/api';
import { ApiError, getErrorMessage } from '@/lib/api-error-handler';
import { handleGlobalError } from '@/lib/error-handler';

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
      console.log('Fetching dashboard stats...');
      const stats = await apiService.getDashboardStats();
      console.log('Dashboard stats received:', stats);
      set({
        stats,
        isLoading: false
      });
    } catch (error: any) {
      console.error('Dashboard stats fetch error:', error);

      const errorMessage = getErrorMessage(error);

      set({
        error: errorMessage,
        isLoading: false
      });

      // Use centralized error handler
      handleGlobalError(error, {
        onAuthError: () => {
          // Clear auth data and redirect
          if (typeof window !== 'undefined') {
            localStorage.removeItem('proplinq_admin_token');
            localStorage.removeItem('proplinq_admin_user');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
        },
      });
    }
  },

  refreshStats: async () => {
    await get().fetchStats();
  },

  setStats: (stats: DashboardStats) => {
    set({ stats, isLoading: false, error: null });
  },
}));