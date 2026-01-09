import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar, ArrowRight } from "lucide-react"

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  excerpt: string
  date: string
  image?: string
  category?: string
  href?: string
}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ className, title, excerpt, date, image, category, href, ...props }, ref) => {
    const Wrapper = href ? 'a' : 'div'
    
    return (
      <div
        ref={ref}
        className={cn(
          "group rounded-xl border border-border bg-card overflow-hidden shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5">
          {category && (
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground mb-3">
              {category}
            </span>
          )}
          <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    )
  }
)
BlogCard.displayName = "BlogCard"

export { BlogCard }
