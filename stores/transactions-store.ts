import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { Transaction, PaginatedResponse, RefundRequest } from '@/types/api';
import { toast } from 'sonner';

interface TransactionsState {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  isProcessingRefund: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: (params?: { page?: number; limit?: number }) => Promise<void>;
  processRefund: (data: RefundRequest) => Promise<void>;
  clearError: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  pagination: null,
  isLoading: false,
  isProcessingRefund: false,
  error: null,

  fetchTransactions: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: PaginatedResponse<Transaction> = await apiService.getTransactions(params);
      
      set({
        transactions: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch transactions';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  processRefund: async (data: RefundRequest) => {
    set({ isProcessingRefund: true });
    
    try {
      const newTransaction = await apiService.processRefund(data);
      
      const { transactions } = get();
      set({
        transactions: [newTransaction, ...transactions],
        isProcessingRefund: false,
      });
      
      toast.success(`Refund of $${data.amount} processed successfully`);
    } catch (error: any) {
      set({ isProcessingRefund: false });
      
      const errorMessage = error.response?.data?.message || 'Failed to process refund';
      toast.error(errorMessage);
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));