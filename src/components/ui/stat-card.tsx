import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  label: string
  icon?: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, icon: Icon, trend, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card p-6 shadow transition-all duration-300 hover:shadow-lg",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          {Icon && (
            <div className="rounded-lg bg-secondary p-2 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.positive 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {trend.value}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-card-foreground mb-1">
          {value}
        </div>
        <div className="text-sm text-muted-foreground">
          {label}
        </div>
      </div>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
