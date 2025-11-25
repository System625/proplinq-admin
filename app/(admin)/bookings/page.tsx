'use client';

import { useEffect } from 'react';
import { BookingsTable } from '@/components/data-tables/bookings-table';
import { useBookingsStore } from '@/stores/bookings-store';
import { StatCard } from '@/components/dashboard/stat-card';
import { Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookingsPage() {
  const { statistics, fetchStatistics } = useBookingsStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Bookings Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage property bookings
        </p>
      </div>

      {/* Bookings Statistics Overview */}
      {statistics ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Bookings Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Bookings Today"
              value={statistics.today.toString()}
              icon={Calendar}
              description="Booked today"
              iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            />
            <StatCard
              title="Bookings This Week"
              value={statistics.thisWeek.toString()}
              icon={Calendar}
              description="This week's bookings"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            />
            <StatCard
              title="Monthly Bookings"
              value={statistics.thisMonth.toString()}
              icon={Calendar}
              description="This month's bookings"
              iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
            />
            <StatCard
              title="Total Bookings"
              value={statistics.allTime.toString()}
              icon={Calendar}
              description="All-time bookings"
              iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Bookings Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      )}

      <BookingsTable />
    </div>
  );
}