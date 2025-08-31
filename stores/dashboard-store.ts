import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { DashboardStats } from '@/types/api';
import { toast } from 'sonner';

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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard stats';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(`Dashboard Error: ${errorMessage}`);
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