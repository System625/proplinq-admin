import { create } from 'zustand';
import {
  SalesDashboardStats,
  MockOnboardingLead,
  MockPartner,
  generateSalesStats,
  generateMockOnboardingLeads,
  generateMockPartners,
} from '@/lib/mock-data';

interface SalesDashboardState {
  stats: SalesDashboardStats | null;
  leads: MockOnboardingLead[];
  partners: MockPartner[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  refreshLeads: () => void;
  refreshPartners: () => void;
  clearError: () => void;
}

export const useSalesDashboardStore = create<SalesDashboardState>((set) => ({
  stats: null,
  leads: [],
  partners: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const stats = generateSalesStats();
      const leads = generateMockOnboardingLeads(15);
      const partners = generateMockPartners(20);

      set({
        stats,
        leads,
        partners,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },

  refreshLeads: () => {
    const leads = generateMockOnboardingLeads(15);
    set({ leads });
  },

  refreshPartners: () => {
    const partners = generateMockPartners(20);
    set({ partners });
  },

  clearError: () => {
    set({ error: null });
  },
}));
