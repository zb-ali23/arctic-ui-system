import { Users, Wrench, Clock, Star } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { AnimatedCounter } from "@/hooks/use-counter";

const stats = [
  { icon: Users, value: 5000, suffix: "+", label: "Happy Customers" },
  { icon: Wrench, value: 15000, suffix: "+", label: "Repairs Completed" },
  { icon: Clock, value: 15, suffix: "+", label: "Years Experience" },
  { icon: Star, value: 4.9, suffix: "", label: "Customer Rating", isDecimal: true },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.15}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-frost mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.isDecimal ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter 
                      end={stat.value} 
                      suffix={stat.suffix}
                      duration={2500}
                    />
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
