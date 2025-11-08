import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { Booking, BookingUpdate, PaginatedResponse, RefundRequest, Transaction } from '@/types/api';
import { toast } from 'sonner';
import { ApiError, getErrorMessage } from '@/lib/api-error-handler';

interface BookingsState {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: string;
  searchTerm: string;
  
  // Actions
  fetchBookings: (params?: { page?: number; limit?: number; status?: string; search?: string }) => Promise<void>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  processRefund: (bookingId: string, amount: number, reason: string) => Promise<Transaction>;
  setStatusFilter: (status: string) => void;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  pagination: null,
  isLoading: false,
  error: null,
  statusFilter: 'all',
  searchTerm: '',

  fetchBookings: async (params) => {
    console.log('🔄 Bookings Store: Starting fetchBookings with params:', params);
    set({ isLoading: true, error: null });
    
    try {
      const { statusFilter, searchTerm } = get();
      console.log('🔍 Bookings Store: statusFilter:', statusFilter);
      console.log('🔍 Bookings Store: searchTerm:', searchTerm);
      
      const response: PaginatedResponse<Booking> = await apiService.getBookings({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || params?.search,
        ...params,
      });
      
      console.log('📡 Bookings Store: Full API response:', response);
      console.log('📊 Bookings Store: response.data:', response.data);
      console.log('🔢 Bookings Store: response.data type:', typeof response.data);
      console.log('📋 Bookings Store: response.data is array:', Array.isArray(response.data));
      
      // The API now returns properly transformed data
      const bookingsArray = Array.isArray(response.data) ? response.data : [];
      const pagination = response.pagination || {
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 1,
      };

      console.log('✅ Bookings Store: Final bookings array:', bookingsArray);
      console.log('📏 Bookings Store: Bookings array length:', bookingsArray.length);
      
      set({
        bookings: bookingsArray,
        pagination: pagination,
        isLoading: false,
      });
      
      console.log('🎯 Bookings Store: State updated successfully');
    } catch (error: any) {
      console.error('❌ Bookings Store: Error in fetchBookings:', error);

      const errorMessage = getErrorMessage(error);
      const isAuthError = error instanceof ApiError && error.isAuthError;

      set({
        bookings: [],
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

  updateBooking: async (id: string, data: BookingUpdate) => {
    const { bookings } = get();
    
    console.log('🔄 Bookings Store: Updating booking', id, 'with data:', data);
    
    // Optimistic update
    const optimisticBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, status: data.status || booking.status } : booking
    );
    set({ bookings: optimisticBookings });
    
    try {
      const updatedBooking = await apiService.updateBooking(id, data);
      console.log('✅ Bookings Store: Update response:', updatedBooking);
      
      // Update with actual response - handle both direct booking object and nested data
      const bookingData = (updatedBooking as any).data || updatedBooking;
      
      const updatedBookings = bookings.map(booking =>
        booking.id === id ? {
          ...booking,
          status: bookingData.status || data.status || booking.status
        } : booking
      );
      set({ bookings: updatedBookings });
      
      console.log('🎯 Bookings Store: Bookings updated successfully');
    } catch (error: any) {
      console.error('❌ Bookings Store: Update failed:', error);
      // Revert optimistic update
      set({ bookings });

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
      }

      throw new Error(errorMessage);
    }
  },

  processRefund: async (bookingId: string, amount: number, reason: string) => {
    console.log('🔄 Bookings Store: Processing refund for booking', bookingId, 'amount:', amount, 'reason:', reason);
    
    try {
      const refundData: RefundRequest = {
        bookingId,
        amount,
        reason,
      };
      
      const transaction = await apiService.processRefund(refundData);
      console.log('✅ Bookings Store: Refund processed successfully:', transaction);
      
      // Refresh bookings to get updated data
      await get().fetchBookings();
      
      return transaction;
    } catch (error: any) {
      console.error('❌ Bookings Store: Refund failed:', error);

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
      }

      throw new Error(errorMessage);
    }
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  clearError: () => {
    set({ error: null });
  },
}));