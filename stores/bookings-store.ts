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
    set({ isLoading: true, error: null });
    
    try {
      const { statusFilter } = get();
      const response: PaginatedResponse<Booking> = await apiService.getBookings({
        status: statusFilter,
        ...params,
      });
      
      set({
        bookings: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch bookings';
      set({
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