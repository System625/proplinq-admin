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
    listingsData,
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

  if (!stats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>No dashboard data available. Please check your connection and try refreshing.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visitors"
          value={(stats.totalVisitors ?? 0).toLocaleString()}
          icon={Users}
          description="All time visitors"
        />
        <StatCard
          title="Total Page Views"
          value={(stats.totalPageViews ?? 0).toLocaleString()}
          icon={Eye}
          description="Pages viewed"
          trend="up"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate ?? 0}%`}
          icon={Target}
          description="Visitor to booking"
        />
        <StatCard
          title="Avg Session"
          value={stats.avgSessionDuration ?? '0m 0s'}
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
            <div className="text-3xl font-bold">{stats.bounceRate ?? 0}%</div>
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
            <div className="text-lg font-bold truncate">{stats.topPerformingListing ?? 'N/A'}</div>
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
            <div className="text-3xl font-bold">{(stats.totalLeads ?? 0).toLocaleString()}</div>
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
            <div className="text-3xl font-bold">{(stats.qualifiedLeads ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-intent leads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Trends</CardTitle>
          <CardDescription>Daily visitor metrics (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData && analyticsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#0EA5E9"
                  name="Unique Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No traffic data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from visit to booking</CardDescription>
        </CardHeader>
        <CardContent>
          {funnelData && funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="value" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No funnel data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Listings Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listings Overview</CardTitle>
            <CardDescription>Property listing performance metrics</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshListings}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {listingsData ? (
            <>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-bold">{(listingsData.total_listings ?? 0).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{(listingsData.active_listings ?? 0).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">New This Month</p>
                  <p className="text-2xl font-bold">{(listingsData.new_listings ?? 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Property type breakdown */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">By Property Type</p>
                <div className="grid grid-cols-3 gap-4">
                  <Badge variant="outline">Hotels: {listingsData.by_type?.hotel ?? 0}</Badge>
                  <Badge variant="outline">Shortlets: {listingsData.by_type?.shortlet ?? 0}</Badge>
                  <Badge variant="outline">Apartments: {listingsData.by_type?.apartment ?? 0}</Badge>
                </div>
              </div>

              {/* Top locations */}
              {listingsData.by_location && listingsData.by_location.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Top Locations</p>
                  <div className="space-y-1">
                    {listingsData.by_location.slice(0, 5).map((loc) => (
                      <div key={loc.city} className="flex justify-between text-sm">
                        <span>{loc.city}</span>
                        <span className="font-medium">{loc.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No listing data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
