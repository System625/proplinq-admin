'use client';

import { useEffect, useState } from 'react';
import {
  Settings,
  CreditCard,
  Users,
  AlertTriangle,
  Home,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  Clock,
  Headphones,
  TrendingUp,
  Building2,
  DollarSign,
} from 'lucide-react';
import { useOperationsDashboardStore } from '@/stores/operations-dashboard-store';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { DashboardSearch } from '@/components/shared/dashboard-search';
import { EscalateIssueDialog } from '@/components/shared/escalate-issue-dialog';

export default function OperationsDashboardPage() {
  return (
    <RoleGuard feature="operations-dashboard" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Operations & Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor platform activity across all departments (Read-only)
          </p>
        </div>

        <OperationsDashboardClient />
      </div>
    </RoleGuard>
  );
}

function OperationsDashboardClient() {
  const {
    stats,
    revenueChart,
    isLoading,
    fetchDashboardData,
    refreshSubscriptions,
    subscriptionSearchQuery,
    transactionSearchQuery,
    setSubscriptionSearchQuery,
    setTransactionSearchQuery,
    getFilteredSubscriptions,
    getFilteredTransactions,
  } = useOperationsDashboardStore();

  const [showAgentsByWeek, setShowAgentsByWeek] = useState(true);

  const filteredSubscriptions = getFilteredSubscriptions();
  const filteredTransactions = getFilteredTransactions();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
      {/* Subscription Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Subscription Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Subscriptions"
            value={stats.totalSubscriptions.toString()}
            icon={Users}
            description="All subscriptions"
          />
          <StatCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions.toString()}
            icon={Settings}
            description="Currently active"
            trend="up"
          />
          <StatCard
            title="Pending"
            value={stats.pendingSubscriptions.toString()}
            icon={AlertTriangle}
            description="Awaiting activation"
            trend="neutral"
          />
          <StatCard
            title="Cancelled This Month"
            value={stats.cancelledThisMonth.toString()}
            icon={CreditCard}
            description="Recent cancellations"
            trend="down"
          />
        </div>
      </div>

      {/* Total Listings */}
      {stats.listings && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Total Listings</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Active Listings"
              value={stats.listings.active.toString()}
              icon={Home}
              description="Currently active"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            />
            <StatCard
              title="Pending Listings"
              value={stats.listings.pending.toString()}
              icon={Clock}
              description="Awaiting approval"
              iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            />
            <StatCard
              title="Rejected Listings"
              value={stats.listings.rejected.toString()}
              icon={XCircle}
              description="Rejected listings"
              iconClassName="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            />
          </div>
        </div>
      )}

      {/* KYC Overview */}
      {stats.kycOverview && (
        <div>
          <h2 className="text-lg font-semibold mb-4">KYC Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              title="Pending KYC"
              value={stats.kycOverview.pendingKyc.toString()}
              icon={AlertTriangle}
              description="Awaiting verification"
              iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            />
            <StatCard
              title="Approved Today"
              value={stats.kycOverview.approvedToday.toString()}
              icon={UserCheck}
              description="Verified today"
              trend="up"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            />
          </div>
        </div>
      )}

      {/* Total Bookings */}
      {stats.bookings && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Total Bookings</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Bookings Today"
              value={stats.bookings.today.toString()}
              icon={Calendar}
              description="Booked today"
              iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            />
            <StatCard
              title="Bookings This Week"
              value={stats.bookings.thisWeek.toString()}
              icon={Calendar}
              description="Booked this week"
              trend="up"
              iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
            />
            <StatCard
              title="Monthly Bookings"
              value={stats.bookings.thisMonth.toString()}
              icon={Calendar}
              description="Booked this month"
              iconClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            />
            <StatCard
              title="Total Bookings (All-Time)"
              value={stats.bookings.allTime.toLocaleString()}
              icon={Calendar}
              description="All bookings"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            />
          </div>
        </div>
      )}

      {/* Tickets Summary */}
      {stats.ticketsSummary && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Tickets Summary</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Open Tickets"
              value={stats.ticketsSummary.openTickets.toString()}
              icon={Headphones}
              description="Awaiting response"
              iconClassName="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            />
            <StatCard
              title="In-Progress"
              value={stats.ticketsSummary.inProgressTickets.toString()}
              icon={Clock}
              description="Being handled"
              iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            />
            <StatCard
              title="Resolved Today"
              value={stats.ticketsSummary.resolvedToday.toString()}
              icon={CheckCircle}
              description="Resolved today"
              trend="up"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            />
          </div>
        </div>
      )}

      {/* Sales Metrics */}
      {stats.salesMetrics && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Sales & Growth Metrics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  New Agents
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAgentsByWeek(!showAgentsByWeek)}
                    className="h-6 text-xs"
                  >
                    {showAgentsByWeek ? 'Week' : 'Month'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {showAgentsByWeek
                    ? stats.salesMetrics.newAgentsThisWeek
                    : stats.salesMetrics.newAgentsThisMonth}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {showAgentsByWeek ? 'This week' : 'This month'}
                </p>
              </CardContent>
            </Card>

            <StatCard
              title="New Properties"
              value={stats.salesMetrics.newPropertiesOnboarded.toString()}
              icon={Building2}
              description="Properties onboarded"
            />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Big Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.salesMetrics.bigAccountsClosed.hotels +
                    stats.salesMetrics.bigAccountsClosed.servicedApartments +
                    stats.salesMetrics.bigAccountsClosed.estates}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.salesMetrics.bigAccountsClosed.hotels} hotels,{' '}
                  {stats.salesMetrics.bigAccountsClosed.servicedApartments} apartments,{' '}
                  {stats.salesMetrics.bigAccountsClosed.estates} estates
                </p>
              </CardContent>
            </Card>

            <StatCard
              title="Deals in Pipeline"
              value={stats.salesMetrics.dealsInPipeline.toString()}
              icon={TrendingUp}
              description="Active deals"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <StatCard
              title="Revenue from Commissions"
              value={`₦${stats.salesMetrics.revenueFromCommissions.toLocaleString()}`}
              icon={DollarSign}
              description="Total commission revenue"
            />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Agent Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Activity Score</span>
                    <span className="text-xl font-bold">{stats.salesMetrics.agentActivityScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Engagement Rate</span>
                    <span className="text-xl font-bold">{stats.salesMetrics.agentEngagementRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.walletBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.pendingPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#0EA5E9" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subscription Sales Chart */}
      {stats.salesMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Sales</CardTitle>
            <CardDescription>Monthly subscription sales breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.salesMetrics.subscriptionSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" name="Sales Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Subscriptions</CardTitle>
            <CardDescription>
              Latest subscription activity ({filteredSubscriptions.length} results)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshSubscriptions}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <DashboardSearch
              placeholder="Search subscriptions by ID, partner, or plan..."
              onSearch={setSubscriptionSearchQuery}
              defaultValue={subscriptionSearchQuery}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No subscriptions found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.slice(0, 10).map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-mono text-sm">{sub.id}</TableCell>
                    <TableCell>{sub.partner}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₦{sub.mrr.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sub.status === 'active'
                            ? 'default'
                            : sub.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="capitalize"
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(sub.next_billing), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <EscalateIssueDialog
                        issueId={sub.id}
                        issueType="general"
                        fromDepartment="operations"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Wallet Transactions</CardTitle>
          <CardDescription>
            Latest wallet activity ({filteredTransactions.length} results)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <DashboardSearch
              placeholder="Search transactions by ID, user, or type..."
              onSearch={setTransactionSearchQuery}
              defaultValue={transactionSearchQuery}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No transactions found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.slice(0, 10).map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                    <TableCell>{txn.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {txn.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={
                        txn.type === 'deposit' || txn.type === 'commission'
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {txn.type === 'deposit' || txn.type === 'commission' ? '+' : '-'}
                      ₦{txn.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          txn.status === 'completed'
                            ? 'default'
                            : txn.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="capitalize"
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(txn.created_at), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <EscalateIssueDialog
                        issueId={txn.id}
                        issueType="general"
                        fromDepartment="operations"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
