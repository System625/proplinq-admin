import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { User, PaginatedResponse } from '@/types/api';
import { toast } from 'sonner';

interface UsersState {
  users: User[];
  currentUser: User | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Actions
  fetchUsers: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  currentUser: null,
  pagination: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchUsers: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const { searchQuery } = get();
      const response: PaginatedResponse<User> = await apiService.getUsers({
        search: searchQuery,
        ...params,
      });
      
      set({
        users: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchUser: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await apiService.getUser(id);
      set({
        currentUser: user,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user details';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));