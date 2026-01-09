import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertCustomProps {
  variant?: AlertVariant;
  title?: string;
  description: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const variantConfig = {
  info: {
    icon: Info,
    containerClass: "border-frost/30 bg-frost/5",
    iconClass: "text-frost",
    titleClass: "text-foreground",
  },
  success: {
    icon: CheckCircle2,
    containerClass: "border-success/30 bg-success/5",
    iconClass: "text-success",
    titleClass: "text-foreground",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "border-warning/30 bg-warning/5",
    iconClass: "text-warning",
    titleClass: "text-foreground",
  },
  error: {
    icon: AlertCircle,
    containerClass: "border-destructive/30 bg-destructive/5",
    iconClass: "text-destructive",
    titleClass: "text-foreground",
  },
};

export function AlertCustom({
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
  icon,
  action,
  className,
}: AlertCustomProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          role="alert"
          className={cn(
            "relative flex gap-3 rounded-xl border p-4",
            config.containerClass,
            className
          )}
        >
          {/* Icon */}
          <div className={cn("flex-shrink-0 mt-0.5", config.iconClass)}>
            {icon || <IconComponent className="h-5 w-5" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className={cn("font-medium mb-1", config.titleClass)}>
                {title}
              </h5>
            )}
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {/* Action */}
            {action && <div className="mt-3">{action}</div>}
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDismiss}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast notification variant
interface ToastNotificationProps {
  variant?: AlertVariant;
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

export function ToastNotification({
  variant = "info",
  title,
  description,
  duration = 5000,
  onClose,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg min-w-[300px] max-w-md",
            config.containerClass
          )}
        >
          <div className={config.iconClass}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{title}</p>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
