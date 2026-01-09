import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string
  title: string
  description?: string
  icon?: LucideIcon
  align?: "left" | "center" | "right"
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, badge, title, description, icon: Icon, align = "center", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mb-12",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className
        )}
        {...props}
      >
        {(badge || Icon) && (
          <div className={cn(
            "mb-4 inline-flex items-center gap-2",
            align === "center" && "justify-center w-full",
            align === "right" && "justify-end w-full"
          )}>
            {Icon && (
              <div className="rounded-lg bg-secondary p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            )}
            {badge && (
              <span className="rounded-full bg-frost/10 px-3 py-1 text-xs font-medium text-frost">
                {badge}
              </span>
            )}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {title}
        </h2>
        {description && (
          <p className={cn(
            "text-muted-foreground text-lg max-w-2xl",
            align === "center" && "mx-auto"
          )}>
            {description}
          </p>
        )}
      </div>
    )
  }
)
SectionHeader.displayName = "SectionHeader"

export { SectionHeader }
