import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { ApiUser, PaginatedResponse } from '@/types/api';
import { toast } from 'sonner';

interface UsersState {
  users: ApiUser[];
  currentUser: ApiUser | null;
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
    console.log('🔄 Users Store: Starting fetchUsers with params:', params);
    set({ isLoading: true, error: null });
    
    try {
      const { searchQuery } = get();
      console.log('🔍 Users Store: searchQuery:', searchQuery);
      
      const response: any = await apiService.getUsers({
        ...params,
      });
      
      console.log('📡 Users Store: Full API response:', response);
      console.log('📊 Users Store: response.data:', response.data);
      console.log('🔢 Users Store: response.data type:', typeof response.data);
      console.log('📋 Users Store: response.data is array:', Array.isArray(response.data));
      console.log('📄 Users Store: response.pagination:', response.pagination);
      
      const responseData = response.data || {};
      
      const usersArray = Array.isArray(responseData.data) ? responseData.data : [];
      const pagination = {
        page: responseData.current_page || 1,
        limit: responseData.per_page || 15,
        total: responseData.total || 0,
        totalPages: responseData.last_page || 1,
      };
      
      console.log('✅ Users Store: Final users array:', usersArray);
      console.log('📏 Users Store: Users array length:', usersArray.length);
      
      set({
        users: usersArray,
        pagination: pagination,
        isLoading: false,
      });
      
      console.log('🎯 Users Store: State updated successfully');
      
      // Verify the state was actually updated
      const { users: updatedUsers } = get();
      console.log('🔍 Users Store: Post-update verification - users:', updatedUsers);
      console.log('🔍 Users Store: Post-update verification - users length:', updatedUsers.length);
    } catch (error: any) {
      console.error('❌ Users Store: Error in fetchUsers:', error);
      console.error('❌ Users Store: Error response:', error.response);
      console.error('❌ Users Store: Error response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({
        users: [],
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchUser: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.getUser(id);
      // Handle the response structure that includes status, message, data
      const user = (response as any).data || response;
      console.log('👤 Users Store: Individual user response:', response);
      console.log('👤 Users Store: Extracted user:', user);
      
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