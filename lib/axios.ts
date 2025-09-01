import { LoginCredentials, ApiLoginResponse, DashboardStats, ApiUser, Booking, BookingUpdate, Transaction, KycVerification, RefundRequest, KycReview, PaginatedResponse } from '@/types/api';

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
};