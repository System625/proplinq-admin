/**
 * Mock Data Generators for RBAC Dashboards
 * Provides dummy data for testing role-specific dashboards without backend
 */

// Helper to generate random numbers within range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate random date within last N days
function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  return date.toISOString();
}

// Helper to pick random item from array
function randomPick<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

// ==========================================
// CUSTOMER SUPPORT DASHBOARD MOCK DATA
// ==========================================

export interface MockTicket {
  id: string;
  title: string;
  user: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'booking' | 'search' | 'kyc' | 'payment' | 'profile';
  created_at: string;
  updated_at: string;
}

export interface MockChat {
  id: string;
  user: string;
  message: string;
  status: 'active' | 'waiting' | 'idle';
  started_at: string;
}

export interface SupportDashboardStats {
  totalTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  activeChats: number;
  avgResponseTime: string;
  satisfactionRate: number;
  categoryBreakdown?: {
    bookingIssues: number;
    searchIssues: number;
    kycIssues: number;
    paymentIssues: number;
    profileIssues: number;
  };
}

export function generateSupportStats(): SupportDashboardStats {
  return {
    totalTickets: randomInt(150, 300),
    pendingTickets: randomInt(20, 50),
    inProgressTickets: randomInt(10, 30),
    resolvedToday: randomInt(15, 40),
    activeChats: randomInt(5, 15),
    avgResponseTime: `${randomInt(2, 8)} min`,
    satisfactionRate: randomInt(85, 98),
    categoryBreakdown: {
      bookingIssues: randomInt(30, 80),
      searchIssues: randomInt(20, 50),
      kycIssues: randomInt(25, 60),
      paymentIssues: randomInt(15, 45),
      profileIssues: randomInt(10, 35),
    },
  };
}

export function generateMockTickets(count: number = 10): MockTicket[] {
  const titles = [
    'Cannot login to account',
    'Payment not reflected',
    'Booking confirmation issue',
    'KYC document upload failed',
    'Property not showing in search',
    'Refund request pending',
    'Account verification stuck',
    'Password reset not working',
    'Email not received',
    'Profile update error',
  ];

  const users = [
    'John Doe',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Brown',
    'David Wilson',
    'Lisa Anderson',
    'James Taylor',
    'Emma Martinez',
    'Robert Lee',
    'Maria Garcia',
  ];

  return Array.from({ length: count }, () => ({
    id: `TKT-${String(randomInt(1000, 9999))}`,
    title: randomPick(titles),
    user: randomPick(users),
    status: randomPick(['pending', 'in-progress', 'resolved', 'closed']),
    priority: randomPick(['low', 'medium', 'high', 'urgent']),
    category: randomPick(['booking', 'search', 'kyc', 'payment', 'profile']),
    created_at: randomDate(30),
    updated_at: randomDate(5),
  }));
}

export function generateMockChats(count: number = 5): MockChat[] {
  const users = [
    'Alice Cooper',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
    'Ethan Hunt',
  ];

  const messages = [
    'Hi, I need help with my booking',
    'My payment was charged twice',
    'Can you help me verify my account?',
    'I cannot find my confirmation email',
    'How do I change my property details?',
  ];

  return Array.from({ length: count }, () => ({
    id: `CHAT-${String(randomInt(100, 999))}`,
    user: randomPick(users),
    message: randomPick(messages),
    status: randomPick(['active', 'waiting', 'idle']),
    started_at: randomDate(1),
  }));
}

// ==========================================
// OPERATIONS & ADMIN DASHBOARD MOCK DATA
// ==========================================

export interface MockSubscription {
  id: string;
  partner: string;
  plan: 'Basic' | 'Premium' | 'Enterprise';
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  mrr: number;
  next_billing: string;
  created_at: string;
}

export interface MockWalletTransaction {
  id: string;
  user: string;
  type: 'deposit' | 'withdrawal' | 'refund' | 'commission';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface OperationsDashboardStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  cancelledThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  walletBalance: number;
  pendingPayouts: number;
  listings?: {
    active: number;
    pending: number;
    rejected: number;
  };
  kycOverview?: {
    pendingKyc: number;
    approvedToday: number;
  };
  bookings?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    allTime: number;
  };
  ticketsSummary?: {
    openTickets: number;
    inProgressTickets: number;
    resolvedToday: number;
  };
  salesMetrics?: {
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
  };
}

