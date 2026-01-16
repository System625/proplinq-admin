'use client';

import { useEffect } from 'react';
import {
  Users,
  Home,
  Building,
  FileCheck,
  UserPlus,
  UserCog,
  UserSquare,
  FileX,
  FileClock,
  Landmark,
  BadgePercent,
  CircleDollarSign,
  Briefcase,
} from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { StatCard } from '@/components/dashboard/stat-card';
import {
  UserRolesChart,
  PropertyStatusChart,
  KycStatusChart,
} from '@/components/dashboard/charts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/api';
import { ServerErrorState, NetworkErrorState, GenericErrorState } from '@/components/shared/error-state';

export function DashboardClient({
  initialStats,
}: {
  initialStats?: DashboardStats;
}) {
  const { stats, isLoading, error, fetchStats, setStats } = useDashboardStore();

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
    } else {
      fetchStats();
    }
  }, [initialStats, fetchStats, setStats]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-8">
        {/* User Section Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Properties Section Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* KYC Section Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* RNPL Section Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    // Check if it's a server error (500)
    if (error.includes('Server error') || error.includes('500')) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <ServerErrorState onRetry={fetchStats} />
        </div>
      );
    }

    // Check if it's a network error
    if (error.includes('Network') || error.includes('connect')) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <NetworkErrorState onRetry={fetchStats} />
        </div>
      );
    }

    // Generic error fallback
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <GenericErrorState
          title="Failed to Load Dashboard"
          message={error}
          onRetry={fetchStats}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6">
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              No dashboard data available
            </p>
            <button
              onClick={fetchStats}
              className="text-proplinq-blue hover:underline"
            >
              Load dashboard data
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Users Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Users"
              value={(stats.users.total || 0).toLocaleString()}
              icon={Users}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Agents"
              value={(stats.users.by_role.agent || 0).toLocaleString()}
              icon={Briefcase}
              iconClassName="h-4 w-4"
            />            
            <StatCard
              title="Admins"
              value={(stats.users.by_role.admin || 0).toLocaleString()}
              icon={UserCog}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="New This Month"
              value={(stats.users.new_this_month || 0).toLocaleString()}
              icon={UserPlus}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Home Seekers"
              value={(stats.users.by_role.home_seeker || 0).toLocaleString()}
              icon={UserSquare}
              iconClassName="h-4 w-4"
            />
          </div>
          <div>
            <UserRolesChart data={stats.users.by_role} />
          </div>
        </CardContent>
      </Card>

      {/* Properties Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            Property Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              title="Total Properties"
              value={(stats.properties.total || 0).toLocaleString()}
              icon={Home}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Available"
              value={(stats.properties.available || 0).toLocaleString()}
              icon={Building}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Rented"
              value={(stats.properties.rented || 0).toLocaleString()}
              icon={BadgePercent}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Sold"
              value={(stats.properties.sold || 0).toLocaleString()}
              icon={CircleDollarSign}
              iconClassName="h-4 w-4"
            />
          </div>
          <div>
            <PropertyStatusChart data={stats.properties} />
          </div>
        </CardContent>
      </Card>

      {/* KYC Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-6 w-6" />
            KYC Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              title="Pending"
              value={(stats.kyc.pending || 0).toLocaleString()}
              icon={FileClock}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Approved"
              value={(stats.kyc.approved || 0).toLocaleString()}
              icon={FileCheck}
              iconClassName="h-4 w-4"
            />
            <StatCard
              title="Rejected"
              value={(stats.kyc.rejected || 0).toLocaleString()}
              icon={FileX}
              iconClassName="h-4 w-4"
            />
          </div>
          <div>
            <KycStatusChart data={stats.kyc} />
          </div>
        </CardContent>
      </Card>

      {/* RNPL Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-6 w-6" />
            RNPL Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Active Loans"
            value={(stats.rnpl.active_loans || 0).toLocaleString()}
            icon={Landmark}
            iconClassName="h-4 w-4"
          />
          <StatCard
            title="Pending Applications"
            value={(stats.rnpl.pending_applications || 0).toLocaleString()}
            icon={FileClock}
            iconClassName="h-4 w-4"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(stats.rnpl.total_value || 0)}
            icon={CircleDollarSign}
            iconClassName="h-4 w-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
