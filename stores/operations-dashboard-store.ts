import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';
import { getTodayDate, getDateDaysAgo } from '@/lib/date-utils';
import {
  OperationsDashboard,
  OperationsSubscription,
  OperationsWalletTransaction,
  SubscriptionQueryParams,
  WalletTransactionQueryParams,
} from '@/types/api';

// UI-compatible mapped types
interface MappedSubscription {
  id: string;
  partner: string;
  plan: string;
  mrr: number;
  status: string;
  next_billing: string;
}

interface MappedTransaction {
  id: string;
  user: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  created_at: string;
}

interface UIStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  cancelledThisMonth: number;
  listings?: {
    active: number;
    pending: number;
    rejected: number;
  };
  kycOverview?: {
    pendingKyc: number;
    approvedToday: number;
    totalVerified: number;
  };
  bookings?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    allTime: number;
  };
  ticketsSummary?: {
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    resolvedToday: number;
    avgResolutionTime: number;
  };
  totalRevenue: number;
  monthlyRevenue: number;
  walletBalance: number;
  pendingPayouts: number;
  salesMetrics?: {
    subscriptionSales: Array<{ month: string; amount: number }>;
    newAgentsThisWeek: number;
    newAgentsThisMonth: number;
    newPropertiesOnboarded: number;
    bigAccountsClosed: {
      week: number;
      month: number;
      quarter: number;
      hotels: number;
      servicedApartments: number;
      estates: number;
    };
    dealsInPipeline: number;
    revenueFromCommissions: number;
    subscriptionRevenue: number;
    agentActivityScore: number;
    agentEngagementRate: number;
  };
}

interface OperationsDashboardState {
  // Data
  dashboard: OperationsDashboard | null;
  stats: UIStats | null;
  subscriptions: MappedSubscription[];
  transactions: MappedTransaction[];
  revenueChart: Array<{ name: string; revenue: number }>;

  // Pagination
  subscriptionsPagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  } | null;
  transactionsPagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  } | null;

  // Search/Filter
  subscriptionSearchQuery: string;
  transactionSearchQuery: string;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  setSubscriptionSearchQuery: (query: string) => void;
  setTransactionSearchQuery: (query: string) => void;
  getFilteredSubscriptions: () => MappedSubscription[];
  getFilteredTransactions: () => MappedTransaction[];
  clearError: () => void;
}

