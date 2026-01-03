# Founder API Documentation

Base URL already in .env.local

## Authentication

All founder endpoints require bearer token authentication and founder role (highest privilege level).

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboards

#### Revenue Dashboard
**Endpoint:** `GET /founder/dashboard/revenue`

**Response:**
```typescript
interface RevenueDashboard {
  total_revenue: number;
  monthly_revenue: number;
  yearly_revenue: number;
  revenue_growth: number;
  revenue_by_source: {
    subscriptions: number;
    bookings: number;
    commissions: number;
    other: number;
  };
  revenue_trend: Array<{
    month: string;
    revenue: number;
  }>;
  top_revenue_properties: Array<{
    property_id: number;
    property_name: string;
    revenue: number;
  }>;
}
```

---

#### Subscriptions Dashboard
**Endpoint:** `GET /founder/dashboard/subscriptions`

**Response:**
```typescript
interface SubscriptionsDashboard {
  total_subscriptions: number;
  active_subscriptions: number;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  churn_rate: number;
  ltv: number; // Lifetime Value
  by_plan: {
    basic: number;
    premium: number;
    enterprise: number;
  };
  subscription_trend: Array<{
    month: string;
    new: number;
    cancelled: number;
    net: number;
  }>;
}
```

---

#### Wallets Dashboard
**Endpoint:** `GET /founder/dashboard/wallets`

**Response:**
```typescript
interface WalletsDashboard {
  total_balance: number;
  total_credited: number;
  total_withdrawn: number;
  pending_withdrawals: number;
  transaction_volume: number;
  top_users_by_balance: Array<{
    user_id: number;
    user_name: string;
    balance: number;
  }>;
}
```

---

#### Growth Dashboard
**Endpoint:** `GET /founder/dashboard/growth`

**Response:**
```typescript
interface GrowthDashboard {
  user_growth_rate: number;
  revenue_growth_rate: number;
  booking_growth_rate: number;
  new_users_this_month: number;
  active_users: number;
  user_retention_rate: number;
  growth_metrics: Array<{
    metric: string;
    current: number;
    previous: number;
    growth: number;
  }>;
}
```

---

#### Properties Dashboard
**Endpoint:** `GET /founder/dashboard/properties`

**Response:**
```typescript
interface PropertiesDashboard {
  total_properties: number;
  active_properties: number;
  properties_by_type: {
    hotel: number;
    shortlet: number;
    apartment: number;
  };
  avg_occupancy_rate: number;
  top_performing_properties: Array<{
    property_id: number;
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
}
```

---

#### Bookings Dashboard
**Endpoint:** `GET /founder/dashboard/bookings`

**Response:**
```typescript
interface BookingsDashboard {
  total_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  total_booking_value: number;
  avg_booking_value: number;
  booking_trend: Array<{
    date: string;
    bookings: number;
    value: number;
  }>;
}
```

---

#### Support Dashboard
**Endpoint:** `GET /founder/dashboard/support`

**Response:**
```typescript
interface SupportDashboard {
  open_tickets: number;
  resolved_tickets: number;
  avg_resolution_time: number; // in hours
  customer_satisfaction: number; // percentage
  support_volume_trend: Array<{
    date: string;
    tickets: number;
    chats: number;
  }>;
  agent_performance: Array<{
    agent_id: number;
    agent_name: string;
    tickets_handled: number;
    avg_resolution_time: number;
    satisfaction_rating: number;
  }>;
}
```

---

### Staff Management

#### List Staff
**Endpoint:** `GET /founder/staff`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `role` (optional): Filter by role
- `status` (optional): Filter by status (active, inactive)

