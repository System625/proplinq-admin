import { create } from 'zustand';
import { founderApiService } from '@/lib/api';
import { FounderSupportDashboard } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderSupportState {
  dashboard: FounderSupportDashboard | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useFounderSupportStore = create<FounderSupportState>((set, get) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await founderApiService.getFounderSupportDashboard();
      set({ dashboard: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Support Dashboard Error: ${errorMessage}`);
    }
  },

  refreshDashboard: async () => {
    await get().fetchDashboard();
    toast.success('Support dashboard refreshed');
  },

  clearError: () => set({ error: null }),
}));
