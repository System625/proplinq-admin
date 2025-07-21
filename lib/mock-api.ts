import { 
  MOCK_CREDENTIALS, 
  MOCK_ADMIN_USER, 
  MOCK_DASHBOARD_STATS, 
  MOCK_USERS, 
  MOCK_BOOKINGS, 
  MOCK_TRANSACTIONS, 
  MOCK_KYC_VERIFICATIONS 
} from './mock-data';
import { 
  LoginCredentials, 
  LoginResponse, 
  DashboardStats, 
  User, 
  Booking, 
  Transaction, 
  KycVerification,
  PaginatedResponse 
} from '@/types/api';

// Simulate network delay
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock JWT token
const MOCK_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi0xIiwiZW1haWwiOiJhZG1pbkBwcm9wbGlucS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU5NzQ0MDAsImV4cCI6OTk5OTk5OTk5OX0.mock';

export class MockApiService {
  // Authentication
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(800);
    
    if (
      credentials.email === MOCK_CREDENTIALS.email &&
      credentials.password === MOCK_CREDENTIALS.password
    ) {
      return {
        token: MOCK_JWT_TOKEN,
        user: MOCK_ADMIN_USER,
      };
    }
    
    throw new Error('Invalid credentials');
  }

  // Dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    await delay(600);
    return MOCK_DASHBOARD_STATS;
  }

  // Users
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    await delay(500);
    
    const { page = 1, limit = 10, search = '' } = params || {};
    
    let filteredUsers = MOCK_USERS;
    
    if (search) {
      filteredUsers = MOCK_USERS.filter(user => 
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const users = filteredUsers.slice(startIndex, endIndex);
    
    return {
      data: users,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    };
  }

  static async getUser(id: string): Promise<User> {
    await delay(300);
    
    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  // Bookings
  static async getBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Booking>> {
    await delay(500);
    
    const { page = 1, limit = 10, status } = params || {};
    
    let filteredBookings = MOCK_BOOKINGS;
    
    if (status && status !== 'all') {
      filteredBookings = MOCK_BOOKINGS.filter(booking => booking.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const bookings = filteredBookings.slice(startIndex, endIndex);
    
    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total: filteredBookings.length,
        totalPages: Math.ceil(filteredBookings.length / limit),
      },
    };
  }

  static async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    await delay(400);
    
    const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    MOCK_BOOKINGS[bookingIndex] = { ...MOCK_BOOKINGS[bookingIndex], ...data };
    return MOCK_BOOKINGS[bookingIndex];
  }

  // Transactions
  static async getTransactions(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Transaction>> {
    await delay(500);
    
    const { page = 1, limit = 10 } = params || {};
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const transactions = MOCK_TRANSACTIONS.slice(startIndex, endIndex);
    
    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total: MOCK_TRANSACTIONS.length,
        totalPages: Math.ceil(MOCK_TRANSACTIONS.length / limit),
      },
    };
  }

  static async processRefund(data: { bookingId: string; amount: number; reason: string }): Promise<Transaction> {
    await delay(800);
    
    const newTransaction: Transaction = {
      id: (MOCK_TRANSACTIONS.length + 1).toString(),
      bookingId: data.bookingId,
      amount: data.amount,
      type: 'refund',
      status: 'completed',
      paymentMethod: 'Credit Card',
      createdAt: new Date().toISOString(),
    };
    
    MOCK_TRANSACTIONS.unshift(newTransaction);
    return newTransaction;
  }

  // KYC Verifications
  static async getKycVerifications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<KycVerification>> {
    await delay(500);
    
    const { page = 1, limit = 10, status } = params || {};
    
    let filteredKyc = MOCK_KYC_VERIFICATIONS;
    
    if (status && status !== 'all') {
      filteredKyc = MOCK_KYC_VERIFICATIONS.filter(kyc => kyc.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const kycs = filteredKyc.slice(startIndex, endIndex);
    
    return {
      data: kycs,
      pagination: {
        page,
        limit,
        total: filteredKyc.length,
        totalPages: Math.ceil(filteredKyc.length / limit),
      },
    };
  }

  static async getKycVerification(id: string): Promise<KycVerification> {
    await delay(300);
    
    const kyc = MOCK_KYC_VERIFICATIONS.find(k => k.id === id);
    if (!kyc) {
      throw new Error('KYC verification not found');
    }
    
    return kyc;
  }

  static async reviewKycVerification(id: string, data: {
    action: 'approve' | 'reject';
    reason?: string;
  }): Promise<KycVerification> {
    await delay(600);
    
    const kycIndex = MOCK_KYC_VERIFICATIONS.findIndex(k => k.id === id);
    if (kycIndex === -1) {
      throw new Error('KYC verification not found');
    }
    
    MOCK_KYC_VERIFICATIONS[kycIndex] = {
      ...MOCK_KYC_VERIFICATIONS[kycIndex],
      status: data.action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: 'admin-1',
      reviewedAt: new Date().toISOString(),
      ...(data.action === 'reject' && data.reason && { rejectionReason: data.reason }),
    };
    
    return MOCK_KYC_VERIFICATIONS[kycIndex];
  }
}