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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="User Growth Rate" value={`${dashboard.user_growth_rate}%`} icon={Percent} trend={dashboard.user_growth_rate > 0 ? 'up' : 'down'} iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" />
        <StatCard title="Revenue Growth Rate" value={`${dashboard.revenue_growth_rate}%`} icon={DollarSign} trend={dashboard.revenue_growth_rate > 0 ? 'up' : 'down'} iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" />
        <StatCard title="Booking Growth Rate" value={`${dashboard.booking_growth_rate}%`} icon={Calendar} trend={dashboard.booking_growth_rate > 0 ? 'up' : 'down'} iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="New Users This Month" value={dashboard.new_users_this_month.toString()} icon={Users} trend="up" />
        <StatCard title="Active Users" value={dashboard.active_users.toString()} icon={Activity} />
        <StatCard title="User Retention Rate" value={`${dashboard.user_retention_rate}%`} icon={TrendingUp} trend="up" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Growth Metrics Comparison</CardTitle>
            <CardDescription>Current vs previous period</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Previous</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.growth_metrics.map((metric) => (
                <TableRow key={metric.metric}>
                  <TableCell className="font-medium">{metric.metric}</TableCell>
                  <TableCell className="text-right">{metric.current.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{metric.previous.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-semibold ${metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.growth >= 0 ? '+' : ''}{metric.growth}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
