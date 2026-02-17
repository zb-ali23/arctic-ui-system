import { Users, Wrench, Clock, Star } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { AnimatedCounter } from "@/hooks/use-counter";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

export function StatsSection() {
  const { stats } = useWebsiteContent();

  const statItems = [
    { icon: Users, value: Number(stats.customers_count), suffix: "+", label: stats.customers_label },
    { icon: Wrench, value: Number(stats.repairs_count), suffix: "+", label: stats.repairs_label },
    { icon: Clock, value: Number(stats.experience_count), suffix: "+", label: stats.experience_label },
    { icon: Star, value: Number(stats.rating_value), suffix: "", label: stats.rating_label, isDecimal: true },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.15}>
          {statItems.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-frost mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.isDecimal ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} />
                  )}
                </div>
                <div className="text-primary-foreground/70 font-medium">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
