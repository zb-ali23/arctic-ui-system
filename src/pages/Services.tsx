import { Link } from "react-router-dom";
import { 
  Wind, 
  Thermometer, 
  Snowflake, 
  Clock, 
  ShieldCheck, 
  Wrench,
  ArrowRight
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

const services = [
  {
    icon: Wind,
    title: "AC Repair & Service",
    description: "Complete air conditioning repair, maintenance, and installation services for all brands and models. We fix cooling issues, compressor problems, refrigerant leaks, and more.",
    href: "/services/ac-repair",
    features: ["All brands serviced", "Same-day service", "90-day warranty"]
  },
  {
    icon: Thermometer,
    title: "Refrigerator Repair",
    description: "Expert refrigerator and freezer repair services. We diagnose and fix cooling issues, compressor failures, ice maker problems, and thermostat malfunctions.",
    href: "/services/refrigerator-repair",
    features: ["Fridges & freezers", "Ice maker repair", "Parts in stock"]
  },
  {
    icon: Snowflake,
    title: "Preventive Maintenance",
    description: "Regular maintenance plans to keep your cooling systems running efficiently all year round. Prevent costly breakdowns and extend equipment lifespan.",
    href: "/services/maintenance",
    features: ["Annual tune-ups", "Filter replacement", "Efficiency checks"]
  },
  {
    icon: Clock,
    title: "Emergency Service",
    description: "24/7 emergency repair services. When your cooling fails, we're here to help—fast. No extra charge for evenings or weekends.",
    href: "/services/emergency",
    features: ["Available 24/7", "Fast response", "No overtime fees"]
  },
  {
    icon: ShieldCheck,
    title: "Warranty Service",
    description: "Authorized warranty service for major brands. Factory-trained technicians you can trust to handle your warranty repairs properly.",
    href: "/services/warranty",
    features: ["Factory authorized", "Genuine parts", "Warranty preserved"]
  },
  {
    icon: Wrench,
    title: "Commercial HVAC",
    description: "Commercial cooling solutions for businesses. Keep your customers and employees comfortable with our professional commercial services.",
    href: "/services/commercial",
    features: ["Offices & retail", "Restaurants", "Industrial cooling"]
  },
];

export default function Services() {
  return (
    <MainLayout>
      <PageHeader
        title="Our Services"
        description="Comprehensive AC and refrigerator repair services for homes and businesses. Professional, reliable, and affordable."
        breadcrumbs={[{ label: "Services" }]}
        variant="hero"
      />

      {/* Services Grid */}
      <section className="section bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link 
                key={service.href} 
                to={service.href}
                className="group block"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-frost/30">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-frost/10 text-frost transition-colors group-hover:bg-frost group-hover:text-frost-foreground">
                    <service.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-background-soft">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Our expert technicians can diagnose any cooling issue. Book a diagnostic visit 
              and we'll recommend the best solution for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/book">
                  Book Diagnostic Visit
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
