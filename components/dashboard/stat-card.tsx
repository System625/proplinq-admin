import { type ComponentType } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;  
  icon: ComponentType<LucideProps>;
  className?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  iconClassName?: string;
}

const trendIconMap: Record<'up' | 'down' | 'neutral', ComponentType<LucideProps>> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendLabelMap: Record<'up' | 'down' | 'neutral', string> = {
  up: 'Trending up',
  down: 'Trending down',
  neutral: 'Holding steady',
};

const trendClassMap: Record<'up' | 'down' | 'neutral', string> = {
  up: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
  down: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
  neutral: 'bg-muted text-muted-foreground dark:bg-muted/20',
};

export function StatCard({
  title,
  value,
  icon,
  className,
  description,
  trend,
  iconClassName,
}: StatCardProps) {
  const Icon = icon;
  const TrendIcon = trend ? trendIconMap[trend] : null;
  const trendLabel = trend ? trendLabelMap[trend] : null;
  const trendClasses = trend ? trendClassMap[trend] : null;
  const composedIconClassName = cn('h-5 w-5', iconClassName);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-foreground/90">{title}</CardTitle>
          {trend && TrendIcon && trendLabel && trendClasses && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                trendClasses,
              )}
            >
              <TrendIcon className="h-3 w-3" aria-hidden />
              {trendLabel}
            </span>
          )}
        </div>
        <span className="rounded-full bg-proplinq-blue/10 p-2 text-proplinq-blue">
          <Icon className={composedIconClassName} aria-hidden />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}