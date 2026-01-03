# Support API Documentation

Base URL: already in .env.local

## Authentication

All support endpoints require bearer token authentication and support role.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboard

#### Get Support Dashboard
Retrieves overview metrics for the support dashboard.

**Endpoint:** `GET /support/dashboard`

**Response:**
```typescript
interface SupportDashboard {
  open_tickets: number;
  pending_tickets: number;
  resolved_tickets: number;
  active_chats: number;
  avg_response_time: number; // in minutes
  customer_satisfaction: number; // percentage
  tickets_today: number;
  chats_today: number;
}
```

**Usage Example:**
```typescript
import { apiClient } from '@/lib/axios';

export async function getSupportDashboard() {
  const response = await apiClient.get<SupportDashboard>('/support/dashboard');
  return response.data;
}
```

---

### Tickets

#### List Tickets
Retrieves a paginated list of support tickets.

**Endpoint:** `GET /support/tickets`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (open, in_progress, resolved, closed)
- `priority` (optional): Filter by priority (low, medium, high, urgent)
- `assigned_to` (optional): Filter by assigned agent ID
- `search` (optional): Search in title and description

**Response:**
```typescript
interface Ticket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  assigned_to?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  user: User;
  assigned_agent?: User;
  responses_count: number;
}

interface ListTicketsResponse {
  data: Ticket[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listTickets(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  priority?: string;
  assigned_to?: number;
  search?: string;
}) {
  const response = await apiClient.get<ListTicketsResponse>('/support/tickets', {
    params
  });
  return response.data;
}
```

---

#### Get Ticket
Retrieves detailed information about a specific ticket.

**Endpoint:** `GET /support/tickets/:id`

**Path Parameters:**
- `id`: Ticket ID

**Response:**
```typescript
interface TicketDetails extends Ticket {
  responses: TicketResponse[];
  history: TicketHistory[];
  attachments?: Attachment[];
}

interface TicketResponse {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_staff: boolean;
  created_at: string;
  user: User;
}

interface TicketHistory {
  id: number;
  ticket_id: number;
  action: string;
  user_id: number;
  details?: any;
  created_at: string;
  user: User;
}
```

**Usage Example:**
```typescript
export async function getTicket(ticketId: number) {
  const response = await apiClient.get<TicketDetails>(`/support/tickets/${ticketId}`);
  return response.data;
}
```

---

#### Create Ticket
Creates a new support ticket.

**Endpoint:** `POST /support/tickets`

**Request Body:**
```typescript
interface CreateTicketRequest {
  user_id: number;
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'general';
}
```

**Usage Example:**
```typescript
export async function createTicket(data: CreateTicketRequest) {
  const response = await apiClient.post('/support/tickets', data);
  return response.data;
}
```

---

#### Update Ticket
Updates ticket information.

**Endpoint:** `PUT /support/tickets/:id`

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```typescript
interface UpdateTicketRequest {
  subject?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'general';
}
```

**Usage Example:**
```typescript
export async function updateTicket(
  ticketId: number,
  data: UpdateTicketRequest
) {
  const response = await apiClient.put(`/support/tickets/${ticketId}`, data);
  return response.data;
}
```

---

#### Respond to Ticket
Add a response to a ticket.

**Endpoint:** `POST /support/tickets/:id/respond`

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```typescript
interface RespondToTicketRequest {
  message: string;
  is_internal?: boolean; // Internal note, not visible to user (default: false)
}
```

**Usage Example:**
```typescript
export async function respondToTicket(
  ticketId: number,
  data: RespondToTicketRequest
) {
  const response = await apiClient.post(
    `/support/tickets/${ticketId}/respond`,
    data
  );
  return response.data;
}
```

---

#### Assign Ticket
Assign a ticket to a support agent.

**Endpoint:** `POST /support/tickets/:id/assign`

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```typescript
interface AssignTicketRequest {
  assigned_to: number;
}
```

**Usage Example:**
```typescript
export async function assignTicket(
  ticketId: number,
  data: AssignTicketRequest
) {
  const response = await apiClient.post(
    `/support/tickets/${ticketId}/assign`,
    data
  );
  return response.data;
}
```

---

#### Tag Ticket
Add tags to a ticket for categorization.

**Endpoint:** `POST /support/tickets/:id/tag`

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```typescript
interface TagTicketRequest {
  tag: string;
}
```

**Usage Example:**
```typescript
export async function tagTicket(
  ticketId: number,
  data: TagTicketRequest
) {
  const response = await apiClient.post(
    `/support/tickets/${ticketId}/tag`,
    data
  );
  return response.data;
}
```

---

#### Forward Ticket
Forward a ticket to another department or team.

**Endpoint:** `POST /support/tickets/:id/forward`

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```typescript
interface ForwardTicketRequest {
  department: string;
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function forwardTicket(
  ticketId: number,
  data: ForwardTicketRequest
) {
  const response = await apiClient.post(
    `/support/tickets/${ticketId}/forward`,
    data
  );
  return response.data;
}
```

---

#### Close Ticket
Close a resolved ticket.

