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
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const stats = await apiService.getDashboardStats();
      set({ 
        stats, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard stats';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      toast.error(errorMessage);
    }
  },

  refreshStats: async () => {
    await get().fetchStats();
    toast.success('Dashboard stats refreshed');
  },
}));