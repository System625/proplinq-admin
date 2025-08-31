import { TransactionsTable } from '@/components/data-tables/transactions-table';
import { FinancialSummary } from '@/components/dashboard/financial-summary';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
        <p className="text-muted-foreground">
          Monitor payments, refunds, and financial activity
        </p>
      </div>
      
      <FinancialSummary />
      <TransactionsTable />
    </div>
  );
}