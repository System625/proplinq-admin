import {
  LoginCredentials,
  ApiLoginResponse,
  DashboardStats,
  ApiUser,
  Booking,
  BookingUpdate,
  Transaction,
  KycVerification,
  RefundRequest,
  KycReview,
  PaginatedResponse,
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  EscalationRequest,
  EscalationResponse,
  Listing,
  ListingReview,
  RevenueDashboard,
  SubscriptionsDashboard,
  WalletsDashboard,
  GrowthDashboard,
  PropertiesDashboard,
  BookingsDashboard,
  FounderSupportDashboard,
  Staff,
  ListStaffResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
  ApproveKYCOverrideRequest,
  DeclineKYCOverrideRequest,
  OverrideSubscriptionRequest,
  OverridePaymentRequest,
  Discount,
  ListDiscountsResponse,
  CreateDiscountRequest,
  UpdateDiscountRequest,
  ExecutiveReport,
  // Marketing API types
  MarketingDashboard,
  TrafficAnalytics,
  TrafficQueryParams,
  ListingsAnalytics,
  ListingPerformance,
  LeadConversion,
  LeadsAnalytics,
  DateRangeParams,
  TrafficSources,
  BookingsAnalytics,
  // CRM API types
  CRMDashboard,
  Lead,
  LeadDetails,
  ListLeadsResponse,
  LeadQueryParams,
  CreateLeadRequest,
  UpdateLeadRequest,
  ConvertLeadRequest,
  Contact,
  ContactDetails,
  ListContactsResponse,
  ContactQueryParams,
  CreateContactRequest,
  UpdateContactRequest,
  Activity,
  ListActivitiesResponse,
  ActivityQueryParams,
  CreateActivityRequest,
  UpdateActivityRequest,
  KYCOverview,
  KYCBreakdown,
  AgentActivity,
  HotelActivity,
  TrendsReport,
  SummaryReport,
  MarketingFlag,
  Campaign,
  CampaignROI,
  CampaignPerformance,
  ReportExportParams,
  TrendsQueryParams,
  FlagsQueryParams,
  ListFlagsResponse,
  FlagPropertyRequest,
  FlagAgentRequest,
  CampaignsQueryParams,
  ListCampaignsResponse,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  AddCampaignMetricRequest,
  // Sales API types
  SalesDashboard,
  ListOnboardingResponse,
  ListPartnersResponse,
  OnboardingAnalytics,
  CreateOnboardingRequest,
  UpdateOnboardingRequest,
  CompleteOnboardingRequest,
  RejectOnboardingRequest,
  OnboardingDetails,
  KYCStatus,
  InitiateKYCRequest,
  KYCRequired,
  PartnerDetails,
  PartnerActivity,
  PartnerEngagement,
  UploadPropertyRequest,
  UpdatePropertyRequest,
  UploadRoomRequest,
  OnboardingRequest,
  // Operations API types
  OperationsDashboard,
  OperationsSubscription,
  OperationsSubscriptionDetails,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CancelSubscriptionRequest,
  SubscriptionHistory,
  SubscriptionQueryParams,
  OperationsWalletTransaction,
  WalletBalances,
  UserWalletBalance,
  WalletTransactionQueryParams,
  RevenueReport,
  SubscriptionsReport,
  CommissionsReport,
  FinancialSummary,
  ReportQueryParams,
  ExportReportRequest,
  FlaggedKYC,
  ManualVerifyKYCRequest,
  ApproveKYCRequest,
  RejectKYCRequest,
  FlaggedKYCQueryParams,
  Reconciliation,
  CreateReconciliationRequest,
  ReconcilePaymentRequest,
  ReconciliationReport,
  ReconciliationQueryParams,
  ReconciliationReportQueryParams,
  CompanyDataPaginatedResponse,
  // Support API types
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
  UserActivity,
  UserSupportHistory,
} from '@/types/api';

