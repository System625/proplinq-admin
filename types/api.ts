export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Real API user structure
export interface ApiUser {
  id: number;
  full_name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  phone_number: string;
  phone_verified_at: string | null;
  location: string;
  terms_accepted: boolean;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
  agency_name: string;
  agent_type: string;
  whatsapp_number: string;
  google_id: string | null;
  apple_id: string | null;
  kyc_status?: 'pending' | 'approved' | 'rejected';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Real API login response structure
export interface ApiLoginResponse {
  status: boolean;
  message: string;
  data: {
    user: ApiUser;
    token: string;
  };
}

export interface DashboardStats {
  users: {
    total: number;
    new_this_month: number;
    by_role: {
      admin: number;
      agent: number;
      home_seeker: number;
    };
  };
  properties: {
    total: number;
    available: number;
    rented: number;
    sold: number;
  };
  kyc: {
    pending: number;
    approved: number;
    rejected: number;
  };
  rnpl: {
    active_loans: number;
    pending_applications: number;
    total_value: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName: string;
  guestEmail: string;
  createdAt: string;
  property?: {
    id: number;
    title: string;
    description: string;
    price: string;
    location: string;
    type: string;
    category: string;
    bedrooms?: number;
    bathrooms?: number;
    features: string[];
    status: string;
  };
  guest?: ApiUser;
  host?: ApiUser;
}

// Extended type for booking updates that includes admin fields
export interface BookingUpdate extends Partial<Booking> {
  admin_notes?: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  type: 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface KycVerification {
  id: number;
  user_id: number;
  bvn: string;
  nin: string;
  employment_status: string;
  occupation: string;
  company_name: string;
  business_name?: string;
  tin?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  user: ApiUser;
  utility_bill_full_url: string;
  bank_statement_full_url: string;
  cac_document_full_url: string;
}

export interface RefundRequest {
  bookingId: string;
  amount: number;
  reason: string;
}

export interface KycReview {
  id: string;
  action: 'approve' | 'reject';
  reason?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CompanyData {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  company_name: string;
  property_type: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyDataResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface CompanyDataPaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  is_published?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreate {
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {}

// ==========================================
// ENHANCED DASHBOARD TYPES
// ==========================================

// Support Dashboard with Category Breakdown
export interface SupportTicketCategories {
  bookingIssues: number;
  searchIssues: number;
  kycIssues: number;
  paymentIssues: number;
  profileIssues: number;
}

export interface EnhancedSupportDashboardStats {
  totalTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  activeChats: number;
  avgResponseTime: string;
  satisfactionRate: number;
  categoryBreakdown: SupportTicketCategories;
}

// Operations Dashboard with comprehensive metrics
export interface OperationsListingsStats {
  active: number;
  pending: number;
  rejected: number;
}

export interface OperationsKycOverview {
  pendingKyc: number;
  approvedToday: number;
}

export interface OperationsBookingsStats {
  today: number;
  thisWeek: number;
}

export interface OperationsTicketsSummary {
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
}

export interface OperationsSalesMetrics {
  newAgentsThisWeek: number;
  newAgentsThisMonth: number;
  newPropertiesOnboarded: number;
  bigAccountsClosed: {
    hotels: number;
    servicedApartments: number;
    estates: number;
  };
  subscriptionSales: {
    month: string;
    amount: number;
  }[];
  revenueFromCommissions: number;
  dealsInPipeline: number;
  agentActivityScore: number;
  agentEngagementRate: number;
}

export interface EnhancedOperationsDashboardStats {
  // Existing subscription metrics
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  cancelledThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  walletBalance: number;
  pendingPayouts: number;
  // New metrics
  listings: OperationsListingsStats;
  kycOverview: OperationsKycOverview;
  bookings: OperationsBookingsStats;
  ticketsSummary: OperationsTicketsSummary;
  salesMetrics: OperationsSalesMetrics;
}

// Escalation Feature
// Listings/Properties
export interface Listing {
  id: number;
  user_id: number;
  title: string;
  description: string;
  type: 'rent' | 'shortlet' | 'hotel';
  price: string;
  location: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities: string[];
  images: string[];
  videos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  user: ApiUser;

  // Additional property details
  property_type?: string;
  square_feet?: number;
  furnished?: boolean;
  parking_spaces?: number;
  floor_number?: number;
  total_floors?: number;
  year_built?: number;

  // Location details
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  city?: string;
  state?: string;

  // Availability
  available_from?: string;
  lease_duration?: string;

  // Features
  pet_friendly?: boolean;
  utilities_included?: string[];
}

export interface ListingReview {
  id: string;
  action: 'approve' | 'reject';
  reason?: string;
}

export interface RejectionReasonOption {
  value: string;
  label: string;
  description: string;
}

export const LISTING_REJECTION_REASONS: RejectionReasonOption[] = [
  {
    value: 'inaccurate_information',
    label: 'Inaccurate Information',
    description: 'Property details do not match reality or are misleading'
  },
  {
    value: 'poor_image_quality',
    label: 'Poor Image Quality',
    description: 'Images are blurry, dark, or do not adequately showcase the property'
  },
  {
    value: 'pricing_mismatch',
    label: 'Pricing Mismatch',
    description: 'Price is significantly different from market value or appears incorrect'
  },
  {
    value: 'invalid_location',
    label: 'Invalid Location',
    description: 'Location details are incorrect, incomplete, or unverifiable'
  },
  {
    value: 'policy_violation',
    label: 'Policy Violation',
    description: 'Listing violates platform terms of service or community guidelines'
  },
  {
    value: 'incomplete_details',
    label: 'Incomplete Details',
    description: 'Essential property information is missing or insufficient'
  },
  {
    value: 'duplicate_listing',
    label: 'Duplicate Listing',
    description: 'Property has already been listed on the platform'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other reason not listed above'
  }
];

export interface EscalationRequest {
  issueId: string;
  issueType: 'ticket' | 'lead' | 'booking' | 'kyc' | 'listing' | 'general';
  fromDepartment: 'support' | 'sales' | 'marketing' | 'operations';
  toDepartment: 'support' | 'sales' | 'marketing' | 'operations';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface EscalationResponse {
  id: string;
  escalationRequest: EscalationRequest;
  status: 'pending' | 'acknowledged' | 'in-progress' | 'resolved';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// FOUNDER FLOW TYPES
// ==========================================

// Dashboard Types
export interface RevenueDashboard {
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

export interface SubscriptionsDashboard {
  active: {
    monthly: number;
    unlimited: number;
  };
  revenue: number;
  growth_trends: {
    this_month: number;
    last_month: number;
  };
}

export interface WalletsDashboard {
  total_balance: number;
  total_transactions: number;
  transaction_trends: {
    today: number;
    this_week: number;
    this_month: number;
  };
  top_users: Array<any>;
}

export interface GrowthDashboard {
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

export interface PropertyItem {
  id: number;
  user_id: number;
  type: string;
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  gated: boolean;
  parking: boolean;
  features: string[];
  status: string;
  views_count: number;
  is_promoted: boolean;
  promoted_at: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  deleted_at: string | null;
  average_rating: string | null;
  rating_count: number;
  bookings_count?: number;
}

export interface PropertiesDashboard {
  total: number;
  new_this_month: number;
  most_viewed: PropertyItem[];
  most_booked: PropertyItem[];
}

export interface BookingsDashboard {
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

export interface FounderSupportDashboard {
  open_tickets: number;
  open_chats: number;
  common_issues: Array<any>;
  resolution_time: number;
  satisfaction_rating: number | null;
}

// Staff Management Types
export interface Staff {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'operations' | 'sales' | 'marketing';
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  created_at: string;
  last_login_at?: string;
}

export interface ListStaffResponse {
  data: Staff[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'support' | 'operations' | 'sales' | 'marketing';
  permissions?: string[];
}

export interface UpdateStaffRequest {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UpdatePermissionsRequest {
  permissions: string[];
}

// Override Types
export interface ApproveKYCOverrideRequest {
  reason: string;
  notes?: string;
}

export interface DeclineKYCOverrideRequest {
  reason: string;
  notes?: string;
}

export interface OverrideSubscriptionRequest {
  plan?: string;
  amount?: number;
  end_date?: string;
  reason: string;
}

export interface OverridePaymentRequest {
  status: 'completed' | 'failed';
  reason: string;
  notes?: string;
}

// Discount Types
export interface Discount {
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

export interface ListDiscountsResponse {
  data: Discount[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateDiscountRequest {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usage_limit?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface UpdateDiscountRequest {
  code?: string;
  value?: number;
  status?: 'active' | 'inactive';
  usage_limit?: number;
  end_date?: string;
}

// Report Types
export interface ExecutiveReport {
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
    revenue_growth_rate: number;
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

// ==========================================
// MARKETING API TYPES
// ==========================================

// Dashboard Types
export interface MarketingDashboard {
  total_campaigns: number;
  active_campaigns: number;
  total_leads: number;
  conversion_rate: number;
  total_listings: number;
  flagged_listings: number;
  traffic_this_month: number;
  roi: number;
}

// Analytics Types
export interface TrafficAnalytics {
  web_users: {
    total: number;
    daily: Array<{
      date: string;
      count: number;
    }>;
  };
  app_users: {
    total: number;
    daily: Array<{
      date: string;
      count: number;
    }>;
  };
  user_growth: {
    this_week: number;
    this_month: number;
    last_month: number;
    growth_percentage: number;
  };
  page_views: any[];
  session_duration: any[];
}

export interface ListingsAnalytics {
  most_viewed: Array<{
    id: number;
    title: string;
    type: string;
    views_count: number;
  }>;
  most_booked: Array<{
    id: number;
    title: string;
    type: string;
    bookings_count: number;
  }>;
  views_over_time: any[];
  conversion_rates: {
    overall: number;
    by_type: Array<{
      type: string;
      rate: number;
    }>;
  };
  engagement_metrics: {
    total_properties: number;
    active_properties: number;
    properties_with_bookings: number;
  };
}

export interface ListingPerformance {
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

export interface LeadConversion {
  funnel: {
    leads: number;
    contacted: number;
    confirmed: number;
  };
  conversion_rate: number;
}

export interface LeadsAnalytics {
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

export interface TrafficSources {
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

export interface BookingsAnalytics {
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

export interface AgentActivity {
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

export interface HotelActivity {
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

// KYC Types
export interface KYCOverview {
  total_kyc: number;
  approved: number;
  pending: number;
  rejected: number;
  completion_rate: number;
  avg_approval_time: number; // in hours
}

export interface KYCBreakdown {
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

// Reports Types
export interface TrendsReport {
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

export interface SummaryReport {
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

// Flags Types
export interface MarketingFlag {
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

export interface ListFlagsResponse {
  data: MarketingFlag[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface FlagPropertyRequest {
  property_id: number;
  reason: string;
  details?: string;
}

export interface FlagAgentRequest {
  agent_id: number;
  reason: string;
  details?: string;
}

// Campaign Types
export interface Campaign {
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

export interface ListCampaignsResponse {
  data: Campaign[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateCampaignRequest {
  name: string;
  type: 'email' | 'sms' | 'social' | 'display';
  budget: number;
  target_audience?: any;
  start_date: string;
  end_date?: string;
  content?: any;
}

export interface UpdateCampaignRequest {
  name?: string;
  status?: 'active' | 'paused' | 'completed';
  budget?: number;
  end_date?: string;
}

export interface CampaignROI {
  campaign_id: number;
  total_spent: number;
  total_revenue: number;
  roi: number; // Return on Investment percentage
  cost_per_acquisition: number;
  conversion_value: number;
}

export interface CampaignPerformance {
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

export interface AddCampaignMetricRequest {
  metric_type: string;
  value: number;
  date?: string; // defaults to today
  notes?: string;
}

// Query parameter types for date ranges (reusable)
export interface DateRangeParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
}

export interface TrafficQueryParams extends DateRangeParams {
  group_by?: 'day' | 'week' | 'month';
}

export interface ReportExportParams {
  report_type: 'listings' | 'traffic' | 'leads' | 'bookings';
  format: 'pdf' | 'csv' | 'excel';
  start_date: string;
  end_date: string;
}

export interface TrendsQueryParams extends DateRangeParams {
  metric: 'traffic' | 'bookings' | 'revenue' | 'leads';
}

export interface FlagsQueryParams {
  page?: number;
  per_page?: number;
  type?: 'property' | 'agent';
  status?: 'active' | 'resolved';
}

export interface CampaignsQueryParams {
  page?: number;
  per_page?: number;
  status?: 'active' | 'paused' | 'completed';
}

// ==========================================
// SALES API TYPES
// ==========================================

export interface SalesDashboard {
  onboarding: {
    pending: number;
    in_progress: number;
    completed_this_month: number;
    rejected: number;
  };
  pipeline: {
    hotels: number;
    shortlets: number;
    agents: number;
  };
  engagement: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface OnboardingRequest {
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
  user: ApiUser;
  assigned_sales_rep?: ApiUser;
}

export interface ListOnboardingResponse {
  data: OnboardingRequest[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Partner {
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
  user: ApiUser;
}

export interface ListPartnersResponse {
  data: Partner[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

// Analytics Types
export interface OnboardingAnalytics {
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

// Onboarding CRUD Types
export interface CreateOnboardingRequest {
  user_id?: number;
  type: 'hotel' | 'shortlet' | 'agent';
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  properties_count?: number;
  additional_info?: any;
}

export interface UpdateOnboardingRequest {
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
  business_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  location?: string;
  assigned_to?: number;
  notes?: string;
}

export interface CompleteOnboardingRequest {
  subscription_plan?: string;
  completion_notes?: string;
}

export interface RejectOnboardingRequest {
  reason: string;
  additional_notes?: string;
}

export interface OnboardingDetails extends OnboardingRequest {
  documents: any[];
  properties: any[];
  notes: Array<{
    id: number;
    content: string;
    created_by: number;
    created_at: string;
    user: ApiUser;
  }>;
  history: Array<{
    id: number;
    action: string;
    details?: any;
    created_by: number;
    created_at: string;
    user: ApiUser;
  }>;
}

// KYC Types
export interface KYCStatus {
  user_id: number;
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  kyc_type: 'user' | 'agent' | 'hotel';
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export interface InitiateKYCRequest {
  kyc_type: 'user' | 'agent' | 'hotel';
  send_notification?: boolean;
}

export interface KYCRequired {
  required: boolean;
  reason?: string;
  kyc_type?: 'user' | 'agent' | 'hotel';
}

// Partner Details Types
export interface PartnerDetails extends Partner {
  properties: any[];
  recent_bookings: any[];
  performance_metrics: {
    avg_rating: number;
    response_rate: number;
    acceptance_rate: number;
    cancellation_rate: number;
  };
}

export interface PartnerActivity {
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

export interface PartnerEngagement {
  engagement_score: number; // 0-100
  last_login: string;
  active_days: number;
  properties_updated_recently: number;
  response_time_avg: number; // in hours
  customer_satisfaction: number; // percentage
  engagement_level: 'low' | 'medium' | 'high';
}

// Property Management Types
export interface UploadPropertyRequest {
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
  pricing: {
    base_price: number;
    currency: string;
  };
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  amenities?: string[];
  pricing?: {
    base_price: number;
    currency: string;
  };
  status?: 'active' | 'inactive';
}

export interface UploadRoomRequest {
  room_type: string;
  name: string;
  description?: string;
  capacity: number;
  price: number;
  amenities?: string[];
}

// ==========================================
// OPERATIONS API TYPES
// ==========================================

// Base Types for Operations API
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface OperationsDateRangeParams {
  start_date: string;
  end_date: string;
}

// Dashboard Types
export interface OperationsDashboard {
  active_subscriptions: number;
  total_revenue: number;
  pending_kyc: number;
  flagged_kyc: number;
  pending_reconciliations: number;
  total_wallet_balance: number;
  monthly_revenue: number;
  subscription_churn_rate: number;
}

// Subscription Types
export interface OperationsSubscription {
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
  user: ApiUser;
  property?: any;
}

export interface OperationsSubscriptionDetails extends OperationsSubscription {
  payment_history: any[];
  usage_stats?: {
    listings_used: number;
    listings_limit: number;
    bookings_made: number;
  };
}

export interface CreateSubscriptionRequest {
  user_id: number;
  plan_type: 'monthly' | 'unlimited';
  amount: number;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  auto_renew: boolean;
}

export interface UpdateSubscriptionRequest {
  plan_type?: 'unlimited' | 'monthly';
  amount?: number;
  end_date?: string;
  auto_renew?: boolean;
}

export interface CancelSubscriptionRequest {
  cancellation_reason?: string;
}

export interface SubscriptionQueryParams extends PaginationParams {
  status?: 'active' | 'cancelled' | 'suspended' | 'expired';
  plan?: string;
  user_id?: number;
  property_id?: number;
}

export interface SubscriptionHistory {
  id: number;
  subscription_id: number;
  action: string;
  details?: any;
  user_id: number;
  created_at: string;
  user: ApiUser;
}

// Wallet Types
export interface OperationsWalletTransaction {
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
  user: ApiUser;
}

export interface WalletBalances {
  total_balance: number;
  available_balance: number;
  pending_balance: number;
  withdrawn_total: number;
  commission_total: number;
}

export interface UserWalletBalance {
  user_id: number;
  balance: number;
  pending_balance: number;
  total_credits: number;
  total_debits: number;
  last_transaction_at?: string;
}

export interface WalletTransactionQueryParams extends PaginationParams {
  type?: 'credit' | 'debit' | 'withdrawal' | 'commission';
  status?: 'pending' | 'completed' | 'failed';
  user_id?: number;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
}

// Report Types
export interface RevenueReport {
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

export interface SubscriptionsReport {
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

export interface CommissionsReport {
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

export interface FinancialSummary {
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

export interface ReportQueryParams extends OperationsDateRangeParams {
  group_by?: 'day' | 'week' | 'month';
}

export interface ExportReportRequest {
  report_type: 'revenue' | 'subscriptions' | 'commissions' | 'financial';
  format: 'pdf' | 'csv' | 'excel';
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
}

// KYC Flagged Types
export interface FlaggedKYC {
  id: number;
  user_id: number;
  type: 'user' | 'agent';
  status: 'flagged' | 'under_review' | 'approved' | 'rejected';
  flag_reason: string;
  flagged_at: string;
  reviewed_by?: number;
  reviewed_at?: string;
  documents: any[];
  user: ApiUser;
}

export interface ManualVerifyKYCRequest {
  notes: string;
}

export interface ApproveKYCRequest {
  notes?: string;
}

export interface RejectKYCRequest {
  rejection_reason: string;
}

export interface FlaggedKYCQueryParams extends PaginationParams {
  type?: 'user' | 'agent';
}

// Payment Reconciliation Types
export interface Reconciliation {
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

export interface CreateReconciliationRequest {
  payment_reference: string;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  notes?: string;
  metadata?: any;
}

export interface ReconcilePaymentRequest {
  notes?: string;
}

export interface ReconciliationReport {
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

export interface ReconciliationQueryParams extends PaginationParams {
  status?: 'pending' | 'completed' | 'failed';
}

export interface ReconciliationReportQueryParams {
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
}

// ============================================================================
// SUPPORT API TYPES
// ============================================================================

// Dashboard Types
export interface SupportDashboard {
  tickets: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
    total: number;
  };
  chats: {
    active: number;
    waiting: number;
    closed: number;
  };
  calls: {
    missed: number;
    answered: number;
    voicemail: number;
  };
  emails: {
    unread: number;
    read: number;
    replied: number;
  };
  metrics: {
    resolution_time: number;
    response_time: number;
    satisfaction_rating: number | null;
  };
}

// Ticket Types
export interface Ticket {
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
  user: ApiUser;
  assigned_agent?: ApiUser;
  responses_count: number;
}

export interface TicketResponse {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_staff: boolean;
  created_at: string;
  user?: ApiUser;
  agent?: ApiUser;
}

export interface TicketHistory {
  id: number;
  ticket_id: number;
  action: string;
  description: string;
  user_id?: number;
  details?: any;
  created_at: string;
  changed_by?: ApiUser;
}

export interface Attachment {
  id: number;
  ticket_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface TicketDetails extends Ticket {
  responses: TicketResponse[];
  history: TicketHistory[];
  attachments?: Attachment[];
}

export interface ListTicketsResponse {
  data: Ticket[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateTicketRequest {
  user_id: number;
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'general';
}

export interface UpdateTicketRequest {
  subject?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'general';
}

export interface RespondToTicketRequest {
  message: string;
  is_internal?: boolean;
}

export interface AssignTicketRequest {
  agent_id: number;
}

export interface TagTicketRequest {
  tag: string;
}

export interface ForwardTicketRequest {
  department: string;
  notes?: string;
}

export interface CloseTicketRequest {
  resolution?: string;
  satisfaction_rating?: number; // 1-5
}

export interface TicketQueryParams extends PaginationParams {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Chat Types
export interface Chat {
  id: number;
  user_id: number;
  status: 'active' | 'pending' | 'closed';
  assigned_to?: number;
  created_at: string;
  closed_at?: string;
  user: ApiUser;
  assigned_agent?: ApiUser;
  last_message?: ChatMessage;
  unread_count: number;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_type: 'user' | 'agent';
  message: string;
  read_at?: string;
  created_at: string;
  sender?: ApiUser;
}

export interface ChatDetails extends Chat {
  messages: ChatMessage[];
}

export interface ListChatsResponse {
  data: Chat[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface RespondToChatRequest {
  message: string;
}

export interface AssignChatRequest {
  agent_id: number;
}

export interface CloseChatRequest {
  summary?: string;
  satisfaction_rating?: number; // 1-5
}

export interface ChatQueryParams extends PaginationParams {
  status?: 'active' | 'pending' | 'closed';
  assigned_to?: number;
}

// ============================================
// Calls API Types
// ============================================

export interface Call {
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
  user: ApiUser;
  assigned_agent?: ApiUser;
}

export interface ListCallsResponse extends CompanyDataPaginatedResponse<Call> {}

export interface CallQueryParams extends PaginationParams {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  assigned_to?: number;
}

export interface ScheduleCallbackRequest {
  callback_scheduled_at: string; // ISO 8601 datetime
  notes?: string;
}

// ============================================
// Emails API Types
// ============================================

export interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: 'unread' | 'read' | 'replied';
  replied_at?: string;
  created_at: string;
}

export interface ListEmailsResponse extends CompanyDataPaginatedResponse<Email> {}

export interface EmailQueryParams extends PaginationParams {
  status?: 'unread' | 'read' | 'replied';
}

export interface ReplyToEmailRequest {
  subject: string;
  body: string;
}

// ============================================
// Analytics API Types
// ============================================

export interface SupportAnalytics {
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

export interface AnalyticsQueryParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  metric?: string;
}

// ============================================
// Users API Types (for support context)
// ============================================

export interface UserActivity {
  id: number;
  action: string;
  description: string;
  created_at: string;
}

export interface UserSupportHistory {
  tickets: Ticket[];
  chats: Chat[];
  calls: Call[];
  total_interactions: number;
  avg_satisfaction: number;
}

// ============================================
// CRM API Types
// ============================================

// Dashboard Types
export interface CRMDashboard {
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

// Lead Types
export interface Lead {
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
  assigned_user?: ApiUser;
}

export interface LeadDetails extends Lead {
  activities: Activity[];
  notes: Note[];
  contacts: Contact[];
}

export interface ListLeadsResponse {
  data: Lead[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateLeadRequest {
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

export interface UpdateLeadRequest {
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

export interface ConvertLeadRequest {
  user_id: number;
}

export interface LeadQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  source?: string;
  assigned_to?: number;
  search?: string;
}

// Contact Types
export interface Contact {
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
  assigned_user?: ApiUser;
}

export interface ContactDetails extends Contact {
  activities: Activity[];
  leads: Lead[];
}

export interface ListContactsResponse {
  data: Contact[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateContactRequest {
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

export interface UpdateContactRequest {
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

export interface ContactQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  assigned_to?: number;
}

// Activity Types
export interface Activity {
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
  created_by_user?: ApiUser;
  lead?: Lead;
  contact?: Contact;
}

export interface Note {
  id: number;
  content: string;
  created_by: number;
  created_at: string;
  created_by_user?: ApiUser;
}

export interface ListActivitiesResponse {
  data: Activity[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface CreateNoteRequest {
  type: 'note';
  subject: string;
  description: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string;
  metadata?: Record<string, any>;
}

export interface CreateCallRequest {
  type: 'call';
  subject: string;
  description?: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string;
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: {
    call_direction?: 'inbound' | 'outbound';
    phone_number?: string;
    [key: string]: any;
  };
}

export interface CreateEmailActivityRequest {
  type: 'email';
  subject: string;
  description: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: {
    email_to?: string;
    email_subject?: string;
    attachments?: string[];
    [key: string]: any;
  };
}

export interface CreateMeetingRequest {
  type: 'meeting';
  subject: string;
  description?: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string;
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: {
    location?: string;
    attendees?: string[];
    meeting_type?: string;
    [key: string]: any;
  };
}

export interface CreateTaskRequest {
  type: 'task';
  subject: string;
  description?: string;
  lead_id?: number;
  contact_id?: number;
  activity_date: string;
  metadata?: {
    due_date?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'pending' | 'completed';
    [key: string]: any;
  };
}

export type CreateActivityRequest =
  | CreateNoteRequest
  | CreateCallRequest
  | CreateEmailActivityRequest
  | CreateMeetingRequest
  | CreateTaskRequest;

export interface UpdateActivityRequest {
  subject?: string;
  description?: string;
  activity_date?: string;
  duration_minutes?: number;
  outcome?: 'successful' | 'follow_up' | string;
  metadata?: Record<string, any>;
}

export interface ActivityQueryParams {
  page?: number;
  per_page?: number;
  type?: string;
  lead_id?: number;
  contact_id?: number;
  user_id?: number;
}