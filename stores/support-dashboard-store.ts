import { create } from 'zustand';
import {
  SupportDashboardStats,
  MockTicket,
  MockChat,
  generateSupportStats,
  generateMockTickets,
  generateMockChats,
  generateTicketTrendsData,
  ChartDataPoint,
} from '@/lib/mock-data';

interface SupportDashboardState {
  stats: SupportDashboardStats | null;
  tickets: MockTicket[];
  chats: MockChat[];
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  // Search and filter state
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  priorityFilter: string;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshTickets: () => void;
  refreshChats: () => void;
  clearError: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  getFilteredTickets: () => MockTicket[];
}

export const useSupportDashboardStore = create<SupportDashboardState>((set, get) => ({
  stats: null,
  tickets: [],
  chats: [],
  chartData: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  categoryFilter: 'all',
  statusFilter: 'all',
  priorityFilter: 'all',

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const stats = generateSupportStats();
      const tickets = generateMockTickets(15);
      const chats = generateMockChats(8);
      const chartData = generateTicketTrendsData();

      set({
        stats,
        tickets,
        chats,
        chartData,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },

  refreshTickets: () => {
    const tickets = generateMockTickets(15);
    set({ tickets });
  },

  refreshChats: () => {
    const chats = generateMockChats(8);
    set({ chats });
  },

  clearError: () => {
    set({ error: null });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setCategoryFilter: (category: string) => {
    set({ categoryFilter: category });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  setPriorityFilter: (priority: string) => {
    set({ priorityFilter: priority });
  },

  getFilteredTickets: () => {
    const state = get();
    let filtered = state.tickets;

    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.user.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (state.categoryFilter && state.categoryFilter !== 'all') {
      filtered = filtered.filter(
        (ticket) => ticket.category === state.categoryFilter
      );
    }

    // Apply status filter
    if (state.statusFilter && state.statusFilter !== 'all') {
      filtered = filtered.filter(
        (ticket) => ticket.status === state.statusFilter
      );
    }

    // Apply priority filter
    if (state.priorityFilter && state.priorityFilter !== 'all') {
      filtered = filtered.filter(
        (ticket) => ticket.priority === state.priorityFilter
      );
    }

    return filtered;
  },
}));
