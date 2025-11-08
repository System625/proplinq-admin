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

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshTickets: () => void;
  refreshChats: () => void;
  clearError: () => void;
}

export const useSupportDashboardStore = create<SupportDashboardState>((set) => ({
  stats: null,
  tickets: [],
  chats: [],
  chartData: [],
  isLoading: false,
  error: null,

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
}));
