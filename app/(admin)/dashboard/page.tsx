'use client';

import { useEffect, Suspense } from 'react';
import { Users, Calendar, DollarSign, FileCheck } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart, UserGrowthChart } from '@/components/dashboard/charts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardContent() {
  const { stats, isLoading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <RevenueChart isLoading={true} />
          <UserGrowthChart isLoading={true} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6">
          <CardContent className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchStats}
              className="text-proplinq-blue hover:underline"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Pending KYC"
          value={stats.pendingKyc.toLocaleString()}
          icon={<FileCheck className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={stats.monthlyRevenue} />
        <UserGrowthChart data={stats.userGrowth} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Recent activity feed would be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your PropLinq admin dashboard
        </p>
      </div>
      
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}