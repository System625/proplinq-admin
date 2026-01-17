import { PropertiesClient } from '@/components/properties/properties-client';

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Properties Management
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor property listings on the platform
        </p>
      </div>

      <PropertiesClient />
    </div>
  );
}
