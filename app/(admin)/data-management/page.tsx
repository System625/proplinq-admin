import { DataManagementClient } from '@/components/data-management/data-management-client';

export default function DataManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor company data submissions
        </p>
      </div>
      
      <DataManagementClient />
    </div>
  );
}