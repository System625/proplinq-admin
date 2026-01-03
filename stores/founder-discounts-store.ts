import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import {
  Discount,
  ListDiscountsResponse,
  CreateDiscountRequest,
  UpdateDiscountRequest,
} from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderDiscountsState {
  discounts: ListDiscountsResponse | null;
  selectedDiscount: Discount | null;
  isLoading: boolean;
  error: string | null;

  fetchDiscounts: (params?: Record<string, unknown>) => Promise<void>;
  fetchDiscountById: (id: string) => Promise<void>;
  createDiscount: (data: CreateDiscountRequest) => Promise<void>;
  updateDiscount: (id: string, data: UpdateDiscountRequest) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useFounderDiscountsStore = create<FounderDiscountsState>((set, get) => ({
  discounts: null,
  selectedDiscount: null,
  isLoading: false,
  error: null,

  fetchDiscounts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.listFounderDiscounts(params);
      set({ discounts: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Discounts Error: ${errorMessage}`);
    }
  },

  fetchDiscountById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getFounderDiscount(id);
      set({ selectedDiscount: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Discount Error: ${errorMessage}`);
    }
  },

  createDiscount: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.createFounderDiscount(data);
      await get().fetchDiscounts();
      toast.success('Discount created successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Create Discount Error: ${errorMessage}`);
      throw error;
    }
  },

  updateDiscount: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.updateFounderDiscount(id, data);
      await get().fetchDiscounts();
      toast.success('Discount updated successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Update Discount Error: ${errorMessage}`);
      throw error;
    }
  },

  deleteDiscount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteFounderDiscount(id);
      await get().fetchDiscounts();
      toast.success('Discount deleted successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Delete Discount Error: ${errorMessage}`);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
