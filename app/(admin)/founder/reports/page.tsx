'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, DollarSign, Users, Building2, TrendingUp, Lightbulb } from 'lucide-react';
import { useFounderReportsStore } from '@/stores/founder-reports-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/role-guard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatCard } from '@/components/dashboard/stat-card';

interface PlaceholderReport {
  message: string;
  format?: string;
  date_range?: { from: string; to: string };
  metrics?: string[];
}

function isPlaceholderReport(report: unknown): report is PlaceholderReport {
  return (
    typeof report === 'object' &&
    report !== null &&
    'message' in report &&
    report.message === 'Executive report generation coming soon'
  );
}

export default function FounderReportsPage() {
  return (
    <RoleGuard feature="founder-reports" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Executive Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports with insights and recommendations
          </p>
        </div>
        <FounderReportsClient />
      </div>
    </RoleGuard>
  );
}

function FounderReportsClient() {
  const { executiveReport: report, isLoading, fetchExecutiveReport } = useFounderReportsStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      return;
    }
    await fetchExecutiveReport({
      format: 'pdf',
      date_from: startDate,
      date_to: endDate,
      include_metrics: ['revenue', 'subscriptions', 'bookings', 'growth']
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select a date range to generate an executive report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateReport} disabled={isLoading || !startDate || !endDate}>
                <FileText className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && !report && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Check if this is a placeholder response */}
          {isPlaceholderReport(report) ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Executive Report Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    The executive report feature is currently under development.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Requested format: {report.format}</p>
                    <p>Date range: {report.date_range?.from} to {report.date_range?.to}</p>
                    <p>Metrics: {report.metrics?.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Executive Report</h2>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>

              {/* Overview Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Business Overview</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Revenue"
                    value={`₦${report.overview?.total_revenue?.toLocaleString() ?? '0'}`}
                    icon={DollarSign}
                    iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  />
              <StatCard
                title="Total Users"
                value={report.overview.total_users.toLocaleString()}
                icon={Users}
                iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              />
              <StatCard
                title="Total Properties"
                value={report.overview.total_properties.toLocaleString()}
                icon={Building2}
                iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
              />
              <StatCard
                title="Total Bookings"
                value={report.overview.total_bookings.toLocaleString()}
                icon={Calendar}
                iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
              />
            </div>
          </div>

          {/* Financial Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Financial Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{report.financial.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₦{report.financial.expenses.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{report.financial.profit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold">{report.financial.profit_margin}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Growth Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">User Growth</p>
                  <p
                    className={`text-2xl font-bold ${
                      report.growth.user_growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {report.growth.user_growth >= 0 ? '+' : ''}
                    {report.growth.user_growth}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Growth</p>
                  <p
                    className={`text-2xl font-bold ${
                      report.growth.revenue_growth_rate >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {report.growth.revenue_growth_rate >= 0 ? '+' : ''}
                    {report.growth.revenue_growth_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Growth</p>
                  <p
                    className={`text-2xl font-bold ${
                      report.growth.booking_growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {report.growth.booking_growth >= 0 ? '+' : ''}
                    {report.growth.booking_growth}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold">
                    {report.operations.active_subscriptions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-bold">{report.operations.churn_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                  <p className="text-2xl font-bold">
                    ₦{report.operations.avg_booking_value.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                  <p className="text-2xl font-bold">{report.operations.customer_satisfaction}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.insights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <p className="text-sm">{insight}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-600 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
