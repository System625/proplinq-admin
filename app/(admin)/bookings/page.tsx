'use client';

import { BookingsTable } from '@/components/data-tables/bookings-table';

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Bookings Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage property bookings
        </p>
      </div>
      
      <BookingsTable />
    </div>
  );
}