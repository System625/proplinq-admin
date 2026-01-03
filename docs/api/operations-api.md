# Operations API Documentation

Base URL: already in .env.local

## Authentication

All operations endpoints require bearer token authentication and operations role.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboard

#### Get Operations Dashboard
Retrieves overview metrics for the operations dashboard.

**Endpoint:** `GET /operations/dashboard`

**Response:**
```typescript
interface OperationsDashboard {
  active_subscriptions: number;
  total_revenue: number;
  pending_kyc: number;
  flagged_kyc: number;
  pending_reconciliations: number;
  total_wallet_balance: number;
  monthly_revenue: number;
  subscription_churn_rate: number;
}
```

**Usage Example:**
```typescript
import { apiClient } from '@/lib/axios';

export async function getOperationsDashboard() {
  const response = await apiClient.get<OperationsDashboard>('/operations/dashboard');
  return response.data;
}
```

---

### Subscriptions

#### List Subscriptions
Retrieves a paginated list of all subscriptions.

**Endpoint:** `GET /operations/subscriptions`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (active, cancelled, suspended, expired)
- `plan` (optional): Filter by plan type
- `user_id` (optional): Filter by user ID
- `property_id` (optional): Filter by property ID

**Response:**
```typescript
interface Subscription {
  id: number;
  user_id: number;
  property_id?: number;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'suspended' | 'expired';
  amount: number;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  next_billing_date?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  property?: Property;
}

interface ListSubscriptionsResponse {
  data: Subscription[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listSubscriptions(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  plan?: string;
  user_id?: number;
  property_id?: number;
}) {
  const response = await apiClient.get<ListSubscriptionsResponse>(
    '/operations/subscriptions',
    { params }
  );
  return response.data;
}
```

---

#### Get Subscription
Retrieves detailed information about a specific subscription.

**Endpoint:** `GET /operations/subscriptions/:id`

**Path Parameters:**
- `id`: Subscription ID

**Response:**
```typescript
interface SubscriptionDetails extends Subscription {
  payment_history: Payment[];
  usage_stats?: {
    listings_used: number;
    listings_limit: number;
    bookings_made: number;
  };
}
```

**Usage Example:**
```typescript
export async function getSubscription(subscriptionId: number) {
  const response = await apiClient.get<SubscriptionDetails>(
    `/operations/subscriptions/${subscriptionId}`
  );
  return response.data;
}
```

---

#### Create Subscription
Creates a new subscription for a user.

**Endpoint:** `POST /operations/subscriptions`

**Request Body:**
```typescript
interface CreateSubscriptionRequest {
  user_id: number;
  plan_type: 'monthly' | 'unlimited';
  amount: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  auto_renew: boolean;
}
```

**Usage Example:**
```typescript
export async function createSubscription(data: CreateSubscriptionRequest) {
  const response = await apiClient.post('/operations/subscriptions', data);
  return response.data;
}
```

---

#### Update Subscription
Updates subscription details.

**Endpoint:** `PUT /operations/subscriptions/:id`

**Path Parameters:**
- `id`: Subscription ID

**Request Body:**
```typescript
interface UpdateSubscriptionRequest {
  plan_type?: 'unlimited' | 'monthly';
  amount?: number;
  end_date?: string;
  auto_renew?: boolean;
}
```

**Usage Example:**
```typescript
export async function updateSubscription(
  subscriptionId: number,
  data: UpdateSubscriptionRequest
) {
  const response = await apiClient.put(
    `/operations/subscriptions/${subscriptionId}`,
    data
  );
  return response.data;
}
```

---

#### Renew Subscription
Manually renew a subscription.

**Endpoint:** `POST /operations/subscriptions/:id/renew`

**Path Parameters:**
- `id`: Subscription ID

**Request Body:** None required

**Usage Example:**
```typescript
export async function renewSubscription(subscriptionId: number) {
  const response = await apiClient.post(
    `/operations/subscriptions/${subscriptionId}/renew`
  );
  return response.data;
}
```

---

#### Cancel Subscription
Cancel a subscription.

**Endpoint:** `POST /operations/subscriptions/:id/cancel`

**Path Parameters:**
- `id`: Subscription ID

**Request Body:**
```typescript
interface CancelSubscriptionRequest {
  cancellation_reason?: string;
}
```

**Usage Example:**
```typescript
export async function cancelSubscription(
  subscriptionId: number,
  data?: CancelSubscriptionRequest
) {
  const response = await apiClient.post(
    `/operations/subscriptions/${subscriptionId}/cancel`,
    data
  );
  return response.data;
}
```

---

#### Suspend Subscription
Temporarily suspend a subscription.

**Endpoint:** `POST /operations/subscriptions/:id/suspend`

**Path Parameters:**
- `id`: Subscription ID

**Request Body:** None required

**Usage Example:**
```typescript
export async function suspendSubscription(subscriptionId: number) {
  const response = await apiClient.post(
    `/operations/subscriptions/${subscriptionId}/suspend`
  );
  return response.data;
}
```

---

#### Reactivate Subscription
Reactivate a suspended or cancelled subscription.

**Endpoint:** `POST /operations/subscriptions/:id/reactivate`

**Path Parameters:**
- `id`: Subscription ID

**Usage Example:**
```typescript
export async function reactivateSubscription(subscriptionId: number) {
  const response = await apiClient.post(
    `/operations/subscriptions/${subscriptionId}/reactivate`
  );
  return response.data;
}
```

---

#### Get Subscription History
Retrieves the complete history of a subscription.

**Endpoint:** `GET /operations/subscriptions/:id/history`

**Path Parameters:**
- `id`: Subscription ID

**Response:**
```typescript
interface SubscriptionHistory {
  id: number;
  subscription_id: number;
  action: string;
  details?: any;
  user_id: number;
  created_at: string;
  user: User;
}
```

**Usage Example:**
```typescript
export async function getSubscriptionHistory(subscriptionId: number) {
  const response = await apiClient.get<SubscriptionHistory[]>(
    `/operations/subscriptions/${subscriptionId}/history`
  );
  return response.data;
}
```

---

### Wallets

#### List Transactions
Retrieves all wallet transactions.

**Endpoint:** `GET /operations/wallets/transactions`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): Filter by type (credit, debit, withdrawal, commission)
- `status` (optional): Filter by status (pending, completed, failed)
- `user_id` (optional): Filter by user ID
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
```typescript
interface WalletTransaction {
  id: number;
  user_id: number;
  type: 'credit' | 'debit' | 'withdrawal' | 'commission';
  amount: number;
  balance_before: number;
  balance_after: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user: User;
}

interface ListTransactionsResponse {
  data: WalletTransaction[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listWalletTransactions(params?: {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  const response = await apiClient.get<ListTransactionsResponse>(
    '/operations/wallets/transactions',
    { params }
  );
  return response.data;
}
```

---

#### Get Transaction
Retrieves detailed information about a transaction.

**Endpoint:** `GET /operations/wallets/transactions/:id`

**Path Parameters:**
- `id`: Transaction ID

**Usage Example:**
```typescript
export async function getWalletTransaction(transactionId: number) {
  const response = await apiClient.get<WalletTransaction>(
    `/operations/wallets/transactions/${transactionId}`
  );
  return response.data;
}
```

---

#### Get Balances
Retrieves total wallet balances across all users.

**Endpoint:** `GET /operations/wallets/balances`

**Response:**
```typescript
interface WalletBalances {
  total_balance: number;
  available_balance: number;
  pending_balance: number;
  withdrawn_total: number;
  commission_total: number;
}
```

**Usage Example:**
```typescript
export async function getWalletBalances() {
  const response = await apiClient.get<WalletBalances>('/operations/wallets/balances');
  return response.data;
}
```

---

#### Get User Balance
Retrieves wallet balance for a specific user.

**Endpoint:** `GET /operations/wallets/:id/balance`

**Path Parameters:**
- `id`: User/Wallet ID

**Response:**
```typescript
interface UserWalletBalance {
  user_id: number;
  balance: number;
  pending_balance: number;
  total_credits: number;
  total_debits: number;
  last_transaction_at?: string;
}
```

**Usage Example:**
```typescript
export async function getUserWalletBalance(userId: number) {
  const response = await apiClient.get<UserWalletBalance>(
    `/operations/wallets/${userId}/balance`
  );
  return response.data;
}
```

---

#### Get User Transactions
Retrieves all transactions for a specific user.

**Endpoint:** `GET /operations/wallets/:id/transactions`

**Path Parameters:**
- `id`: User/Wallet ID

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): Filter by type
- `status` (optional): Filter by status

**Usage Example:**
```typescript
export async function getUserWalletTransactions(
  userId: number,
  params?: {
    page?: number;
    per_page?: number;
    type?: string;
    status?: string;
  }
) {
  const response = await apiClient.get<ListTransactionsResponse>(
    `/operations/wallets/${userId}/transactions`,
    { params }
  );
  return response.data;
}
```

---

### Reports

#### Revenue Report
Generates revenue report for a specified period.

**Endpoint:** `GET /operations/reports/revenue`

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `group_by` (optional): Group data by period (day, week, month)

**Response:**
```typescript
interface RevenueReport {
  period: {
    start_date: string;
    end_date: string;
  };
  total_revenue: number;
  subscription_revenue: number;
  booking_revenue: number;
  commission_revenue: number;
  refunded_amount: number;
  net_revenue: number;
  revenue_by_period?: Array<{
    period: string;
    revenue: number;
  }>;
}
```

**Usage Example:**
```typescript
export async function getRevenueReport(params: {
  start_date: string;
  end_date: string;
  group_by?: 'day' | 'week' | 'month';
}) {
  const response = await apiClient.get<RevenueReport>(
    '/operations/reports/revenue',
    { params }
  );
  return response.data;
}
```

---

#### Subscriptions Report
Generates subscriptions report.

**Endpoint:** `GET /operations/reports/subscriptions`

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
```typescript
interface SubscriptionsReport {
  total_subscriptions: number;
  active_subscriptions: number;
  cancelled_subscriptions: number;
  suspended_subscriptions: number;
  new_subscriptions: number;
  churn_rate: number;
  revenue_by_plan: Array<{
    plan: string;
    count: number;
    revenue: number;
  }>;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
}
```

**Usage Example:**
```typescript
export async function getSubscriptionsReport(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const response = await apiClient.get<SubscriptionsReport>(
    '/operations/reports/subscriptions',
    { params }
  );
  return response.data;
}
```

---

#### Commissions Report
Generates commissions report.

**Endpoint:** `GET /operations/reports/commissions`

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `user_id` (optional): Filter by user ID

**Response:**
```typescript
interface CommissionsReport {
  total_commissions: number;
  paid_commissions: number;
  pending_commissions: number;
  commissions_by_user: Array<{
    user_id: number;
    user_name: string;
    total_commission: number;
    bookings_count: number;
  }>;
}
```

**Usage Example:**
```typescript
export async function getCommissionsReport(params: {
  start_date: string;
  end_date: string;
  user_id?: number;
}) {
  const response = await apiClient.get<CommissionsReport>(
    '/operations/reports/commissions',
    { params }
  );
  return response.data;
}
```

---

#### Financial Summary
Generates overall financial summary.

**Endpoint:** `GET /operations/reports/financial-summary`

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

**Response:**
```typescript
interface FinancialSummary {
  revenue: {
    total: number;
    subscriptions: number;
    bookings: number;
    commissions: number;
  };
  expenses: {
    total: number;
    refunds: number;
    payouts: number;
    other: number;
  };
  net_profit: number;
  profit_margin: number;
  growth_rate: number;
}
```

