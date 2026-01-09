import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5",
        ghost: 
          "text-foreground hover:bg-muted hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        // Primary CTA - Accent Green with glow
        cta: 
          "bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0",
        // Frost/Cyan variant for cooling theme
        frost:
          "bg-frost text-frost-foreground shadow-md hover:shadow-lg hover:shadow-frost/30 hover:-translate-y-0.5 active:translate-y-0",
        // Warm accent variant
        warm:
          "bg-accent-warm text-accent-warm-foreground shadow-md hover:shadow-lg hover:shadow-accent-warm/25 hover:-translate-y-0.5 active:translate-y-0",
        // Hero variant - Large prominent button
        hero:
          "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 font-semibold",
        // Hero frost variant
        "hero-frost":
          "bg-frost text-frost-foreground shadow-lg hover:shadow-xl hover:shadow-frost/40 hover:-translate-y-1 active:translate-y-0 font-semibold",
        // Hero CTA
        "hero-cta":
          "bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1 active:translate-y-0 font-semibold",
        // Glass variant
        glass:
          "bg-white/70 backdrop-blur-md border border-white/50 text-foreground shadow-md hover:shadow-lg hover:bg-white/80 hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
