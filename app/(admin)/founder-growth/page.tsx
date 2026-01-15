'use client';

import { useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Activity, Percent } from 'lucide-react';
import { useFounderGrowthStore } from '@/stores/founder-growth-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FounderGrowthPage() {
  return (
    <RoleGuard feature="founder-growth" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Growth Metrics</h1>
          <p className="text-muted-foreground">User, revenue, and booking growth analytics</p>
        </div>
        <FounderGrowthClient />
      </div>
    </RoleGuard>
  );
}

function FounderGrowthClient() {
  const { dashboard, isLoading, fetchDashboard, refreshDashboard } = useFounderGrowthStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboard) {
    return <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      {/* New Signups */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="New Signups Today"
          value={dashboard.new_signups.today.toString()}
          icon={Users}
          trend="up"
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="New Signups This Week"
          value={dashboard.new_signups.this_week.toString()}
          icon={Calendar}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
        <StatCard
          title="New Signups This Month"
          value={dashboard.new_signups.this_month.toString()}
          icon={TrendingUp}
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>

      {/* User Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Active Users"
          value={dashboard.user_activity.active.toString()}
          icon={Activity}
          iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
        />
        <StatCard
          title="Inactive Users"
          value={dashboard.user_activity.inactive.toString()}
          icon={Users}
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
        />
      </div>

      {/* Verified Users */}
      <Card>
        <CardHeader>
          <CardTitle>Verified Users</CardTitle>
          <CardDescription>Breakdown of verified users by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <span className="font-medium">Agents</span>
              <span className="text-2xl font-bold">{dashboard.verified_users.agents}</span>
            </div>
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <span className="font-medium">Hotels</span>
              <span className="text-2xl font-bold">{dashboard.verified_users.hotels}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Pipeline</CardTitle>
          <CardDescription>Current onboarding status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending</span>
              <span className="text-lg font-semibold">{dashboard.onboarding_pipeline.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completed</span>
              <span className="text-lg font-semibold">{dashboard.onboarding_pipeline.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-lg font-semibold">{dashboard.onboarding_pipeline.completion_rate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>KYC Breakdown</CardTitle>
            <CardDescription>KYC verification status</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Verified</TableCell>
                <TableCell className="text-right text-green-600 font-semibold">{dashboard.kyc_breakdown.verified}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Flagged</TableCell>
                <TableCell className="text-right text-amber-600 font-semibold">{dashboard.kyc_breakdown.flagged}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Failed</TableCell>
                <TableCell className="text-right text-red-600 font-semibold">{dashboard.kyc_breakdown.failed}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
