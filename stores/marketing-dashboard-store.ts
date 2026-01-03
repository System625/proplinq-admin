import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';
import { getDateDaysAgo, getTodayDate, formatDuration } from '@/lib/date-utils';
import {
  MarketingDashboardStats,
  MockAnalytics,
  ChartDataPoint,
} from '@/lib/mock-data';
import { ListingsAnalytics } from '@/types/api';

// UI-specific interface for transformed listings data
interface TransformedListingsData {
  total_listings: number;
  active_listings: number;
  new_listings: number;
  by_type: {
    hotel: number;
    shortlet: number;
    apartment: number;
  };
  by_location: Array<{
    city: string;
    count: number;
  }>;
}

interface MarketingDashboardState {
  stats: MarketingDashboardStats | null;
  analyticsData: MockAnalytics[];
  listingsData: TransformedListingsData | null;
  funnelData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshAnalytics: () => void;
  refreshListings: () => void;
  clearError: () => void;
}

export const useMarketingDashboardStore = create<MarketingDashboardState>((set, get) => ({
  stats: null,
  analyticsData: [],
  listingsData: null,
  funnelData: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      // Fetch endpoints with individual error handling
      const results = await Promise.allSettled([
        apiService.getMarketingTrafficAnalytics({
          start_date: getDateDaysAgo(30),
          end_date: getTodayDate()
        }),
        apiService.getMarketingLeadConversion({
          start_date: getDateDaysAgo(30),
          end_date: getTodayDate()
        }),
        apiService.getMarketingListingsAnalytics()
      ]);

      const trafficData = results[0].status === 'fulfilled' ? results[0].value : null;
      const leadConversionData = results[1].status === 'fulfilled' ? results[1].value : null;
      const listingsData = results[2].status === 'fulfilled' ? results[2].value : null;

      // Show errors for failed endpoints
      if (results[0].status === 'rejected') {
        console.error('Traffic analytics error:', results[0].reason);
        toast.error('Failed to load traffic analytics');
      }
      if (results[1].status === 'rejected') {
        console.error('Lead conversion error:', results[1].reason);
        toast.error('Failed to load lead conversion data');
      }
      if (results[2].status === 'rejected') {
        console.error('Listings analytics error:', results[2].reason);
        toast.error('Failed to load listings analytics');
      }

      // Transform traffic data to stats format (if available)
      // Allow partial stats - show what we can even if some endpoints fail
      let stats: MarketingDashboardStats | null = null;
      if (trafficData || leadConversionData || listingsData) {
        // Calculate total visitors from web and app users
        const totalWebUsers = trafficData?.web_users?.total || 0;
        const totalAppUsers = trafficData?.app_users?.total || 0;
        const totalVisitors = totalWebUsers + totalAppUsers;

        // Get most viewed listing title
        const topListing = listingsData?.most_viewed?.[0]?.title || 'N/A';

        stats = {
          totalVisitors,
          totalPageViews: 0, // Not available in current API structure
          conversionRate: leadConversionData?.conversion_rate || 0,
          avgSessionDuration: '0m 0s', // Not available in current API structure
          bounceRate: 0, // Not available in current API structure
          topPerformingListing: topListing,
          totalLeads: leadConversionData?.funnel?.leads || 0,
          qualifiedLeads: leadConversionData?.funnel?.confirmed || 0
        };
      }

      // Transform trend data for chart (if available)
      // Combine web and app daily data
      const webDaily = trafficData?.web_users?.daily || [];
      const appDaily = trafficData?.app_users?.daily || [];

      const analyticsData = webDaily.length > 0 ? webDaily.map((webDay: any, index: number) => {
        const appDay = appDaily[index] || { count: 0 };
        return {
          date: webDay.date,
          visitors: (webDay.count || 0) + (appDay.count || 0),
          conversions: 0,
          revenue: 0
        };
      }) : [];

      // Transform funnel data (if available)
      const funnelData = leadConversionData?.funnel ? [
        { name: 'Leads', value: leadConversionData.funnel.leads || 0 },
        { name: 'Contacted', value: leadConversionData.funnel.contacted || 0 },
        { name: 'Confirmed', value: leadConversionData.funnel.confirmed || 0 }
      ] : [];

      // Transform listings data to match expected interface
      const transformedListingsData = listingsData ? {
        total_listings: listingsData.engagement_metrics?.total_properties || 0,
        active_listings: listingsData.engagement_metrics?.active_properties || 0,
        new_listings: 0, // Not available in current API
        by_type: {
          hotel: listingsData.most_viewed?.filter((l: any) => l.type === 'hotel').length || 0,
          shortlet: listingsData.most_viewed?.filter((l: any) => l.type === 'shortlet').length || 0,
          apartment: listingsData.most_viewed?.filter((l: any) => l.type === 'apartment').length || 0
        },
        by_location: [] // Not available in current API structure
      } : null;

      set({
        stats,
        analyticsData,
        listingsData: transformedListingsData,
        funnelData,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Marketing Dashboard Error: ${errorMessage}`);
    }
  },

  refreshAnalytics: () => {
    // Re-fetch all dashboard data
    get().fetchDashboardData();
  },

  refreshListings: () => {
    // Re-fetch all dashboard data
    get().fetchDashboardData();
  },

  clearError: () => {
    set({ error: null });
  },
}));
