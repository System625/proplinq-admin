import { create } from 'zustand';
import { propertiesApiService } from '@/lib/api';
import {
  PropertyItem,
  ListPropertiesResponse,
  UpdatePropertyListingRequest,
  UpdatePropertyListingStatusRequest,
} from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/api-error-handler';

interface PropertiesState {
  properties: ListPropertiesResponse | null;
  selectedProperty: PropertyItem | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProperties: (params?: Record<string, unknown>) => Promise<void>;
  fetchPropertyById: (id: number) => Promise<void>;
  updateProperty: (id: number, data: UpdatePropertyListingRequest) => Promise<void>;
  updatePropertyStatus: (
    id: number,
    data: UpdatePropertyListingStatusRequest
  ) => Promise<void>;
  deleteProperty: (id: number) => Promise<void>;
  setSelectedProperty: (property: PropertyItem | null) => void;
  clearError: () => void;
}

export const usePropertiesStore = create<PropertiesState>((set, get) => ({
  properties: null,
  selectedProperty: null,
  isLoading: false,
  error: null,

  fetchProperties: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await propertiesApiService.listProperties(params);
      set({ properties: data, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Properties Error: ${errorMessage}`);
    }
  },

  fetchPropertyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await propertiesApiService.getPropertyById(id);
      set({ selectedProperty: data, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Property Error: ${errorMessage}`);
    }
  },

  updateProperty: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesApiService.updateProperty(id, data);
      await get().fetchProperties();
      toast.success('Property updated successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Update Property Error: ${errorMessage}`);
      throw error;
    }
  },

  updatePropertyStatus: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesApiService.updatePropertyStatus(id, data);
      await get().fetchProperties();
      toast.success('Property status updated successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Update Status Error: ${errorMessage}`);
      throw error;
    }
  },

  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await propertiesApiService.deleteProperty(id);
      await get().fetchProperties();
      toast.success('Property deleted successfully');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(`Delete Property Error: ${errorMessage}`);
      throw error;
    }
  },

  setSelectedProperty: (property) => set({ selectedProperty: property }),

  clearError: () => set({ error: null }),
}));
