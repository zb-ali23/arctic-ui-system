import { cn } from "@/lib/utils";
import { 
  BookingStatus, 
  PaymentStatus, 
  ServicePriority,
  bookingStatusConfig, 
  paymentStatusConfig 
} from "@/types/booking";
import { 
  Clock, 
  CheckCircle2, 
  User, 
  Truck, 
  Wrench, 
  Star, 
  XCircle, 
  RefreshCw,
  AlertTriangle,
  Zap,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

// ============================================
// Booking Status Badge
// ============================================

interface StatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const statusIcons: Record<BookingStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  assigned: User,
  en_route: Truck,
  in_progress: Wrench,
  completed: Star,
  cancelled: XCircle,
  rescheduled: RefreshCw
};

export function StatusBadge({ 
  status, 
  size = "md", 
  showIcon = true,
  animated = false,
  className 
}: StatusBadgeProps) {
  const config = bookingStatusConfig[status];
  const Icon = statusIcons[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const baseClassName = cn(
    "inline-flex items-center font-medium rounded-full",
    config.bgColor,
    config.color,
    sizeClasses[size],
    className
  );

  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" as const, stiffness: 500 }}
        className={baseClassName}
      >
        {showIcon && <Icon className={iconSizes[size]} />}
        {config.label}
      </motion.span>
    );
  }

  return (
    <span className={baseClassName}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}

// ============================================
// Payment Status Badge
// ============================================

interface PaymentBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md";
  className?: string;
}

export function PaymentBadge({ status, size = "sm", className }: PaymentBadgeProps) {
  const config = paymentStatusConfig[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-medium rounded-full",
      config.bgColor,
      config.color,
      sizeClasses[size],
      className
    )}>
      <DollarSign className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// ============================================
// Priority Badge
// ============================================

interface PriorityBadgeProps {
  priority: ServicePriority;
  size?: "sm" | "md";
  className?: string;
}

const priorityConfig: Record<ServicePriority, { label: string; color: string; bgColor: string }> = {
  normal: { label: "Normal", color: "text-slate-600", bgColor: "bg-slate-100 dark:bg-slate-800" },
  urgent: { label: "Urgent", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  emergency: { label: "Emergency", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" }
};

export function PriorityBadge({ priority, size = "sm", className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  if (priority === "normal") return null; // Don't show badge for normal priority

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-medium rounded-full",
      config.bgColor,
      config.color,
      sizeClasses[size],
      className
    )}>
      {priority === "emergency" ? (
        <Zap className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {config.label}
    </span>
  );
}

// ============================================
// Status Timeline
// ============================================

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  timeline?: Array<{
    status: BookingStatus;
    timestamp?: string;
    note?: string;
  }>;
  variant?: "horizontal" | "vertical";
  className?: string;
}

const statusOrder: BookingStatus[] = [
  "pending",
  "confirmed", 
  "assigned",
  "en_route",
  "in_progress",
  "completed"
];

export function StatusTimeline({ 
  currentStatus, 
  timeline,
  variant = "horizontal",
  className 
}: StatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";
  const isRescheduled = currentStatus === "rescheduled";

  if (variant === "vertical") {
    return (
      <div className={cn("space-y-0", className)}>
        {statusOrder.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = status === currentStatus;
          const Icon = statusIcons[status];
          const config = bookingStatusConfig[status];
          const timelineEntry = timeline?.find(t => t.status === status);

          return (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10",
                    isCompleted ? "bg-green-500 text-white" :
                    isCurrent ? "bg-frost text-frost-foreground ring-4 ring-frost/20" :
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                {index < statusOrder.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-12 -my-1",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
              <div className="flex-1 pt-2 pb-6">
                <p className={cn(
                  "font-medium",
                  isCurrent ? "text-frost" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {config.label}
                </p>
                {timelineEntry?.timestamp && (
                  <p className="text-sm text-muted-foreground">{timelineEntry.timestamp}</p>
                )}
                {timelineEntry?.note && (
                  <p className="text-sm text-muted-foreground mt-1">{timelineEntry.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {statusOrder.slice(0, 5).map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = status === currentStatus;
        const Icon = statusIcons[status];

        return (
          <div key={status} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isCompleted ? "bg-green-500 text-white" :
                  isCurrent ? "bg-frost text-frost-foreground" :
                  "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </motion.div>
              <span className={cn(
                "text-xs mt-1 text-center",
                isCurrent ? "text-frost font-medium" : "text-muted-foreground"
              )}>
                {bookingStatusConfig[status].label}
              </span>
            </div>
            {index < 4 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 mt-[-20px]",
                isCompleted ? "bg-green-500" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Status Indicator Dot
// ============================================

interface StatusDotProps {
  status: BookingStatus;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusDot({ status, pulse = false, size = "sm", className }: StatusDotProps) {
  const config = bookingStatusConfig[status];
  
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3"
  };

  const colorMap: Record<BookingStatus, string> = {
    pending: "bg-amber-500",
    confirmed: "bg-green-500",
    assigned: "bg-purple-500",
    en_route: "bg-blue-500",
    in_progress: "bg-frost",
    completed: "bg-emerald-500",
    cancelled: "bg-red-500",
    rescheduled: "bg-orange-500"
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      <span className={cn(
        "rounded-full",
        sizeClasses[size],
        colorMap[status]
      )} />
      {pulse && (status === "en_route" || status === "in_progress") && (
        <span className={cn(
          "absolute inline-flex rounded-full opacity-75 animate-ping",
          sizeClasses[size],
          colorMap[status]
        )} />
      )}
    </span>
  );
}
