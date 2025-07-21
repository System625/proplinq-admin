import { User, DashboardStats, Booking, Transaction, KycVerification } from '@/types/api';

// Mock credentials
export const MOCK_CREDENTIALS = {
  email: 'admin@proplinq.com',
  password: 'admin123',
};

// Mock admin user
export const MOCK_ADMIN_USER: User = {
  id: 'admin-1',
  email: 'admin@proplinq.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  isVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock users data
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-25T11:20:00Z',
  },
  {
    id: '3',
    email: 'mike.johnson@example.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'user',
    isVerified: false,
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: '2024-02-01T14:00:00Z',
  },
  {
    id: '4',
    email: 'sarah.wilson@example.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'user',
    isVerified: true,
    createdAt: '2024-02-05T16:30:00Z',
    updatedAt: '2024-02-10T12:15:00Z',
  },
  {
    id: '5',
    email: 'david.brown@example.com',
    firstName: 'David',
    lastName: 'Brown',
    role: 'user',
    isVerified: false,
    createdAt: '2024-02-10T08:45:00Z',
    updatedAt: '2024-02-10T08:45:00Z',
  },
];

// Generate additional mock users
for (let i = 6; i <= 50; i++) {
  MOCK_USERS.push({
    id: i.toString(),
    email: `user${i}@example.com`,
    firstName: `User${i}`,
    lastName: `LastName${i}`,
    role: 'user',
    isVerified: Math.random() > 0.3,
    createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// Mock bookings data
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    userId: '1',
    propertyId: 'prop-1',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    totalAmount: 750,
    status: 'confirmed',
    guestName: 'John Doe',
    guestEmail: 'john.doe@example.com',
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '2',
    propertyId: 'prop-2',
    checkIn: '2024-03-20',
    checkOut: '2024-03-25',
    totalAmount: 1200,
    status: 'pending',
    guestName: 'Jane Smith',
    guestEmail: 'jane.smith@example.com',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    userId: '3',
    propertyId: 'prop-3',
    checkIn: '2024-02-10',
    checkOut: '2024-02-12',
    totalAmount: 400,
    status: 'completed',
    guestName: 'Mike Johnson',
    guestEmail: 'mike.johnson@example.com',
    createdAt: '2024-01-25T09:15:00Z',
  },
  {
    id: '4',
    userId: '4',
    propertyId: 'prop-4',
    checkIn: '2024-04-01',
    checkOut: '2024-04-05',
    totalAmount: 950,
    status: 'cancelled',
    guestName: 'Sarah Wilson',
    guestEmail: 'sarah.wilson@example.com',
    createdAt: '2024-03-01T11:45:00Z',
  },
];

// Generate additional mock bookings
const statuses: Array<Booking['status']> = ['pending', 'confirmed', 'cancelled', 'completed'];
for (let i = 5; i <= 100; i++) {
  const userId = Math.floor(Math.random() * 50) + 1;
  const user = MOCK_USERS.find(u => u.id === userId.toString()) || MOCK_USERS[0];
  
  MOCK_BOOKINGS.push({
    id: i.toString(),
    userId: userId.toString(),
    propertyId: `prop-${Math.floor(Math.random() * 20) + 1}`,
    checkIn: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    checkOut: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    totalAmount: Math.floor(Math.random() * 2000) + 200,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    guestName: `${user.firstName} ${user.lastName}`,
    guestEmail: user.email,
    createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
  });
}

// Mock transactions data
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    bookingId: '1',
    amount: 750,
    type: 'payment',
    status: 'completed',
    paymentMethod: 'Credit Card',
    createdAt: '2024-02-15T10:05:00Z',
  },
  {
    id: '2',
    bookingId: '2',
    amount: 1200,
    type: 'payment',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    createdAt: '2024-02-20T14:35:00Z',
  },
  {
    id: '3',
    bookingId: '4',
    amount: 950,
    type: 'refund',
    status: 'completed',
    paymentMethod: 'Credit Card',
    createdAt: '2024-03-02T09:20:00Z',
  },
];

// Generate additional mock transactions
const paymentMethods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Apple Pay'];
const transactionStatuses: Array<Transaction['status']> = ['pending', 'completed', 'failed'];

MOCK_BOOKINGS.slice(3).forEach((booking, index) => {
  const transactionId = (4 + index).toString();
  MOCK_TRANSACTIONS.push({
    id: transactionId,
    bookingId: booking.id,
    amount: booking.totalAmount,
    type: Math.random() > 0.8 ? 'refund' : 'payment',
    status: transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)],
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    createdAt: booking.createdAt,
  });
});

// Mock KYC verifications
export const MOCK_KYC_VERIFICATIONS: KycVerification[] = [
  {
    id: '1',
    userId: '3',
    documentType: 'passport',
    documentUrl: '/mock/documents/passport-1.jpg',
    status: 'pending',
    submittedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '5',
    documentType: 'driver_license',
    documentUrl: '/mock/documents/license-1.jpg',
    status: 'pending',
    submittedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    userId: '1',
    documentType: 'national_id',
    documentUrl: '/mock/documents/id-1.jpg',
    status: 'approved',
    reviewedBy: 'admin-1',
    reviewedAt: '2024-01-20T09:15:00Z',
    submittedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '4',
    userId: '2',
    documentType: 'passport',
    documentUrl: '/mock/documents/passport-2.jpg',
    status: 'rejected',
    reviewedBy: 'admin-1',
    reviewedAt: '2024-01-25T11:20:00Z',
    rejectionReason: 'Document image is unclear',
    submittedAt: '2024-01-22T10:30:00Z',
  },
];

// Generate additional mock KYC verifications
const documentTypes: Array<KycVerification['documentType']> = ['passport', 'driver_license', 'national_id'];
const kycStatuses: Array<KycVerification['status']> = ['pending', 'approved', 'rejected'];

MOCK_USERS.slice(5, 25).forEach((user, index) => {
  const kycId = (5 + index).toString();
  const status = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
  
  MOCK_KYC_VERIFICATIONS.push({
    id: kycId,
    userId: user.id,
    documentType: documentTypes[Math.floor(Math.random() * documentTypes.length)],
    documentUrl: `/mock/documents/doc-${kycId}.jpg`,
    status,
    submittedAt: user.createdAt,
    ...(status !== 'pending' && {
      reviewedBy: 'admin-1',
      reviewedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      ...(status === 'rejected' && {
        rejectionReason: 'Document verification failed'
      })
    })
  });
});

// Mock dashboard stats
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalUsers: MOCK_USERS.length,
  totalBookings: MOCK_BOOKINGS.length,
  totalRevenue: MOCK_TRANSACTIONS
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0),
  pendingKyc: MOCK_KYC_VERIFICATIONS.filter(k => k.status === 'pending').length,
  monthlyRevenue: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 19000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 },
    { month: 'Jul', revenue: 32000 },
    { month: 'Aug', revenue: 29000 },
    { month: 'Sep', revenue: 31000 },
    { month: 'Oct', revenue: 35000 },
    { month: 'Nov', revenue: 38000 },
    { month: 'Dec', revenue: 42000 },
  ],
  userGrowth: [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 180 },
    { month: 'Apr', users: 210 },
    { month: 'May', users: 250 },
    { month: 'Jun', users: 280 },
    { month: 'Jul', users: 320 },
    { month: 'Aug', users: 350 },
    { month: 'Sep', users: 380 },
    { month: 'Oct', users: 420 },
    { month: 'Nov', users: 450 },
    { month: 'Dec', users: 500 },
  ],
};