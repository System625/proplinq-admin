import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { KycVerification, PaginatedResponse, KycReview } from '@/types/api';
import { toast } from 'sonner';
import { ApiError, getErrorMessage } from '@/lib/api-error-handler';

interface KycState {
  verifications: KycVerification[];
  currentVerification: KycVerification | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  statusCounts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  isLoading: boolean;
  isReviewing: boolean;
  error: string | null;
  statusFilter: string;
  
  // Actions
  fetchVerifications: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchVerification: (id: string) => Promise<void>;
  reviewVerification: (id: string, data: KycReview) => Promise<void>;
  fetchStatusCounts: () => Promise<void>;
  setStatusFilter: (status: string) => void;
  clearError: () => void;
}

export const useKycStore = create<KycState>((set, get) => ({
  verifications: [],
  currentVerification: null,
  pagination: null,
  statusCounts: {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  isLoading: false,
  isReviewing: false,
  error: null,
  statusFilter: 'all',

  fetchVerifications: async (params) => {
    console.log('🔄 KYC Store: Starting fetchVerifications with params:', params);
    set({ isLoading: true, error: null });
    
    try {
      const { statusFilter } = get();
      console.log('🔍 KYC Store: statusFilter:', statusFilter);
      
      // Since backend filtering isn't working, fetch all data and filter on frontend
      const response: PaginatedResponse<KycVerification> = await apiService.getKycVerifications({
        limit: 1000, // Get more data
        ...params,
        // Don't pass status to backend since it's not working
      });
      
      console.log('📡 KYC Store: Full API response:', response);
      
      const responseData = (response as any).data || {};
      const allVerifications = Array.isArray(responseData.data) ? responseData.data : [];
      
      // Filter on frontend based on statusFilter
      let filteredVerifications = allVerifications;
      if (statusFilter && statusFilter !== 'all') {
        filteredVerifications = allVerifications.filter((v: any) => v.status === statusFilter);
        console.log(`🔍 Filtered for ${statusFilter}:`, filteredVerifications.length, 'records');
      }
      
      // Simple pagination on frontend (since backend pagination won't work with our filtering)
      const page = params?.page || 1;
      const limit = params?.limit || 15;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVerifications = filteredVerifications.slice(startIndex, endIndex);
      
      const pagination = {
        page: page,
        limit: limit,
        total: filteredVerifications.length,
        totalPages: Math.ceil(filteredVerifications.length / limit),
      };
      
      console.log('✅ KYC Store: Final verifications array:', paginatedVerifications);
      console.log('📏 KYC Store: Filtered length:', filteredVerifications.length);
      console.log('📄 KYC Store: Paginated length:', paginatedVerifications.length);
      
      set({
        verifications: paginatedVerifications,
        pagination: pagination,
        isLoading: false,
      });
      
      console.log('🎯 KYC Store: State updated successfully');
    } catch (error: any) {
      console.error('❌ KYC Store: Error in fetchVerifications:', error);

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      set({
        verifications: [],
        error: errorMessage,
        isLoading: false,
      });

      if (isAuthError) {
        toast.error(errorMessage, {
          description: 'You may need to log in again',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login',
          },
        });
      } else {
        toast.error(errorMessage);
      }
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
      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      set({
        error: errorMessage,
        isLoading: false,
      });

      if (isAuthError) {
        toast.error(errorMessage, {
          description: 'You may need to log in again',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login',
          },
        });
      } else {
        toast.error(errorMessage);
      }
    }
  },

  reviewVerification: async (id: string, data: KycReview) => {
    set({ isReviewing: true });
    
    try {
      const updatedVerification = await apiService.reviewKycVerification(id, data);
      
      const { verifications } = get();
      const updatedVerifications = verifications.map(verification =>
        verification.id === parseInt(id) ? updatedVerification : verification
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

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      if (isAuthError) {
        toast.error(errorMessage, {
          description: 'You may need to log in again',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login',
          },
        });
      } else {
        toast.error(errorMessage);
      }

      throw error;
    }
  },

  fetchStatusCounts: async () => {
    try {
      console.log('🔄 Fetching status counts from all data...');
      
      // Since backend filtering isn't working, fetch all data and count on frontend
      const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : '';
      const response = await fetch('/api/kyc?limit=1000', { // Get more data to count properly
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const allVerifications = result.data?.data || [];
      
      console.log('📊 All KYC data:', allVerifications);
      
      // Count statuses from the actual data
      const statusCounts = allVerifications.reduce((acc: Record<string, number>, verification: any) => {
        const status = verification.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const counts = {
        all: allVerifications.length,
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
      };

      console.log('📊 Calculated status counts:', counts);

      set({ statusCounts: counts });
    } catch (error) {
      console.error('Failed to fetch status counts:', error);
    }
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  clearError: () => {
    set({ error: null });
  },
}));