'use client';

import { useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useFounderWalletsStore } from '@/stores/founder-wallets-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FounderWalletsPage() {
  return (
    <RoleGuard feature="founder-wallets" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Wallets Analytics</h1>
          <p className="text-muted-foreground">Wallet balances and transaction analytics</p>
        </div>
        <FounderWalletsClient />
      </div>
    </RoleGuard>
  );
}

function FounderWalletsClient() {
  const { dashboard, isLoading, fetchDashboard, refreshDashboard } = useFounderWalletsStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboard) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={`₦${dashboard.total_balance.toLocaleString()}`}
          icon={Wallet}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="Total Transactions"
          value={dashboard.total_transactions.toLocaleString()}
          icon={TrendingUp}
          trend="up"
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
        <StatCard
          title="Today's Transactions"
          value={dashboard.transaction_trends.today.toLocaleString()}
          icon={DollarSign}
          description="Transactions today"
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        />
        <StatCard
          title="This Week"
          value={dashboard.transaction_trends.this_week.toLocaleString()}
          icon={Users}
          description="Weekly transactions"
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Trends</CardTitle>
          <CardDescription>Transaction volume breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Today</p>
              <p className="text-2xl font-bold">{dashboard.transaction_trends.today}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">This Week</p>
              <p className="text-2xl font-bold">{dashboard.transaction_trends.this_week}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">This Month</p>
              <p className="text-2xl font-bold">{dashboard.transaction_trends.this_month}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Users</CardTitle>
            <CardDescription>Users with recent wallet activity</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          {dashboard.top_users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead className="text-right">Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.top_users.map((user: unknown, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{JSON.stringify(user)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No user data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
