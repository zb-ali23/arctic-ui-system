import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: LucideIcon
  helperText?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, label, error, success, icon: Icon, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-11 w-full rounded-lg border bg-background px-4 py-2 text-sm transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              Icon && "pl-10",
              error
                ? "border-destructive focus-visible:ring-destructive"
                : success
                ? "border-success focus-visible:ring-success"
                : "border-input focus-visible:ring-ring",
              className
            )}
            ref={ref}
            {...props}
          />
          {(error || success) && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
              error ? "bg-destructive" : "bg-success"
            )} />
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }
