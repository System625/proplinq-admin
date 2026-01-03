# Sales API Documentation

Base URL: `https://proapi.proplinq.com/api/v1/sales`

## Authentication

All sales endpoints require bearer token authentication and sales role.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboard

#### Get Sales Dashboard
Retrieves overview metrics for the sales dashboard.

**Endpoint:** `GET /sales/dashboard`

**Response:**
```typescript
interface SalesDashboard {
  total_onboardings: number;
  pending_onboardings: number;
  completed_onboardings: number;
  total_partners: number;
  active_partners: number;
  revenue_this_month: number;
  onboarding_conversion_rate: number;
  avg_onboarding_time: number; // in days
}
```

**Usage Example:**
```typescript
import { apiClient } from '@/lib/axios';

export async function getSalesDashboard() {
  const response = await apiClient.get<SalesDashboard>('/sales/dashboard');
  return response.data;
}
```

---

### Onboarding

#### List Onboarding Requests
Retrieves all onboarding requests.

**Endpoint:** `GET /sales/onboarding`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status (pending, in_progress, completed, rejected)
- `type` (optional): Filter by type (hotel, shortlet, agent)
- `assigned_to` (optional): Filter by assigned sales rep

**Response:**
```typescript
interface OnboardingRequest {
  id: number;
  user_id: number;
  type: 'hotel' | 'shortlet' | 'agent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  properties_count?: number;
  assigned_to?: number;
  kyc_status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  user: User;
  assigned_sales_rep?: User;
}

interface ListOnboardingResponse {
  data: OnboardingRequest[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listOnboarding(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  type?: string;
  assigned_to?: number;
}) {
  const response = await apiClient.get<ListOnboardingResponse>(
    '/sales/onboarding',
    { params }
  );
  return response.data;
}
```

---

#### Get Hotels
Retrieves all hotel onboarding requests.

**Endpoint:** `GET /sales/onboarding/hotels`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status

**Usage Example:**
```typescript
export async function getHotels(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}) {
  const response = await apiClient.get<ListOnboardingResponse>(
    '/sales/onboarding/hotels',
    { params }
  );
  return response.data;
}
```

---

#### Get Shortlets
Retrieves all shortlet onboarding requests.

**Endpoint:** `GET /sales/onboarding/shortlets`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status

**Usage Example:**
```typescript
export async function getShortlets(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}) {
  const response = await apiClient.get<ListOnboardingResponse>(
    '/sales/onboarding/shortlets',
    { params }
  );
  return response.data;
}
```

---

#### Get Agents
Retrieves all agent onboarding requests.

**Endpoint:** `GET /sales/onboarding/agents`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): Filter by status

**Usage Example:**
```typescript
export async function getAgents(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}) {
  const response = await apiClient.get<ListOnboardingResponse>(
    '/sales/onboarding/agents',
    { params }
  );
  return response.data;
}
```

---

#### Get Onboarding Request
Retrieves detailed information about an onboarding request.

**Endpoint:** `GET /sales/onboarding/:id`

**Path Parameters:**
- `id`: Onboarding request ID

**Response:**
```typescript
interface OnboardingDetails extends OnboardingRequest {
  documents: any[];
  properties: Property[];
  notes: Array<{
    id: number;
    content: string;
    created_by: number;
    created_at: string;
    user: User;
  }>;
  history: Array<{
    id: number;
    action: string;
    details?: any;
    created_by: number;
    created_at: string;
    user: User;
  }>;
}
```

**Usage Example:**
```typescript
export async function getOnboardingRequest(requestId: number) {
  const response = await apiClient.get<OnboardingDetails>(
    `/sales/onboarding/${requestId}`
  );
  return response.data;
}
```

---

#### Create Onboarding Request
Creates a new onboarding request.

**Endpoint:** `POST /sales/onboarding`

**Request Body:**
```typescript
interface CreateOnboardingRequest {
  user_id?: number; // If creating for existing user
  type: 'hotel' | 'shortlet' | 'agent';
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  properties_count?: number;
  additional_info?: any;
}
```

