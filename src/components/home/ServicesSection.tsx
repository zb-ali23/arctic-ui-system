import { Link } from "react-router-dom";
import { 
  Wind, Thermometer, Snowflake, Clock, Wrench, ShieldCheck, ArrowRight
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const icons = [Wind, Thermometer, Snowflake, Clock, Wrench, ShieldCheck];
const hrefs = ["/services/ac-repair", "/services/refrigerator-repair", "/services/maintenance", "/services/emergency", "/services/installation", "/services/warranty"];
const colors = ["frost", "accent", "frost", "accent-warm", "frost", "accent"];

export function ServicesSection() {
  const { servicesSection } = useWebsiteContent();

  const services = Array.from({ length: 6 }, (_, i) => ({
    icon: icons[i],
    title: (servicesSection as any)[`service_${i + 1}_title`] as string,
    description: (servicesSection as any)[`service_${i + 1}_desc`] as string,
    category: (servicesSection as any)[`service_${i + 1}_category`] as string,
    href: hrefs[i],
    color: colors[i],
  }));

  return (
    <section className="section bg-background">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge={servicesSection.badge}
            title={servicesSection.title}
            description={servicesSection.description}
          />
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <ScaleOnHover>
                <Link to={service.href} className="block h-full">
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:border-frost/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        service.category === "AC" 
                          ? "bg-frost/10 text-frost" 
                          : service.category === "Refrigerator"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        {service.category}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${
                      service.color === "frost" 
                        ? "bg-frost/10 text-frost group-hover:bg-frost group-hover:text-frost-foreground" 
                        : service.color === "accent"
                        ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                        : "bg-accent-warm/10 text-accent-warm group-hover:bg-accent-warm group-hover:text-accent-warm-foreground"
                    }`}>
                      <service.icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.4} className="text-center mt-10">
          <Link 
            to="/services"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            {servicesSection.view_all_text}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
