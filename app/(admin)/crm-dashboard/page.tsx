import { RoleGuard } from '@/components/role-guard';
import { CRMDashboardClient } from '@/components/crm/crm-dashboard-client';

export default function CRMDashboardPage() {
  return (
    <RoleGuard feature="crm-dashboard" requiredLevel="view">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage leads, contacts, and sales activities
          </p>
        </div>
        <CRMDashboardClient />
      </div>
    </RoleGuard>
  );
}