export const useOperationsDashboardStore = create<OperationsDashboardState>((set, get) => ({
  dashboard: null,
  stats: null,
  subscriptions: [],
  transactions: [],
  revenueChart: [],
  subscriptionsPagination: null,
  transactionsPagination: null,
  subscriptionSearchQuery: '',
  transactionSearchQuery: '',
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      // Concurrent requests with partial failure handling
      const results = await Promise.allSettled([
        apiService.getOperationsDashboard(),
        apiService.listOperationsSubscriptions({ per_page: 15 }),
        apiService.listOperationsWalletTransactions({ per_page: 15 }),
        apiService.getOperationsRevenueReport({
          start_date: getDateDaysAgo(30),
          end_date: getTodayDate(),
          group_by: 'day',
        }),
      ]);

      // Extract data or null
      const dashboardData = results[0].status === 'fulfilled' ? results[0].value : null;
      const subscriptionsData = results[1].status === 'fulfilled' ? results[1].value : null;
      const transactionsData = results[2].status === 'fulfilled' ? results[2].value : null;
      const revenueData = results[3].status === 'fulfilled' ? results[3].value : null;

      // Individual error toasts
      if (results[0].status === 'rejected') {
        toast.error('Failed to load dashboard statistics');
      }
      if (results[1].status === 'rejected') {
        toast.error('Failed to load subscriptions');
      }
      if (results[2].status === 'rejected') {
        toast.error('Failed to load transactions');
      }
      if (results[3].status === 'rejected') {
        toast.error('Failed to load revenue chart');
      }

      // Map dashboard data to UI stats format
      const stats: UIStats | null = dashboardData
        ? {
            totalSubscriptions: dashboardData.active_subscriptions,
            activeSubscriptions: dashboardData.active_subscriptions,
            pendingSubscriptions: 0, // Not provided by API
            cancelledThisMonth: 0, // Not provided by API
            kycOverview: {
              pendingKyc: dashboardData.pending_kyc,
              approvedToday: 0, // Not provided by API
              totalVerified: dashboardData.flagged_kyc,
            },
            ticketsSummary: {
              openTickets: 0,
              inProgressTickets: 0,
              resolvedTickets: 0,
              resolvedToday: 0,
              avgResolutionTime: 0,
            },
            totalRevenue: dashboardData.total_revenue,
            monthlyRevenue: dashboardData.monthly_revenue,
            walletBalance: dashboardData.total_wallet_balance,
            pendingPayouts: dashboardData.pending_reconciliations,
            salesMetrics: {
              subscriptionSales: [],
              newAgentsThisWeek: 0,
              newAgentsThisMonth: 0,
              newPropertiesOnboarded: 0,
              bigAccountsClosed: {
                week: 0,
                month: 0,
                quarter: 0,
                hotels: 0,
                servicedApartments: 0,
                estates: 0,
              },
              dealsInPipeline: 0,
              revenueFromCommissions: 0,
              subscriptionRevenue: dashboardData.total_revenue,
              agentActivityScore: 0,
              agentEngagementRate: 0,
            },
          }
        : null;

      // Map subscriptions to UI format
      const mappedSubscriptions: MappedSubscription[] = (subscriptionsData?.data || []).map((sub: OperationsSubscription) => ({
        id: String(sub.id),
        partner: sub.user?.full_name || sub.user?.email || 'Unknown',
        plan: sub.plan,
        mrr: sub.amount,
        status: sub.status,
        next_billing: sub.next_billing_date || sub.end_date,
      }));

      // Map transactions to UI format
      const mappedTransactions: MappedTransaction[] = (transactionsData?.data || []).map((tx: OperationsWalletTransaction) => ({
        id: String(tx.id),
        user: tx.user?.full_name || tx.user?.email || 'Unknown',
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        date: tx.created_at,
        created_at: tx.created_at,
      }));

      // Map revenue chart data to UI format
      const mappedRevenueChart = (revenueData?.revenue_by_period || []).map((item: { period: string; revenue: number }) => ({
        name: item.period,
        revenue: item.revenue,
      }));

      // Update state (allow partial success)
      set({
        dashboard: dashboardData,
        stats,
        subscriptions: mappedSubscriptions,
        transactions: mappedTransactions,
        revenueChart: mappedRevenueChart,
        subscriptionsPagination: subscriptionsData
          ? {
              currentPage: subscriptionsData.current_page,
              perPage: subscriptionsData.per_page,
              total: subscriptionsData.total,
              lastPage: subscriptionsData.last_page,
            }
          : null,
        transactionsPagination: transactionsData
          ? {
              currentPage: transactionsData.current_page,
              perPage: transactionsData.per_page,
              total: transactionsData.total,
              lastPage: transactionsData.last_page,
            }
          : null,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Operations Dashboard Error: ${errorMessage}`);
    }
  },

  refreshSubscriptions: async () => {
    try {
      const data = await apiService.listOperationsSubscriptions({ per_page: 15 });
      const mappedSubscriptions: MappedSubscription[] = data.data.map((sub: OperationsSubscription) => ({
        id: String(sub.id),
        partner: sub.user?.full_name || sub.user?.email || 'Unknown',
        plan: sub.plan,
        mrr: sub.amount,
        status: sub.status,
        next_billing: sub.next_billing_date || sub.end_date,
      }));

      set({
        subscriptions: mappedSubscriptions,
        subscriptionsPagination: {
          currentPage: data.current_page,
          perPage: data.per_page,
          total: data.total,
          lastPage: data.last_page,
        },
      });
    } catch (error) {
      toast.error('Failed to refresh subscriptions');
    }
  },

  refreshTransactions: async () => {
    try {
      const data = await apiService.listOperationsWalletTransactions({ per_page: 15 });
      const mappedTransactions: MappedTransaction[] = data.data.map((tx: OperationsWalletTransaction) => ({
        id: String(tx.id),
        user: tx.user?.full_name || tx.user?.email || 'Unknown',
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        date: tx.created_at,
        created_at: tx.created_at,
      }));

      set({
        transactions: mappedTransactions,
        transactionsPagination: {
          currentPage: data.current_page,
          perPage: data.per_page,
          total: data.total,
          lastPage: data.last_page,
        },
      });
    } catch (error) {
      toast.error('Failed to refresh transactions');
    }
  },

  setSubscriptionSearchQuery: (query: string) => set({ subscriptionSearchQuery: query }),
  setTransactionSearchQuery: (query: string) => set({ transactionSearchQuery: query }),

  getFilteredSubscriptions: () => {
    const { subscriptions, subscriptionSearchQuery } = get();
    if (!subscriptionSearchQuery) return subscriptions;

    const query = subscriptionSearchQuery.toLowerCase();
    return subscriptions.filter(
      (sub) =>
        sub.id.toString().includes(query) ||
        sub.partner?.toLowerCase().includes(query) ||
        sub.plan?.toLowerCase().includes(query)
    );
  },

  getFilteredTransactions: () => {
    const { transactions, transactionSearchQuery } = get();
    if (!transactionSearchQuery) return transactions;

    const query = transactionSearchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.id.toString().includes(query) ||
        tx.user?.toLowerCase().includes(query) ||
        tx.type?.toLowerCase().includes(query)
    );
  },

  clearError: () => set({ error: null }),
}));
