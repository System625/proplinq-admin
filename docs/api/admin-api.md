# Admin API Documentation

Base URL: `https://proapi.proplinq.com/api/v1`

## Authentication

All admin endpoints require bearer token authentication.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboard

#### Get Dashboard Stats
Retrieves overview statistics for the admin dashboard.

**Endpoint:** `GET /admin/dashboard/stats`

**Headers:**
```typescript
{
  'Authorization': 'Bearer {{token}}',
  'Accept': 'application/json'
}
```

**Response:**
```typescript
interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  pendingKYC: number;
  // ... other stats
}
```

**Usage Example:**
```typescript
import { apiClient } from '@/lib/axios';

export async function getDashboardStats() {
  const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
  return response.data;
}
```

---

### User Management

#### List Users
Retrieves a paginated list of all users.

**Endpoint:** `GET /admin/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)
- `search` (optional): Search term for filtering users
- `role` (optional): Filter by user role
- `status` (optional): Filter by user status

**Response:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'agent' | 'hotel' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface ListUsersResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
import { apiClient } from '@/lib/axios';

export async function listUsers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const response = await apiClient.get<ListUsersResponse>('/admin/users', {
    params
  });
  return response.data;
}
```

---

#### Get User Details
Retrieves detailed information about a specific user.

**Endpoint:** `GET /admin/users/:id`

**Path Parameters:**
- `id`: User ID

**Response:**
```typescript
interface UserDetails extends User {
  kyc_status?: 'pending' | 'approved' | 'rejected';
  properties?: Property[];
  bookings?: Booking[];
  transactions?: Transaction[];
}
```

**Usage Example:**
```typescript
export async function getUserDetails(userId: number) {
  const response = await apiClient.get<UserDetails>(`/admin/users/${userId}`);
  return response.data;
}
```

---

### Booking Management

#### List All Bookings
Retrieves all bookings across the platform.

**Endpoint:** `GET /admin/bookings`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)
- `user_id` (optional): Filter by user
- `property_id` (optional): Filter by property
- `start_date` (optional): Filter by check-in date (YYYY-MM-DD)
- `end_date` (optional): Filter by check-out date (YYYY-MM-DD)

**Response:**
```typescript
interface Booking {
  id: number;
  user_id: number;
  property_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  user: User;
  property: Property;
}

interface ListBookingsResponse {
  data: Booking[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listBookings(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  user_id?: number;
  property_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  const response = await apiClient.get<ListBookingsResponse>('/admin/bookings', {
    params
  });
  return response.data;
}
```

---

#### Manage Booking
Update booking status or details.

**Endpoint:** `PATCH /admin/bookings/:id`

**Path Parameters:**
- `id`: Booking ID

**Request Body:**
```typescript
interface ManageBookingRequest {
  status?: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function manageBooking(
  bookingId: number,
  data: ManageBookingRequest
) {
  const response = await apiClient.patch(`/admin/bookings/${bookingId}`, data);
  return response.data;
}
```

---

### Transaction Management

#### List All Transactions
Retrieves all financial transactions.

**Endpoint:** `GET /admin/transactions`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): Filter by type (payment, refund, withdrawal)
- `status` (optional): Filter by status
- `user_id` (optional): Filter by user
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
```typescript
interface Transaction {
  id: number;
  user_id: number;
  type: 'payment' | 'refund' | 'withdrawal' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ListTransactionsResponse {
  data: Transaction[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listTransactions(params?: {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  const response = await apiClient.get<ListTransactionsResponse>('/admin/transactions', {
    params
  });
  return response.data;
}
```

---

#### Process Refund
Process a refund for a transaction.

**Endpoint:** `POST /admin/transactions/:id/refund`

**Path Parameters:**
- `id`: Transaction ID

**Request Body:**
```typescript
interface ProcessRefundRequest {
  amount?: number; // Optional: partial refund amount
  reason: string;
}
```

**Usage Example:**
```typescript
export async function processRefund(
  transactionId: number,
  data: ProcessRefundRequest
) {
  const response = await apiClient.post(
    `/admin/transactions/${transactionId}/refund`,
    data
  );
  return response.data;
}
```

---

### KYC Management

#### List All KYC Verifications
Retrieves all KYC verification submissions.

**Endpoint:** `GET /admin/kyc`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (pending, approved, rejected)
- `type` (optional): Filter by type (user, agent)

**Response:**
```typescript
interface KYCVerification {
  id: number;
  user_id: number;
  type: 'user' | 'agent';
  status: 'pending' | 'approved' | 'rejected';
  id_type: string;
  id_number: string;
  id_document_url: string;
  selfie_url?: string;
  additional_documents?: string[];
  rejection_reason?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  user: User;
}

interface ListKYCResponse {
  data: KYCVerification[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listKYC(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  type?: string;
}) {
  const response = await apiClient.get<ListKYCResponse>('/admin/kyc', {
    params
  });
  return response.data;
}
```

---

#### List Pending KYC Verifications
Retrieves only pending KYC verifications.

**Endpoint:** `GET /admin/kyc/pending`

**Usage Example:**
```typescript
export async function listPendingKYC(params?: {
  page?: number;
  per_page?: number;
}) {
  const response = await apiClient.get<ListKYCResponse>('/admin/kyc/pending', {
    params
  });
  return response.data;
}
```

---

#### Get KYC Verification Details
Retrieves detailed information about a KYC submission.

**Endpoint:** `GET /admin/kyc/:id`

**Path Parameters:**
- `id`: KYC verification ID

**Usage Example:**
```typescript
export async function getKYCDetails(kycId: number) {
  const response = await apiClient.get<KYCVerification>(`/admin/kyc/${kycId}`);
  return response.data;
}
```

---

#### Review KYC Verification
Approve or reject a KYC verification.

**Endpoint:** `POST /admin/kyc/:id/review`

**Path Parameters:**
- `id`: KYC verification ID

**Request Body:**
```typescript
interface ReviewKYCRequest {
  status: 'approved' | 'rejected';
  reason?: string; // Required if status is 'rejected'
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function reviewKYC(
  kycId: number,
  data: ReviewKYCRequest
) {
  const response = await apiClient.post(`/admin/kyc/${kycId}/review`, data);
  return response.data;
}
```

---

### Admin Login

#### Admin Login
Authenticate admin users.

**Endpoint:** `POST /admin-login`

**Request Body:**
```typescript
interface AdminLoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface AdminLoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
}
```

**Usage Example:**
```typescript
export async function adminLogin(credentials: AdminLoginRequest) {
  const response = await apiClient.post<AdminLoginResponse>(
    '/admin-login',
    credentials
  );
  return response.data;
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```typescript
{
  "message": "Validation error",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```typescript
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```typescript
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```typescript
{
  "message": "Resource not found."
}
```

### 500 Internal Server Error
```typescript
{
  "message": "Server Error"
}
```

---

## Store Integration

Here's how to integrate these endpoints with Zustand store:

```typescript
// stores/admin-store.ts
import { create } from 'zustand';
import {
  getDashboardStats,
  listUsers,
  listBookings,
  listKYC
} from '@/lib/api/admin';

interface AdminStore {
  dashboardStats: DashboardStats | null;
  users: ListUsersResponse | null;
  bookings: ListBookingsResponse | null;
  kycVerifications: ListKYCResponse | null;

  fetchDashboardStats: () => Promise<void>;
  fetchUsers: (params?: any) => Promise<void>;
  fetchBookings: (params?: any) => Promise<void>;
  fetchKYC: (params?: any) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  dashboardStats: null,
  users: null,
  bookings: null,
  kycVerifications: null,

  fetchDashboardStats: async () => {
    const data = await getDashboardStats();
    set({ dashboardStats: data });
  },

  fetchUsers: async (params) => {
    const data = await listUsers(params);
    set({ users: data });
  },

  fetchBookings: async (params) => {
    const data = await listBookings(params);
    set({ bookings: data });
  },

  fetchKYC: async (params) => {
    const data = await listKYC(params);
    set({ kycVerifications: data });
  }
}));
```