**Usage Example:**
```typescript
export async function createOnboarding(data: CreateOnboardingRequest) {
  const response = await apiClient.post('/sales/onboarding', data);
  return response.data;
}
```

---

#### Update Onboarding Request
Updates onboarding request information.

**Endpoint:** `PATCH /sales/onboarding/:id`

**Path Parameters:**
- `id`: Onboarding request ID

**Request Body:**
```typescript
interface UpdateOnboardingRequest {
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
  business_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  location?: string;
  assigned_to?: number;
  notes?: string;
}
```

**Usage Example:**
```typescript
export async function updateOnboarding(
  requestId: number,
  data: UpdateOnboardingRequest
) {
  const response = await apiClient.patch(
    `/sales/onboarding/${requestId}`,
    data
  );
  return response.data;
}
```

---

#### Complete Onboarding
Mark an onboarding request as completed.

**Endpoint:** `POST /sales/onboarding/:id/complete`

**Path Parameters:**
- `id`: Onboarding request ID

**Request Body:**
```typescript
interface CompleteOnboardingRequest {
  subscription_plan?: string;
  completion_notes?: string;
}
```

**Usage Example:**
```typescript
export async function completeOnboarding(
  requestId: number,
  data: CompleteOnboardingRequest
) {
  const response = await apiClient.post(
    `/sales/onboarding/${requestId}/complete`,
    data
  );
  return response.data;
}
```

---

#### Reject Onboarding
Reject an onboarding request.

**Endpoint:** `POST /sales/onboarding/:id/reject`

**Path Parameters:**
- `id`: Onboarding request ID

**Request Body:**
```typescript
interface RejectOnboardingRequest {
  reason: string;
  additional_notes?: string;
}
```

**Usage Example:**
```typescript
export async function rejectOnboarding(
  requestId: number,
  data: RejectOnboardingRequest
) {
  const response = await apiClient.post(
    `/sales/onboarding/${requestId}/reject`,
    data
  );
  return response.data;
}
```

---

### KYC Flow

#### Check KYC Status
Check the KYC status for a user/partner.

**Endpoint:** `GET /sales/kyc/:userId/status`

**Path Parameters:**
- `userId`: User ID

**Response:**
```typescript
interface KYCStatus {
  user_id: number;
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  kyc_type: 'user' | 'agent' | 'hotel';
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
}
```

**Usage Example:**
```typescript
export async function checkKYCStatus(userId: number) {
  const response = await apiClient.get<KYCStatus>(
    `/sales/kyc/${userId}/status`
  );
  return response.data;
}
```

---

#### Initiate KYC
Initiate KYC process for a partner.

**Endpoint:** `POST /sales/kyc/:userId/initiate`

**Path Parameters:**
- `userId`: User ID

**Request Body:**
```typescript
interface InitiateKYCRequest {
  kyc_type: 'user' | 'agent' | 'hotel';
  send_notification?: boolean;
}
```

**Usage Example:**
```typescript
export async function initiateKYC(
  userId: number,
  data: InitiateKYCRequest
) {
  const response = await apiClient.post(
    `/sales/kyc/${userId}/initiate`,
    data
  );
  return response.data;
}
```

---

#### Check KYC Required
Check if KYC is required for a user based on their role and activities.

**Endpoint:** `GET /sales/kyc/:userId/required`

**Path Parameters:**
- `userId`: User ID

**Response:**
```typescript
interface KYCRequired {
  required: boolean;
  reason?: string;
  kyc_type?: 'user' | 'agent' | 'hotel';
}
```

**Usage Example:**
```typescript
export async function checkKYCRequired(userId: number) {
  const response = await apiClient.get<KYCRequired>(
    `/sales/kyc/${userId}/required`
  );
  return response.data;
}
```

---

### Partner Engagement

#### List Partners
Retrieves all partners (agents, hotels, shortlets).

**Endpoint:** `GET /sales/partners`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): Filter by type (agent, hotel, shortlet)
- `status` (optional): Filter by status (active, inactive)

