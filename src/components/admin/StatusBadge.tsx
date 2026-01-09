import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  assigned: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  en_route: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  in_progress: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  unavailable: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  busy: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  en_route: 'En Route',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paid: 'Paid',
  partial: 'Partial',
  overdue: 'Overdue',
  active: 'Active',
  inactive: 'Inactive',
  available: 'Available',
  unavailable: 'Unavailable',
  busy: 'Busy',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/ /g, '_');
  const style = statusStyles[normalizedStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  const label = statusLabels[normalizedStatus] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        style,
        className
      )}
    >
      {label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: 'low' | 'normal' | 'high' | 'urgent';
  className?: string;
}

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        priorityStyles[priority] || priorityStyles.normal,
        className
      )}
    >
      {priority}
    </span>
  );
}
