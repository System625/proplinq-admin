'use client';

import { useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Percent, Building2 } from 'lucide-react';
import { useFounderRevenueStore } from '@/stores/founder-revenue-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ErrorCard } from '@/components/shared/error-card';
import { EmptyState } from '@/components/shared/empty-state';

const COLORS = ['#0EA5E9', '#10b981', '#f59e0b', '#8b5cf6'];

export default function FounderRevenuePage() {
  return (
    <RoleGuard feature="founder-revenue" requiredLevel="view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Revenue Analytics
            </h1>
            <p className="text-muted-foreground">
              Comprehensive revenue insights and trends
            </p>
          </div>
        </div>

        <FounderRevenueClient />
      </div>
    </RoleGuard>
  );
}

function FounderRevenueClient() {
  const { dashboard, isLoading, error, fetchDashboard, refreshDashboard } = useFounderRevenueStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Loading state
  if (isLoading && !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorCard
        title="Failed to Load Revenue Data"
        message={error}
        onRetry={fetchDashboard}
        showHomeButton
      />
    );
  }

  // No data state
  if (!dashboard) {
    return (
      <EmptyState
        title="No Revenue Data"
        description="Unable to load revenue analytics. Please try again."
        onRetry={fetchDashboard}
      />
    );
  }

  // Safe data access with optional chaining and fallbacks
  // Convert subscriptions string to number for display
  const subscriptionsValue = parseFloat(dashboard?.by_source?.subscriptions ?? '0') || 0;

  const revenueBySourceData = [
    { name: 'Subscriptions', value: subscriptionsValue, color: COLORS[0] },
    { name: 'Bookings', value: dashboard?.by_source?.bookings ?? 0, color: COLORS[1] },
    { name: 'Commissions', value: dashboard?.by_source?.commissions ?? 0, color: COLORS[2] },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={`₦${(dashboard?.total ?? 0).toLocaleString()}`}
          icon={DollarSign}
          description="Total revenue"
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
        <StatCard
          title="Subscriptions"
          value={`₦${subscriptionsValue.toLocaleString()}`}
          icon={CreditCard}
          description="From subscriptions"
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="Commissions"
          value={`₦${(dashboard?.by_source?.commissions ?? 0).toLocaleString()}`}
          icon={TrendingUp}
          description="From commissions"
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>

      {/* Revenue by Source */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Revenue breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBySourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {revenueBySourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{source.name}</span>
                    <span className="text-xs text-muted-foreground">₦{source.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Comparison by revenue stream</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueBySourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Bar dataKey="value" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dashboard?.trends ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
              <Area type="monotone" dataKey="amount" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Source Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Source Breakdown</CardTitle>
          <CardDescription>Detailed breakdown of revenue sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueBySourceData.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="font-medium">{source.name}</span>
                </div>
                <span className="text-lg font-semibold">₦{source.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
