'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/auth-store';
import { MOCK_USERS } from '@/lib/mock-users';
import { Info } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, checkAuth, initAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldShowLogin, setShouldShowLogin] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect authenticated users away from login page
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        initAuth();
        if (checkAuth()) {
          // Redirect to user's role-specific dashboard
          const defaultDashboard = useAuthStore.getState().getDefaultDashboard();
          router.push(defaultDashboard);
          return;
        }
        setShouldShowLogin(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setShouldShowLogin(true);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [checkAuth, initAuth, router]);

  async function onSubmit(values: LoginForm) {
    try {
      await login(values);

      // Get the user's default dashboard based on their role
      const defaultDashboard = useAuthStore.getState().getDefaultDashboard();
      router.push(defaultDashboard);
    } catch {
      // Error handling is now done in the auth store with toast notifications
    }
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-proplinq-blue/10 to-proplinq-cyan/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated or we shouldn't show login
  if (!shouldShowLogin) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-proplinq-blue/10 to-proplinq-cyan/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo.png"
              alt="PropLinq Logo"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-proplinq-blue">
            PropLinq Admin
          </CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button
                type="submit"
                className="w-full bg-proplinq-blue hover:bg-proplinq-blue/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          {/* Dev Credentials Hint - Only in Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                    Test Credentials (Dev Only)
                  </p>
                  <div className="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                    {MOCK_USERS.map((user) => (
                      <div key={user.email} className="font-mono">
                        <span className="font-semibold">{user.displayName}:</span>{' '}
                        {user.email} / {user.password}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}