export function generateOperationsStats(): OperationsDashboardStats {
  return {
    totalSubscriptions: randomInt(200, 500),
    activeSubscriptions: randomInt(150, 400),
    pendingSubscriptions: randomInt(10, 30),
    cancelledThisMonth: randomInt(5, 20),
    totalRevenue: randomInt(500000, 1500000),
    monthlyRevenue: randomInt(50000, 150000),
    walletBalance: randomInt(100000, 500000),
    pendingPayouts: randomInt(20000, 80000),
    listings: {
      active: randomInt(500, 1500),
      pending: randomInt(50, 150),
      rejected: randomInt(20, 80),
    },
    kycOverview: {
      pendingKyc: randomInt(30, 100),
      approvedToday: randomInt(5, 25),
    },
    bookings: {
      today: randomInt(10, 50),
      thisWeek: randomInt(80, 250),
      thisMonth: randomInt(300, 800),
      allTime: randomInt(5000, 15000),
    },
    ticketsSummary: {
      openTickets: randomInt(20, 60),
      inProgressTickets: randomInt(10, 30),
      resolvedToday: randomInt(15, 40),
    },
    salesMetrics: {
      newAgentsThisWeek: randomInt(5, 20),
      newAgentsThisMonth: randomInt(20, 80),
      newPropertiesOnboarded: randomInt(30, 100),
      bigAccountsClosed: {
        hotels: randomInt(2, 10),
        servicedApartments: randomInt(3, 15),
        estates: randomInt(1, 8),
      },
      subscriptionSales: [
        { month: 'Jan', amount: randomInt(50000, 150000) },
        { month: 'Feb', amount: randomInt(50000, 150000) },
        { month: 'Mar', amount: randomInt(50000, 150000) },
        { month: 'Apr', amount: randomInt(50000, 150000) },
        { month: 'May', amount: randomInt(50000, 150000) },
        { month: 'Jun', amount: randomInt(50000, 150000) },
      ],
      revenueFromCommissions: randomInt(200000, 800000),
      dealsInPipeline: randomInt(15, 50),
      agentActivityScore: randomInt(70, 95),
      agentEngagementRate: randomInt(65, 90),
    },
  };
}

export function generateMockSubscriptions(count: number = 10): MockSubscription[] {
  const partners = [
    'Grand Hotel Lagos',
    'Sunset Apartments',
    'Beach Resort Abuja',
    'City Center Suites',
    'Luxury Villas',
    'Comfort Inn',
    'Royal Plaza Hotel',
    'Ocean View Properties',
    'Downtown Residences',
    'Paradise Stays',
  ];

  return Array.from({ length: count }, () => ({
    id: `SUB-${String(randomInt(10000, 99999))}`,
    partner: randomPick(partners),
    plan: randomPick(['Basic', 'Premium', 'Enterprise']),
    status: randomPick(['active', 'pending', 'cancelled', 'expired']),
    mrr: randomInt(5000, 50000),
    next_billing: randomDate(-30), // Future date
    created_at: randomDate(365),
  }));
}

export function generateMockWalletTransactions(count: number = 10): MockWalletTransaction[] {
  const users = [
    'Hotel Manager A',
    'Agent B',
    'Property Owner C',
    'Partner D',
    'User E',
    'Client F',
    'Customer G',
    'Business H',
  ];

  return Array.from({ length: count }, () => ({
    id: `WTX-${String(randomInt(10000, 99999))}`,
    user: randomPick(users),
    type: randomPick(['deposit', 'withdrawal', 'refund', 'commission']),
    amount: randomInt(5000, 500000),
    status: randomPick(['completed', 'pending', 'failed']),
    created_at: randomDate(30),
  }));
}

// ==========================================
// SALES & PARTNERSHIPS DASHBOARD MOCK DATA
// ==========================================

export interface MockOnboardingLead {
  id: string;
  name: string;
  type: 'hotel' | 'shortlet' | 'agent';
  status: 'new' | 'contacted' | 'negotiating' | 'onboarding' | 'completed';
  properties: number;
  contact: string;
  created_at: string;
}

export interface MockPartner {
  id: string;
  name: string;
  type: 'hotel' | 'shortlet' | 'realtor';
  properties: number;
  bookings: number;
  revenue: number;
  kyc_status: 'pending' | 'verified' | 'rejected';
  joined_at: string;
  last_active: string;
}

export interface SalesDashboardStats {
  totalPartners: number;
  newThisMonth: number;
  onboardingInProgress: number;
  totalProperties: number;
  kycPending: number;
  kycVerified: number;
  avgPropertiesPerPartner: number;
  conversionRate: number;
}

export function generateSalesStats(): SalesDashboardStats {
  return {
    totalPartners: randomInt(200, 600),
    newThisMonth: randomInt(15, 50),
    onboardingInProgress: randomInt(10, 30),
    totalProperties: randomInt(1000, 3000),
    kycPending: randomInt(20, 60),
    kycVerified: randomInt(150, 500),
    avgPropertiesPerPartner: randomInt(3, 8),
    conversionRate: randomInt(60, 85),
  };
}

