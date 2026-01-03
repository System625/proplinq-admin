import { create } from 'zustand';
import { toast } from 'sonner';
import { apiService } from '@/lib/axios';
import {
  SupportDashboard,
  Ticket,
  TicketDetails,
  Chat,
  ChatDetails,
  ListTicketsResponse,
  ListChatsResponse,
  TicketQueryParams,
  ChatQueryParams,
  RespondToTicketRequest,
  AssignTicketRequest,
  UpdateTicketRequest,
  CloseTicketRequest,
  RespondToChatRequest,
  AssignChatRequest,
  CloseChatRequest,
  Call,
  ListCallsResponse,
  CallQueryParams,
  ScheduleCallbackRequest,
  Email,
  ListEmailsResponse,
  EmailQueryParams,
  ReplyToEmailRequest,
  SupportAnalytics,
  AnalyticsQueryParams,
  UserSupportHistory,
} from '@/types/api';
import { getErrorMessage } from '@/lib/utils';

interface SupportDashboardState {
  // Data state
  dashboard: SupportDashboard | null;
  tickets: ListTicketsResponse | null;
  chats: ListChatsResponse | null;
  calls: ListCallsResponse | null;
  emails: ListEmailsResponse | null;
  analytics: SupportAnalytics | null;
  selectedTicket: TicketDetails | null;
  selectedChat: ChatDetails | null;
  selectedCall: Call | null;
  selectedEmail: Email | null;

  // Loading states
  isLoading: boolean;
  isTicketLoading: boolean;
  isChatLoading: boolean;
  isCallLoading: boolean;
  isEmailLoading: boolean;
  isAnalyticsLoading: boolean;
  isTicketDetailLoading: boolean;
  isChatDetailLoading: boolean;
  isCallDetailLoading: boolean;
  isEmailDetailLoading: boolean;

  // Error state
  error: string | null;

  // Filter state
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;
  priorityFilter: string;
  callStatusFilter: string;
  emailStatusFilter: string;
  analyticsDateRange: { start?: string; end?: string };

  // Actions - Dashboard
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;

  // Actions - Filters
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  setCallStatusFilter: (status: string) => void;
  setEmailStatusFilter: (status: string) => void;
  setAnalyticsDateRange: (start: string, end: string) => void;

  // Actions - Tickets
  fetchTickets: (params?: TicketQueryParams) => Promise<void>;
  fetchTicketDetails: (ticketId: number) => Promise<void>;
  respondToTicket: (ticketId: number, message: string, attachments?: File[]) => Promise<void>;
  assignTicket: (ticketId: number, agentId: number) => Promise<void>;
  updateTicketStatus: (ticketId: number, status: string, priority?: string) => Promise<void>;
  closeTicket: (ticketId: number, resolution?: string) => Promise<void>;
  clearSelectedTicket: () => void;

  // Actions - Chats
  fetchChats: (params?: ChatQueryParams) => Promise<void>;
  fetchChatDetails: (chatId: number) => Promise<void>;
  respondToChat: (chatId: number, message: string) => Promise<void>;
  assignChat: (chatId: number, agentId: number) => Promise<void>;
  closeChat: (chatId: number, summary?: string) => Promise<void>;
  clearSelectedChat: () => void;

  // Actions - Calls
  fetchCalls: (params?: CallQueryParams) => Promise<void>;
  fetchCallDetails: (callId: number) => Promise<void>;
  scheduleCallback: (callId: number, data: ScheduleCallbackRequest) => Promise<void>;
  clearSelectedCall: () => void;

  // Actions - Emails
  fetchEmails: (params?: EmailQueryParams) => Promise<void>;
  fetchEmailDetails: (emailId: number) => Promise<void>;
  replyToEmail: (emailId: number, data: ReplyToEmailRequest) => Promise<void>;
  clearSelectedEmail: () => void;

  // Actions - Analytics
  fetchAnalytics: (params?: AnalyticsQueryParams) => Promise<void>;

  // Actions - Users (for context)
  fetchUserSupportHistory: (userId: number) => Promise<UserSupportHistory | null>;
}

