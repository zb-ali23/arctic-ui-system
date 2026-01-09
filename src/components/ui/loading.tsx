import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Snowflake, Loader2 } from "lucide-react";

// Spinner Loader
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={cn("animate-spin text-frost", sizeClasses[size], className)} />
  );
}

// Frost Spinner (branded)
export function FrostSpinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className={cn(sizeClasses[size], className)}
    >
      <Snowflake className="h-full w-full text-frost" />
    </motion.div>
  );
}

// Dots Loader
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-frost"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Pulse Loader
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-10 w-10", className)}>
      <motion.div
        className="absolute inset-0 rounded-full bg-frost"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-frost"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.7, 0, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.3,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Snowflake className="h-5 w-5 text-frost" />
      </div>
    </div>
  );
}

// Skeleton Loader
interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "circle" | "rectangle" | "card";
}

export function SkeletonLoader({ className, variant = "text" }: SkeletonLoaderProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circle: "h-12 w-12 rounded-full",
    rectangle: "h-24 w-full rounded-lg",
    card: "h-48 w-full rounded-xl",
  };

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        variantClasses[variant],
        className
      )}
      animate={{
        backgroundPosition: ["0% 0%", "-200% 0%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Full Page Loader
interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <PulseLoader />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-sm text-muted-foreground"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

// Button Loading State
interface ButtonLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function ButtonLoader({ loading, children }: ButtonLoaderProps) {
  return (
    <>
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </>
  );
}

// Content Placeholder
export function ContentPlaceholder({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader
          key={i}
          className={i === lines - 1 ? "w-3/4" : "w-full"}
        />
      ))}
    </div>
  );
}

// Card Placeholder
export function CardPlaceholder() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <SkeletonLoader variant="circle" />
      <div className="space-y-2">
        <SkeletonLoader className="h-5 w-1/2" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-3/4" />
      </div>
    </div>
  );
}
