import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const serviceCardVariants = cva(
  "relative rounded-xl border bg-card p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border shadow hover:shadow-lg hover:-translate-y-1",
        frost: "border-frost/20 shadow hover:shadow-lg hover:shadow-frost/10 hover:-translate-y-1",
        glass: "bg-white/70 backdrop-blur-md border-white/50 shadow-md hover:shadow-lg hover:-translate-y-1",
        elevated: "border-transparent shadow-md hover:shadow-xl hover:-translate-y-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ServiceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof serviceCardVariants> {
  icon?: LucideIcon
  title: string
  description: string
  iconClassName?: string
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, variant, icon: Icon, title, description, iconClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(serviceCardVariants({ variant, className }))}
        {...props}
      >
        {Icon && (
          <div className={cn(
            "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary",
            iconClassName
          )}>
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    )
  }
)
ServiceCard.displayName = "ServiceCard"

export { ServiceCard, serviceCardVariants }