export const useSupportDashboardStore = create<SupportDashboardState>((set, get) => ({
  // Initial state
  dashboard: null,
  tickets: null,
  chats: null,
  calls: null,
  emails: null,
  analytics: null,
  selectedTicket: null,
  selectedChat: null,
  selectedCall: null,
  selectedEmail: null,
  isLoading: false,
  isTicketLoading: false,
  isChatLoading: false,
  isCallLoading: false,
  isEmailLoading: false,
  isAnalyticsLoading: false,
  isTicketDetailLoading: false,
  isChatDetailLoading: false,
  isCallDetailLoading: false,
  isEmailDetailLoading: false,
  error: null,
  searchQuery: '',
  categoryFilter: 'all',
  statusFilter: 'all',
  priorityFilter: 'all',
  callStatusFilter: 'all',
  emailStatusFilter: 'all',
  analyticsDateRange: {},

  // Dashboard actions
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      // Fetch all dashboard data concurrently with Promise.allSettled for partial failure handling
      const [dashboardResult, ticketsResult, chatsResult] = await Promise.allSettled([
        apiService.getSupportDashboard(),
        apiService.listTickets({ limit: 15, page: 1 }),
        apiService.listChats({ status: 'active' }),
      ]);

      // Handle dashboard stats
      if (dashboardResult.status === 'fulfilled') {
        set({ dashboard: dashboardResult.value });
      } else {
        console.error('Failed to fetch dashboard stats:', dashboardResult.reason);
        toast.error('Failed to load dashboard statistics');
      }

      // Handle tickets
      if (ticketsResult.status === 'fulfilled') {
        set({ tickets: ticketsResult.value });
      } else {
        console.error('Failed to fetch tickets:', ticketsResult.reason);
        toast.error('Failed to load recent tickets');
      }

      // Handle chats
      if (chatsResult.status === 'fulfilled') {
        set({ chats: chatsResult.value });
      } else {
        console.error('Failed to fetch chats:', chatsResult.reason);
        toast.error('Failed to load active chats');
      }

      // Only set error if all requests failed
      if (
        dashboardResult.status === 'rejected' &&
        ticketsResult.status === 'rejected' &&
        chatsResult.status === 'rejected'
      ) {
        set({ error: 'Failed to load dashboard data' });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  // Filter actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    // Trigger ticket fetch with new search query
    const state = get();
    state.fetchTickets({
      search: query || undefined,
      category: state.categoryFilter !== 'all' ? state.categoryFilter : undefined,
      status: state.statusFilter !== 'all' ? (state.statusFilter as any) : undefined,
      priority: state.priorityFilter !== 'all' ? (state.priorityFilter as any) : undefined,
    });
  },

  setCategoryFilter: (category: string) => {
    set({ categoryFilter: category });
    // Trigger ticket fetch with new category filter
    const state = get();
    state.fetchTickets({
      search: state.searchQuery || undefined,
      category: category !== 'all' ? category : undefined,
      status: state.statusFilter !== 'all' ? (state.statusFilter as any) : undefined,
      priority: state.priorityFilter !== 'all' ? (state.priorityFilter as any) : undefined,
    });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
    // Trigger ticket fetch with new status filter
    const state = get();
    state.fetchTickets({
      search: state.searchQuery || undefined,
      category: state.categoryFilter !== 'all' ? state.categoryFilter : undefined,
      status: status !== 'all' ? (status as any) : undefined,
      priority: state.priorityFilter !== 'all' ? (state.priorityFilter as any) : undefined,
    });
  },

  setPriorityFilter: (priority: string) => {
    set({ priorityFilter: priority });
    // Trigger ticket fetch with new priority filter
    const state = get();
    state.fetchTickets({
      search: state.searchQuery || undefined,
      category: state.categoryFilter !== 'all' ? state.categoryFilter : undefined,
      status: state.statusFilter !== 'all' ? (state.statusFilter as any) : undefined,
      priority: priority !== 'all' ? (priority as any) : undefined,
    });
  },

  // Ticket actions
  fetchTickets: async (params?: TicketQueryParams) => {
    set({ isTicketLoading: true });

    try {
      const tickets = await apiService.listTickets(params);
      set({ tickets, isTicketLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to fetch tickets:', errorMessage);
      toast.error('Failed to load tickets');
      set({ isTicketLoading: false });
    }
  },

  fetchTicketDetails: async (ticketId: number) => {
    set({ isTicketDetailLoading: true, selectedTicket: null });

    try {
      const ticket = await apiService.getTicket(ticketId);
      set({ selectedTicket: ticket, isTicketDetailLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to fetch ticket details:', errorMessage);
      toast.error('Failed to load ticket details');
      set({ isTicketDetailLoading: false });
    }
  },

  respondToTicket: async (ticketId: number, message: string, attachments?: File[]) => {
    try {
      const data: RespondToTicketRequest = { message };

      // TODO: Handle file attachments when backend supports it
      // For now, we'll just send the message

      await apiService.respondToTicket(ticketId, data);
      toast.success('Response added successfully');

      // Refresh ticket details to show new response
      await get().fetchTicketDetails(ticketId);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to respond to ticket:', errorMessage);
      toast.error('Failed to add response');
      throw error;
    }
  },

  assignTicket: async (ticketId: number, agentId: number) => {
    try {
      const data: AssignTicketRequest = { agent_id: agentId };
      await apiService.assignTicket(ticketId, data);
      toast.success('Ticket assigned successfully');

      // Refresh ticket details
      await get().fetchTicketDetails(ticketId);

      // Refresh tickets list
      await get().fetchTickets();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to assign ticket:', errorMessage);
      toast.error('Failed to assign ticket');
      throw error;
    }
  },

  updateTicketStatus: async (ticketId: number, status: string, priority?: string) => {
    try {
      const data: UpdateTicketRequest = {
        status: status as any,
        priority: priority as any
      };
      await apiService.updateTicket(ticketId, data);
      toast.success('Ticket updated successfully');

      // Refresh ticket details
      await get().fetchTicketDetails(ticketId);

      // Refresh tickets list
      await get().fetchTickets();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to update ticket:', errorMessage);
      toast.error('Failed to update ticket');
      throw error;
    }
  },

  closeTicket: async (ticketId: number, resolution?: string) => {
    try {
      const data: CloseTicketRequest | undefined = resolution ? { resolution } : undefined;
      await apiService.closeTicket(ticketId, data);
      toast.success('Ticket closed successfully');

      // Refresh ticket details
      await get().fetchTicketDetails(ticketId);

      // Refresh tickets list and dashboard
      await get().fetchTickets();
      await get().fetchDashboardData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to close ticket:', errorMessage);
      toast.error('Failed to close ticket');
      throw error;
    }
  },

  clearSelectedTicket: () => {
    set({ selectedTicket: null });
  },

  // Chat actions
  fetchChats: async (params?: ChatQueryParams) => {
    set({ isChatLoading: true });

    try {
      const chats = await apiService.listChats(params);
      set({ chats, isChatLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to fetch chats:', errorMessage);
      toast.error('Failed to load chats');
      set({ isChatLoading: false });
    }
  },

  fetchChatDetails: async (chatId: number) => {
    set({ isChatDetailLoading: true, selectedChat: null });

    try {
      const chat = await apiService.getChat(chatId);
      set({ selectedChat: chat, isChatDetailLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to fetch chat details:', errorMessage);
      toast.error('Failed to load chat details');
      set({ isChatDetailLoading: false });
    }
  },

  respondToChat: async (chatId: number, message: string) => {
    try {
      const data: RespondToChatRequest = { message };
      await apiService.respondToChat(chatId, data);
      toast.success('Message sent successfully');

      // Refresh chat details to show new message
      await get().fetchChatDetails(chatId);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to send message:', errorMessage);
      toast.error('Failed to send message');
      throw error;
    }
  },

  assignChat: async (chatId: number, agentId: number) => {
    try {
      const data: AssignChatRequest = { agent_id: agentId };
      await apiService.assignChat(chatId, data);
      toast.success('Chat assigned successfully');

      // Refresh chat details
      await get().fetchChatDetails(chatId);

      // Refresh chats list
      await get().fetchChats();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to assign chat:', errorMessage);
      toast.error('Failed to assign chat');
      throw error;
    }
  },

  closeChat: async (chatId: number, summary?: string) => {
    try {
      const data: CloseChatRequest | undefined = summary ? { summary } : undefined;
      await apiService.closeChat(chatId, data);
      toast.success('Chat closed successfully');

      // Refresh chat details
      await get().fetchChatDetails(chatId);

      // Refresh chats list and dashboard
      await get().fetchChats();
      await get().fetchDashboardData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to close chat:', errorMessage);
      toast.error('Failed to close chat');
      throw error;
    }
  },

  clearSelectedChat: () => {
    set({ selectedChat: null });
  },

  // ============================================
  // Calls Methods
  // ============================================

  fetchCalls: async (params?: CallQueryParams) => {
    set({ isCallLoading: true });
    try {
      const calls = await apiService.listCalls(params);
      set({ calls, isCallLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch calls:', error);
      toast.error(`Failed to load calls: ${message}`);
      set({ isCallLoading: false });
    }
  },

  fetchCallDetails: async (callId: number) => {
    set({ isCallDetailLoading: true });
    try {
      const call = await apiService.getCall(callId);
      set({ selectedCall: call, isCallDetailLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch call details:', error);
      toast.error(`Failed to load call details: ${message}`);
      set({ isCallDetailLoading: false });
    }
  },

  scheduleCallback: async (callId: number, data: ScheduleCallbackRequest) => {
    try {
      const updatedCall = await apiService.scheduleCallback(callId, data);
      set({ selectedCall: updatedCall });
      toast.success('Callback scheduled successfully');

      // Refresh calls list
      const state = get();
      state.fetchCalls({
        status: state.callStatusFilter !== 'all' ? (state.callStatusFilter as any) : undefined,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to schedule callback:', error);
      toast.error(`Failed to schedule callback: ${message}`);
      throw error;
    }
  },

  clearSelectedCall: () => {
    set({ selectedCall: null });
  },

  setCallStatusFilter: (status: string) => {
    set({ callStatusFilter: status });
    const state = get();
    state.fetchCalls({
      status: status !== 'all' ? (status as any) : undefined,
    });
  },

  // ============================================
  // Emails Methods
  // ============================================

  fetchEmails: async (params?: EmailQueryParams) => {
    set({ isEmailLoading: true });
    try {
      const emails = await apiService.listEmails(params);
      set({ emails, isEmailLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch emails:', error);
      toast.error(`Failed to load emails: ${message}`);
      set({ isEmailLoading: false });
    }
  },

  fetchEmailDetails: async (emailId: number) => {
    set({ isEmailDetailLoading: true });
    try {
      const email = await apiService.getEmail(emailId);
      set({ selectedEmail: email, isEmailDetailLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch email details:', error);
      toast.error(`Failed to load email details: ${message}`);
      set({ isEmailDetailLoading: false });
    }
  },

  replyToEmail: async (emailId: number, data: ReplyToEmailRequest) => {
    try {
      const updatedEmail = await apiService.replyToEmail(emailId, data);
      set({ selectedEmail: updatedEmail });
      toast.success('Email reply sent successfully');

      // Refresh emails list
      const state = get();
      state.fetchEmails({
        status: state.emailStatusFilter !== 'all' ? (state.emailStatusFilter as any) : undefined,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to reply to email:', error);
      toast.error(`Failed to send reply: ${message}`);
      throw error;
    }
  },

  clearSelectedEmail: () => {
    set({ selectedEmail: null });
  },

  setEmailStatusFilter: (status: string) => {
    set({ emailStatusFilter: status });
    const state = get();
    state.fetchEmails({
      status: status !== 'all' ? (status as any) : undefined,
    });
  },

  // ============================================
  // Analytics Methods
  // ============================================

  fetchAnalytics: async (params?: AnalyticsQueryParams) => {
    set({ isAnalyticsLoading: true });
    try {
      const analytics = await apiService.getSupportAnalytics(params);
      set({ analytics, isAnalyticsLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch analytics:', error);
      toast.error(`Failed to load analytics: ${message}`);
      set({ isAnalyticsLoading: false });
    }
  },

  setAnalyticsDateRange: (start: string, end: string) => {
    set({ analyticsDateRange: { start, end } });
    const state = get();
    state.fetchAnalytics({ start_date: start, end_date: end });
  },

  // ============================================
  // Users Methods (for context)
  // ============================================

  fetchUserSupportHistory: async (userId: number) => {
    try {
      const history = await apiService.getUserSupportHistory(userId);
      return history;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch user support history:', error);
      toast.error(`Failed to load user history: ${message}`);
      return null;
    }
  },
}));
