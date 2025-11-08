'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { ShieldOff, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccessDeniedPage() {
  const router = useRouter();
  const { getRoleDisplayName, getDefaultDashboard } = useAuthStore();

  const roleName = getRoleDisplayName();

  const handleGoToDashboard = () => {
    router.push(getDefaultDashboard());
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
              <ShieldOff className="h-16 w-16 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-base mt-2">
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Current Role: {roleName}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Your current role doesn&apos;t have the necessary permissions to view this content.
                  This page may be restricted to specific user roles or permission levels.
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  If you believe you should have access to this page, please contact your system
                  administrator for assistance.
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
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button
              onClick={handleGoBack}
              className="flex-1"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              What you can do:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-proplinq-blue mt-0.5">•</span>
                <span>Return to your dashboard to access available features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-proplinq-blue mt-0.5">•</span>
                <span>Contact your administrator to request additional permissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-proplinq-blue mt-0.5">•</span>
                <span>Check the navigation menu for pages you have access to</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
