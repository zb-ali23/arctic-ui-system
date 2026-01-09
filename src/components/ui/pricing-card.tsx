import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Button } from "./button"

const pricingCardVariants = cva(
  "relative rounded-2xl border p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border bg-card shadow hover:shadow-lg",
        featured: "border-frost bg-card shadow-lg scale-105 ring-2 ring-frost/20",
        premium: "border-primary bg-primary text-primary-foreground shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface PricingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingCardVariants> {
  title: string
  price: string
  period?: string
  description?: string
  features: string[]
  buttonText?: string
  onButtonClick?: () => void
  badge?: string
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ 
    className, 
    variant, 
    title, 
    price, 
    period = "starting at",
    description, 
    features, 
    buttonText = "Get Started",
    onButtonClick,
    badge,
    ...props 
  }, ref) => {
    const isPremium = variant === "premium"
    const isFeatured = variant === "featured"
    
    return (
      <div
        ref={ref}
        className={cn(pricingCardVariants({ variant, className }))}
        {...props}
      >
        {badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-frost px-3 py-1 text-xs font-medium text-frost-foreground">
              {badge}
            </span>
          </div>
        )}
        
        <div className="mb-4">
          <h3 className={cn(
            "text-lg font-semibold",
            isPremium ? "text-primary-foreground" : "text-card-foreground"
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              "mt-1 text-sm",
              isPremium ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {description}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <span className={cn(
            "text-3xl font-bold",
            isPremium ? "text-primary-foreground" : "text-card-foreground"
          )}>
            {price}
          </span>
          <span className={cn(
            "text-sm ml-1",
            isPremium ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {period}
          </span>
        </div>
        
        <ul className="mb-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className={cn(
                "h-5 w-5 shrink-0",
                isPremium ? "text-primary-foreground" : "text-accent"
              )} />
              <span className={cn(
                "text-sm",
                isPremium ? "text-primary-foreground/90" : "text-muted-foreground"
              )}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button
          variant={isPremium ? "glass" : isFeatured ? "frost" : "default"}
          className="w-full"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    )
  }
)
PricingCard.displayName = "PricingCard"

export { PricingCard, pricingCardVariants }
