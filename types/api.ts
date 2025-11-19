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
export interface EscalationRequest {
  issueId: string;
  issueType: 'ticket' | 'lead' | 'booking' | 'kyc' | 'general';
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