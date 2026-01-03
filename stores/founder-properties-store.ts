import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { PropertiesDashboard } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderPropertiesState {
  dashboard: PropertiesDashboard | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useFounderPropertiesStore = create<FounderPropertiesState>((set, get) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getFounderPropertiesDashboard();
      set({ dashboard: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Properties Dashboard Error: ${errorMessage}`);
    }
  },

  refreshDashboard: async () => {
    await get().fetchDashboard();
    toast.success('Properties dashboard refreshed');
  },

  clearError: () => set({ error: null }),
}));
