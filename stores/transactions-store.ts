import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { Transaction, PaginatedResponse, RefundRequest } from '@/types/api';
import { toast } from 'sonner';
import { ApiError, getErrorMessage } from '@/lib/api-error-handler';

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
    console.log('🔄 Transactions Store: Starting fetchTransactions with params:', params);
    set({ isLoading: true, error: null });
    
    try {
      const response: PaginatedResponse<Transaction> = await apiService.getTransactions(params);
      
      console.log('📡 Transactions Store: Full API response:', response);
      console.log('📊 Transactions Store: response.data:', response.data);
      console.log('🔢 Transactions Store: response.data type:', typeof response.data);
      console.log('📋 Transactions Store: response.data is array:', Array.isArray(response.data));
      
      const transactionsArray = Array.isArray(response.data) ? response.data : [];
      console.log('✅ Transactions Store: Final transactions array:', transactionsArray);
      console.log('📏 Transactions Store: Transactions array length:', transactionsArray.length);
      
      set({
        transactions: transactionsArray,
        pagination: response.pagination,
        isLoading: false,
      });
      
      console.log('🎯 Transactions Store: State updated successfully');
    } catch (error: any) {
      console.error('❌ Transactions Store: Error in fetchTransactions:', error);

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      set({
        transactions: [],
        error: errorMessage,
        isLoading: false,
      });

      if (isAuthError) {
        toast.error(errorMessage, {
          description: 'You may need to log in again',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login',
          },
        });
      } else {
        toast.error(errorMessage);
      }
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

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      if (isAuthError) {
        toast.error(errorMessage, {
          description: 'You may need to log in again',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login',
          },
        });
      } else {
        toast.error(errorMessage);
      }

      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));