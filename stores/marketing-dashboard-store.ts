import { create } from 'zustand';
import {
  MarketingDashboardStats,
  MockAnalytics,
  MockListingPerformance,
  generateMarketingStats,
  generateMockAnalytics,
  generateMockListingPerformance,
  generateConversionFunnelData,
  ChartDataPoint,
} from '@/lib/mock-data';

interface MarketingDashboardState {
  stats: MarketingDashboardStats | null;
  analyticsData: MockAnalytics[];
  listingPerformance: MockListingPerformance[];
  funnelData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshAnalytics: () => void;
  refreshListings: () => void;
  clearError: () => void;
}

export const useMarketingDashboardStore = create<MarketingDashboardState>((set) => ({
  stats: null,
  analyticsData: [],
  listingPerformance: [],
  funnelData: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const stats = generateMarketingStats();
      const analyticsData = generateMockAnalytics(30);
      const listingPerformance = generateMockListingPerformance(15);
      const funnelData = generateConversionFunnelData();

      set({
        stats,
        analyticsData,
        listingPerformance,
        funnelData,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },

  refreshAnalytics: () => {
    const analyticsData = generateMockAnalytics(30);
    set({ analyticsData });
  },

  refreshListings: () => {
    const listingPerformance = generateMockListingPerformance(15);
    set({ listingPerformance });
  },

  clearError: () => {
    set({ error: null });
  },
}));
