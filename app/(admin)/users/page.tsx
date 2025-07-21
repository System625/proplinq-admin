'use client';

import { UsersTable } from '@/components/data-tables/users-table';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor user accounts
        </p>
      </div>
      
      <UsersTable />
    </div>
  );
}