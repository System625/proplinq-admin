'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Feature, PermissionLevel } from '@/types/rbac';
import { AlertCircle, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleGuardProps {
  children: React.ReactNode;
  feature: Feature;
  requiredLevel?: PermissionLevel;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard Component
 * Protects content based on user's role permissions
 * Shows access denied UI or redirects if user lacks permission
 */
export function RoleGuard({
  children,
  feature,
  requiredLevel = 'view',
  fallback,
  redirectTo,
}: RoleGuardProps) {
  const router = useRouter();
  const { hasPermission, getRoleDisplayName, checkAuth, getDefaultDashboard } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      // First check if user is authenticated
      const isAuthenticated = checkAuth();

      if (!isAuthenticated) {
        // Not authenticated - redirect to login
        router.push('/login');
        return;
      }

      // Check permission for this feature
      const permission = hasPermission(feature, requiredLevel);
      setHasAccess(permission);
      setIsChecking(false);

      // If no access, redirect to specified route or user's default dashboard
      if (!permission) {
        const destination = redirectTo || getDefaultDashboard();
        router.push(destination);
      }
    };

    checkPermission();
  }, [feature, requiredLevel, hasPermission, checkAuth, redirectTo, router, getDefaultDashboard]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-proplinq-blue"></div>
      </div>
    );
  }

  // Show access denied UI if no permission
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return <AccessDenied roleName={getRoleDisplayName()} />;
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * AccessDenied Component
 * Default UI shown when user lacks permission
 */
function AccessDenied({ roleName }: { roleName: string }) {
  const router = useRouter();
  const { getDefaultDashboard } = useAuthStore();

  const handleGoToDashboard = () => {
    router.push(getDefaultDashboard());
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
              <ShieldOff className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Current Role: {roleName}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your current role doesn&apos;t have the necessary permissions to view this content.
                  Please contact your administrator if you believe this is an error.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGoToDashboard}
              className="flex-1"
              variant="default"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={handleGoBack}
              className="flex-1"
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * PermissionBadge Component
 * Shows user's permission level for a feature (for UI feedback)
 */
interface PermissionBadgeProps {
  feature: Feature;
  className?: string;
}

export function PermissionBadge({ feature, className = '' }: PermissionBadgeProps) {
  const { getPermission } = useAuthStore();
  const level = getPermission(feature);

  if (level === 'none') return null;

  const badgeStyles = {
    view: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    edit: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    full: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    none: '',
  };

  const labels = {
    view: 'View Only',
    edit: 'Can Edit',
    full: 'Full Access',
    none: '',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[level]} ${className}`}
    >
      {labels[level]}
    </span>
  );
}

/**
 * Hook to check permissions in components
 */
export function usePermission(feature: Feature, requiredLevel: PermissionLevel = 'view') {
  const { hasPermission, getPermission } = useAuthStore();

  return {
    hasPermission: hasPermission(feature, requiredLevel),
    permissionLevel: getPermission(feature),
    canView: hasPermission(feature, 'view'),
    canEdit: hasPermission(feature, 'edit'),
    hasFull: hasPermission(feature, 'full'),
  };
}
