# CRM API Documentation

Base URL: already in .env.local

## Authentication

All CRM endpoints require bearer token authentication.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboard

#### Get CRM Dashboard
**Endpoint:** `GET /crm/dashboard`

**Query Parameters:**
- `my_leads` (optional, boolean): Set to true to filter by assigned user (default: false)

**Response:**
```typescript
interface CRMDashboard {
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  total_contacts: number;
  active_contacts: number;
  pipeline_value: number;
  conversion_rate: number;
  avg_deal_size: number;
  activities_this_week: number;
}
```

**Usage Example:**
```typescript
import { apiClient } from '@/lib/axios';

export async function getCRMDashboard(myLeads = false) {
  const response = await apiClient.get<CRMDashboard>('/crm/dashboard', {
    params: { my_leads: myLeads }
  });
  return response.data;
}
```

---

### Leads

#### List Leads
**Endpoint:** `GET /crm/leads`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page (default: 15)
- `status` (optional): Filter by status (new, contacted, qualified, proposal, negotiation, closed_won, closed_lost)
- `source` (optional): Filter by source (website, referral, social_media, email_campaign, cold_call, event, partner, other)
- `assigned_to` (optional): Filter by assigned user ID
- `search` (optional): Search by name, email, company, or phone

**Response:**
```typescript
interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  description?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  source: 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'event' | 'partner' | 'other';
  estimated_value?: number;
  assigned_to?: number;
  contact_id?: number;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  assigned_user?: User;
}

interface ListLeadsResponse {
  data: Lead[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listLeads(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  source?: string;
  assigned_to?: number;
  search?: string;
}) {
  const response = await apiClient.get<ListLeadsResponse>('/crm/leads', {
    params
  });
  return response.data;
}
```

---

#### Create Lead
**Endpoint:** `POST /crm/leads`

**Request Body:**
```typescript
interface CreateLeadRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  description?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  source: 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'event' | 'partner' | 'other';
  estimated_value?: number;
  assigned_to?: number;
  contact_id?: number;
  custom_fields?: Record<string, any>;
}
```

**Usage Example:**
```typescript
export async function createLead(data: CreateLeadRequest) {
  const response = await apiClient.post('/crm/leads', data);
  return response.data;
}
```

---

#### Get Lead
**Endpoint:** `GET /crm/leads/:id`

**Path Parameters:**
- `id`: Lead ID

**Response:**
```typescript
interface LeadDetails extends Lead {
  activities: Activity[];
  notes: Note[];
  contacts: Contact[];
}
```

**Usage Example:**
```typescript
export async function getLead(leadId: number) {
  const response = await apiClient.get<LeadDetails>(`/crm/leads/${leadId}`);
  return response.data;
}
```

---

#### Update Lead
**Endpoint:** `PUT /crm/leads/:id`

**Path Parameters:**
- `id`: Lead ID

**Request Body:**
```typescript
interface UpdateLeadRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  description?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  source?: 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'event' | 'partner' | 'other';
  estimated_value?: number;
  assigned_to?: number;
  contact_id?: number;
  custom_fields?: Record<string, any>;
}
```

**Usage Example:**
```typescript
export async function updateLead(
  leadId: number,
  data: UpdateLeadRequest
) {
  const response = await apiClient.put(`/crm/leads/${leadId}`, data);
  return response.data;
}
```

---

#### Delete Lead
**Endpoint:** `DELETE /crm/leads/:id`

**Path Parameters:**
- `id`: Lead ID

**Usage Example:**
```typescript
export async function deleteLead(leadId: number) {
  const response = await apiClient.delete(`/crm/leads/${leadId}`);
  return response.data;
}
```

---

#### Convert Lead
Convert a lead to a user (closes as won).

**Endpoint:** `POST /crm/leads/:id/convert`

**Path Parameters:**
- `id`: Lead ID

**Request Body:**
```typescript
interface ConvertLeadRequest {
  user_id: number;
}
```

