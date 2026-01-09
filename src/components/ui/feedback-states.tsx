import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  WifiOff, 
  RefreshCw,
  Inbox,
  Search,
  FileX,
  Loader2,
  Phone,
  MessageCircle,
  Mail,
  ArrowRight,
  Home,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================
// Loading States
// ============================================

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-frost/20"
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-frost"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

interface PulseLoaderProps {
  className?: string;
}

export function PulseLoader({ className }: PulseLoaderProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-frost"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15
          }}
        />
      ))}
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export function LoadingOverlay({ message = "Please wait...", submessage }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-frost/20"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-frost"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-frost" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1">{message}</h3>
        {submessage && (
          <p className="text-sm text-muted-foreground">{submessage}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6 animate-pulse", className)}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-3 w-4/6 rounded bg-muted" />
      </div>
    </div>
  );
}

// ============================================
// Success States
// ============================================

interface SuccessStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function SuccessState({ 
  title, 
  description, 
  icon,
  children,
  className 
}: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("text-center py-12", className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="relative w-20 h-20 mx-auto mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
          {icon || <CheckCircle2 className="w-10 h-10 text-white" />}
        </div>
        {/* Animated rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-green-400/30"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-green-400/20"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, delay: 0.2 }}
        />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-2"
      >
        {title}
      </motion.h2>
      
      {description && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground max-w-md mx-auto"
        >
          {description}
        </motion.p>
      )}

      {children && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================
// Error States
// ============================================

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showSupport?: boolean;
  className?: string;
}

export function ErrorState({ 
  title = "Something went wrong",
  description = "We encountered an error while processing your request. Please try again.",
  onRetry,
  onGoHome,
  showSupport = true,
  className 
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("text-center py-12", className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25"
      >
        <XCircle className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="cta">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>

      {showSupport && (
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Need help? Contact our support team</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+1234567890" className="inline-flex items-center gap-2 text-sm font-medium text-frost hover:underline">
              <Phone className="w-4 h-4" />
              (123) 456-7890
            </a>
            <a href="https://wa.me/1234567890" className="inline-flex items-center gap-2 text-sm font-medium text-frost hover:underline">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// Empty States
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon,
  title, 
  description,
  action,
  className 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center py-16", className)}
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        {icon || <Inbox className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="cta">
          {action.label}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </motion.div>
  );
}

export function NoResultsState({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-muted-foreground" />}
      title="No results found"
      description={searchTerm 
        ? `We couldn't find anything matching "${searchTerm}". Try a different search term.`
        : "We couldn't find what you're looking for. Try adjusting your filters."
      }
    />
  );
}

export function NoBookingsState({ onBook }: { onBook: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="w-8 h-8 text-muted-foreground" />}
      title="No bookings yet"
      description="You haven't made any service bookings. Schedule your first repair today!"
      action={{
        label: "Book a Service",
        onClick: onBook
      }}
    />
  );
}

// ============================================
// Offline / Network Error States
// ============================================

interface OfflineStateProps {
  onRetry?: () => void;
}

export function OfflineState({ onRetry }: OfflineStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25"
      >
        <WifiOff className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold mb-2">You're Offline</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        It looks like you've lost your internet connection. Please check your network and try again.
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="cta">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </Button>
      )}

      <div className="mt-8 p-4 rounded-xl bg-muted/50 max-w-md mx-auto">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Your progress has been saved locally. Once you're back online, you can continue where you left off.
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// Warning / Alert States
// ============================================

interface WarningBannerProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export function WarningBanner({ 
  title, 
  description, 
  action,
  onDismiss,
  className 
}: WarningBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20",
        className
      )}
    >
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-medium text-amber-700 dark:text-amber-400">{title}</h4>
        {description && (
          <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">{description}</p>
        )}
        {action && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={action.onClick}
            className="mt-2 text-amber-700 hover:text-amber-800 hover:bg-amber-500/10 p-0 h-auto"
          >
            {action.label}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="text-amber-500 hover:text-amber-600 p-1"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// ============================================
// Toast Notifications
// ============================================

interface ToastNotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  onClose?: () => void;
}

export function ToastNotification({ type, title, description, onClose }: ToastNotificationProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-500/10 border-green-500/20",
      iconColor: "text-green-500"
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-500/10 border-red-500/20",
      iconColor: "text-red-500"
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-500"
    },
    info: {
      icon: AlertTriangle,
      bgColor: "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-500"
    }
  };

  const { icon: Icon, bgColor, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm",
        bgColor
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", iconColor)} />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// ============================================
// Confirmation Dialogs
// ============================================

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const variantConfig = {
    danger: {
      icon: XCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      buttonVariant: "destructive" as const
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      buttonVariant: "default" as const
    },
    default: {
      icon: AlertTriangle,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      buttonVariant: "default" as const
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", config.iconBg)}>
              <Icon className={cn("w-6 h-6", config.iconColor)} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-6">{description}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant={config.buttonVariant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
