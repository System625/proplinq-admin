import { z } from 'zod';
import type {
  RevenueDashboard,
  DashboardStats,
  GrowthDashboard,
  SubscriptionsDashboard,
  WalletsDashboard,
  PropertiesDashboard,
  BookingsDashboard,
  FounderSupportDashboard
} from '@/types/api';

/**
 * Zod schema for DashboardStats
 * Uses .default() to provide safe fallback values
 */
const DashboardStatsSchema = z.object({
  users: z.object({
    total: z.number().default(0),
    new_this_month: z.number().default(0),
    by_role: z.object({
      admin: z.number().default(0),
      agent: z.number().default(0),
      home_seeker: z.number().default(0),
    }).default({ admin: 0, agent: 0, home_seeker: 0 }),
  }).default({ total: 0, new_this_month: 0, by_role: { admin: 0, agent: 0, home_seeker: 0 } }),
  properties: z.object({
    total: z.number().default(0),
    available: z.number().default(0),
    rented: z.number().default(0),
    sold: z.number().default(0),
  }).default({ total: 0, available: 0, rented: 0, sold: 0 }),
  kyc: z.object({
    pending: z.number().default(0),
    approved: z.number().default(0),
    rejected: z.number().default(0),
  }).default({ pending: 0, approved: 0, rejected: 0 }),
  rnpl: z.object({
    active_loans: z.number().default(0),
    pending_applications: z.number().default(0),
    total_value: z.number().default(0),
  }).default({ active_loans: 0, pending_applications: 0, total_value: 0 }),
});

/**
 * Zod schema for RevenueDashboard
 * Uses .default() to provide safe fallback values
 */
const RevenueDashboardSchema = z.object({
  total: z.number().default(0),
  by_source: z.object({
    subscriptions: z.string().default('0'),
    commissions: z.number().default(0),
    bookings: z.number().default(0),
  }).default({ subscriptions: '0', commissions: 0, bookings: 0 }),
  trends: z.array(z.object({
    date: z.string().default(''),
    amount: z.number().default(0),
  })).default([]),
});

/**
 * Zod schema for GrowthDashboard
 * Uses .default() to provide safe fallback values
 */
const GrowthDashboardSchema = z.object({
  verified_users: z.object({
    agents: z.number().default(0),
    hotels: z.number().default(0),
  }).default({ agents: 0, hotels: 0 }),
  new_signups: z.object({
    today: z.number().default(0),
    this_week: z.number().default(0),
    this_month: z.number().default(0),
  }).default({ today: 0, this_week: 0, this_month: 0 }),
  onboarding_pipeline: z.object({
    pending: z.number().default(0),
    completed: z.number().default(0),
    completion_rate: z.number().default(0),
  }).default({ pending: 0, completed: 0, completion_rate: 0 }),
  kyc_breakdown: z.object({
    verified: z.number().default(0),
    flagged: z.number().default(0),
    failed: z.number().default(0),
  }).default({ verified: 0, flagged: 0, failed: 0 }),
  user_activity: z.object({
    active: z.number().default(0),
    inactive: z.number().default(0),
  }).default({ active: 0, inactive: 0 }),
});

/**
 * Validates DashboardStats data with runtime type checking
 * Returns safe defaults on validation failure
 */
export function validateDashboardStats(data: unknown): DashboardStats {
  const result = DashboardStatsSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 DashboardStats Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }

    return createEmptyDashboardStats();
  }

  return result.data as DashboardStats;
}

/**
 * Validates RevenueDashboard data with runtime type checking
 * Returns safe defaults on validation failure
 */
export function validateRevenueDashboard(data: unknown): RevenueDashboard {
  const result = RevenueDashboardSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 RevenueDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }

    return createEmptyRevenueDashboard();
  }

  return result.data as RevenueDashboard;
}

/**
 * Validates GrowthDashboard data with runtime type checking
 * Returns safe defaults on validation failure
 */
export function validateGrowthDashboard(data: unknown): GrowthDashboard {
  const result = GrowthDashboardSchema.safeParse(data);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 GrowthDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }

    return createEmptyGrowthDashboard();
  }

  return result.data as GrowthDashboard;
}

/**
 * Creates an empty DashboardStats object with safe defaults
 */
