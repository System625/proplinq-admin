import {
  SupportDashboard,
  Ticket,
  TicketDetails,
  TicketResponse,
  TicketHistory,
  ListTicketsResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  RespondToTicketRequest,
  AssignTicketRequest,
  TagTicketRequest,
  ForwardTicketRequest,
  CloseTicketRequest,
  TicketQueryParams,
  Chat,
  ChatDetails,
  ChatMessage,
  ListChatsResponse,
  RespondToChatRequest,
  AssignChatRequest,
  CloseChatRequest,
  ChatQueryParams,
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
  ApiUser,
  UserActivity,
  UserSupportHistory,
} from '@/types/api';

// Support API service
export const supportApiService = {
  // ============================================
  // Dashboard
  // ============================================

  async getSupportDashboard(): Promise<SupportDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/support/dashboard', { headers });
    if (!response.ok) throw new Error('Failed to fetch support dashboard');
    const data = await response.json();
    return data.data || data;
  },

  // ============================================
  // Tickets
  // ============================================

  async listTickets(params?: TicketQueryParams): Promise<ListTicketsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/support/tickets${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    const data = await response.json();
    return data.data || data;
  },

  async getTicket(ticketId: number): Promise<TicketDetails> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch ticket');
    const data = await response.json();
    return data.data || data;
  },

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/support/tickets', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async updateTicket(ticketId: number, data: UpdateTicketRequest): Promise<Ticket> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async respondToTicket(ticketId: number, data: RespondToTicketRequest): Promise<TicketResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}/respond`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to respond to ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async assignTicket(ticketId: number, data: AssignTicketRequest): Promise<Ticket> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}/assign`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to assign ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async tagTicket(ticketId: number, data: TagTicketRequest): Promise<Ticket> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}/tag`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to tag ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async forwardTicket(ticketId: number, data: ForwardTicketRequest): Promise<Ticket> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}/forward`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to forward ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async closeTicket(ticketId: number, data?: CloseTicketRequest): Promise<Ticket> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}/close`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error('Failed to close ticket');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async getTicketHistory(ticketId: number): Promise<TicketHistory[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/tickets/${ticketId}/history`, { headers });
    if (!response.ok) throw new Error('Failed to fetch ticket history');
    const data = await response.json();
    return data.data || data;
  },

  // ============================================
  // Chats
  // ============================================

  async listChats(params?: ChatQueryParams): Promise<ListChatsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/support/chats${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch chats');
    const data = await response.json();
    return data.data || data;
  },

  async getChat(chatId: number): Promise<ChatDetails> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/chats/${chatId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch chat');
    const data = await response.json();
    return data.data || data;
  },

  async respondToChat(chatId: number, data: RespondToChatRequest): Promise<ChatMessage> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/chats/${chatId}/respond`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to respond to chat');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async assignChat(chatId: number, data: AssignChatRequest): Promise<Chat> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/chats/${chatId}/assign`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to assign chat');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  async closeChat(chatId: number, data?: CloseChatRequest): Promise<Chat> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/chats/${chatId}/close`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error('Failed to close chat');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  // ============================================
  // Calls
  // ============================================

  async listCalls(params?: CallQueryParams): Promise<ListCallsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }

    const url = queryParams.toString()
      ? `/api/support/calls?${queryParams}`
      : '/api/support/calls';

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Failed to fetch calls');
    const data = await response.json();
    return data.data || data;
  },

  async getCall(callId: number): Promise<Call> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/calls/${callId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch call details');
    const data = await response.json();
    return data.data || data;
  },

  async scheduleCallback(callId: number, data: ScheduleCallbackRequest): Promise<Call> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/calls/${callId}/callback`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to schedule callback');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  // ============================================
  // Emails
  // ============================================

  async listEmails(params?: EmailQueryParams): Promise<ListEmailsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }

    const url = queryParams.toString()
      ? `/api/support/emails?${queryParams}`
      : '/api/support/emails';

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Failed to fetch emails');
    const data = await response.json();
    return data.data || data;
  },

  async getEmail(emailId: number): Promise<Email> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/emails/${emailId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch email details');
    const data = await response.json();
    return data.data || data;
  },

  async replyToEmail(emailId: number, data: ReplyToEmailRequest): Promise<Email> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/emails/${emailId}/reply`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to reply to email');
    const responseData = await response.json();
    return responseData.data || responseData;
  },

  // ============================================
  // Analytics
  // ============================================

  async getSupportAnalytics(params?: AnalyticsQueryParams): Promise<SupportAnalytics> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }

    const url = queryParams.toString()
      ? `/api/support/analytics?${queryParams}`
      : '/api/support/analytics';

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    const data = await response.json();
    return data.data || data;
  },

  // ============================================
  // Users (for support context)
  // ============================================

  async getSupportUser(userId: number): Promise<ApiUser> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/users/${userId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user');
    const data = await response.json();
    return data.data || data;
  },

  async getUserActivity(userId: number): Promise<UserActivity[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/users/${userId}/activity`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user activity');
    const data = await response.json();
    return data.data || data;
  },

  async getUserSupportHistory(userId: number): Promise<UserSupportHistory> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/support/users/${userId}/support-history`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user support history');
    const data = await response.json();
    return data.data || data;
  },
};
