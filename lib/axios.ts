import { LoginCredentials, ApiLoginResponse, DashboardStats, ApiUser, Booking, BookingUpdate, Transaction, KycVerification, RefundRequest, KycReview, PaginatedResponse, BlogPost, BlogPostCreate, BlogPostUpdate, EscalationRequest, EscalationResponse } from '@/types/api';

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
};