**Endpoint:** `POST /support/tickets/:id/close`

**Path Parameters:**
- `id`: Ticket ID

**Request Body:**
```typescript
interface CloseTicketRequest {
  satisfaction_rating?: number; // 1-5
}
```

**Usage Example:**
```typescript
export async function closeTicket(
  ticketId: number,
  data?: CloseTicketRequest
) {
  const response = await apiClient.post(
    `/support/tickets/${ticketId}/close`,
    data
  );
  return response.data;
}
```

---

#### Get Ticket History
Retrieves the complete history of a ticket.

**Endpoint:** `GET /support/tickets/:id/history`

**Path Parameters:**
- `id`: Ticket ID

**Usage Example:**
```typescript
export async function getTicketHistory(ticketId: number) {
  const response = await apiClient.get<TicketHistory[]>(
    `/support/tickets/${ticketId}/history`
  );
  return response.data;
}
```

---

### Chats

#### List Chats
Retrieves a list of support chat conversations.

**Endpoint:** `GET /support/chats`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (active, waiting, closed)
- `assigned_to` (optional): Filter by assigned agent ID

**Response:**
```typescript
interface Chat {
  id: number;
  user_id: number;
  status: 'active' | 'waiting' | 'closed';
  assigned_to?: number;
  started_at: string;
  ended_at?: string;
  user: User;
  assigned_agent?: User;
  last_message?: ChatMessage;
  unread_count: number;
}

interface ListChatsResponse {
  data: Chat[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listChats(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  assigned_to?: number;
}) {
  const response = await apiClient.get<ListChatsResponse>('/support/chats', {
    params
  });
  return response.data;
}
```

---

#### Get Chat
Retrieves a specific chat conversation with messages.

**Endpoint:** `GET /support/chats/:id`

**Path Parameters:**
- `id`: Chat ID

**Response:**
```typescript
interface ChatDetails extends Chat {
  messages: ChatMessage[];
}

interface ChatMessage {
  id: number;
  chat_id: number;
  user_id: number;
  message: string;
  is_staff: boolean;
  read_at?: string;
  created_at: string;
  user: User;
}
```

**Usage Example:**
```typescript
export async function getChat(chatId: number) {
  const response = await apiClient.get<ChatDetails>(`/support/chats/${chatId}`);
  return response.data;
}
```

---

#### Respond to Chat
Send a message in a chat conversation.

**Endpoint:** `POST /support/chats/:id/respond`

**Path Parameters:**
- `id`: Chat ID

**Request Body:**
```typescript
interface RespondToChatRequest {
  message: string;
}
```

**Usage Example:**
```typescript
export async function respondToChat(
  chatId: number,
  data: RespondToChatRequest
) {
  const response = await apiClient.post(
    `/support/chats/${chatId}/respond`,
    data
  );
  return response.data;
}
```

---

#### Assign Chat
Assign a chat to a support agent.

**Endpoint:** `POST /support/chats/:id/assign`

**Path Parameters:**
- `id`: Chat ID

**Request Body:**
```typescript
interface AssignChatRequest {
  assigned_to: number;
}
```

**Usage Example:**
```typescript
export async function assignChat(
  chatId: number,
  data: AssignChatRequest
) {
  const response = await apiClient.post(
    `/support/chats/${chatId}/assign`,
    data
  );
  return response.data;
}
```

---

#### Close Chat
End a chat conversation.

**Endpoint:** `POST /support/chats/:id/close`

**Path Parameters:**
- `id`: Chat ID

**Request Body:**
```typescript
interface CloseChatRequest {
  satisfaction_rating?: number; // 1-5
}
```

**Usage Example:**
```typescript
export async function closeChat(chatId: number, data?: CloseChatRequest) {
  const response = await apiClient.post(`/support/chats/${chatId}/close`, data);
  return response.data;
}
```

---

### Calls

#### List Calls
Retrieves a list of support call records.

**Endpoint:** `GET /support/calls`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status
- `assigned_to` (optional): Filter by assigned agent ID

**Response:**
```typescript
interface Call {
  id: number;
  user_id: number;
  phone_number: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  assigned_to?: number;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  duration?: number; // in seconds
  notes?: string;
  recording_url?: string;
  user: User;
  assigned_agent?: User;
}

interface ListCallsResponse {
  data: Call[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listCalls(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  assigned_to?: number;
}) {
  const response = await apiClient.get<ListCallsResponse>('/support/calls', {
    params
  });
  return response.data;
}
```

---

#### Get Call
Retrieves detailed information about a call.

**Endpoint:** `GET /support/calls/:id`

**Path Parameters:**
- `id`: Call ID

**Usage Example:**
```typescript
export async function getCall(callId: number) {
  const response = await apiClient.get<Call>(`/support/calls/${callId}`);
  return response.data;
}
```

---

#### Schedule Callback
Schedule a callback for a user.

**Endpoint:** `POST /support/calls/:id/callback`

**Path Parameters:**
- `id`: Call ID

