'use client';

import { useEffect } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useFounderBookingsStore } from '@/stores/founder-bookings-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function FounderBookingsPage() {
  return (
    <RoleGuard feature="founder-bookings" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bookings Analytics</h1>
          <p className="text-muted-foreground">Booking trends and performance metrics</p>
        </div>
        <FounderBookingsClient />
      </div>
    </RoleGuard>
  );
}

function FounderBookingsClient() {
  const { dashboard, isLoading, fetchDashboard, refreshDashboard } = useFounderBookingsStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboard) {
    return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Bookings" value={dashboard.total_bookings.toString()} icon={Calendar} />
        <StatCard title="Confirmed Bookings" value={dashboard.confirmed_bookings.toString()} icon={CheckCircle} trend="up" iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" />
        <StatCard title="Pending Bookings" value={dashboard.pending_bookings.toString()} icon={Clock} iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300" />
        <StatCard title="Cancelled Bookings" value={dashboard.cancelled_bookings.toString()} icon={XCircle} iconClassName="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Total Booking Value" value={`₦${dashboard.total_booking_value.toLocaleString()}`} icon={DollarSign} iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" />
        <StatCard title="Avg Booking Value" value={`₦${dashboard.avg_booking_value.toLocaleString()}`} icon={TrendingUp} iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Bookings and value over time</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dashboard.booking_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => name === 'value' ? `₦${Number(value).toLocaleString()}` : value} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#0EA5E9" name="Bookings" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" name="Value (₦)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
