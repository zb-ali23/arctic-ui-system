import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Wind, 
  Thermometer, 
  Snowflake, 
  Clock, 
  Wrench, 
  ShieldCheck,
  ArrowRight,
  Filter
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/animated-section";

const categories = ["All", "AC", "Refrigerator", "Commercial"];

const services = [
  {
    icon: Wind,
    title: "AC Repair & Service",
    description: "Complete air conditioning repair, maintenance, and installation services for all brands and models.",
    category: "AC",
    href: "/services/ac-repair",
    features: ["All brands", "Same-day service", "90-day warranty"],
    price: "From $149"
  },
  {
    icon: Thermometer,
    title: "Refrigerator Repair",
    description: "Expert refrigerator and freezer repair services. We diagnose and fix cooling issues quickly.",
    category: "Refrigerator",
    href: "/services/refrigerator-repair",
    features: ["Fridges & freezers", "Ice maker repair", "Parts in stock"],
    price: "From $129"
  },
  {
    icon: Snowflake,
    title: "Preventive Maintenance",
    description: "Regular maintenance plans to keep your cooling systems running efficiently all year round.",
    category: "AC",
    href: "/services/maintenance",
    features: ["Annual tune-ups", "Filter replacement", "Efficiency checks"],
    price: "$199/year"
  },
  {
    icon: Clock,
    title: "Emergency Service",
    description: "24/7 emergency repair services. When your cooling fails, we're here to help—fast.",
    category: "AC",
    href: "/services/emergency",
    features: ["Available 24/7", "60-min response", "No overtime fees"],
    price: "Standard rates"
  },
  {
    icon: ShieldCheck,
    title: "Warranty Service",
    description: "Authorized warranty service for major brands. Factory-trained technicians you can trust.",
    category: "Refrigerator",
    href: "/services/warranty",
    features: ["Factory authorized", "Genuine parts", "Warranty preserved"],
    price: "Varies"
  },
  {
    icon: Wrench,
    title: "Commercial HVAC",
    description: "Commercial cooling solutions for businesses. Keep your customers and employees comfortable.",
    category: "Commercial",
    href: "/services/commercial",
    features: ["Offices & retail", "Restaurants", "Industrial"],
    price: "Custom quote"
  },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = activeCategory === "All" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <MainLayout>
      <PageHeader
        title="Our Services"
        description="Comprehensive AC and refrigerator repair services for homes and businesses."
        breadcrumbs={[{ label: "Services" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container">
          {/* Filter Buttons */}
          <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "frost" : "secondary"}
                size="lg"
                onClick={() => setActiveCategory(category)}
                className="gap-2"
              >
                {category === "All" && <Filter className="h-4 w-4" />}
                {category}
              </Button>
            ))}
          </AnimatedSection>

          {/* Services Grid */}
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <ScaleOnHover>
                  <Link to={service.href} className="block h-full">
                    <div className="group h-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-frost/30 transition-all duration-300">
                      {/* Header with Price */}
                      <div className="p-6 pb-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-frost/10 text-frost group-hover:bg-frost group-hover:text-frost-foreground transition-all">
                            <service.icon className="h-7 w-7" strokeWidth={1.5} />
                          </div>
                          <span className="text-sm font-semibold text-frost">{service.price}</span>
                        </div>
                        
                        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground mb-3">
                          {service.category}
                        </span>
                        
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="px-6 pb-6">
                        <ul className="space-y-2 mb-4">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          Learn More
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScaleOnHover>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-background-soft">
        <div className="container">
          <AnimatedSection>
            <div className="rounded-2xl bg-primary p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Not Sure What You Need?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Book a diagnostic visit and our experts will recommend the best solution.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero-cta" size="xl" asChild>
                  <Link to="/book">
                    Book Diagnostic
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="glass" size="xl" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
