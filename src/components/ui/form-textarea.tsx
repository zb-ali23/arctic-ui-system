import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, success, helperText, id, ...props }, ref) => {
    const textareaId = id || React.useId()
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              "flex min-h-[120px] w-full rounded-lg border bg-background px-4 py-3 text-sm transition-all duration-200 resize-none",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
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
FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