**Usage Example:**
```typescript
export async function convertLead(
  leadId: number,
  data: ConvertLeadRequest
) {
  const response = await apiClient.post(`/crm/leads/${leadId}/convert`, data);
  return response.data;
}
```

---

### Contacts

#### List Contacts
**Endpoint:** `GET /crm/contacts`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page (default: 15)
- `search` (optional): Search by name, email, company, or phone
- `type` (optional): Filter by type (customer, partner, vendor, prospect, other)
- `assigned_to` (optional): Filter by assigned user ID

**Response:**
```typescript
interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  notes?: string;
  type: 'customer' | 'partner' | 'vendor' | 'prospect' | 'other';
  assigned_to?: number;
  user_id?: number;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  assigned_user?: User;
}

interface ListContactsResponse {
  data: Contact[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listContacts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  assigned_to?: number;
}) {
  const response = await apiClient.get<ListContactsResponse>('/crm/contacts', {
    params
  });
  return response.data;
}
```

---

#### Create Contact
**Endpoint:** `POST /crm/contacts`

**Request Body:**
```typescript
interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  notes?: string;
  type: 'customer' | 'partner' | 'vendor' | 'prospect' | 'other';
  assigned_to?: number;
  user_id?: number;
  custom_fields?: Record<string, any>;
}
```

**Usage Example:**
```typescript
export async function createContact(data: CreateContactRequest) {
  const response = await apiClient.post('/crm/contacts', data);
  return response.data;
}
```

---

#### Get Contact
**Endpoint:** `GET /crm/contacts/:id`

**Path Parameters:**
- `id`: Contact ID

**Response:**
```typescript
interface ContactDetails extends Contact {
  activities: Activity[];
  leads: Lead[];
}
```

**Usage Example:**
```typescript
export async function getContact(contactId: number) {
  const response = await apiClient.get<ContactDetails>(
    `/crm/contacts/${contactId}`
  );
  return response.data;
}
```

---

#### Update Contact
**Endpoint:** `PUT /crm/contacts/:id`

**Path Parameters:**
- `id`: Contact ID

**Request Body:**
```typescript
interface UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  notes?: string;
  type?: 'customer' | 'partner' | 'vendor' | 'prospect' | 'other';
  assigned_to?: number;
  user_id?: number;
  custom_fields?: Record<string, any>;
}
```

**Usage Example:**
```typescript
export async function updateContact(
  contactId: number,
  data: UpdateContactRequest
) {
  const response = await apiClient.put(`/crm/contacts/${contactId}`, data);
  return response.data;
}
```

---

#### Delete Contact
**Endpoint:** `DELETE /crm/contacts/:id`

**Path Parameters:**
- `id`: Contact ID

**Usage Example:**
```typescript
export async function deleteContact(contactId: number) {
  const response = await apiClient.delete(`/crm/contacts/${contactId}`);
  return response.data;
}
```

---

### Activities

#### List Activities
**Endpoint:** `GET /crm/activities`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page (default: 15)
- `type` (optional): Filter by type (note, call, email, meeting, task, other)
- `lead_id` (optional): Filter by lead ID
- `contact_id` (optional): Filter by contact ID
- `user_id` (optional): Filter by user ID

**Response:**
```typescript
interface Activity {
  id: number;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'other';
  subject: string;
  description?: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string; // ISO 8601 datetime
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: Record<string, any>;
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_user?: User;
  lead?: Lead;
  contact?: Contact;
}

interface ListActivitiesResponse {
  data: Activity[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listActivities(params?: {
  page?: number;
  per_page?: number;
  type?: string;
  lead_id?: number;
  contact_id?: number;
  user_id?: number;
}) {
  const response = await apiClient.get<ListActivitiesResponse>(
    '/crm/activities',
    { params }
  );
  return response.data;
}
```

---

#### Create Activity
**Endpoint:** `POST /crm/activities`

All activity types use the same endpoint with different request bodies based on the `type` field.

**Create Activity - Note:**
```typescript
interface CreateNoteRequest {
  type: 'note';
  subject: string;
  description: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string; // ISO 8601 datetime
  metadata?: Record<string, any>;
}
```

**Create Activity - Call:**
```typescript
interface CreateCallRequest {
  type: 'call';
  subject: string;
  description?: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string; // ISO 8601 datetime
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: {
    call_direction?: 'inbound' | 'outbound';
    phone_number?: string;
    [key: string]: any;
  };
}
```

**Create Activity - Email:**
```typescript
interface CreateEmailRequest {
  type: 'email';
  subject: string;
  description: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string; // ISO 8601 datetime
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: {
    email_to?: string;
    email_subject?: string;
    attachments?: string[];
    [key: string]: any;
  };
}
```

**Create Activity - Meeting:**
```typescript
interface CreateMeetingRequest {
  type: 'meeting';
  subject: string;
  description?: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string; // ISO 8601 datetime
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: {
    location?: string;
    attendees?: string[];
    meeting_type?: string;
    [key: string]: any;
  };
}
```

**Usage Example:**
```typescript
export async function createActivity(
  data: CreateNoteRequest | CreateCallRequest | CreateEmailRequest | CreateMeetingRequest
) {
  const response = await apiClient.post('/crm/activities', data);
  return response.data;
}
```

---

#### Get Activity
**Endpoint:** `GET /crm/activities/:id`

**Path Parameters:**
- `id`: Activity ID

**Usage Example:**
```typescript
export async function getActivity(activityId: number) {
  const response = await apiClient.get<Activity>(`/crm/activities/${activityId}`);
  return response.data;
}
```

---

#### Update Activity
**Endpoint:** `PUT /crm/activities/:id`

**Path Parameters:**
- `id`: Activity ID

**Request Body:**
```typescript
interface UpdateActivityRequest {
  subject?: string;
  description?: string;
  activity_date?: string; // ISO 8601 datetime
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: Record<string, any>;
}
```

**Usage Example:**
```typescript
export async function updateActivity(
  activityId: number,
  data: UpdateActivityRequest
) {
  const response = await apiClient.put(`/crm/activities/${activityId}`, data);
  return response.data;
}
```

---

#### Delete Activity
**Endpoint:** `DELETE /crm/activities/:id`

**Path Parameters:**
- `id`: Activity ID

**Usage Example:**
```typescript
export async function deleteActivity(activityId: number) {
  const response = await apiClient.delete(`/crm/activities/${activityId}`);
  return response.data;
}
```

---

## Store Integration

```typescript
// stores/crm-store.ts
import { create } from 'zustand';
import {
  getCRMDashboard,
  listLeads,
  listContacts,
  listActivities
} from '@/lib/api/crm';

interface CRMStore {
  dashboard: CRMDashboard | null;
  leads: ListLeadsResponse | null;
  contacts: ListContactsResponse | null;
  activities: ListActivitiesResponse | null;

  fetchDashboard: () => Promise<void>;
  fetchLeads: (params?: any) => Promise<void>;
  fetchContacts: (params?: any) => Promise<void>;
  fetchActivities: (params?: any) => Promise<void>;
}

export const useCRMStore = create<CRMStore>((set) => ({
  dashboard: null,
  leads: null,
  contacts: null,
  activities: null,

  fetchDashboard: async () => {
    const data = await getCRMDashboard();
    set({ dashboard: data });
  },

  fetchLeads: async (params) => {
    const data = await listLeads(params);
    set({ leads: data });
  },

  fetchContacts: async (params) => {
    const data = await listContacts(params);
    set({ contacts: data });
  },

  fetchActivities: async (params) => {
    const data = await listActivities(params);
    set({ activities: data });
  }
}));
```

---

## Common Patterns

### Pagination
All list endpoints support pagination with these parameters:
- `page`: Current page number (1-based)
- `per_page`: Items per page (default: 10, max: 100)

### Search
Many endpoints support the `search` query parameter for filtering by name, email, or other text fields.

### Filtering
Use specific query parameters to filter results (e.g., `status`, `type`, `source`).

### Relationships
Related entities are often included in detail endpoints (e.g., `activities` in lead details).
