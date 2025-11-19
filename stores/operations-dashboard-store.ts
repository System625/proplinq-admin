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
  // Separate search state for each table
  subscriptionSearchQuery: string;
  transactionSearchQuery: string;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshSubscriptions: () => void;
  refreshTransactions: () => void;
  clearError: () => void;
  setSubscriptionSearchQuery: (query: string) => void;
  setTransactionSearchQuery: (query: string) => void;
  getFilteredSubscriptions: () => MockSubscription[];
  getFilteredTransactions: () => MockWalletTransaction[];
}

export const useOperationsDashboardStore = create<OperationsDashboardState>((set, get) => ({
  stats: null,
  subscriptions: [],
  transactions: [],
  revenueChart: [],
  isLoading: false,
  error: null,
  subscriptionSearchQuery: '',
  transactionSearchQuery: '',

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

  setSubscriptionSearchQuery: (query: string) => {
    set({ subscriptionSearchQuery: query });
  },

  setTransactionSearchQuery: (query: string) => {
    set({ transactionSearchQuery: query });
  },

  getFilteredSubscriptions: () => {
    const state = get();
    if (!state.subscriptionSearchQuery) return state.subscriptions;

    const query = state.subscriptionSearchQuery.toLowerCase();
    return state.subscriptions.filter(
      (sub) =>
        sub.id.toLowerCase().includes(query) ||
        sub.partner.toLowerCase().includes(query) ||
        sub.plan.toLowerCase().includes(query)
    );
  },

  getFilteredTransactions: () => {
    const state = get();
    if (!state.transactionSearchQuery) return state.transactions;

    const query = state.transactionSearchQuery.toLowerCase();
    return state.transactions.filter(
      (tx) =>
        tx.id.toLowerCase().includes(query) ||
        tx.user.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query)
    );
  },
}));
