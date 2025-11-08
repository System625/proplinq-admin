import { create } from 'zustand';
import {
  OperationsDashboardStats,
  MockSubscription,
  MockWalletTransaction,
  generateOperationsStats,
  generateMockSubscriptions,
  generateMockWalletTransactions,
  generateRevenueChartData,
  ChartDataPoint,
} from '@/lib/mock-data';

interface OperationsDashboardState {
  stats: OperationsDashboardStats | null;
  subscriptions: MockSubscription[];
  transactions: MockWalletTransaction[];
  revenueChart: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshSubscriptions: () => void;
  refreshTransactions: () => void;
  clearError: () => void;
}

export const useOperationsDashboardStore = create<OperationsDashboardState>((set) => ({
  stats: null,
  subscriptions: [],
  transactions: [],
  revenueChart: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const stats = generateOperationsStats();
      const subscriptions = generateMockSubscriptions(20);
      const transactions = generateMockWalletTransactions(15);
      const revenueChart = generateRevenueChartData();

      set({
        stats,
        subscriptions,
        transactions,
        revenueChart,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },

  refreshSubscriptions: () => {
    const subscriptions = generateMockSubscriptions(20);
    set({ subscriptions });
  },

  refreshTransactions: () => {
    const transactions = generateMockWalletTransactions(15);
    set({ transactions });
  },

  clearError: () => {
    set({ error: null });
  },
}));