**Usage Example:**
```typescript
export async function getFinancialSummary(params: {
  start_date: string;
  end_date: string;
}) {
  const response = await apiClient.get<FinancialSummary>(
    '/operations/reports/financial-summary',
    { params }
  );
  return response.data;
}
```

---

#### Export Report
Export a report in various formats.

**Endpoint:** `POST /operations/reports/export`

**Request Body:**
```typescript
interface ExportReportRequest {
  report_type: 'revenue' | 'subscriptions' | 'commissions' | 'financial';
  format: 'pdf' | 'csv' | 'excel';
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
}
```

**Usage Example:**
```typescript
export async function exportReport(data: ExportReportRequest) {
  const response = await apiClient.post('/operations/reports/export', data, {
    responseType: 'blob'
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `report-${data.report_type}.${data.format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
```

---

### KYC Flagged

#### List Flagged KYC
Retrieves flagged KYC verifications requiring manual review.

**Endpoint:** `GET /operations/kyc/flagged`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): Filter by type (user, agent)

**Response:**
```typescript
interface FlaggedKYC {
  id: number;
  user_id: number;
  type: 'user' | 'agent';
  status: 'flagged' | 'under_review' | 'approved' | 'rejected';
  flag_reason: string;
  flagged_at: string;
  reviewed_by?: number;
  reviewed_at?: string;
  documents: any[];
  user: User;
}

interface ListFlaggedKYCResponse {
  data: FlaggedKYC[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listFlaggedKYC(params?: {
  page?: number;
  per_page?: number;
  type?: string;
}) {
  const response = await apiClient.get<ListFlaggedKYCResponse>(
    '/operations/kyc/flagged',
    { params }
  );
  return response.data;
}
```

---

#### Get Flagged KYC
Retrieves detailed information about a flagged KYC.

**Endpoint:** `GET /operations/kyc/flagged/:id`

**Path Parameters:**
- `id`: Flagged KYC ID

**Usage Example:**
```typescript
export async function getFlaggedKYC(kycId: number) {
  const response = await apiClient.get<FlaggedKYC>(
    `/operations/kyc/flagged/${kycId}`
  );
  return response.data;
}
```

---

#### Manual Verify KYC
Perform manual verification on flagged KYC.

**Endpoint:** `POST /operations/kyc/flagged/:id/manual-verify`

**Path Parameters:**
- `id`: Flagged KYC ID

**Request Body:**
```typescript
interface ManualVerifyKYCRequest {
  notes: string;
}
```

**Usage Example:**
```typescript
export async function manualVerifyKYC(
  kycId: number,
  data: ManualVerifyKYCRequest
) {
  const response = await apiClient.post(
    `/operations/kyc/flagged/${kycId}/manual-verify`,
    data
  );
  return response.data;
}
```

---

#### Approve Flagged KYC
Approve a flagged KYC verification.

**Endpoint:** `POST /operations/kyc/flagged/:id/approve`

**Path Parameters:**
- `id`: Flagged KYC ID

**Request Body:**
```typescript
interface ApproveKYCRequest {
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function approveFlaggedKYC(
  kycId: number,
  data?: ApproveKYCRequest
) {
  const response = await apiClient.post(
    `/operations/kyc/flagged/${kycId}/approve`,
    data
  );
  return response.data;
}
```

---

#### Reject Flagged KYC
Reject a flagged KYC verification.

**Endpoint:** `POST /operations/kyc/flagged/:id/reject`

**Path Parameters:**
- `id`: Flagged KYC ID

**Request Body:**
```typescript
interface RejectKYCRequest {
  rejection_reason: string;
}
```

**Usage Example:**
```typescript
export async function rejectFlaggedKYC(
  kycId: number,
  data: RejectKYCRequest
) {
  const response = await apiClient.post(
    `/operations/kyc/flagged/${kycId}/reject`,
    data
  );
  return response.data;
}
```

---

### Payment Reconciliation

#### List Reconciliations
Retrieves payment reconciliation records.

**Endpoint:** `GET /operations/payments/reconcile`

**Query Parameters:**
- `status` (optional): Filter by status (pending, completed, failed)

**Response:**
```typescript
interface Reconciliation {
  id: number;
  batch_id: string;
  status: 'pending' | 'completed' | 'failed';
  total_transactions: number;
  matched_transactions: number;
  unmatched_transactions: number;
  discrepancy_amount: number;
  created_by: number;
  created_at: string;
  completed_at?: string;
}

interface ListReconciliationsResponse {
  data: Reconciliation[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listReconciliations(params?: {
  status?: string;
}) {
  const response = await apiClient.get<ListReconciliationsResponse>(
    '/operations/payments/reconcile',
    { params }
  );
  return response.data;
}
```

---

#### Create Reconciliation
Create a new payment reconciliation batch.

**Endpoint:** `POST /operations/payments/reconcile`

**Request Body:**
```typescript
interface CreateReconciliationRequest {
  payment_reference: string;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  notes?: string;
  metadata?: any;
}
```

**Usage Example:**
```typescript
export async function createReconciliation(data: CreateReconciliationRequest) {
  const response = await apiClient.post('/operations/payments/reconcile', data);
  return response.data;
}
```

---

#### Reconcile Payment
Manually reconcile a specific payment.

**Endpoint:** `POST /operations/payments/reconcile/:id`

**Path Parameters:**
- `id`: Reconciliation ID

**Request Body:**
```typescript
interface ReconcilePaymentRequest {
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function reconcilePayment(
  reconciliationId: number,
  data?: ReconcilePaymentRequest
) {
  const response = await apiClient.post(
    `/operations/payments/reconcile/${reconciliationId}`,
    data
  );
  return response.data;
}
```

---

#### Reconciliation Report
Generate a reconciliation report.

**Endpoint:** `GET /operations/payments/reconciliation-report`

**Query Parameters:**
- `date_from` (optional): Start date filter (YYYY-MM-DD)
- `date_to` (optional): End date filter (YYYY-MM-DD)

**Response:**
```typescript
interface ReconciliationReport {
  summary: {
    total_transactions: number;
    matched: number;
    unmatched: number;
    discrepancies: number;
    total_amount: number;
    discrepancy_amount: number;
  };
  details: Array<{
    transaction_id: number;
    reference: string;
    amount: number;
    status: 'matched' | 'unmatched' | 'discrepancy';
    notes?: string;
  }>;
}
```

**Usage Example:**
```typescript
export async function getReconciliationReport(params?: {
  date_from?: string;
  date_to?: string;
}) {
  const response = await apiClient.get<ReconciliationReport>(
    '/operations/payments/reconciliation-report',
    { params }
  );
  return response.data;
}
```

---

## Store Integration

```typescript
// stores/operations-store.ts
import { create } from 'zustand';
import {
  getOperationsDashboard,
  listSubscriptions,
  listWalletTransactions,
  getRevenueReport
} from '@/lib/api/operations';

interface OperationsStore {
  dashboard: OperationsDashboard | null;
  subscriptions: ListSubscriptionsResponse | null;
  transactions: ListTransactionsResponse | null;
  revenueReport: RevenueReport | null;

  fetchDashboard: () => Promise<void>;
  fetchSubscriptions: (params?: any) => Promise<void>;
  fetchTransactions: (params?: any) => Promise<void>;
  fetchRevenueReport: (params: any) => Promise<void>;
}

export const useOperationsStore = create<OperationsStore>((set) => ({
  dashboard: null,
  subscriptions: null,
  transactions: null,
  revenueReport: null,

  fetchDashboard: async () => {
    const data = await getOperationsDashboard();
    set({ dashboard: data });
  },

  fetchSubscriptions: async (params) => {
    const data = await listSubscriptions(params);
    set({ subscriptions: data });
  },

  fetchTransactions: async (params) => {
    const data = await listWalletTransactions(params);
    set({ transactions: data });
  },

  fetchRevenueReport: async (params) => {
    const data = await getRevenueReport(params);
    set({ revenueReport: data });
  }
}));
```
