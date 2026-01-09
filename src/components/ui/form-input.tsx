import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, Check, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: LucideIcon
  helperText?: string
  showSuccessIcon?: boolean
  required?: boolean
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success, 
    icon: Icon, 
    helperText, 
    id, 
    showSuccessIcon = true,
    required,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasBeenTouched, setHasBeenTouched] = React.useState(false)
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasBeenTouched(true)
      onBlur?.(e)
    }
    
    const showError = error && hasBeenTouched
    const showSuccess = success && hasBeenTouched && !error
    
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              isFocused ? "text-frost" : "text-foreground",
              showError && "text-destructive"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <motion.div 
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                isFocused ? "text-frost" : "text-muted-foreground",
                showError && "text-destructive"
              )}
              animate={{ scale: isFocused ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 bg-background px-4 py-2 text-sm transition-all duration-200",
              "placeholder:text-muted-foreground/60",
              "focus-visible:outline-none focus-visible:ring-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "hover:border-muted-foreground/50",
              Icon && "pl-10",
              (showSuccess && showSuccessIcon) && "pr-10",
              showError && "pr-10",
              showError
                ? "border-destructive bg-destructive/5 focus-visible:border-destructive"
                : showSuccess
                ? "border-green-500 bg-green-500/5 focus-visible:border-green-500"
                : isFocused
                ? "border-frost shadow-[0_0_0_3px_hsl(var(--frost)/0.1)]"
                : "border-input",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          
          {/* Status Icons */}
          <AnimatePresence mode="wait">
            {showError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                </div>
              </motion.div>
            )}
            {showSuccess && showSuccessIcon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Error/Helper Message */}
        <AnimatePresence mode="wait">
          {showError ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              id={`${inputId}-error`}
              className="text-xs text-destructive flex items-center gap-1.5"
            >
              {error}
            </motion.p>
          ) : helperText ? (
            <motion.p
              key="helper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              id={`${inputId}-helper`}
              className="text-xs text-muted-foreground"
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }
