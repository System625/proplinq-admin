import { create } from 'zustand';
import { founderApiService } from '@/lib/api';
import { SubscriptionsDashboard } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderSubscriptionsState {
  dashboard: SubscriptionsDashboard | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useFounderSubscriptionsStore = create<FounderSubscriptionsState>((set, get) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await founderApiService.getFounderSubscriptionsDashboard();
      set({ dashboard: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Subscriptions Dashboard Error: ${errorMessage}`);
    }
  },

  refreshDashboard: async () => {
    await get().fetchDashboard();
    toast.success('Subscriptions dashboard refreshed');
  },

  clearError: () => set({ error: null }),
}));
