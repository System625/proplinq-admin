import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { Booking, PaginatedResponse } from '@/types/api';
import { toast } from 'sonner';

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
  
  // Actions
  fetchBookings: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  setStatusFilter: (status: string) => void;
  clearError: () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  pagination: null,
  isLoading: false,
  error: null,
  statusFilter: 'all',

  fetchBookings: async (params) => {
    console.log('🔄 Bookings Store: Starting fetchBookings with params:', params);
    set({ isLoading: true, error: null });
    
    try {
      const { statusFilter } = get();
      console.log('🔍 Bookings Store: statusFilter:', statusFilter);
      
      const response: PaginatedResponse<Booking> = await apiService.getBookings({
        status: statusFilter,
        ...params,
      });
      
      console.log('📡 Bookings Store: Full API response:', response);
      console.log('📊 Bookings Store: response.data:', response.data);
      console.log('🔢 Bookings Store: response.data type:', typeof response.data);
      console.log('📋 Bookings Store: response.data is array:', Array.isArray(response.data));
      
      const responseData = (response as any).data || {};
      
      const bookingsArray = Array.isArray(responseData.data) ? responseData.data : [];
      const pagination = {
        page: responseData.current_page || 1,
        limit: responseData.per_page || 15,
        total: responseData.total || 0,
        totalPages: responseData.last_page || 1,
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
      const errorMessage = error.response?.data?.message || 'Failed to fetch bookings';
      set({
        bookings: [],
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  updateBooking: async (id: string, data: Partial<Booking>) => {
    const { bookings } = get();
    
    // Optimistic update
    const optimisticBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, ...data } : booking
    );
    set({ bookings: optimisticBookings });
    
    try {
      const updatedBooking = await apiService.updateBooking(id, data);
      
      // Update with actual response
      const updatedBookings = bookings.map(booking =>
        booking.id === id ? updatedBooking : booking
      );
      set({ bookings: updatedBookings });
      
      toast.success('Booking updated successfully');
    } catch (error: any) {
      // Revert optimistic update
      set({ bookings });
      
      const errorMessage = error.response?.data?.message || 'Failed to update booking';
      toast.error(errorMessage);
    }
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  clearError: () => {
    set({ error: null });
  },
}));