/**
 * Error State Components
 * Beautiful, user-friendly error displays for different error types
 */

import { AlertTriangle, ServerCrash, ShieldAlert, WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface ErrorStateProps {
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

/**
 * 500 Server Error State
 */
export function ServerErrorState({ onRetry, onGoHome, showHomeButton = true }: ErrorStateProps) {
  return (
    <Card className="border-destructive/50 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-destructive/10 p-3">
            <ServerCrash className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-destructive">Server Error</CardTitle>
            <CardDescription className="mt-1">
              We are experiencing technical difficulties
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Our servers are having trouble processing your request. This issue has been logged and our
          team has been notified. Please try again in a few moments.
        </p>
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="default" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button
              onClick={onGoHome || (() => (window.location.href = '/dashboard'))}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 401 Unauthorized / Session Expired State
 */
export function UnauthorizedErrorState() {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Card className="border-amber-500/50 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-500/10 p-3">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-amber-500">Session Expired</CardTitle>
            <CardDescription className="mt-1">
              Please log in again to continue
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your session has expired for security reasons. Please log in again to access your admin
          dashboard.
        </p>
        <Button onClick={handleLogin} variant="default" className="w-full">
          Go to Login
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Network Error State
 */
export function NetworkErrorState({ onRetry, showHomeButton = true }: ErrorStateProps) {
  return (
    <Card className="border-blue-500/50 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-500/10 p-3">
            <WifiOff className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-blue-500">Connection Problem</CardTitle>
            <CardDescription className="mt-1">
              Unable to reach the server
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We could not connect to our servers. Please check your internet connection and try again.
        </p>
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="default" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button
              onClick={() => (window.location.href = '/dashboard')}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Generic Error State
 */
export function GenericErrorState({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onGoHome,
  showHomeButton = true,
}: ErrorStateProps & { title?: string; message?: string }) {
  return (
    <Card className="border-destructive/50 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-destructive">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="default" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button
              onClick={onGoHome || (() => (window.location.href = '/dashboard'))}
              variant="outline"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
