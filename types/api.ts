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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingKyc: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
  }>;
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
  id: string;
  userId: string;
  documentType: 'passport' | 'driver_license' | 'national_id';
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  submittedAt: string;
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

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}