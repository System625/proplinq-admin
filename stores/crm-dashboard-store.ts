import { create } from 'zustand';
import { toast } from 'sonner';
import { apiService } from '@/lib/axios';
import type {
  CRMDashboard,
  Lead,
  LeadDetails,
  ListLeadsResponse,
  Contact,
  ContactDetails,
  ListContactsResponse,
  Activity,
  ListActivitiesResponse,
  CreateLeadRequest,
  UpdateLeadRequest,
  ConvertLeadRequest,
  CreateContactRequest,
  UpdateContactRequest,
  CreateActivityRequest,
  UpdateActivityRequest,
} from '@/types/api';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

interface CRMDashboardState {
  // Data
  dashboard: CRMDashboard | null;
  leads: ListLeadsResponse | null;
  contacts: ListContactsResponse | null;
  activities: ListActivitiesResponse | null;
  selectedLead: LeadDetails | null;
  selectedContact: ContactDetails | null;
  selectedActivity: Activity | null;

  // Loading states (granular)
  isLoading: boolean;
  isLeadLoading: boolean;
  isContactLoading: boolean;
  isActivityLoading: boolean;
  isLeadDetailLoading: boolean;
  isContactDetailLoading: boolean;
  isActivityDetailLoading: boolean;

  // Error state
  error: string | null;

  // Filter state
  searchQuery: string;
  leadStatusFilter: string;
  leadSourceFilter: string;
  contactTypeFilter: string;
  activityTypeFilter: string;

  // Actions
  clearError: () => void;
  setSearchQuery: (query: string) => void;
  setLeadStatusFilter: (status: string) => void;
  setLeadSourceFilter: (source: string) => void;
  setContactTypeFilter: (type: string) => void;
  setActivityTypeFilter: (type: string) => void;

  // Dashboard data fetching
  fetchDashboardData: () => Promise<void>;

  // Lead actions
  fetchLeads: () => Promise<void>;
  fetchLeadDetails: (leadId: number) => Promise<void>;
  createLead: (data: CreateLeadRequest) => Promise<void>;
  updateLead: (leadId: number, data: UpdateLeadRequest) => Promise<void>;
  deleteLead: (leadId: number) => Promise<void>;
  convertLead: (leadId: number, userId: number) => Promise<void>;
  clearSelectedLead: () => void;

  // Contact actions
  fetchContacts: () => Promise<void>;
  fetchContactDetails: (contactId: number) => Promise<void>;
  createContact: (data: CreateContactRequest) => Promise<void>;
  updateContact: (contactId: number, data: UpdateContactRequest) => Promise<void>;
  deleteContact: (contactId: number) => Promise<void>;
  clearSelectedContact: () => void;

  // Activity actions
  fetchActivities: () => Promise<void>;
  fetchActivityDetails: (activityId: number) => Promise<void>;
  createActivity: (data: CreateActivityRequest) => Promise<void>;
  updateActivity: (activityId: number, data: UpdateActivityRequest) => Promise<void>;
  deleteActivity: (activityId: number) => Promise<void>;
  clearSelectedActivity: () => void;
}

