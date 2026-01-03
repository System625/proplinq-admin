# Marketing API Documentation

Base URL: already in .env.local

## Authentication

All marketing endpoints require bearer token authentication and marketing role.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Accept': 'application/json'
}
```

## Endpoints

### Dashboard

#### Get Marketing Dashboard
**Endpoint:** `GET /marketing/dashboard`

**Response:**
```typescript
interface MarketingDashboard {
  total_campaigns: number;
  active_campaigns: number;
  total_leads: number;
  conversion_rate: number;
  total_listings: number;
  flagged_listings: number;
  traffic_this_month: number;
  roi: number;
}
```

---

### KYC Insights

#### KYC Overview
**Endpoint:** `GET /marketing/kyc/overview`

**Response:**
```typescript
interface KYCOverview {
  total_kyc: number;
  approved: number;
  pending: number;
  rejected: number;
  completion_rate: number;
  avg_approval_time: number; // in hours
}
```

#### KYC Breakdown
**Endpoint:** `GET /marketing/kyc/breakdown`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD

**Response:**
```typescript
interface KYCBreakdown {
  by_type: {
    user: number;
    agent: number;
    hotel: number;
  };
  by_status: {
    pending: number;
    approved: number;
    rejected: number;
  };
  trend: Array<{
    date: string;
    submitted: number;
    approved: number;
  }>;
}
```

---

### Analytics

#### Listings Analytics
**Endpoint:** `GET /marketing/analytics/listings`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD

**Response:**
```typescript
interface ListingsAnalytics {
  total_listings: number;
  active_listings: number;
  new_listings: number;
  avg_listing_quality: number;
  by_type: {
    hotel: number;
    shortlet: number;
    apartment: number;
  };
  by_location: Array<{
    city: string;
    count: number;
  }>;
}
```

#### Listing Performance
**Endpoint:** `GET /marketing/analytics/listings/:id/performance`

**Path Parameters:**
- `id`: Listing ID

**Response:**
```typescript
interface ListingPerformance {
  listing_id: number;
  views: number;
  favorites: number;
  bookings: number;
  conversion_rate: number;
  avg_rating: number;
  revenue: number;
  traffic_sources: Array<{
    source: string;
    visits: number;
  }>;
}
```

---

#### Traffic Analytics
**Endpoint:** `GET /marketing/analytics/traffic`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD
- `group_by` (optional): day | week | month

**Response:**
```typescript
interface TrafficAnalytics {
  total_visits: number;
  unique_visitors: number;
  page_views: number;
  avg_session_duration: number; // in seconds
  bounce_rate: number;
  trend: Array<{
    date: string;
    visits: number;
    unique_visitors: number;
  }>;
}
```

#### Traffic Sources
**Endpoint:** `GET /marketing/analytics/traffic/sources`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

**Response:**
```typescript
interface TrafficSources {
  sources: Array<{
    source: string;
    visits: number;
    conversions: number;
    conversion_rate: number;
  }>;
  channels: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    paid: number;
  };
}
```

---

#### Leads Analytics
**Endpoint:** `GET /marketing/analytics/leads`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD

**Response:**
```typescript
interface LeadsAnalytics {
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  conversion_rate: number;
  by_source: Array<{
    source: string;
    count: number;
    conversion_rate: number;
  }>;
  by_status: {
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  };
}
```

#### Lead Conversion
**Endpoint:** `GET /marketing/analytics/leads/conversion`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

**Response:**
```typescript
interface LeadConversion {
  conversion_funnel: Array<{
    stage: string;
    count: number;
    drop_off_rate: number;
  }>;
  avg_conversion_time: number; // in days
  top_converting_sources: Array<{
    source: string;
    conversion_rate: number;
  }>;
}
```

---

#### Bookings Analytics
**Endpoint:** `GET /marketing/analytics/bookings`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

**Response:**
```typescript
interface BookingsAnalytics {
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  avg_booking_value: number;
  peak_booking_times: Array<{
    period: string;
    bookings: number;
  }>;
  by_property_type: {
    hotel: number;
    shortlet: number;
    apartment: number;
  };
}
```

---

#### Agent Activity
**Endpoint:** `GET /marketing/analytics/agents`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD

**Response:**
```typescript
interface AgentActivity {
  total_agents: number;
  active_agents: number;
  top_agents: Array<{
    agent_id: number;
    agent_name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  avg_response_time: number; // in hours
}
```

---

#### Hotel Activity
**Endpoint:** `GET /marketing/analytics/hotels`

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD

**Response:**
```typescript
interface HotelActivity {
  total_hotels: number;
  active_hotels: number;
  top_hotels: Array<{
    hotel_id: number;
    hotel_name: string;
    bookings: number;
    revenue: number;
    rating: number;
    occupancy_rate: number;
  }>;
}
```

---

### Reports

#### Export Report
**Endpoint:** `GET /marketing/reports/export`

**Query Parameters:**
- `report_type`: listings | traffic | leads | bookings
- `format`: pdf | csv | excel
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

**Usage Example:**
```typescript
export async function exportMarketingReport(params: {
  report_type: 'listings' | 'traffic' | 'leads' | 'bookings';
  format: 'pdf' | 'csv' | 'excel';
  start_date: string;
  end_date: string;
}) {
  const response = await apiClient.get('/marketing/reports/export', {
    params,
    responseType: 'blob'
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `marketing-report.${params.format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
```

---

#### Trends Report
**Endpoint:** `GET /marketing/reports/trends`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD
- `metric`: traffic | bookings | revenue | leads

**Response:**
```typescript
interface TrendsReport {
  metric: string;
  period: {
    start_date: string;
    end_date: string;
  };
  trend_direction: 'up' | 'down' | 'stable';
  growth_rate: number;
  data_points: Array<{
    date: string;
    value: number;
  }>;
  insights: string[];
}
```

---

#### Summary Report
**Endpoint:** `GET /marketing/reports/summary`

**Query Parameters:**
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD

**Response:**
```typescript
interface SummaryReport {
  overview: {
    total_listings: number;
    total_bookings: number;
    total_revenue: number;
    total_users: number;
  };
  highlights: {
    best_performing_listing: any;
    top_traffic_source: string;
    highest_conversion_day: string;
    most_booked_property_type: string;
  };
  recommendations: string[];
}
```

---

### Flags

#### List Flags
**Endpoint:** `GET /marketing/flags`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `type` (optional): property | agent
- `status` (optional): active | resolved

**Response:**
```typescript
interface Flag {
  id: number;
  flaggable_type: 'property' | 'agent';
  flaggable_id: number;
  reason: string;
  status: 'active' | 'resolved';
  flagged_by: number;
  resolved_by?: number;
  created_at: string;
  resolved_at?: string;
}

interface ListFlagsResponse {
  data: Flag[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

---

#### Flag Property
**Endpoint:** `POST /marketing/flags/property`

**Request Body:**
```typescript
interface FlagPropertyRequest {
  property_id: number;
  reason: string;
  details?: string;
}
```

---

#### Flag Agent
**Endpoint:** `POST /marketing/flags/agent`

**Request Body:**
```typescript
interface FlagAgentRequest {
  agent_id: number;
  reason: string;
  details?: string;
}
```

---

### Campaigns

#### List Campaigns
**Endpoint:** `GET /marketing/campaigns`

**Query Parameters:**
- `page` (optional): Page number
- `per_page` (optional): Items per page
- `status` (optional): active | paused | completed

**Response:**
```typescript
interface Campaign {
  id: number;
  name: string;
  type: 'email' | 'sms' | 'social' | 'display';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

interface ListCampaignsResponse {
  data: Campaign[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

---

#### Get Campaign
**Endpoint:** `GET /marketing/campaigns/:id`

**Path Parameters:**
- `id`: Campaign ID

---

#### Create Campaign
**Endpoint:** `POST /marketing/campaigns`

**Request Body:**
```typescript
interface CreateCampaignRequest {
  name: string;
  type: 'email' | 'sms' | 'social' | 'display';
  budget: number;
  target_audience?: any;
  start_date: string;
  end_date?: string;
  content?: any;
}
```

---

#### Update Campaign
**Endpoint:** `PATCH /marketing/campaigns/:id`

**Path Parameters:**
- `id`: Campaign ID

**Request Body:**
```typescript
interface UpdateCampaignRequest {
  name?: string;
  status?: 'active' | 'paused' | 'completed';
  budget?: number;
  end_date?: string;
}
```

---

#### Campaign ROI
**Endpoint:** `GET /marketing/campaigns/:id/roi`

**Path Parameters:**
- `id`: Campaign ID

**Response:**
```typescript
interface CampaignROI {
  campaign_id: number;
  total_spent: number;
  total_revenue: number;
  roi: number; // Return on Investment percentage
  cost_per_acquisition: number;
  conversion_value: number;
}
```

---

#### Campaign Performance
**Endpoint:** `GET /marketing/campaigns/:id/performance`

**Path Parameters:**
- `id`: Campaign ID

**Response:**
```typescript
interface CampaignPerformance {
  campaign_id: number;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  conversions: number;
  conversion_rate: number;
  engagement_rate: number;
  performance_by_day: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
  }>;
}
```

---

#### Add Campaign Metric
**Endpoint:** `POST /marketing/campaigns/:id/metrics`

**Path Parameters:**
- `id`: Campaign ID

**Request Body:**
```typescript
interface AddCampaignMetricRequest {
  metric_type: string;
  value: number;
  date?: string; // defaults to today
  notes?: string;
}
```

---

## Store Integration

```typescript
// stores/marketing-store.ts
import { create } from 'zustand';
import {
  getMarketingDashboard,
  getListingsAnalytics,
  getTrafficAnalytics,
  listCampaigns
} from '@/lib/api/marketing';

interface MarketingStore {
  dashboard: MarketingDashboard | null;
  listingsAnalytics: ListingsAnalytics | null;
  trafficAnalytics: TrafficAnalytics | null;
  campaigns: ListCampaignsResponse | null;

  fetchDashboard: () => Promise<void>;
  fetchListingsAnalytics: (params?: any) => Promise<void>;
  fetchTrafficAnalytics: (params: any) => Promise<void>;
  fetchCampaigns: (params?: any) => Promise<void>;
}

export const useMarketingStore = create<MarketingStore>((set) => ({
  dashboard: null,
  listingsAnalytics: null,
  trafficAnalytics: null,
  campaigns: null,

  fetchDashboard: async () => {
    const data = await getMarketingDashboard();
    set({ dashboard: data });
  },

  fetchListingsAnalytics: async (params) => {
    const data = await getListingsAnalytics(params);
    set({ listingsAnalytics: data });
  },

  fetchTrafficAnalytics: async (params) => {
    const data = await getTrafficAnalytics(params);
    set({ trafficAnalytics: data });
  },

  fetchCampaigns: async (params) => {
    const data = await listCampaigns(params);
    set({ campaigns: data });
  }
}));
```
