import {
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
  UpdatePermissionsRequest,
  ApproveKYCOverrideRequest,
  DeclineKYCOverrideRequest,
  OverrideSubscriptionRequest,
  OverridePaymentRequest,
  Discount,
  ListDiscountsResponse,
  CreateDiscountRequest,
  UpdateDiscountRequest,
  ExecutiveReport,
} from '@/types/api';
import { ApiError } from './api-error-handler';
import {
  validateRevenueDashboard,
  validateGrowthDashboard,
  validateSubscriptionsDashboard,
  validateWalletsDashboard,
  validatePropertiesDashboard,
  validateBookingsDashboard,
  validateFounderSupportDashboard,
  createEmptyRevenueDashboard,
  createEmptyGrowthDashboard,
  createEmptySubscriptionsDashboard,
  createEmptyWalletsDashboard,
  createEmptyPropertiesDashboard,
  createEmptyBookingsDashboard,
  createEmptyFounderSupportDashboard,
} from './api-validators';

/**
 * Safely unwraps API response data with optional validation
 * @param data - The raw response data
 * @param validator - Optional validator function to validate and transform data
 * @param fallback - Optional fallback value if validation fails
 * @returns Unwrapped and validated data
 */
function safeUnwrap<T>(
  data: unknown,
  validator?: (data: unknown) => T,
  fallback?: T
): T {
  // Handle null/undefined response
  if (!data) {
    if (fallback !== undefined) return fallback;
    throw new ApiError('No data returned from API', 500);
  }

  // Unwrap data.data if it exists, otherwise use data directly
  const unwrapped = (data as Record<string, unknown>).data ?? data;

  // Run validator if provided
  if (validator) {
    try {
      return validator(unwrapped);
    } catch (error) {
      console.error('Data validation failed:', error);
      if (fallback !== undefined) return fallback;
      throw new ApiError('Invalid data structure received', 500);
    }
  }

  return unwrapped as T;
}

// Founder API service
export const founderApiService = {
  // ==========================================
  // FOUNDER DASHBOARD APIS
  // ==========================================

  async getFounderRevenueDashboard(): Promise<RevenueDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/revenue', { headers });
    if (!response.ok) throw new Error('Failed to fetch revenue dashboard');
    const data = await response.json();
    return safeUnwrap(data, validateRevenueDashboard, createEmptyRevenueDashboard());
  },

  async getFounderSubscriptionsDashboard(): Promise<SubscriptionsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/subscriptions', { headers });
    if (!response.ok) throw new Error('Failed to fetch subscriptions dashboard');
    const data = await response.json();
    return safeUnwrap(data, validateSubscriptionsDashboard, createEmptySubscriptionsDashboard());
  },

  async getFounderWalletsDashboard(): Promise<WalletsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/wallets', { headers });
    if (!response.ok) throw new Error('Failed to fetch wallets dashboard');
    const data = await response.json();
    return safeUnwrap(data, validateWalletsDashboard, createEmptyWalletsDashboard());
  },

  async getFounderGrowthDashboard(): Promise<GrowthDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/growth', { headers });
    if (!response.ok) throw new Error('Failed to fetch growth dashboard');
    const data = await response.json();
    return safeUnwrap(data, validateGrowthDashboard, createEmptyGrowthDashboard());
  },

  async getFounderPropertiesDashboard(): Promise<PropertiesDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/properties', { headers });
    if (!response.ok) throw new Error('Failed to fetch properties dashboard');
    const data = await response.json();
    return safeUnwrap(data, validatePropertiesDashboard, createEmptyPropertiesDashboard());
  },

  async getFounderBookingsDashboard(): Promise<BookingsDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/bookings', { headers });
    if (!response.ok) throw new Error('Failed to fetch bookings dashboard');
    const data = await response.json();
    return safeUnwrap(data, validateBookingsDashboard, createEmptyBookingsDashboard());
  },

  async getFounderSupportDashboard(): Promise<FounderSupportDashboard> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/founder/dashboard/support', { headers });
    if (!response.ok) throw new Error('Failed to fetch support dashboard');
    const data = await response.json();
    return safeUnwrap(data, validateFounderSupportDashboard, createEmptyFounderSupportDashboard());
  },

  // ==========================================
  // FOUNDER STAFF MANAGEMENT APIS
  // ==========================================

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
      method: 'PUT',
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

  async updateFounderStaffPermissions(id: string, data: UpdatePermissionsRequest): Promise<Staff> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('proplinq_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/founder/staff/${id}/permissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update permissions');
    const result = await response.json();
    return result.data;
  },

  // ==========================================
  // FOUNDER OVERRIDE APIS
  // ==========================================

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

  // ==========================================
  // FOUNDER DISCOUNT APIS
  // ==========================================

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
      method: 'PUT',
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

  // ==========================================
  // FOUNDER REPORTS APIS
  // ==========================================

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
};
