'use client';

import { useAuthStore } from '@/stores/auth-store';
import { UserRole, ROLE_PERMISSIONS } from '@/types/rbac';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

/**
 * RoleSwitcher Component
 * Dev tool to switch between roles without re-login
 * Should be hidden in production
 */
export function RoleSwitcher() {
  const { getUserRole, mockSetRole } = useAuthStore();
  const currentRole = getUserRole();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const roles: UserRole[] = ['admin', 'customer_support', 'operations', 'sales', 'marketing'];

  return (
    <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <Badge variant="secondary" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        DEV
      </Badge>
      <Select value={currentRole || 'admin'} onValueChange={(value) => mockSetRole(value as UserRole)}>
        <SelectTrigger className="w-[200px] h-8">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {ROLE_PERMISSIONS[role].displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