**Response:**
```typescript
interface Partner {
  id: number;
  user_id: number;
  type: 'agent' | 'hotel' | 'shortlet';
  business_name: string;
  status: 'active' | 'inactive' | 'suspended';
  properties_count: number;
  total_bookings: number;
  total_revenue: number;
  commission_earned: number;
  last_active_at?: string;
  created_at: string;
  user: User;
}

interface ListPartnersResponse {
  data: Partner[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

**Usage Example:**
```typescript
export async function listPartners(params?: {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
}) {
  const response = await apiClient.get<ListPartnersResponse>(
    '/sales/partners',
    { params }
  );
  return response.data;
}
```

---

#### Get Partner
Retrieves detailed information about a partner.

**Endpoint:** `GET /sales/partners/:id`

**Path Parameters:**
- `id`: Partner ID

**Response:**
```typescript
interface PartnerDetails extends Partner {
  properties: Property[];
  recent_bookings: Booking[];
  performance_metrics: {
    avg_rating: number;
    response_rate: number;
    acceptance_rate: number;
    cancellation_rate: number;
  };
}
```

**Usage Example:**
```typescript
export async function getPartner(partnerId: number) {
  const response = await apiClient.get<PartnerDetails>(
    `/sales/partners/${partnerId}`
  );
  return response.data;
}
```

---

#### Get Partner Activity
Retrieves partner's activity timeline.

**Endpoint:** `GET /sales/partners/:id/activity`

**Path Parameters:**
- `id`: Partner ID

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
```typescript
interface PartnerActivity {
  activities: Array<{
    id: number;
    type: string;
    description: string;
    created_at: string;
    metadata?: any;
  }>;
  summary: {
    listings_added: number;
    bookings_received: number;
    revenue_generated: number;
    login_count: number;
  };
}
```

**Usage Example:**
```typescript
export async function getPartnerActivity(
  partnerId: number,
  params?: {
    start_date?: string;
    end_date?: string;
  }
) {
  const response = await apiClient.get<PartnerActivity>(
    `/sales/partners/${partnerId}/activity`,
    { params }
  );
  return response.data;
}
```

---

#### Get Partner Engagement
Retrieves partner engagement metrics.

**Endpoint:** `GET /sales/partners/:id/engagement`

**Path Parameters:**
- `id`: Partner ID

**Response:**
```typescript
interface PartnerEngagement {
  engagement_score: number; // 0-100
  last_login: string;
  active_days: number;
  properties_updated_recently: number;
  response_time_avg: number; // in hours
  customer_satisfaction: number; // percentage
  engagement_level: 'low' | 'medium' | 'high';
}
```

**Usage Example:**
```typescript
export async function getPartnerEngagement(partnerId: number) {
  const response = await apiClient.get<PartnerEngagement>(
    `/sales/partners/${partnerId}/engagement`
  );
  return response.data;
}
```

---

#### Engagement Report
Generate partner engagement report.

**Endpoint:** `GET /sales/partners/engagement-report`

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `type` (optional): Filter by partner type

**Response:**
```typescript
interface EngagementReport {
  total_partners: number;
  active_partners: number;
  engagement_breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  partners: Array<{
    partner_id: number;
    business_name: string;
    engagement_score: number;
    engagement_level: 'low' | 'medium' | 'high';
    last_active: string;
  }>;
}
```

**Usage Example:**
```typescript
export async function getEngagementReport(params: {
  start_date: string;
  end_date: string;
  type?: string;
}) {
  const response = await apiClient.get<EngagementReport>(
    '/sales/partners/engagement-report',
    { params }
  );
  return response.data;
}
```

---

### Property Upload

#### Upload Property
Upload a new property for a partner.

**Endpoint:** `POST /sales/properties/upload`

**Request Body:**
```typescript
interface UploadPropertyRequest {
  partner_id: number;
  property_type: 'hotel' | 'shortlet' | 'apartment';
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  amenities: string[];
  images: File[];
  pricing: {
    base_price: number;
    currency: string;
  };
}
```

**Usage Example:**
```typescript
export async function uploadProperty(data: UploadPropertyRequest) {
  const formData = new FormData();
  formData.append('partner_id', data.partner_id.toString());
  formData.append('property_type', data.property_type);
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('location', JSON.stringify(data.location));
  formData.append('amenities', JSON.stringify(data.amenities));
  formData.append('pricing', JSON.stringify(data.pricing));

  data.images.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  const response = await apiClient.post('/sales/properties/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}
```

---

#### Upload Room
Add a room to a property.

**Endpoint:** `POST /sales/properties/:propertyId/rooms`

**Path Parameters:**
- `propertyId`: Property ID

**Request Body:**
```typescript
interface UploadRoomRequest {
  room_type: string;
  name: string;
  description?: string;
  capacity: number;
  price: number;
  amenities?: string[];
  images?: File[];
}
```

**Usage Example:**
```typescript
export async function uploadRoom(
  propertyId: number,
  data: UploadRoomRequest
) {
  const response = await apiClient.post(
    `/sales/properties/${propertyId}/rooms`,
    data
  );
  return response.data;
}
```

---

#### Update Property
Update property information.

**Endpoint:** `PATCH /sales/properties/:id`

**Path Parameters:**
- `id`: Property ID

**Request Body:**
```typescript
interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  amenities?: string[];
  pricing?: {
    base_price: number;
    currency: string;
  };
  status?: 'active' | 'inactive';
}
```

**Usage Example:**
```typescript
export async function updateProperty(
  propertyId: number,
  data: UpdatePropertyRequest
) {
  const response = await apiClient.patch(
    `/sales/properties/${propertyId}`,
    data
  );
  return response.data;
}
```

---

#### Upload Property Images
Upload additional images for a property.

**Endpoint:** `POST /sales/properties/:id/images`

**Path Parameters:**
- `id`: Property ID

**Request Body:**
```typescript
interface UploadImagesRequest {
  images: File[];
  is_primary?: boolean[];
}
```

**Usage Example:**
```typescript
export async function uploadPropertyImages(
  propertyId: number,
  data: UploadImagesRequest
) {
  const formData = new FormData();
  data.images.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
    if (data.is_primary?.[index]) {
      formData.append(`is_primary[${index}]`, 'true');
    }
  });

  const response = await apiClient.post(
    `/sales/properties/${propertyId}/images`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}
```

---

### Analytics

#### Onboarding Analytics
Get analytics for onboarding performance.

**Endpoint:** `GET /sales/analytics/onboarding`

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response:**
```typescript
interface OnboardingAnalytics {
  total_requests: number;
  completed: number;
  pending: number;
  rejected: number;
  conversion_rate: number;
  avg_completion_time: number; // in days
  by_type: {
    hotel: number;
    shortlet: number;
    agent: number;
  };
  trend: Array<{
    date: string;
    requests: number;
    completed: number;
  }>;
}
```

**Usage Example:**
```typescript
export async function getOnboardingAnalytics(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const response = await apiClient.get<OnboardingAnalytics>(
    '/sales/analytics/onboarding',
    { params }
  );
  return response.data;
}
```

---

## Store Integration

```typescript
// stores/sales-store.ts
import { create } from 'zustand';
import {
  getSalesDashboard,
  listOnboarding,
  listPartners,
  getOnboardingAnalytics
} from '@/lib/api/sales';

interface SalesStore {
  dashboard: SalesDashboard | null;
  onboarding: ListOnboardingResponse | null;
  partners: ListPartnersResponse | null;
  analytics: OnboardingAnalytics | null;

  fetchDashboard: () => Promise<void>;
  fetchOnboarding: (params?: any) => Promise<void>;
  fetchPartners: (params?: any) => Promise<void>;
  fetchAnalytics: (params?: any) => Promise<void>;
}

export const useSalesStore = create<SalesStore>((set) => ({
  dashboard: null,
  onboarding: null,
  partners: null,
  analytics: null,

  fetchDashboard: async () => {
    const data = await getSalesDashboard();
    set({ dashboard: data });
  },

  fetchOnboarding: async (params) => {
    const data = await listOnboarding(params);
    set({ onboarding: data });
  },

  fetchPartners: async (params) => {
    const data = await listPartners(params);
    set({ partners: data });
  },

  fetchAnalytics: async (params) => {
    const data = await getOnboardingAnalytics(params);
    set({ analytics: data });
  }
}));
```
