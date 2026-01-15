import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorCard({
  title = 'Error Loading Data',
  message,
  onRetry,
  showHomeButton = false,
}: ErrorCardProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {(onRetry || showHomeButton) && (
        <CardContent className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
          {showHomeButton && (
            <Button
              onClick={() => (window.location.href = '/dashboard')}
              variant="default"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