export function generateMockOnboardingLeads(count: number = 10): MockOnboardingLead[] {
  const names = [
    'Hilton Hotels',
    'Prime Properties Ltd',
    'Skyline Apartments',
    'Coastal Resorts',
    'Urban Living Spaces',
    'Elite Realtors',
    'Prestige Hotels Group',
    'Smart Homes Agency',
    'Luxury Estates',
    'Metro Properties',
  ];

  return Array.from({ length: count }).map((unused, index) => {
    void unused;
    return {
      id: `LEAD-${String(randomInt(1000, 9999))}`,
      name: randomPick(names),
      type: randomPick(['hotel', 'shortlet', 'agent']),
      status: randomPick(['new', 'contacted', 'negotiating', 'onboarding', 'completed']),
      properties: randomInt(1, 25),
      contact: `contact${index}@example.com`,
      created_at: randomDate(90),
    };
  });
}

export function generateMockPartners(count: number = 10): MockPartner[] {
  const names = [
    'Grand Plaza Hotel',
    'Sunset Villas',
    'Cityscape Apartments',
    'Beach House Rentals',
    'Premium Stays',
    'Royal Residences',
    'Modern Living Spaces',
    'Comfort Suites',
    'Elite Properties',
    'Paradise Hotels',
  ];

  return Array.from({ length: count }, () => ({
    id: `PTR-${String(randomInt(1000, 9999))}`,
    name: randomPick(names),
    type: randomPick(['hotel', 'shortlet', 'realtor']),
    properties: randomInt(1, 20),
    bookings: randomInt(10, 200),
    revenue: randomInt(50000, 500000),
    kyc_status: randomPick(['pending', 'verified', 'rejected']),
    joined_at: randomDate(365),
    last_active: randomDate(30),
  }));
}

// ==========================================
// MARKETING & GROWTH DASHBOARD MOCK DATA
// ==========================================

export interface MockAnalytics {
  date: string;
  visitors: number;
  conversions: number;
  revenue: number;
}

export interface MockListingPerformance {
  id: string;
  property: string;
  views: number;
  inquiries: number;
  bookings: number;
  conversionRate: number;
  revenue: number;
}

export interface MarketingDashboardStats {
  totalVisitors: number;
  totalPageViews: number;
  conversionRate: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPerformingListing: string;
  totalLeads: number;
  qualifiedLeads: number;
}

export function generateMarketingStats(): MarketingDashboardStats {
  return {
    totalVisitors: randomInt(50000, 150000),
    totalPageViews: randomInt(200000, 500000),
    conversionRate: randomInt(2, 8),
    avgSessionDuration: `${randomInt(2, 6)} min`,
    bounceRate: randomInt(30, 60),
    topPerformingListing: 'Luxury Villa in VI',
    totalLeads: randomInt(500, 1500),
    qualifiedLeads: randomInt(200, 800),
  };
}

export function generateMockAnalytics(days: number = 30): MockAnalytics[] {
  return Array.from({ length: days }).map((unused, index) => {
    void unused;
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    return {
      date: date.toISOString().split('T')[0],
      visitors: randomInt(1000, 5000),
      conversions: randomInt(20, 100),
      revenue: randomInt(50000, 200000),
    };
  });
}

export function generateMockListingPerformance(count: number = 10): MockListingPerformance[] {
  const properties = [
    'Luxury Villa - Victoria Island',
    'Modern Apartment - Lekki',
    '3BR Shortlet - Ikoyi',
    'Beach House - Ajah',
    'Penthouse Suite - VI',
    'Family Home - Ikeja',
    'Studio Apartment - Yaba',
    'Duplex - Banana Island',
    'Serviced Apartment - Lekki Phase 1',
    'Executive Suite - GRA',
  ];

  return Array.from({ length: count }, () => {
    const views = randomInt(100, 1000);
    const inquiries = randomInt(10, Math.floor(views * 0.3));
    const bookings = randomInt(1, Math.floor(inquiries * 0.5));
    return {
      id: `LST-${String(randomInt(1000, 9999))}`,
      property: randomPick(properties),
      views,
      inquiries,
      bookings,
      conversionRate: Number(((bookings / views) * 100).toFixed(2)),
      revenue: bookings * randomInt(50000, 200000),
    };
  });
}

// ==========================================
// CHART DATA GENERATORS
// ==========================================

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export function generateRevenueChartData(): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    name: month,
    value: randomInt(80000, 150000),
    revenue: randomInt(80000, 150000),
  }));
}

export function generateTicketTrendsData(): ChartDataPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    name: day,
    pending: randomInt(5, 20),
    resolved: randomInt(10, 30),
    value: randomInt(15, 50),
  }));
}

export function generateConversionFunnelData(): ChartDataPoint[] {
  return [
    { name: 'Visitors', value: 10000 },
    { name: 'Property Views', value: 6000 },
    { name: 'Inquiries', value: 1200 },
    { name: 'Bookings', value: 400 },
  ];
}
