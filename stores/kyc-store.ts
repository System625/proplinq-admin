import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { KycVerification, PaginatedResponse, KycReview } from '@/types/api';
import { toast } from 'sonner';

interface KycState {
  verifications: KycVerification[];
  currentVerification: KycVerification | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isReviewing: boolean;
  error: string | null;
  statusFilter: string;
  
  // Actions
  fetchVerifications: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchVerification: (id: string) => Promise<void>;
  reviewVerification: (id: string, data: KycReview) => Promise<void>;
  setStatusFilter: (status: string) => void;
  clearError: () => void;
}

export const useKycStore = create<KycState>((set, get) => ({
  verifications: [],
  currentVerification: null,
  pagination: null,
  isLoading: false,
  isReviewing: false,
  error: null,
  statusFilter: 'all',

  fetchVerifications: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const { statusFilter } = get();
      const response: PaginatedResponse<KycVerification> = await apiService.getKycVerifications({
        status: statusFilter,
        ...params,
      });
      
      set({
        verifications: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch KYC verifications';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchVerification: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const verification = await apiService.getKycVerification(id);
      set({
        currentVerification: verification,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch KYC verification details';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  reviewVerification: async (id: string, data: KycReview) => {
    set({ isReviewing: true });
    
    try {
      const updatedVerification = await apiService.reviewKycVerification(id, data);
      
      const { verifications } = get();
      const updatedVerifications = verifications.map(verification =>
        verification.id === id ? updatedVerification : verification
      );
      
      set({
        verifications: updatedVerifications,
        currentVerification: updatedVerification,
        isReviewing: false,
      });
      
      const action = data.action === 'approve' ? 'approved' : 'rejected';
      toast.success(`KYC verification ${action} successfully`);
    } catch (error: any) {
      set({ isReviewing: false });
      
      const errorMessage = error.response?.data?.message || 'Failed to review KYC verification';
      toast.error(errorMessage);
      throw error;
    }
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  clearError: () => {
    set({ error: null });
  },
}));