import { Suspense } from 'react';
import { getDashboardStats } from '@/lib/data';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your PropLinq admin dashboard
        </p>
      </div>

      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardClient initialStats={stats} />
      </Suspense>
    </div>
  );
}