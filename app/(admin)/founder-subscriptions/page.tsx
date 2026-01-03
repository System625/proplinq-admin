'use client';

import { useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useFounderSubscriptionsStore } from '@/stores/founder-subscriptions-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PLAN_COLORS = ['#0EA5E9', '#10b981', '#8b5cf6'];

export default function FounderSubscriptionsPage() {
  return (
    <RoleGuard feature="founder-subscriptions" requiredLevel="view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Subscriptions Analytics
            </h1>
            <p className="text-muted-foreground">
              Subscription metrics, MRR, ARR, and churn analysis
            </p>
          </div>
        </div>

        <FounderSubscriptionsClient />
      </div>
    </RoleGuard>
  );
}

function FounderSubscriptionsClient() {
  const { dashboard, isLoading, fetchDashboard, refreshDashboard } = useFounderSubscriptionsStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!dashboard) return null;

  const planData = [
    { name: 'Monthly', value: dashboard.active.monthly, color: PLAN_COLORS[0] },
    { name: 'Unlimited', value: dashboard.active.unlimited, color: PLAN_COLORS[1] },
  ];

  const totalActive = dashboard.active.monthly + dashboard.active.unlimited;
  const growthRate = dashboard.growth_trends.last_month > 0
    ? ((dashboard.growth_trends.this_month - dashboard.growth_trends.last_month) / dashboard.growth_trends.last_month * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Active Subscriptions"
          value={totalActive.toString()}
          icon={Users}
          description="Monthly + Unlimited"
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title="Monthly Subscriptions"
          value={dashboard.active.monthly.toString()}
          icon={Activity}
          description="Active monthly plans"
          trend="up"
          iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        />
        <StatCard
          title="Unlimited Subscriptions"
          value={dashboard.active.unlimited.toString()}
          icon={TrendingUp}
          description="Active unlimited plans"
          trend="up"
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>

      {/* Revenue & Growth Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{dashboard.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total subscription revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{growthRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month: {dashboard.growth_trends.this_month} | Last month: {dashboard.growth_trends.last_month}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions by Plan</CardTitle>
            <CardDescription>Distribution across plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {planData.map((plan) => (
                <div key={plan.name} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm font-medium">{plan.name}</span>
                  <span className="text-xs text-muted-foreground">{plan.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
            <CardDescription>Subscribers per plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={planData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Monthly subscription growth comparison</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshDashboard}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">This Month</p>
              <p className="text-3xl font-bold">{dashboard.growth_trends.this_month}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Last Month</p>
              <p className="text-3xl font-bold">{dashboard.growth_trends.last_month}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
