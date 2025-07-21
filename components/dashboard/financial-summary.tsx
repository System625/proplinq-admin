'use client';

import { useEffect } from 'react';
import { useTransactionsStore } from '@/stores/transactions-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export function FinancialSummary() {
  const { transactions, isLoading, fetchTransactions } = useTransactionsStore();

  useEffect(() => {
    fetchTransactions({ limit: 100 }); // Get more data for summary
  }, [fetchTransactions]);

  if (isLoading && transactions.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const completedPayments = transactions.filter(
    t => t.type === 'payment' && t.status === 'completed'
  );
  const completedRefunds = transactions.filter(
    t => t.type === 'refund' && t.status === 'completed'
  );
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const totalRevenue = completedPayments.reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = completedRefunds.reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-proplinq-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            {completedPayments.length} completed payments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRefunds)}</div>
          <p className="text-xs text-muted-foreground">
            {completedRefunds.length} processed refunds
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
          <RefreshCw className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
          <p className="text-xs text-muted-foreground">
            {pendingTransactions.length} pending transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}