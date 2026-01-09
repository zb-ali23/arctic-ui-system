import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Wind, 
  Thermometer, 
  Snowflake, 
  Clock, 
  Wrench, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

const services = [
  {
    icon: Wind,
    title: "AC Repair",
    description: "Expert diagnosis and repair for all AC brands. Cooling issues, compressor problems, and more.",
    category: "AC",
    href: "/services/ac-repair",
    color: "frost"
  },
  {
    icon: Thermometer,
    title: "Refrigerator Repair",
    description: "Complete fridge and freezer repair. Ice makers, cooling issues, and compressor fixes.",
    category: "Refrigerator",
    href: "/services/refrigerator-repair",
    color: "accent"
  },
  {
    icon: Snowflake,
    title: "AC Maintenance",
    description: "Preventive maintenance to keep your AC running efficiently all season long.",
    category: "AC",
    href: "/services/maintenance",
    color: "frost"
  },
  {
    icon: Clock,
    title: "Emergency Service",
    description: "24/7 emergency repairs when you need help fast. No overtime charges.",
    category: "Both",
    href: "/services/emergency",
    color: "accent-warm"
  },
  {
    icon: Wrench,
    title: "Installation",
    description: "Professional installation of new AC units and refrigerators with warranty.",
    category: "Both",
    href: "/services/installation",
    color: "frost"
  },
  {
    icon: ShieldCheck,
    title: "Warranty Service",
    description: "Authorized warranty repairs for major brands. Factory-trained technicians.",
    category: "Both",
    href: "/services/warranty",
    color: "accent"
  },
];

export function ServicesSection() {
  return (
    <section className="section bg-background">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge="Our Services"
            title="Professional Cooling Solutions"
            description="From quick fixes to complete overhauls, we handle all your AC and refrigerator needs with expertise."
          />
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <ScaleOnHover>
                <Link to={service.href} className="block h-full">
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:border-frost/30 transition-all duration-300">
                    {/* Category Tag */}
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

                    {/* Icon */}
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${
                      service.color === "frost" 
                        ? "bg-frost/10 text-frost group-hover:bg-frost group-hover:text-frost-foreground" 
                        : service.color === "accent"
                        ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                        : "bg-accent-warm/10 text-accent-warm group-hover:bg-accent-warm group-hover:text-accent-warm-foreground"
                    }`}>
                      <service.icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
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
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
