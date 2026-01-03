import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { ExecutiveReport } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderReportsState {
  executiveReport: ExecutiveReport | null;
  isLoading: boolean;
  error: string | null;

  fetchExecutiveReport: (params: {
    format: string;
    date_from: string;
    date_to: string;
    include_metrics: string[];
  }) => Promise<void>;
  clearError: () => void;
}

export const useFounderReportsStore = create<FounderReportsState>((set) => ({
  executiveReport: null,
  isLoading: false,
  error: null,

  fetchExecutiveReport: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getFounderExecutiveReport(params);
      set({ executiveReport: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Executive Report Error: ${errorMessage}`);
    }
  },

  clearError: () => set({ error: null }),
}));
