import { ListingsTable } from '@/components/data-tables/listings-table';

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Listings Review</h1>
        <p className="text-muted-foreground">
          Review and manage property listings submitted by agents and hosts
        </p>
      </div>

      <ListingsTable />
    </div>
  );
}
