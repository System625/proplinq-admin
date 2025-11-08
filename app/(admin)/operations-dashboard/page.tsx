'use client';

import { useEffect } from 'react';
import { Settings, CreditCard, Users, AlertTriangle } from 'lucide-react';
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

export default function OperationsDashboardPage() {
  return (
    <RoleGuard feature="operations-dashboard" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Operations & Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage subscriptions, finances, and operational tasks
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
    subscriptions,
    transactions,
    revenueChart,
    isLoading,
    fetchDashboardData,
    refreshSubscriptions,
  } = useOperationsDashboardStore();

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

      {/* Subscriptions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Subscriptions</CardTitle>
            <CardDescription>Latest subscription activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshSubscriptions}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.slice(0, 10).map((sub) => (
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Wallet Transactions</CardTitle>
          <CardDescription>Latest wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((txn) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
