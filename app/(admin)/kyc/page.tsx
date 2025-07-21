'use client';

import { KycTable } from '@/components/data-tables/kyc-table';

export default function KycPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">KYC Verifications</h1>
        <p className="text-muted-foreground">
          Review and manage identity verification documents
        </p>
      </div>
      
      <KycTable />
    </div>
  );
}