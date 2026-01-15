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
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Conversion Rate"
          value={`${dashboard.conversion_rate}%`}
          icon={TrendingUp}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="Booking Trends"
          value={dashboard.trends.length.toString()}
          icon={Calendar}
          description="Data points available"
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>

      {dashboard.trends.length > 0 ? (
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
              <LineChart data={dashboard.trends}>
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
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No booking trends data available</p>
          </CardContent>
        </Card>
      )}

      {dashboard.by_type.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Type</CardTitle>
            <CardDescription>Breakdown of bookings by property type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.by_type.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{item.type || 'Unknown'}</span>
                  <span className="text-lg font-semibold">{item.count || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
