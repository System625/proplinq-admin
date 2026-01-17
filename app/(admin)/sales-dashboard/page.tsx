'use client';

import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { EscalateIssueDialog } from '@/components/shared/escalate-issue-dialog';

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
  const { dashboard, onboardingRequests, partners, isLoading, fetchDashboardData, refreshDashboard } =
    useSalesDashboardStore();

  const [onboardingPage, setOnboardingPage] = useState(1);
  const [partnersPage, setPartnersPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const renderPagination = (currentPage: number, totalItems: number, onPageChange: (page: number) => void) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) return null;

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const getPaginatedData = <T,>(data: T[], page: number): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

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

  if (!dashboard) return null;

  // Transform API data to match UI expectations
  const totalPartners = (dashboard.pipeline?.hotels ?? 0) + (dashboard.pipeline?.shortlets ?? 0) + (dashboard.pipeline?.agents ?? 0);
  const totalOnboarding = (dashboard.onboarding?.pending ?? 0) + (dashboard.onboarding?.in_progress ?? 0);
  const totalCompleted = dashboard.onboarding?.completed_this_month ?? 0;

  const stats = {
    totalPartners: totalPartners,
    newThisMonth: totalCompleted,
    onboardingInProgress: totalOnboarding,
    totalProperties: partners.reduce((sum, p) => sum + (p.properties_count ?? 0), 0),
    kycPending: partners.filter(p => p.user?.kyc_status === 'pending').length,
    kycVerified: partners.filter(p => p.user?.kyc_status === 'approved').length,
    avgPropertiesPerPartner: totalPartners > 0
      ? Math.round(partners.reduce((sum, p) => sum + (p.properties_count ?? 0), 0) / totalPartners)
      : 0,
    conversionRate: (totalOnboarding + totalCompleted) > 0
      ? Math.round((totalCompleted / (totalOnboarding + totalCompleted)) * 100)
      : 0,
  };

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

      {/* Partner Management Tabs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Partner Management</CardTitle>
            <CardDescription>Manage onboarding pipeline and partner engagement</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="onboarding" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="onboarding">
                <Clock className="h-4 w-4 mr-2" />
                Onboarding Pipeline
              </TabsTrigger>
              <TabsTrigger value="partners">
                <Users className="h-4 w-4 mr-2" />
                Partner Engagement
              </TabsTrigger>
            </TabsList>

            {/* Onboarding Pipeline Tab */}
            <TabsContent value="onboarding" className="mt-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">Current onboarding leads and their status</p>
              </div>
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
                  {getPaginatedData(onboardingRequests, onboardingPage).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No onboarding requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData(onboardingRequests, onboardingPage).map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-sm">{request.id}</TableCell>
                        <TableCell className="font-medium">{request.business_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {request.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.properties_count || 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'pending'
                                ? 'secondary'
                                : request.status === 'completed'
                                ? 'default'
                                : 'outline'
                            }
                            className="capitalize"
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {request.email}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <EscalateIssueDialog
                            issueId={request.id.toString()}
                            issueType="lead"
                            fromDepartment="sales"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {renderPagination(onboardingPage, onboardingRequests.length, setOnboardingPage)}
            </TabsContent>

            {/* Partner Engagement Tab */}
            <TabsContent value="partners" className="mt-4">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">Active partners and their activity</p>
              </div>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPaginatedData(partners, partnersPage).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        No partners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPaginatedData(partners, partnersPage).map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-mono text-sm">{partner.id}</TableCell>
                        <TableCell className="font-medium">{partner.business_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {partner.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{partner.properties_count}</TableCell>
                        <TableCell>{partner.total_bookings}</TableCell>
                        <TableCell className="font-medium">
                          ₦{partner.total_revenue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              partner.user?.kyc_status === 'approved'
                                ? 'default'
                                : partner.user?.kyc_status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                            className="capitalize"
                          >
                            {partner.user?.kyc_status || 'unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {partner.last_active_at
                            ? format(new Date(partner.last_active_at), 'MMM d, yyyy')
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <EscalateIssueDialog
                            issueId={partner.id.toString()}
                            issueType="general"
                            fromDepartment="sales"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {renderPagination(partnersPage, partners.length, setPartnersPage)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