export const useCRMDashboardStore = create<CRMDashboardState>((set, get) => ({
  // Initial state
  dashboard: null,
  leads: null,
  contacts: null,
  activities: null,
  selectedLead: null,
  selectedContact: null,
  selectedActivity: null,

  isLoading: false,
  isLeadLoading: false,
  isContactLoading: false,
  isActivityLoading: false,
  isLeadDetailLoading: false,
  isContactDetailLoading: false,
  isActivityDetailLoading: false,

  error: null,

  searchQuery: '',
  leadStatusFilter: '',
  leadSourceFilter: '',
  contactTypeFilter: '',
  activityTypeFilter: '',

  // Error handling
  clearError: () => set({ error: null }),

  // Filter setters
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    // Trigger refetch for both leads and contacts
    const { fetchLeads, fetchContacts } = get();
    fetchLeads();
    fetchContacts();
  },

  setLeadStatusFilter: (status: string) => {
    set({ leadStatusFilter: status });
    get().fetchLeads();
  },

  setLeadSourceFilter: (source: string) => {
    set({ leadSourceFilter: source });
    get().fetchLeads();
  },

  setContactTypeFilter: (type: string) => {
    set({ contactTypeFilter: type });
    get().fetchContacts();
  },

  setActivityTypeFilter: (type: string) => {
    set({ activityTypeFilter: type });
    get().fetchActivities();
  },

  // Dashboard data fetching with Promise.allSettled for partial failure handling
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      const [dashboardResult, leadsResult, contactsResult] = await Promise.allSettled([
        apiService.getCRMDashboard(),
        apiService.listLeads({ per_page: 15, page: 1 }),
        apiService.listContacts({ per_page: 15, page: 1 }),
      ]);

      // Handle dashboard result
      if (dashboardResult.status === 'fulfilled') {
        set({ dashboard: dashboardResult.value });
      } else {
        console.error('Dashboard fetch failed:', dashboardResult.reason);
        toast.error('Failed to load dashboard metrics');
      }

      // Handle leads result
      if (leadsResult.status === 'fulfilled') {
        set({ leads: leadsResult.value });
      } else {
        console.error('Leads fetch failed:', leadsResult.reason);
        toast.error('Failed to load leads');
      }

      // Handle contacts result
      if (contactsResult.status === 'fulfilled') {
        set({ contacts: contactsResult.value });
      } else {
        console.error('Contacts fetch failed:', contactsResult.reason);
        toast.error('Failed to load contacts');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Lead actions
  fetchLeads: async () => {
    set({ isLeadLoading: true, error: null });

    try {
      const { searchQuery, leadStatusFilter, leadSourceFilter } = get();
      const params: Record<string, any> = { per_page: 15, page: 1 };

      if (searchQuery) params.search = searchQuery;
      if (leadStatusFilter) params.status = leadStatusFilter;
      if (leadSourceFilter) params.source = leadSourceFilter;

      const data = await apiService.listLeads(params);
      set({ leads: data });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLeadLoading: false });
    }
  },

  fetchLeadDetails: async (leadId: number) => {
    set({ isLeadDetailLoading: true, error: null });

    try {
      const data = await apiService.getLead(leadId);
      set({ selectedLead: data });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLeadDetailLoading: false });
    }
  },

  createLead: async (data: CreateLeadRequest) => {
    try {
      await apiService.createLead(data);
      toast.success('Lead created successfully');

      // Refresh leads and dashboard
      await Promise.all([
        get().fetchLeads(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  updateLead: async (leadId: number, data: UpdateLeadRequest) => {
    try {
      await apiService.updateLead(leadId, data);
      toast.success('Lead updated successfully');

      // Refresh leads and dashboard
      await Promise.all([
        get().fetchLeads(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);

      // If this is the selected lead, refresh details
      if (get().selectedLead?.id === leadId) {
        await get().fetchLeadDetails(leadId);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  deleteLead: async (leadId: number) => {
    try {
      await apiService.deleteLead(leadId);
      toast.success('Lead deleted successfully');

      // Clear selected lead if it's the one being deleted
      if (get().selectedLead?.id === leadId) {
        set({ selectedLead: null });
      }

      // Refresh leads and dashboard
      await Promise.all([
        get().fetchLeads(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  convertLead: async (leadId: number, userId: number) => {
    try {
      await apiService.convertLead(leadId, { user_id: userId });
      toast.success('Lead converted successfully');

      // Clear selected lead
      set({ selectedLead: null });

      // Refresh leads and dashboard
      await Promise.all([
        get().fetchLeads(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  clearSelectedLead: () => set({ selectedLead: null }),

  // Contact actions
  fetchContacts: async () => {
    set({ isContactLoading: true, error: null });

    try {
      const { searchQuery, contactTypeFilter } = get();
      const params: Record<string, any> = { per_page: 15, page: 1 };

      if (searchQuery) params.search = searchQuery;
      if (contactTypeFilter) params.type = contactTypeFilter;

      const data = await apiService.listContacts(params);
      set({ contacts: data });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isContactLoading: false });
    }
  },

  fetchContactDetails: async (contactId: number) => {
    set({ isContactDetailLoading: true, error: null });

    try {
      const data = await apiService.getContact(contactId);
      set({ selectedContact: data });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isContactDetailLoading: false });
    }
  },

  createContact: async (data: CreateContactRequest) => {
    try {
      await apiService.createContact(data);
      toast.success('Contact created successfully');

      // Refresh contacts and dashboard
      await Promise.all([
        get().fetchContacts(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  updateContact: async (contactId: number, data: UpdateContactRequest) => {
    try {
      await apiService.updateContact(contactId, data);
      toast.success('Contact updated successfully');

      // Refresh contacts and dashboard
      await Promise.all([
        get().fetchContacts(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);

      // If this is the selected contact, refresh details
      if (get().selectedContact?.id === contactId) {
        await get().fetchContactDetails(contactId);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  deleteContact: async (contactId: number) => {
    try {
      await apiService.deleteContact(contactId);
      toast.success('Contact deleted successfully');

      // Clear selected contact if it's the one being deleted
      if (get().selectedContact?.id === contactId) {
        set({ selectedContact: null });
      }

      // Refresh contacts and dashboard
      await Promise.all([
        get().fetchContacts(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  clearSelectedContact: () => set({ selectedContact: null }),

  // Activity actions
  fetchActivities: async () => {
    set({ isActivityLoading: true, error: null });

    try {
      const { activityTypeFilter } = get();
      const params: Record<string, any> = { per_page: 15, page: 1 };

      if (activityTypeFilter) params.type = activityTypeFilter;

      const data = await apiService.listActivities(params);
      set({ activities: data });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isActivityLoading: false });
    }
  },

  fetchActivityDetails: async (activityId: number) => {
    set({ isActivityDetailLoading: true, error: null });

    try {
      const data = await apiService.getActivity(activityId);
      set({ selectedActivity: data });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isActivityDetailLoading: false });
    }
  },

  createActivity: async (data: CreateActivityRequest) => {
    try {
      await apiService.createActivity(data);
      toast.success('Activity created successfully');

      // Refresh activities and dashboard
      await Promise.all([
        get().fetchActivities(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  updateActivity: async (activityId: number, data: UpdateActivityRequest) => {
    try {
      await apiService.updateActivity(activityId, data);
      toast.success('Activity updated successfully');

      // Refresh activities
      await get().fetchActivities();

      // If this is the selected activity, refresh details
      if (get().selectedActivity?.id === activityId) {
        await get().fetchActivityDetails(activityId);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  deleteActivity: async (activityId: number) => {
    try {
      await apiService.deleteActivity(activityId);
      toast.success('Activity deleted successfully');

      // Clear selected activity if it's the one being deleted
      if (get().selectedActivity?.id === activityId) {
        set({ selectedActivity: null });
      }

      // Refresh activities and dashboard
      await Promise.all([
        get().fetchActivities(),
        apiService.getCRMDashboard().then(dashboard => set({ dashboard })),
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    }
  },

  clearSelectedActivity: () => set({ selectedActivity: null }),
}));
