import { cn } from "@/lib/utils";
import { Breadcrumbs, BreadcrumbItem } from "./breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "hero";
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  className,
  variant = "default"
}: PageHeaderProps) {
  return (
    <section 
      className={cn(
        "pt-20 md:pt-24",
        variant === "hero" ? "pb-16 md:pb-20 bg-primary text-primary-foreground" : "pb-8 bg-background-soft",
        className
      )}
    >
      <div className="container">
        {breadcrumbs && (
          <Breadcrumbs 
            items={breadcrumbs} 
            className={variant === "hero" ? "[&_*]:text-primary-foreground/70 [&_*:hover]:text-primary-foreground [&_.font-medium]:text-primary-foreground" : ""}
          />
        )}
        <h1 className={cn(
          "text-4xl md:text-5xl font-bold",
          variant === "hero" ? "text-primary-foreground" : "text-foreground"
        )}>
          {title}
        </h1>
        {description && (
          <p className={cn(
            "mt-4 text-lg max-w-2xl",
            variant === "hero" ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
