import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import {
  ApproveKYCOverrideRequest,
  DeclineKYCOverrideRequest,
  OverrideSubscriptionRequest,
  OverridePaymentRequest,
} from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderOverridesState {
  isLoading: boolean;
  error: string | null;

  approveKyc: (id: string, data: ApproveKYCOverrideRequest) => Promise<void>;
  declineKyc: (id: string, data: DeclineKYCOverrideRequest) => Promise<void>;
  overrideSubscription: (id: string, data: OverrideSubscriptionRequest) => Promise<void>;
  overridePayment: (id: string, data: OverridePaymentRequest) => Promise<void>;
  clearError: () => void;
}

export const useFounderOverridesStore = create<FounderOverridesState>((set) => ({
  isLoading: false,
  error: null,

  approveKyc: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.approveKycOverride(id, data);
      set({ isLoading: false });
      toast.success('KYC approved successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Approve KYC Error: ${errorMessage}`);
      throw error;
    }
  },

  declineKyc: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.declineKycOverride(id, data);
      set({ isLoading: false });
      toast.success('KYC declined successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Decline KYC Error: ${errorMessage}`);
      throw error;
    }
  },

  overrideSubscription: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.overrideSubscription(id, data);
      set({ isLoading: false });
      toast.success('Subscription override applied successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Override Subscription Error: ${errorMessage}`);
      throw error;
    }
  },

  overridePayment: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.overridePayment(id, data);
      set({ isLoading: false });
      toast.success('Payment override applied successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Override Payment Error: ${errorMessage}`);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
