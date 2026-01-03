import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';
import {
  SalesDashboard,
  OnboardingRequest,
  Partner,
} from '@/types/api';

interface SalesDashboardState {
  // Data
  dashboard: SalesDashboard | null;
  onboardingRequests: OnboardingRequest[];
  partners: Partner[];

  // Pagination
  onboardingPagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  } | null;
  partnersPagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  } | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useSalesDashboardStore = create<SalesDashboardState>((set, get) => ({
  dashboard: null,
  onboardingRequests: [],
  partners: [],
  onboardingPagination: null,
  partnersPagination: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    console.log('🔄 Sales Dashboard Store: Starting fetch');
    set({ isLoading: true, error: null });

    try {
      // Fetch all endpoints with partial failure handling (Marketing Dashboard pattern)
      const results = await Promise.allSettled([
        apiService.getSalesDashboard(),
        apiService.listOnboarding({ per_page: 15, status: 'pending' }),
        apiService.listPartners({ per_page: 10, status: 'active' })
      ]);

      console.log('📡 Sales Dashboard Store: Fetch results', results);

      // Extract data or null for failed endpoints
      const dashboardData = results[0].status === 'fulfilled' ? results[0].value : null;
      const onboardingData = results[1].status === 'fulfilled' ? results[1].value : null;
      const partnersData = results[2].status === 'fulfilled' ? results[2].value : null;

      // Show individual errors for failed endpoints
      if (results[0].status === 'rejected') {
        console.error('❌ Dashboard stats error:', results[0].reason);
        toast.error('Failed to load dashboard statistics');
      }
      if (results[1].status === 'rejected') {
        console.error('❌ Onboarding data error:', results[1].reason);
        toast.error('Failed to load onboarding pipeline');
      }
      if (results[2].status === 'rejected') {
        console.error('❌ Partners data error:', results[2].reason);
        toast.error('Failed to load partner data');
      }

      // Update state with available data (allow partial success)
      set({
        dashboard: dashboardData,
        onboardingRequests: onboardingData?.data || [],
        partners: partnersData?.data || [],
        onboardingPagination: onboardingData ? {
          currentPage: onboardingData.current_page,
          perPage: onboardingData.per_page,
          total: onboardingData.total,
          lastPage: onboardingData.last_page,
        } : null,
        partnersPagination: partnersData ? {
          currentPage: partnersData.current_page,
          perPage: partnersData.per_page,
          total: partnersData.total,
          lastPage: partnersData.last_page,
        } : null,
        isLoading: false,
      });

      console.log('✅ Sales Dashboard Store: Fetch completed successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error('❌ Sales Dashboard Store: Fatal error', error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Sales Dashboard Error: ${errorMessage}`);
    }
  },

  refreshDashboard: async () => {
    await get().fetchDashboardData();
    toast.success('Dashboard refreshed');
  },

  clearError: () => set({ error: null }),
}));
