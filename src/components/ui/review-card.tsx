import * as React from "react"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  rating: number
  review: string
  date?: string
  avatar?: string
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ className, name, rating, review, date, avatar, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card p-6 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          className
        )}
        {...props}
      >
        <div className="mb-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating
                  ? "fill-accent-warm text-accent-warm"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed italic">
          "{review}"
        </p>
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-medium">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-card-foreground">{name}</p>
            {date && (
              <p className="text-xs text-muted-foreground">{date}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)
ReviewCard.displayName = "ReviewCard"

export { ReviewCard }