**Request Body:**
```typescript
interface ScheduleCallbackRequest {
  callback_scheduled_at: string; // ISO 8601 datetime
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function scheduleCallback(callId: number, data: ScheduleCallbackRequest) {
  const response = await apiClient.post(`/support/calls/${callId}/callback`, data);
  return response.data;
}
```

---

### Emails

#### List Emails
Retrieves support emails.

**Endpoint:** `GET /support/emails`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (unread, read, replied)

**Response:**
```typescript
interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: 'unread' | 'read' | 'replied';
  replied_at?: string;
  created_at: string;
}

interface ListEmailsResponse {
  data: Email[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listEmails(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}) {
  const response = await apiClient.get<ListEmailsResponse>('/support/emails', {
    params
  });
  return response.data;
}
```

---

#### Get Email
Retrieves a specific email.

**Endpoint:** `GET /support/emails/:id`

**Path Parameters:**
- `id`: Email ID

**Usage Example:**
```typescript
export async function getEmail(emailId: number) {
  const response = await apiClient.get<Email>(`/support/emails/${emailId}`);
  return response.data;
}
```

---

#### Reply to Email
Reply to a support email.

**Endpoint:** `POST /support/emails/:id/reply`

**Path Parameters:**
- `id`: Email ID

**Request Body:**
```typescript
interface ReplyToEmailRequest {
  subject: string;
  body: string;
}
```

**Usage Example:**
```typescript
export async function replyToEmail(
  emailId: number,
  data: ReplyToEmailRequest
) {
  const response = await apiClient.post(
    `/support/emails/${emailId}/reply`,
    data
  );
  return response.data;
}
```

---

### Analytics

#### Get Support Analytics
Retrieves analytics and metrics for support operations.

**Endpoint:** `GET /support/analytics`

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)
- `metric` (optional): Specific metric to retrieve

**Response:**
```typescript
interface SupportAnalytics {
  total_tickets: number;
  resolved_tickets: number;
  avg_resolution_time: number; // in hours
  avg_response_time: number; // in minutes
  customer_satisfaction: number; // percentage
  tickets_by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  tickets_by_status: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  agent_performance: Array<{
    agent_id: number;
    agent_name: string;
    tickets_handled: number;
    avg_resolution_time: number;
    satisfaction_rating: number;
  }>;
}
```

**Usage Example:**
```typescript
export async function getSupportAnalytics(params?: {
  start_date?: string;
  end_date?: string;
  metric?: string;
}) {
  const response = await apiClient.get<SupportAnalytics>('/support/analytics', {
    params
  });
  return response.data;
}
```

---

### Users

#### Get User
Retrieves user information for support context.

**Endpoint:** `GET /support/users/:id`

**Path Parameters:**
- `id`: User ID

**Usage Example:**
```typescript
export async function getSupportUser(userId: number) {
  const response = await apiClient.get(`/support/users/${userId}`);
  return response.data;
}
```

---

#### Get User Activity
Retrieves user activity timeline.

**Endpoint:** `GET /support/users/:id/activity`

**Path Parameters:**
- `id`: User ID

**Usage Example:**
```typescript
export async function getUserActivity(userId: number) {
  const response = await apiClient.get(`/support/users/${userId}/activity`);
  return response.data;
}
```

---

#### Get User Support History
Retrieves user's complete support interaction history.

**Endpoint:** `GET /support/users/:id/support-history`

**Path Parameters:**
- `id`: User ID

**Response:**
```typescript
interface UserSupportHistory {
  tickets: Ticket[];
  chats: Chat[];
  calls: Call[];
  total_interactions: number;
  avg_satisfaction: number;
}
```

**Usage Example:**
```typescript
export async function getUserSupportHistory(userId: number) {
  const response = await apiClient.get<UserSupportHistory>(
    `/support/users/${userId}/support-history`
  );
  return response.data;
}
```

---

## Store Integration

```typescript
// stores/support-store.ts
import { create } from 'zustand';
import {
  getSupportDashboard,
  listTickets,
  listChats,
  getSupportAnalytics
} from '@/lib/api/support';

interface SupportStore {
  dashboard: SupportDashboard | null;
  tickets: ListTicketsResponse | null;
  chats: ListChatsResponse | null;
  analytics: SupportAnalytics | null;

  fetchDashboard: () => Promise<void>;
  fetchTickets: (params?: any) => Promise<void>;
  fetchChats: (params?: any) => Promise<void>;
  fetchAnalytics: (params?: any) => Promise<void>;
}

export const useSupportStore = create<SupportStore>((set) => ({
  dashboard: null,
  tickets: null,
  chats: null,
  analytics: null,

  fetchDashboard: async () => {
    const data = await getSupportDashboard();
    set({ dashboard: data });
  },

  fetchTickets: async (params) => {
    const data = await listTickets(params);
    set({ tickets: data });
  },

  fetchChats: async (params) => {
    const data = await listChats(params);
    set({ chats: data });
  },

  fetchAnalytics: async (params) => {
    const data = await getSupportAnalytics(params);
    set({ analytics: data });
  }
}));
```
