import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { Staff, ListStaffResponse, CreateStaffRequest, UpdateStaffRequest, UpdatePermissionsRequest } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface FounderStaffState {
  staff: ListStaffResponse | null;
  selectedStaff: Staff | null;
  isLoading: boolean;
  error: string | null;

  fetchStaff: (params?: Record<string, unknown>) => Promise<void>;
  fetchStaffById: (id: string) => Promise<void>;
  createStaff: (data: CreateStaffRequest) => Promise<void>;
  updateStaff: (id: string, data: UpdateStaffRequest) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  updatePermissions: (id: string, data: UpdatePermissionsRequest) => Promise<void>;
  clearError: () => void;
}

export const useFounderStaffStore = create<FounderStaffState>((set, get) => ({
  staff: null,
  selectedStaff: null,
  isLoading: false,
  error: null,

  fetchStaff: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.listFounderStaff(params);
      set({ staff: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Staff Error: ${errorMessage}`);
    }
  },

  fetchStaffById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getFounderStaff(id);
      set({ selectedStaff: data, isLoading: false });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Staff Error: ${errorMessage}`);
    }
  },

  createStaff: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.createFounderStaff(data);
      await get().fetchStaff();
      toast.success('Staff member created successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Create Staff Error: ${errorMessage}`);
      throw error;
    }
  },

  updateStaff: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.updateFounderStaff(id, data);
      await get().fetchStaff();
      toast.success('Staff member updated successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Update Staff Error: ${errorMessage}`);
      throw error;
    }
  },

  deleteStaff: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteFounderStaff(id);
      await get().fetchStaff();
      toast.success('Staff member deleted successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Delete Staff Error: ${errorMessage}`);
      throw error;
    }
  },

  updatePermissions: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.updateFounderStaffPermissions(id, data);
      await get().fetchStaffById(id);
      toast.success('Permissions updated successfully');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Update Permissions Error: ${errorMessage}`);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
