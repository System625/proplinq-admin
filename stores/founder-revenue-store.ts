import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { RevenueDashboard } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderRevenueState {
  dashboard: RevenueDashboard | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useFounderRevenueStore = create<FounderRevenueState>((set, get) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getFounderRevenueDashboard();

      // Additional safety check
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid dashboard data received');
      }

      set({ dashboard: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      // Keep previous dashboard data instead of clearing it
      toast.error(`Revenue Dashboard Error: ${errorMessage}`, {
        action: {
          label: 'Retry',
          onClick: () => get().fetchDashboard(),
        },
      });
    }
  },

  refreshDashboard: async () => {
    await get().fetchDashboard();
    toast.success('Revenue dashboard refreshed');
  },

  clearError: () => set({ error: null }),
}));
