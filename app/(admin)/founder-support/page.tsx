'use client';

import { useEffect } from 'react';
import { Headphones, Clock, Smile, Users } from 'lucide-react';
import { useFounderSupportStore } from '@/stores/founder-support-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FounderSupportPage() {
  return (
    <RoleGuard feature="founder-support" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Support Analytics</h1>
          <p className="text-muted-foreground">Support metrics and agent performance</p>
        </div>
        <FounderSupportClient />
      </div>
    </RoleGuard>
  );
}

function FounderSupportClient() {
  const { dashboard, isLoading, fetchDashboard, refreshDashboard } = useFounderSupportStore();

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
        <StatCard
          title="Open Tickets"
          value={dashboard.open_tickets.toString()}
          icon={Headphones}
          iconClassName="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
        />
        <StatCard
          title="Open Chats"
          value={dashboard.open_chats.toString()}
          icon={Users}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="Resolution Time"
          value={`${dashboard.resolution_time}h`}
          icon={Clock}
          iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
        />
        <StatCard
          title="Satisfaction Rating"
          value={dashboard.satisfaction_rating !== null ? `${dashboard.satisfaction_rating}%` : 'N/A'}
          icon={Smile}
          trend={dashboard.satisfaction_rating && dashboard.satisfaction_rating > 75 ? 'up' : undefined}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Common Issues</CardTitle>
            <CardDescription>Frequently reported support issues</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>Refresh</Button>
        </CardHeader>
        <CardContent>
          {dashboard.common_issues.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.common_issues.map((issue: unknown, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{JSON.stringify(issue)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No common issues reported
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Metrics Summary</CardTitle>
          <CardDescription>Overall support performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Open Cases</p>
              <p className="text-3xl font-bold">{dashboard.open_tickets + dashboard.open_chats}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {dashboard.open_tickets} tickets, {dashboard.open_chats} chats
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Resolution Time</p>
              <p className="text-3xl font-bold">{dashboard.resolution_time}h</p>
              <p className="text-xs text-muted-foreground mt-1">
                Time to resolve issues
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
