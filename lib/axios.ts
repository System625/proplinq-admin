import axios from 'axios';
import { MockApiService } from './mock-api';
import { LoginCredentials, LoginResponse, DashboardStats, User, Booking, Transaction, KycVerification, RefundRequest, KycReview, PaginatedResponse } from '@/types/api';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('proplinq_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('proplinq_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service with fallback to mock data
export const apiService = {
  // Authentication
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch {
      // Fallback to mock API if real API is unavailable
      console.warn('Using mock API for login');
      return await MockApiService.login(credentials);
    }
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch {
      console.warn('Using mock API for dashboard stats');
      return await MockApiService.getDashboardStats();
    }
  },

  // Users
  async getUsers(params?: Record<string, unknown>): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch {
      console.warn('Using mock API for users');
      return await MockApiService.getUsers(params);
    }
  },

  async getUser(id: string): Promise<User> {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch {
      console.warn('Using mock API for user details');
      return await MockApiService.getUser(id);
    }
  },

  // Bookings
  async getBookings(params?: Record<string, unknown>): Promise<PaginatedResponse<Booking>> {
    try {
      const response = await api.get('/admin/bookings', { params });
      return response.data;
    } catch {
      console.warn('Using mock API for bookings');
      return await MockApiService.getBookings(params);
    }
  },

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    try {
      const response = await api.put(`/admin/bookings/${id}`, data);
      return response.data;
    } catch {
      console.warn('Using mock API for booking update');
      return await MockApiService.updateBooking(id, data);
    }
  },

  // Transactions
  async getTransactions(params?: Record<string, unknown>): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await api.get('/admin/transactions', { params });
      return response.data;
    } catch {
      console.warn('Using mock API for transactions');
      return await MockApiService.getTransactions(params);
    }
  },

  async processRefund(data: RefundRequest): Promise<Transaction> {
    try {
      const response = await api.post('/admin/refunds', data);
      return response.data;
    } catch {
      console.warn('Using mock API for refund processing');
      return await MockApiService.processRefund(data);
    }
  },

  // KYC
  async getKycVerifications(params?: Record<string, unknown>): Promise<PaginatedResponse<KycVerification>> {
    try {
      const response = await api.get('/admin/kyc', { params });
      return response.data;
    } catch {
      console.warn('Using mock API for KYC verifications');
      return await MockApiService.getKycVerifications(params);
    }
  },

  async getKycVerification(id: string): Promise<KycVerification> {
    try {
      const response = await api.get(`/admin/kyc/${id}`);
      return response.data;
    } catch {
      console.warn('Using mock API for KYC details');
      return await MockApiService.getKycVerification(id);
    }
  },

  async reviewKycVerification(id: string, data: KycReview): Promise<KycVerification> {
    try {
      const response = await api.post(`/admin/kyc/${id}/verify`, data);
      return response.data;
    } catch {
      console.warn('Using mock API for KYC review');
      return await MockApiService.reviewKycVerification(id, data);
    }
  },
};