// Production API service
export const apiService = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiLoginResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    console.log('Login response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    console.log('🔄 API Service: Fetching dashboard stats');
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/dashboard/stats', {
      headers,
    });
    
    console.log('📡 API Service: Dashboard stats response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API Service: Dashboard stats failed with status:', response.status);
      throw new Error('Failed to fetch dashboard stats');
    }
    
    const data = await response.json();
    console.log('📊 API Service: Dashboard stats data:', data);
    return data.data;
  },

  // Users
  async getUsers(params?: Record<string, unknown>): Promise<PaginatedResponse<ApiUser>> {
    console.log('🔄 API Service: Fetching users with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/users?${queryString}` : '/api/users';
    console.log('🌐 API Service: Users URL:', url);

    const response = await fetch(url, { headers });
    console.log('📡 API Service: Users response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API Service: Users failed with status:', response.status);
      throw new Error('Failed to fetch users');
    }
    
    const data = await response.json();
    console.log('📊 API Service: Users data:', data);
    return data;
  },

  async getUser(id: string): Promise<ApiUser> {
    console.log('🔄 API Service: Fetching user with ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/users/${id}`, { headers });
    console.log('📡 API Service: User response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API Service: User failed with status:', response.status);
      throw new Error('Failed to fetch user');
    }
    
    const data = await response.json();
    console.log('📊 API Service: User data:', data);
    return data;
  },

  // Bookings
  async getBookings(params?: Record<string, unknown>): Promise<PaginatedResponse<Booking>> {
    console.log('🔄 API Service: Starting getBookings');
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    console.log('🔐 API Service: Token from localStorage:', token ? `Present (${token.substring(0, 20)}...)` : 'Missing');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/bookings?${queryString}` : '/api/bookings';
    
    console.log('📡 API Service: Making request to:', url);
    console.log('📋 API Service: Headers:', headers);

    const response = await fetch(url, { headers });
    console.log('📊 API Service: Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API Service: Request failed with status:', response.status);
      throw new Error('Failed to fetch bookings');
    }
    
    const result = await response.json();
    console.log('📦 API Service: Response data:', result);
    return result;
  },

  async updateBooking(id: string, data: BookingUpdate): Promise<Booking> {
    console.log('🔄 API Service: Updating booking', id, 'with data:', data);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Transform data to match backend expectations
    const updateData = {
      status: data.status,
      admin_notes: data.admin_notes,
    };

    console.log('📡 API Service: Sending update data:', updateData);

    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    });
    
    console.log('📊 API Service: Update response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Update failed:', errorData);
      throw new Error(errorData.message || 'Failed to update booking');
    }
    
    const result = await response.json();
    console.log('✅ API Service: Update successful:', result);
    return result;
  },

  // Transactions
  async getTransactions(params?: Record<string, unknown>): Promise<PaginatedResponse<Transaction>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/transactions?${queryString}` : '/api/transactions';

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return await response.json();
  },

  async processRefund(data: RefundRequest): Promise<Transaction> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/refunds', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to process refund');
    }
    
    return await response.json();
  },

  // KYC
  async getKycVerifications(params?: Record<string, unknown>): Promise<PaginatedResponse<KycVerification>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/kyc?${queryString}` : '/api/kyc';

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch KYC verifications');
    }
    
    return await response.json();
  },

  async getKycVerification(id: string): Promise<KycVerification> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/kyc/${id}`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch KYC verification');
    }
    
    return await response.json();
  },

  async reviewKycVerification(id: string, data: KycReview): Promise<KycVerification> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/kyc/${id}/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to review KYC verification');
    }

    return await response.json();
  },

  // Blog Posts
  async getBlogPosts(params?: Record<string, unknown>): Promise<PaginatedResponse<BlogPost>> {
    console.log('🔄 API Service: Fetching blog posts with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/blog-posts?${queryString}` : '/api/blog-posts';
    console.log('🌐 API Service: Blog posts URL:', url);

    const response = await fetch(url, { headers });
    console.log('📡 API Service: Blog posts response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Blog posts failed with status:', response.status);
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();
    console.log('📊 API Service: Blog posts data:', data);
    return data;
  },

  async getBlogPost(id: string): Promise<BlogPost> {
    console.log('🔄 API Service: Fetching blog post with ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/blog-posts/${id}`, { headers });
    console.log('📡 API Service: Blog post response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Blog post failed with status:', response.status);
      throw new Error('Failed to fetch blog post');
    }

    const data = await response.json();
    console.log('📊 API Service: Blog post data:', data);
    return data;
  },

  async createBlogPost(data: BlogPostCreate): Promise<BlogPost> {
    console.log('🔄 API Service: Creating blog post with data:', data);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('📤 API Service: Sending JSON data:', JSON.stringify(data, null, 2));

    const response = await fetch('/api/blog-posts', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📡 API Service: Create blog post response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Create blog post failed:', errorData);
      throw new Error(errorData.message || 'Failed to create blog post');
    }

    const result = await response.json();
    console.log('✅ API Service: Create blog post successful:', result);
    return result;
  },

  async updateBlogPost(id: string, data: BlogPostUpdate): Promise<BlogPost> {
    console.log('🔄 API Service: Updating blog post', id, 'with data:', data);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('📤 API Service: Sending JSON update data:', JSON.stringify(data, null, 2));

    const response = await fetch(`/api/blog-posts/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📡 API Service: Update blog post response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Update blog post failed:', errorData);
      throw new Error(errorData.message || 'Failed to update blog post');
    }

    const result = await response.json();
    console.log('✅ API Service: Update blog post successful:', result);
    return result;
  },

  async deleteBlogPost(id: string): Promise<void> {
    console.log('🔄 API Service: Deleting blog post with ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/blog-posts/${id}`, {
      method: 'DELETE',
      headers,
    });

    console.log('📡 API Service: Delete blog post response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Delete blog post failed:', errorData);
      throw new Error(errorData.message || 'Failed to delete blog post');
    }

    console.log('✅ API Service: Delete blog post successful');
  },

  async uploadBlogPostImage(file: File): Promise<{ image_path: string }> {
    console.log('🔄 API Service: Uploading blog post image:', file.name);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('image_file', file);

    console.log('📤 API Service: Uploading file:', file.name, file.size, file.type);

    const response = await fetch('/api/blog-posts/upload-image', {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('📡 API Service: Upload image response status:', response.status);

    if (!response.ok) {
      // Handle 413 Payload Too Large error
      if (response.status === 413) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        throw new Error(`Image size (${fileSizeMB}MB) is too large. Maximum allowed size is 2MB.`);
      }

      // Try to parse error data, but handle cases where response is not JSON
      let errorMessage = 'Failed to upload image';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status-based message
        if (response.status === 413) {
          errorMessage = 'Image is too large. Maximum allowed size is 2MB.';
        }
      }

      console.error('❌ API Service: Upload image failed:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ API Service: Upload image successful:', result);
    return result;
  },

  async publishBlogPost(id: string): Promise<BlogPost> {
    console.log('🔄 API Service: Publishing blog post with ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/blog-posts/${id}/publish`, {
      method: 'POST',
      headers,
    });

    console.log('📡 API Service: Publish blog post response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Publish blog post failed:', errorData);
      throw new Error(errorData.message || 'Failed to publish blog post');
    }

    const result = await response.json();
    console.log('✅ API Service: Publish blog post successful:', result);
    return result;
  },

  // Escalations
  async createEscalation(data: EscalationRequest): Promise<EscalationResponse> {
    console.log('🔄 API Service: Creating escalation with data:', data);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/escalations', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📡 API Service: Create escalation response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Create escalation failed:', errorData);
      throw new Error(errorData.message || 'Failed to create escalation');
    }

    const result = await response.json();
    console.log('✅ API Service: Create escalation successful:', result);
    return result;
  },

  async getEscalations(params?: Record<string, unknown>): Promise<PaginatedResponse<EscalationResponse>> {
    console.log('🔄 API Service: Fetching escalations with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/escalations?${queryString}` : '/api/escalations';

    const response = await fetch(url, { headers });
    console.log('📡 API Service: Escalations response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Escalations failed with status:', response.status);
      throw new Error('Failed to fetch escalations');
    }

    const data = await response.json();
    console.log('📊 API Service: Escalations data:', data);
    return data;
  },

  async updateEscalation(id: string, data: Partial<EscalationResponse>): Promise<EscalationResponse> {
    console.log('🔄 API Service: Updating escalation', id, 'with data:', data);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/escalations/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📡 API Service: Update escalation response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Update escalation failed:', errorData);
      throw new Error(errorData.message || 'Failed to update escalation');
    }

    const result = await response.json();
    console.log('✅ API Service: Update escalation successful:', result);
    return result;
  },

  // Listings
  async getListings(params?: Record<string, unknown>): Promise<PaginatedResponse<Listing>> {
    console.log('🔄 API Service: Fetching listings with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = queryString ? `/api/listings?${queryString}` : '/api/listings';
    console.log('🌐 API Service: Listings URL:', url);

    const response = await fetch(url, { headers });
    console.log('📡 API Service: Listings response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Listings failed with status:', response.status);
      throw new Error('Failed to fetch listings');
    }

    const data = await response.json();
    console.log('📊 API Service: Listings data:', data);
    return data;
  },

  async getListing(id: string): Promise<Listing> {
    console.log('🔄 API Service: Fetching listing with ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/listings/${id}`, { headers });
    console.log('📡 API Service: Listing response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Listing failed with status:', response.status);
      throw new Error('Failed to fetch listing');
    }

    const data = await response.json();
    console.log('📊 API Service: Listing data:', data);
    return data;
  },

  async reviewListing(id: string, data: ListingReview): Promise<Listing> {
    console.log('🔄 API Service: Reviewing listing', id, 'with data:', data);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/listings/${id}/review`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('📡 API Service: Review listing response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Service: Review listing failed:', errorData);
      throw new Error(errorData.message || 'Failed to review listing');
    }

    const result = await response.json();
    console.log('✅ API Service: Review listing successful:', result);
    return result;
  },

  // ==========================================
  // FOUNDER FLOW APIS
  // ==========================================

  // Founder Dashboard APIs
  async getFounderRevenueDashboard(): Promise<RevenueDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/revenue', { headers });
    if (!response.ok) throw new Error('Failed to fetch revenue dashboard');
    const data = await response.json();
    return data.data;
  },

  async getFounderSubscriptionsDashboard(): Promise<SubscriptionsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/subscriptions', { headers });
    if (!response.ok) throw new Error('Failed to fetch subscriptions dashboard');
    const data = await response.json();
    return data.data;
  },

  async getFounderWalletsDashboard(): Promise<WalletsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/wallets', { headers });
    if (!response.ok) throw new Error('Failed to fetch wallets dashboard');
    const data = await response.json();
    return data.data;
  },

  async getFounderGrowthDashboard(): Promise<GrowthDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/growth', { headers });
    if (!response.ok) throw new Error('Failed to fetch growth dashboard');
    const data = await response.json();
    return data.data;
  },

  async getFounderPropertiesDashboard(): Promise<PropertiesDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/properties', { headers });
    if (!response.ok) throw new Error('Failed to fetch properties dashboard');
    const data = await response.json();
    return data.data;
  },

  async getFounderBookingsDashboard(): Promise<BookingsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/bookings', { headers });
    if (!response.ok) throw new Error('Failed to fetch bookings dashboard');
    const data = await response.json();
    return data.data;
  },

  async getFounderSupportDashboard(): Promise<FounderSupportDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/support', { headers });
    if (!response.ok) throw new Error('Failed to fetch support dashboard');
    const data = await response.json();
    return data.data;
  },

  // Founder Staff Management APIs
  async listFounderStaff(params?: Record<string, unknown>): Promise<ListStaffResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/founder/staff${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch staff');
    const data = await response.json();
    return data.data;
  },

  async getFounderStaff(id: string): Promise<Staff> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/staff/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch staff');
    const data = await response.json();
    return data.data;
  },

  async createFounderStaff(data: CreateStaffRequest): Promise<Staff> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/staff', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create staff');
    const result = await response.json();
    return result.data;
  },

  async updateFounderStaff(id: string, data: UpdateStaffRequest): Promise<Staff> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/staff/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update staff');
    const result = await response.json();
    return result.data;
  },

  async deleteFounderStaff(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/staff/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete staff');
  },

  async updateFounderStaffPermissions(id: string, permissions: string[]): Promise<Staff> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/staff/${id}/permissions`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ permissions }),
    });
    if (!response.ok) throw new Error('Failed to update permissions');
    const result = await response.json();
    return result.data;
  },

  // Founder Override APIs
  async approveKycOverride(id: string, data: ApproveKYCOverrideRequest): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/overrides/kyc/${id}/approve`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to approve KYC override');
  },

  async declineKycOverride(id: string, data: DeclineKYCOverrideRequest): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/overrides/kyc/${id}/decline`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to decline KYC override');
  },

  async overrideSubscription(id: string, data: OverrideSubscriptionRequest): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/overrides/subscription/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to override subscription');
  },

  async overridePayment(id: string, data: OverridePaymentRequest): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/overrides/payment/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to override payment');
  },

  // Founder Discount APIs
  async listFounderDiscounts(params?: Record<string, unknown>): Promise<ListDiscountsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/founder/discounts${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch discounts');
    const data = await response.json();
    return data.data;
  },

  async getFounderDiscount(id: string): Promise<Discount> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/discounts/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch discount');
    const data = await response.json();
    return data.data;
  },

  async createFounderDiscount(data: CreateDiscountRequest): Promise<Discount> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/discounts', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create discount');
    const result = await response.json();
    return result.data;
  },

  async updateFounderDiscount(id: string, data: UpdateDiscountRequest): Promise<Discount> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/discounts/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update discount');
    const result = await response.json();
    return result.data;
  },

  async deleteFounderDiscount(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/discounts/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete discount');
  },

  // Founder Reports APIs
  async getFounderExecutiveReport(params: {
    format: string;
    date_from: string;
    date_to: string;
    include_metrics: string[]
  }): Promise<ExecutiveReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/reports/executive', {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Failed to fetch executive report');
    const data = await response.json();
    return data.data;
  },

  // ==========================================
  // MARKETING APIS
  // ==========================================

  // Marketing Analytics - Traffic
  async getMarketingTrafficAnalytics(params: TrafficQueryParams): Promise<TrafficAnalytics> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`/api/marketing/analytics/traffic?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch traffic analytics');
    const data = await response.json();
    return data.data;
  },

  // Marketing Analytics - Leads
  async getMarketingLeadConversion(params: DateRangeParams): Promise<LeadConversion> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`/api/marketing/analytics/leads/conversion?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch lead conversion');
    const data = await response.json();
    return data.data;
  },

  async getMarketingLeadsAnalytics(params?: DateRangeParams): Promise<LeadsAnalytics> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/analytics/leads${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch leads analytics');
    const data = await response.json();
    return data.data;
  },

  // Marketing Analytics - Listings
  async getMarketingListingsAnalytics(params?: DateRangeParams): Promise<ListingsAnalytics> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/analytics/listings${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch listings analytics');
    const data = await response.json();
    return data.data;
  },

  async getMarketingListingPerformance(id: string): Promise<ListingPerformance> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/analytics/listings/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch listing performance');
    const data = await response.json();
    return data.data;
  },

  // Marketing Dashboard
  async getMarketingDashboard(): Promise<MarketingDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/marketing/dashboard', { headers });
    if (!response.ok) throw new Error('Failed to fetch marketing dashboard');
    const data = await response.json();
    return data.data;
  },

  // Marketing Analytics - Bookings
  async getMarketingBookingsAnalytics(params: DateRangeParams): Promise<BookingsAnalytics> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`/api/marketing/analytics/bookings?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch bookings analytics');
    const data = await response.json();
    return data.data;
  },

  // Marketing Analytics - Traffic Sources
  async getMarketingTrafficSources(params: DateRangeParams): Promise<TrafficSources> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`/api/marketing/analytics/traffic/sources?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch traffic sources');
    const data = await response.json();
    return data.data;
  },

  // Marketing KYC Insights
  async getMarketingKycOverview(): Promise<KYCOverview> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/marketing/kyc/overview', { headers });
    if (!response.ok) throw new Error('Failed to fetch KYC overview');
    const data = await response.json();
    return data.data;
  },

  async getMarketingKycBreakdown(params?: DateRangeParams): Promise<KYCBreakdown> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/kyc/breakdown${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch KYC breakdown');
    const data = await response.json();
    return data.data;
  },

  // Marketing Analytics - Agents & Hotels
  async getMarketingAgentActivity(params?: DateRangeParams): Promise<AgentActivity> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/analytics/agents${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch agent activity');
    const data = await response.json();
    return data.data;
  },

  async getMarketingHotelActivity(params?: DateRangeParams): Promise<HotelActivity> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/analytics/hotels${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch hotel activity');
    const data = await response.json();
    return data.data;
  },

  // Marketing Reports
  async exportMarketingReport(params: ReportExportParams): Promise<unknown> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/marketing/reports/export', {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Failed to export report');
    const data = await response.json();
    return data.data;
  },

  async getMarketingTrendsReport(params?: TrendsQueryParams): Promise<TrendsReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as unknown as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/reports/trends${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch trends report');
    const data = await response.json();
    return data.data;
  },

  async getMarketingSummaryReport(params?: DateRangeParams): Promise<SummaryReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/reports/summary${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch summary report');
    const data = await response.json();
    return data.data;
  },

  // Marketing Flags
  async listMarketingFlags(params?: FlagsQueryParams): Promise<ListFlagsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/flags${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch flags');
    const data = await response.json();
    return data.data;
  },

  async flagProperty(propertyId: string, data: FlagPropertyRequest): Promise<MarketingFlag> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/flags/properties/${propertyId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to flag property');
    const result = await response.json();
    return result.data;
  },

  async flagAgent(agentId: string, data: FlagAgentRequest): Promise<MarketingFlag> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/flags/agents/${agentId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to flag agent');
    const result = await response.json();
    return result.data;
  },

  // Marketing Campaigns
  async listMarketingCampaigns(params?: CampaignsQueryParams): Promise<ListCampaignsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/marketing/campaigns${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    const data = await response.json();
    return data.data;
  },

  async getMarketingCampaign(id: string): Promise<Campaign> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/campaigns/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch campaign');
    const data = await response.json();
    return data.data;
  },

  async createMarketingCampaign(data: CreateCampaignRequest): Promise<Campaign> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/marketing/campaigns', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create campaign');
    const result = await response.json();
    return result.data;
  },

  async updateMarketingCampaign(id: string, data: UpdateCampaignRequest): Promise<Campaign> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/campaigns/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update campaign');
    const result = await response.json();
    return result.data;
  },

  async getMarketingCampaignROI(id: string): Promise<CampaignROI> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/campaigns/${id}/roi`, { headers });
    if (!response.ok) throw new Error('Failed to fetch campaign ROI');
    const data = await response.json();
    return data.data;
  },

  async getMarketingCampaignPerformance(id: string): Promise<CampaignPerformance> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/campaigns/${id}/performance`, { headers });
    if (!response.ok) throw new Error('Failed to fetch campaign performance');
    const data = await response.json();
    return data.data;
  },

  async addMarketingCampaignMetric(id: string, data: AddCampaignMetricRequest): Promise<unknown> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/marketing/campaigns/${id}/metrics`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add campaign metric');
    const result = await response.json();
    return result.data;
  },

  // ==========================================
  // SALES APIS
  // ==========================================

  async getSalesDashboard(): Promise<SalesDashboard> {
    console.log('🔄 API Service: Fetching sales dashboard');
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/sales/dashboard', { headers });
    console.log('📡 API Service: Sales dashboard response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Sales dashboard failed with status:', response.status);
      throw new Error('Failed to fetch sales dashboard');
    }

    const data = await response.json();
    console.log('✅ API Service: Sales dashboard data:', data);
    return data.data;
  },

  async listOnboarding(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    type?: string;
    assigned_to?: number;
  }): Promise<ListOnboardingResponse> {
    console.log('🔄 API Service: Fetching onboarding requests with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/sales/onboarding${queryString}`, { headers });
    console.log('📡 API Service: Onboarding response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Onboarding failed with status:', response.status);
      throw new Error('Failed to fetch onboarding requests');
    }

    const data = await response.json();
    console.log('✅ API Service: Onboarding data:', data);
    return data.data;
  },

  async listPartners(params?: {
    page?: number;
    per_page?: number;
    type?: string;
    status?: string;
  }): Promise<ListPartnersResponse> {
    console.log('🔄 API Service: Fetching partners with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/sales/partners${queryString}`, { headers });
    console.log('📡 API Service: Partners response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Partners failed with status:', response.status);
      throw new Error('Failed to fetch partners');
    }

    const data = await response.json();
    console.log('✅ API Service: Partners data:', data);
    return data.data;
  },

  // Sales Analytics
  async getOnboardingAnalytics(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<OnboardingAnalytics> {
    console.log('🔄 API Service: Fetching onboarding analytics with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/sales/analytics/onboarding${queryString}`, { headers });
    console.log('📡 API Service: Onboarding analytics response status:', response.status);

    if (!response.ok) {
      console.error('❌ API Service: Onboarding analytics failed with status:', response.status);
      throw new Error('Failed to fetch onboarding analytics');
    }

    const data = await response.json();
    console.log('✅ API Service: Onboarding analytics data:', data);
    return data.data;
  },

  async getOnboardingByType(type: 'hotels' | 'shortlets' | 'agents', params?: {
    page?: number;
    per_page?: number;
    status?: string;
  }): Promise<ListOnboardingResponse> {
    console.log(`🔄 API Service: Fetching ${type} onboarding with params:`, params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/sales/onboarding/${type}${queryString}`, { headers });
    console.log(`📡 API Service: ${type} onboarding response status:`, response.status);

    if (!response.ok) {
      console.error(`❌ API Service: ${type} onboarding failed with status:`, response.status);
      throw new Error(`Failed to fetch ${type} onboarding`);
    }

    const data = await response.json();
    console.log(`✅ API Service: ${type} onboarding data:`, data);
    return data.data;
  },

  // ==========================================
  // ONBOARDING CRUD OPERATIONS
  // ==========================================

  async getOnboardingDetails(id: number): Promise<OnboardingDetails> {
    console.log('🔄 API Service: Fetching onboarding details for ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/onboarding/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch onboarding details');
    const data = await response.json();
    return data.data;
  },

  async createOnboarding(requestData: CreateOnboardingRequest): Promise<OnboardingRequest> {
    console.log('🔄 API Service: Creating onboarding request:', requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/sales/onboarding', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to create onboarding request');
    const data = await response.json();
    return data.data;
  },

  async updateOnboarding(id: number, requestData: UpdateOnboardingRequest): Promise<OnboardingRequest> {
    console.log('🔄 API Service: Updating onboarding ID:', id, requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/onboarding/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to update onboarding request');
    const data = await response.json();
    return data.data;
  },

  async completeOnboarding(id: number, requestData: CompleteOnboardingRequest): Promise<OnboardingRequest> {
    console.log('🔄 API Service: Completing onboarding ID:', id, requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/onboarding/${id}/complete`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to complete onboarding');
    const data = await response.json();
    return data.data;
  },

  async rejectOnboarding(id: number, requestData: RejectOnboardingRequest): Promise<OnboardingRequest> {
    console.log('🔄 API Service: Rejecting onboarding ID:', id, requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/onboarding/${id}/reject`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to reject onboarding');
    const data = await response.json();
    return data.data;
  },

  // ==========================================
  // KYC MANAGEMENT
  // ==========================================

  async getKYCStatus(userId: number): Promise<KYCStatus> {
    console.log('🔄 API Service: Fetching KYC status for user:', userId);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/kyc/${userId}/status`, { headers });
    if (!response.ok) throw new Error('Failed to fetch KYC status');
    const data = await response.json();
    return data.data;
  },

  async initiateKYC(userId: number, requestData: InitiateKYCRequest): Promise<unknown> {
    console.log('🔄 API Service: Initiating KYC for user:', userId, requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/kyc/${userId}/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to initiate KYC');
    const data = await response.json();
    return data.data;
  },

  async checkKYCRequired(userId: number): Promise<KYCRequired> {
    console.log('🔄 API Service: Checking if KYC required for user:', userId);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/kyc/${userId}/required`, { headers });
    if (!response.ok) throw new Error('Failed to check KYC requirement');
    const data = await response.json();
    return data.data;
  },

  // ==========================================
  // PARTNER DETAILS & ENGAGEMENT
  // ==========================================

  async getPartnerDetails(id: number): Promise<PartnerDetails> {
    console.log('🔄 API Service: Fetching partner details for ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/partners/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch partner details');
    const data = await response.json();
    return data.data;
  },

  async getPartnerActivity(id: number, params?: { start_date?: string; end_date?: string }): Promise<PartnerActivity> {
    console.log('🔄 API Service: Fetching partner activity for ID:', id, params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/sales/partners/${id}/activity${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch partner activity');
    const data = await response.json();
    return data.data;
  },

  async getPartnerEngagement(id: number): Promise<PartnerEngagement> {
    console.log('🔄 API Service: Fetching partner engagement for ID:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/partners/${id}/engagement`, { headers });
    if (!response.ok) throw new Error('Failed to fetch partner engagement');
    const data = await response.json();
    return data.data;
  },

  // ==========================================
  // PROPERTY MANAGEMENT
  // ==========================================

  async uploadProperty(requestData: UploadPropertyRequest, images: File[]): Promise<unknown> {
    console.log('🔄 API Service: Uploading property:', requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append('partner_id', requestData.partner_id.toString());
    formData.append('property_type', requestData.property_type);
    formData.append('name', requestData.name);
    formData.append('description', requestData.description);
    formData.append('location', JSON.stringify(requestData.location));
    formData.append('amenities', JSON.stringify(requestData.amenities));
    formData.append('pricing', JSON.stringify(requestData.pricing));

    images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    const response = await fetch('/api/sales/properties/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload property');
    const data = await response.json();
    return data.data;
  },

  async updateProperty(id: number, requestData: UpdatePropertyRequest): Promise<unknown> {
    console.log('🔄 API Service: Updating property ID:', id, requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/properties/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to update property');
    const data = await response.json();
    return data.data;
  },

  async uploadRoom(propertyId: number, requestData: UploadRoomRequest): Promise<unknown> {
    console.log('🔄 API Service: Uploading room for property:', propertyId, requestData);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/sales/properties/${propertyId}/rooms`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to upload room');
    const data = await response.json();
    return data.data;
  },

  async uploadPropertyImages(id: number, images: File[]): Promise<unknown> {
    console.log('🔄 API Service: Uploading images for property:', id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    const response = await fetch(`/api/sales/properties/${id}/images`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload property images');
    const data = await response.json();
    return data.data;
  },

  // ==========================================
  // OPERATIONS API
  // ==========================================

  // Dashboard
  async getOperationsDashboard(): Promise<OperationsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/operations/dashboard', { headers });
    if (!response.ok) throw new Error('Failed to fetch operations dashboard');
    const data = await response.json();
    return data.data;
  },

  // Subscriptions
  async listOperationsSubscriptions(params?: SubscriptionQueryParams): Promise<CompanyDataPaginatedResponse<OperationsSubscription>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/subscriptions${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    const data = await response.json();
    return data.data;
  },

  async getOperationsSubscription(id: number): Promise<OperationsSubscriptionDetails> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch subscription');
    const data = await response.json();
    return data.data;
  },

  async createOperationsSubscription(request: CreateSubscriptionRequest): Promise<OperationsSubscription> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/operations/subscriptions', {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to create subscription');
    const data = await response.json();
    return data.data;
  },

  async updateOperationsSubscription(id: number, request: UpdateSubscriptionRequest): Promise<OperationsSubscription> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update subscription');
    const data = await response.json();
    return data.data;
  },

  async renewOperationsSubscription(id: number): Promise<OperationsSubscription> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}/renew`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to renew subscription');
    const data = await response.json();
    return data.data;
  },

  async cancelOperationsSubscription(id: number, data?: CancelSubscriptionRequest): Promise<OperationsSubscription> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}/cancel`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error('Failed to cancel subscription');
    const responseData = await response.json();
    return responseData.data;
  },

  async suspendOperationsSubscription(id: number): Promise<OperationsSubscription> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}/suspend`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to suspend subscription');
    const data = await response.json();
    return data.data;
  },

  async reactivateOperationsSubscription(id: number): Promise<OperationsSubscription> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}/reactivate`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Failed to reactivate subscription');
    const data = await response.json();
    return data.data;
  },

  async getSubscriptionHistory(id: number): Promise<SubscriptionHistory[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/subscriptions/${id}/history`, { headers });
    if (!response.ok) throw new Error('Failed to fetch subscription history');
    const data = await response.json();
    return data.data;
  },

  // Wallets
  async listOperationsWalletTransactions(params?: WalletTransactionQueryParams): Promise<CompanyDataPaginatedResponse<OperationsWalletTransaction>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/wallets/transactions${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch wallet transactions');
    const data = await response.json();
    return data.data;
  },

  async getOperationsWalletTransaction(id: number): Promise<OperationsWalletTransaction> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/wallets/transactions/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch wallet transaction');
    const data = await response.json();
    return data.data;
  },

  async getOperationsWalletBalances(): Promise<WalletBalances> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/operations/wallets/balances', { headers });
    if (!response.ok) throw new Error('Failed to fetch wallet balances');
    const data = await response.json();
    return data.data;
  },

  async getOperationsUserWalletBalance(userId: number): Promise<UserWalletBalance> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/wallets/${userId}/balance`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user wallet balance');
    const data = await response.json();
    return data.data;
  },

  async getOperationsUserWalletTransactions(userId: number, params?: WalletTransactionQueryParams): Promise<CompanyDataPaginatedResponse<OperationsWalletTransaction>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/wallets/${userId}/transactions${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user wallet transactions');
    const data = await response.json();
    return data.data;
  },

  // Reports
  async getOperationsRevenueReport(params: ReportQueryParams): Promise<RevenueReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as unknown as Record<string, string>).toString();
    const response = await fetch(`/api/operations/reports/revenue?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch revenue report');
    const data = await response.json();
    return data.data;
  },

  async getOperationsSubscriptionsReport(params?: ReportQueryParams): Promise<SubscriptionsReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as unknown as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/reports/subscriptions${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch subscriptions report');
    const data = await response.json();
    return data.data;
  },

  async getOperationsCommissionsReport(params: ReportQueryParams): Promise<CommissionsReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as unknown as Record<string, string>).toString();
    const response = await fetch(`/api/operations/reports/commissions?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch commissions report');
    const data = await response.json();
    return data.data;
  },

  async getOperationsFinancialSummary(params: ReportQueryParams): Promise<FinancialSummary> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = new URLSearchParams(params as unknown as Record<string, string>).toString();
    const response = await fetch(`/api/operations/reports/financial-summary?${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch financial summary');
    const data = await response.json();
    return data.data;
  },

  async exportOperationsReport(data: ExportReportRequest): Promise<Blob> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/operations/reports/export', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to export report');
    return response.blob();
  },

  // KYC Flagged
  async listOperationsFlaggedKYC(params?: FlaggedKYCQueryParams): Promise<CompanyDataPaginatedResponse<FlaggedKYC>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/kyc/flagged${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch flagged KYC');
    const data = await response.json();
    return data.data;
  },

  async getOperationsFlaggedKYC(id: number): Promise<FlaggedKYC> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/kyc/flagged/${id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch flagged KYC');
    const data = await response.json();
    return data.data;
  },

  async manualVerifyOperationsKYC(id: number, data: ManualVerifyKYCRequest): Promise<FlaggedKYC> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/kyc/flagged/${id}/manual-verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to manually verify KYC');
    const responseData = await response.json();
    return responseData.data;
  },

  async approveOperationsFlaggedKYC(id: number, data?: ApproveKYCRequest): Promise<FlaggedKYC> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/kyc/flagged/${id}/approve`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error('Failed to approve flagged KYC');
    const responseData = await response.json();
    return responseData.data;
  },

  async rejectOperationsFlaggedKYC(id: number, data: RejectKYCRequest): Promise<FlaggedKYC> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/kyc/flagged/${id}/reject`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to reject flagged KYC');
    const responseData = await response.json();
    return responseData.data;
  },

  // Payment Reconciliation
  async listOperationsReconciliations(params?: ReconciliationQueryParams): Promise<CompanyDataPaginatedResponse<Reconciliation>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/payments/reconcile${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch reconciliations');
    const data = await response.json();
    return data.data;
  },

  async createOperationsReconciliation(data: CreateReconciliationRequest): Promise<Reconciliation> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/operations/payments/reconcile', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create reconciliation');
    const responseData = await response.json();
    return responseData.data;
  },

  async reconcileOperationsPayment(id: number, data?: ReconcilePaymentRequest): Promise<Reconciliation> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/operations/payments/reconcile/${id}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) throw new Error('Failed to reconcile payment');
    const responseData = await response.json();
    return responseData.data;
  },

  async getOperationsReconciliationReport(params?: ReconciliationReportQueryParams): Promise<ReconciliationReport> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await fetch(`/api/operations/payments/reconciliation-report${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch reconciliation report');
    const data = await response.json();
    return data.data;
  },

  // ============================================================================
  // SUPPORT API METHODS
  // ============================================================================

  // Dashboard
  async getSupportDashboard(): Promise<SupportDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/support/dashboard', { headers });
    if (!response.ok) throw new Error('Failed to fetch support dashboard');
    const data = await response.json();
    return data.data || data;
  },

  // Tickets
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

  // Chats
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
  // Calls API Methods
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
  // Emails API Methods
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
  // Analytics API Methods
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
  // Users API Methods (for support context)
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

  // ========== CRM Dashboard Methods ==========
  async getCRMDashboard(myLeads?: boolean): Promise<CRMDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryString = myLeads ? '?my_leads=true' : '';
    const response = await fetch(`/api/crm/dashboard${queryString}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch CRM dashboard');
    return response.json();
  },

  // ========== Lead Methods ==========
  async listLeads(params?: LeadQueryParams): Promise<ListLeadsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.source) queryParams.append('source', params.source);
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const response = await fetch(`/api/crm/leads${queryString ? `?${queryString}` : ''}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  },

  async getLead(leadId: number): Promise<LeadDetails> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/leads/${leadId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch lead');
    return response.json();
  },

  async createLead(data: CreateLeadRequest): Promise<Lead> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/crm/leads', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
  },

  async updateLead(leadId: number, data: UpdateLeadRequest): Promise<Lead> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/leads/${leadId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update lead');
    return response.json();
  },

  async deleteLead(leadId: number): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/leads/${leadId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete lead');
  },

  async convertLead(leadId: number, data: ConvertLeadRequest): Promise<Lead> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/leads/${leadId}/convert`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to convert lead');
    return response.json();
  },

  // ========== Contact Methods ==========
  async listContacts(params?: ContactQueryParams): Promise<ListContactsResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.assigned_to) queryParams.append('assigned_to', params.assigned_to.toString());

    const queryString = queryParams.toString();
    const response = await fetch(`/api/crm/contacts${queryString ? `?${queryString}` : ''}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  async getContact(contactId: number): Promise<ContactDetails> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/contacts/${contactId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch contact');
    return response.json();
  },

  async createContact(data: CreateContactRequest): Promise<Contact> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/crm/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create contact');
    return response.json();
  },

  async updateContact(contactId: number, data: UpdateContactRequest): Promise<Contact> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/contacts/${contactId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update contact');
    return response.json();
  },

  async deleteContact(contactId: number): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/contacts/${contactId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete contact');
  },

  // ========== Activity Methods ==========
  async listActivities(params?: ActivityQueryParams): Promise<ListActivitiesResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.lead_id) queryParams.append('lead_id', params.lead_id.toString());
    if (params?.contact_id) queryParams.append('contact_id', params.contact_id.toString());
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString());

    const queryString = queryParams.toString();
    const response = await fetch(`/api/crm/activities${queryString ? `?${queryString}` : ''}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
  },

  async getActivity(activityId: number): Promise<Activity> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/activities/${activityId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
  },

  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/crm/activities', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create activity');
    return response.json();
  },

  async updateActivity(activityId: number, data: UpdateActivityRequest): Promise<Activity> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/activities/${activityId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update activity');
    return response.json();
  },

  async deleteActivity(activityId: number): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/crm/activities/${activityId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete activity');
  },
};