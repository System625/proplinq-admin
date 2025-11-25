'use client';

import { useEffect } from 'react';
import { Eye, MousePointerClick, Users, Target } from 'lucide-react';
import { useMarketingDashboardStore } from '@/stores/marketing-dashboard-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { EscalateIssueDialog } from '@/components/shared/escalate-issue-dialog';

export default function MarketingDashboardPage() {
  return (
    <RoleGuard feature="marketing-dashboard" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Marketing & Growth Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track performance, analytics, and campaign metrics
          </p>
        </div>

        <MarketingDashboardClient />
      </div>
    </RoleGuard>
  );
}

function MarketingDashboardClient() {
  const {
    stats,
    analyticsData,
    listingPerformance,
    funnelData,
    isLoading,
    fetchDashboardData,
    refreshListings,
  } = useMarketingDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !stats) {
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

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={stats.totalVisitors.toLocaleString()}
          icon={Users}
          description="All time visitors"
        />
        <StatCard
          title="Total Page Views"
          value={stats.totalPageViews.toLocaleString()}
          icon={Eye}
          description="Pages viewed"
          trend="up"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={Target}
          description="Visitor to booking"
        />
        <StatCard
          title="Avg Session"
          value={stats.avgSessionDuration}
          icon={MousePointerClick}
          description="Session duration"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.bounceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Single page visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats.topPerformingListing}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Most viewed property
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Generated leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.qualifiedLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-intent leads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Conversion Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic & Conversion Trends</CardTitle>
          <CardDescription>Daily visitor and conversion metrics (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="visitors"
                stroke="#0EA5E9"
                name="Visitors"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversions"
                stroke="#10B981"
                name="Conversions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from visit to booking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Bar dataKey="value" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Listing Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listing Performance</CardTitle>
            <CardDescription>Top performing properties by views and bookings</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshListings}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Inquiries</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listingPerformance.slice(0, 10).map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-mono text-sm">{listing.id}</TableCell>
                  <TableCell className="max-w-xs truncate font-medium">
                    {listing.property}
                  </TableCell>
                  <TableCell>{listing.views.toLocaleString()}</TableCell>
                  <TableCell>{listing.inquiries.toLocaleString()}</TableCell>
                  <TableCell>{listing.bookings.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={listing.conversionRate >= 1 ? 'default' : 'secondary'}
                    >
                      {listing.conversionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₦{listing.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <EscalateIssueDialog
                      issueId={listing.id}
                      issueType="general"
                      fromDepartment="marketing"
                    />
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