**Response:**
```typescript
interface Staff {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'operations' | 'sales' | 'marketing';
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  created_at: string;
  last_login_at?: string;
}

interface ListStaffResponse {
  data: Staff[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

---

#### Get Staff
**Endpoint:** `GET /founder/staff/:id`

**Path Parameters:**
- `id`: Staff ID

---

#### Create Staff
**Endpoint:** `POST /founder/staff`

**Request Body:**
```typescript
interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'support' | 'operations' | 'sales' | 'marketing';
  permissions?: string[];
}
```

---

#### Update Staff
**Endpoint:** `PATCH /founder/staff/:id`

**Path Parameters:**
- `id`: Staff ID

**Request Body:**
```typescript
interface UpdateStaffRequest {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
```

---

#### Update Staff Permissions
**Endpoint:** `PATCH /founder/staff/:id/permissions`

**Path Parameters:**
- `id`: Staff ID

**Request Body:**
```typescript
interface UpdatePermissionsRequest {
  permissions: string[];
}
```

---

#### Delete Staff
**Endpoint:** `DELETE /founder/staff/:id`

**Path Parameters:**
- `id`: Staff ID

---

### Overrides

#### Approve KYC
Override and manually approve a KYC verification.

**Endpoint:** `POST /founder/overrides/kyc/:id/approve`

**Path Parameters:**
- `id`: KYC ID

**Request Body:**
```typescript
interface ApproveKYCOverrideRequest {
  reason: string;
  notes?: string;
}
```

---

#### Decline KYC
Override and decline a KYC verification.

**Endpoint:** `POST /founder/overrides/kyc/:id/decline`

**Path Parameters:**
- `id`: KYC ID

**Request Body:**
```typescript
interface DeclineKYCOverrideRequest {
  reason: string;
  notes?: string;
}
```

---

#### Override Subscription
Manually adjust subscription details.

**Endpoint:** `POST /founder/overrides/subscription/:id`

**Path Parameters:**
- `id`: Subscription ID

**Request Body:**
```typescript
interface OverrideSubscriptionRequest {
  plan?: string;
  amount?: number;
  end_date?: string;
  reason: string;
}
```

---

#### Override Payment
Manually mark payment as complete or failed.

**Endpoint:** `POST /founder/overrides/payment/:id`

**Path Parameters:**
- `id`: Payment ID

**Request Body:**
```typescript
interface OverridePaymentRequest {
  status: 'completed' | 'failed';
  reason: string;
  notes?: string;
}
```

---

### Discounts

#### List Discounts
**Endpoint:** `GET /founder/discounts`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): active | inactive | expired

**Response:**
```typescript
interface Discount {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'active' | 'inactive' | 'expired';
  usage_limit?: number;
  usage_count: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

interface ListDiscountsResponse {
  data: Discount[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

---

#### Get Discount
**Endpoint:** `GET /founder/discounts/:id`

**Path Parameters:**
- `id`: Discount ID

---

#### Create Discount
**Endpoint:** `POST /founder/discounts`

**Request Body:**
```typescript
interface CreateDiscountRequest {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usage_limit?: number;
  start_date?: string; // defaults to now
  end_date?: string;
  description?: string;
}
```

---

#### Update Discount
**Endpoint:** `PATCH /founder/discounts/:id`

**Path Parameters:**
- `id`: Discount ID

**Request Body:**
```typescript
interface UpdateDiscountRequest {
  code?: string;
  value?: number;
  status?: 'active' | 'inactive';
  usage_limit?: number;
  end_date?: string;
}
```

---

#### Delete Discount
**Endpoint:** `DELETE /founder/discounts/:id`

**Path Parameters:**
- `id`: Discount ID

---

### Reports

#### Executive Report
Comprehensive report for executive decision-making.

**Endpoint:** `GET /founder/reports/executive`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

**Response:**
```typescript
interface ExecutiveReport {
  overview: {
    total_revenue: number;
    total_users: number;
    total_properties: number;
    total_bookings: number;
  };
  financial: {
    revenue: number;
    expenses: number;
    profit: number;
    profit_margin: number;
  };
  growth: {
    user_growth: number;
    revenue_growth: number;
    booking_growth: number;
  };
  operations: {
    active_subscriptions: number;
    churn_rate: number;
    avg_booking_value: number;
    customer_satisfaction: number;
  };
  insights: string[];
  recommendations: string[];
}
```

---

## Store Integration

```typescript
// stores/founder-store.ts
import { create } from 'zustand';
import {
  getRevenueDashboard,
  getSubscriptionsDashboard,
  listStaff,
  getExecutiveReport
} from '@/lib/api/founder';

interface FounderStore {
  revenueDashboard: RevenueDashboard | null;
  subscriptionsDashboard: SubscriptionsDashboard | null;
  staff: ListStaffResponse | null;
  executiveReport: ExecutiveReport | null;

  fetchRevenueDashboard: () => Promise<void>;
  fetchSubscriptionsDashboard: () => Promise<void>;
  fetchStaff: (params?: any) => Promise<void>;
  fetchExecutiveReport: (params: any) => Promise<void>;
}

export const useFounderStore = create<FounderStore>((set) => ({
  revenueDashboard: null,
  subscriptionsDashboard: null,
  staff: null,
  executiveReport: null,

  fetchRevenueDashboard: async () => {
    const data = await getRevenueDashboard();
    set({ revenueDashboard: data });
  },

  fetchSubscriptionsDashboard: async () => {
    const data = await getSubscriptionsDashboard();
    set({ subscriptionsDashboard: data });
  },

  fetchStaff: async (params) => {
    const data = await listStaff(params);
    set({ staff: data });
  },

  fetchExecutiveReport: async (params) => {
    const data = await getExecutiveReport(params);
    set({ executiveReport: data });
  }
}));
```