function createEmptyDashboardStats(): DashboardStats {
  return {
    users: {
      total: 0,
      new_this_month: 0,
      by_role: {
        admin: 0,
        agent: 0,
        home_seeker: 0,
      },
    },
    properties: {
      total: 0,
      available: 0,
      rented: 0,
      sold: 0,
    },
    kyc: {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    rnpl: {
      active_loans: 0,
      pending_applications: 0,
      total_value: 0,
    },
  };
}

/**
 * Creates an empty RevenueDashboard object with safe defaults
 */
function createEmptyRevenueDashboard(): RevenueDashboard {
  return {
    total: 0,
    by_source: {
      subscriptions: '0',
      commissions: 0,
      bookings: 0,
    },
    trends: [],
  };
}

/**
 * Creates an empty GrowthDashboard object with safe defaults
 */
function createEmptyGrowthDashboard(): GrowthDashboard {
  return {
    verified_users: {
      agents: 0,
      hotels: 0,
    },
    new_signups: {
      today: 0,
      this_week: 0,
      this_month: 0,
    },
    onboarding_pipeline: {
      pending: 0,
      completed: 0,
      completion_rate: 0,
    },
    kyc_breakdown: {
      verified: 0,
      flagged: 0,
      failed: 0,
    },
    user_activity: {
      active: 0,
      inactive: 0,
    },
  };
}

/**
 * Zod schema for SubscriptionsDashboard
 */
const SubscriptionsDashboardSchema = z.object({
  active: z.object({
    monthly: z.number().default(0),
    unlimited: z.number().default(0),
  }).default({ monthly: 0, unlimited: 0 }),
  revenue: z.number().default(0),
  growth_trends: z.object({
    this_month: z.number().default(0),
    last_month: z.number().default(0),
  }).default({ this_month: 0, last_month: 0 }),
});

/**
 * Zod schema for WalletsDashboard
 */
const WalletsDashboardSchema = z.object({
  total_balance: z.number().default(0),
  total_transactions: z.number().default(0),
  transaction_trends: z.object({
    today: z.number().default(0),
    this_week: z.number().default(0),
    this_month: z.number().default(0),
  }).default({ today: 0, this_week: 0, this_month: 0 }),
  top_users: z.array(z.any()).default([]),
});

/**
 * Zod schema for PropertiesDashboard
 */
const PropertiesDashboardSchema = z.object({
  total: z.number().default(0),
  new_this_month: z.number().default(0),
  most_viewed: z.array(z.any()).default([]),
  most_booked: z.array(z.any()).default([]),
});

/**
 * Zod schema for BookingsDashboard
 */
const BookingsDashboardSchema = z.object({
  trends: z.array(z.object({
    date: z.string().optional(),
    bookings: z.number().optional(),
    value: z.number().optional(),
  })).default([]),
  by_type: z.array(z.any()).default([]),
  conversion_rate: z.number().default(0),
});

/**
 * Zod schema for FounderSupportDashboard
 */
const FounderSupportDashboardSchema = z.object({
  open_tickets: z.number().default(0),
  open_chats: z.number().default(0),
  common_issues: z.array(z.any()).default([]),
  resolution_time: z.number().default(0),
  satisfaction_rating: z.number().nullable().default(null),
});

/**
 * Validates SubscriptionsDashboard data
 */
export function validateSubscriptionsDashboard(data: unknown): SubscriptionsDashboard {
  const result = SubscriptionsDashboardSchema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 SubscriptionsDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }
    return createEmptySubscriptionsDashboard();
  }
  return result.data as SubscriptionsDashboard;
}

/**
 * Validates WalletsDashboard data
 */
export function validateWalletsDashboard(data: unknown): WalletsDashboard {
  const result = WalletsDashboardSchema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 WalletsDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }
    return createEmptyWalletsDashboard();
  }
  return result.data as WalletsDashboard;
}

/**
 * Validates PropertiesDashboard data
 */
export function validatePropertiesDashboard(data: unknown): PropertiesDashboard {
  const result = PropertiesDashboardSchema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 PropertiesDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }
    return createEmptyPropertiesDashboard();
  }
  return result.data as PropertiesDashboard;
}

/**
 * Validates BookingsDashboard data
 */
export function validateBookingsDashboard(data: unknown): BookingsDashboard {
  const result = BookingsDashboardSchema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 BookingsDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }
    return createEmptyBookingsDashboard();
  }
  return result.data as BookingsDashboard;
}

/**
 * Validates FounderSupportDashboard data
 */
export function validateFounderSupportDashboard(data: unknown): FounderSupportDashboard {
  const result = FounderSupportDashboardSchema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 FounderSupportDashboard Validation Error');
      console.error('Validation errors:', result.error.format());
      console.error('Received data:', data);
      console.groupEnd();
    }
    return createEmptyFounderSupportDashboard();
  }
  return result.data as FounderSupportDashboard;
}

/**
 * Creates empty SubscriptionsDashboard
 */
function createEmptySubscriptionsDashboard(): SubscriptionsDashboard {
  return {
    active: { monthly: 0, unlimited: 0 },
    revenue: 0,
    growth_trends: { this_month: 0, last_month: 0 },
  };
}

/**
 * Creates empty WalletsDashboard
 */
function createEmptyWalletsDashboard(): WalletsDashboard {
  return {
    total_balance: 0,
    total_transactions: 0,
    transaction_trends: { today: 0, this_week: 0, this_month: 0 },
    top_users: [],
  };
}

/**
 * Creates empty PropertiesDashboard
 */
function createEmptyPropertiesDashboard(): PropertiesDashboard {
  return {
    total: 0,
    new_this_month: 0,
    most_viewed: [],
    most_booked: [],
  };
}

/**
 * Creates empty BookingsDashboard
 */
function createEmptyBookingsDashboard(): BookingsDashboard {
  return {
    trends: [],
    by_type: [],
    conversion_rate: 0,
  };
}

/**
 * Creates empty FounderSupportDashboard
 */
function createEmptyFounderSupportDashboard(): FounderSupportDashboard {
  return {
    open_tickets: 0,
    open_chats: 0,
    common_issues: [],
    resolution_time: 0,
    satisfaction_rating: null,
  };
}

/**
 * Export empty object creators for use in other files
 */
export {
  createEmptyDashboardStats,
  createEmptyRevenueDashboard,
  createEmptyGrowthDashboard,
  createEmptySubscriptionsDashboard,
  createEmptyWalletsDashboard,
  createEmptyPropertiesDashboard,
  createEmptyBookingsDashboard,
  createEmptyFounderSupportDashboard,
};
