import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'bg-primary/10 text-primary',
  description,
  className,
}: StatCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {(change || description) && (
            <div className="mt-2 flex items-center gap-2">
              {change && (
                <span
                  className={cn(
                    'text-sm font-medium',
                    changeType === 'positive' && 'text-green-600',
                    changeType === 'negative' && 'text-red-600',
                    changeType === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change}
                </span>
              )}
              {description && (
                <span className="text-sm text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('rounded-lg p-3', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

interface DataTableCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DataTableCard({ title, description, action, children, className }: DataTableCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card', className)}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
