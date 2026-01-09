import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex-1 flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "hsl(var(--frost))"
                      : isCurrent
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isCompleted || isCurrent
                      ? "text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>

                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-frost"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Vertical Step Indicator
interface VerticalStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function VerticalStepIndicator({
  steps,
  currentStep,
  className,
}: VerticalStepIndicatorProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="relative flex gap-4">
            {/* Line and Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "hsl(var(--frost))"
                    : isCurrent
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold z-10",
                  isCompleted || isCurrent
                    ? "text-white"
                    : "text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className="w-0.5 flex-1 bg-muted my-1">
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    className="w-full bg-frost"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-8", index === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
