import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { Listing, PaginatedResponse, ListingReview } from '@/types/api';
import { toast } from 'sonner';
import { ApiError, getErrorMessage } from '@/lib/api-error-handler';

interface ListingsState {
  listings: Listing[];
  currentListing: Listing | null;
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
  typeFilter: string;

  // Actions
  fetchListings: (params?: { page?: number; limit?: number; status?: string; type?: string }) => Promise<void>;
  fetchListing: (id: string) => Promise<void>;
  reviewListing: (id: string, data: ListingReview) => Promise<void>;
  fetchStatusCounts: () => Promise<void>;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  clearError: () => void;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  currentListing: null,
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
  typeFilter: 'all',

  fetchListings: async (params) => {
    console.log('🔄 Listings Store: Starting fetchListings with params:', params);
    set({ isLoading: true, error: null });

    try {
      const { statusFilter, typeFilter } = get();
      console.log('🔍 Listings Store: statusFilter:', statusFilter, 'typeFilter:', typeFilter);

      // Fetch all data and filter on frontend (matching KYC pattern)
      const response: PaginatedResponse<Listing> = await apiService.getListings({
        limit: 1000,
        ...params,
      });

      console.log('📡 Listings Store: Full API response:', response);

      const responseData = (response as any).data || {};
      const allListings = Array.isArray(responseData.data) ? responseData.data : [];

      // Filter on frontend based on statusFilter and typeFilter
      let filteredListings = allListings;
      if (statusFilter && statusFilter !== 'all') {
        filteredListings = filteredListings.filter((l: any) => l.status === statusFilter);
        console.log(`🔍 Filtered for ${statusFilter}:`, filteredListings.length, 'records');
      }
      if (typeFilter && typeFilter !== 'all') {
        filteredListings = filteredListings.filter((l: any) => l.type === typeFilter);
        console.log(`🔍 Filtered for ${typeFilter}:`, filteredListings.length, 'records');
      }

      // Simple pagination on frontend
      const page = params?.page || 1;
      const limit = params?.limit || 15;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedListings = filteredListings.slice(startIndex, endIndex);

      const pagination = {
        page: page,
        limit: limit,
        total: filteredListings.length,
        totalPages: Math.ceil(filteredListings.length / limit),
      };

      console.log('✅ Listings Store: Final listings array:', paginatedListings);
      console.log('📏 Listings Store: Filtered length:', filteredListings.length);
      console.log('📄 Listings Store: Paginated length:', paginatedListings.length);

      set({
        listings: paginatedListings,
        pagination: pagination,
        isLoading: false,
      });

      console.log('🎯 Listings Store: State updated successfully');
    } catch (error: any) {
      console.error('❌ Listings Store: Error in fetchListings:', error);

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      set({
        listings: [],
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

  fetchListing: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const listing = await apiService.getListing(id);
      set({
        currentListing: listing,
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

  reviewListing: async (id: string, data: ListingReview) => {
    set({ isReviewing: true });

    try {
      const updatedListing = await apiService.reviewListing(id, data);

      const { listings } = get();
      const updatedListings = listings.map(listing =>
        listing.id === parseInt(id) ? updatedListing : listing
      );

      set({
        listings: updatedListings,
        currentListing: updatedListing,
        isReviewing: false,
      });

      const action = data.action === 'approve' ? 'approved' : 'rejected';
      toast.success(`Listing ${action} successfully`);
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

      const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : '';
      const response = await fetch('/api/listings?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const allListings = result.data?.data || [];

      console.log('📊 All Listings data:', allListings);

      // Count statuses from the actual data
      const statusCounts = allListings.reduce((acc: Record<string, number>, listing: any) => {
        const status = listing.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const counts = {
        all: allListings.length,
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

  setTypeFilter: (type: string) => {
    set({ typeFilter: type });
  },

  clearError: () => {
    set({ error: null });
  },
}));
