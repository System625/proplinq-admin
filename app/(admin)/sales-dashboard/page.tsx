'use client';

import { useEffect } from 'react';
import { UserPlus, Building, Clock, Users } from 'lucide-react';
import { useSalesDashboardStore } from '@/stores/sales-dashboard-store';
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
import { format } from 'date-fns';

export default function SalesDashboardPage() {
  return (
    <RoleGuard feature="sales-dashboard" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sales & Partnerships Dashboard
          </h1>
          <p className="text-muted-foreground">
            Onboard new partners and track engagement
          </p>
        </div>

        <SalesDashboardClient />
      </div>
    </RoleGuard>
  );
}

function SalesDashboardClient() {
  const { stats, leads, partners, isLoading, fetchDashboardData, refreshLeads } =
    useSalesDashboardStore();

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
          title="Total Partners"
          value={stats.totalPartners.toString()}
          icon={Users}
          description="All partners"
        />
        <StatCard
          title="New This Month"
          value={stats.newThisMonth.toString()}
          icon={UserPlus}
          description="Recently onboarded"
          trend="up"
        />
        <StatCard
          title="Onboarding in Progress"
          value={stats.onboardingInProgress.toString()}
          icon={Clock}
          description="Being processed"
        />
        <StatCard
          title="Total Properties"
          value={stats.totalProperties.toString()}
          icon={Building}
          description="Across all partners"
        />
      </div>

      {/* KYC & Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">KYC Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.kycPending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">KYC Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.kycVerified}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgPropertiesPerPartner}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per partner
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lead to partner
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Pipeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Onboarding Pipeline</CardTitle>
            <CardDescription>Current onboarding leads and their status</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshLeads}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-mono text-sm">{lead.id}</TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {lead.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.properties}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.status === 'new'
                          ? 'secondary'
                          : lead.status === 'completed'
                          ? 'default'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.contact}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(lead.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Partner Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Engagement</CardTitle>
          <CardDescription>Active partners and their activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.slice(0, 10).map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-mono text-sm">{partner.id}</TableCell>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {partner.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{partner.properties}</TableCell>
                  <TableCell>{partner.bookings}</TableCell>
                  <TableCell className="font-medium">
                    ₦{partner.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.kyc_status === 'verified'
                          ? 'default'
                          : partner.kyc_status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="capitalize"
                    >
                      {partner.kyc_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(partner.last_active), 'MMM d, yyyy')}
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
