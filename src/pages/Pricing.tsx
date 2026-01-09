import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, ShieldCheck, Star, HelpCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

const pricingPlans = [
  {
    name: "Diagnostic",
    price: "$79",
    period: "flat rate",
    description: "Professional diagnosis of your cooling system.",
    features: [
      "Complete system inspection",
      "Written diagnosis report",
      "Repair cost estimate",
      "Applied toward repair",
      "No obligation"
    ],
    cta: "Book Diagnostic",
    popular: false,
    color: "default"
  },
  {
    name: "Standard Repair",
    price: "$149",
    period: "starting at",
    description: "Most common AC and refrigerator repairs.",
    features: [
      "Parts and labor included",
      "90-day repair warranty",
      "Same-day service",
      "All major brands",
      "Free follow-up check",
      "No hidden fees"
    ],
    cta: "Get a Quote",
    popular: true,
    color: "frost"
  },
  {
    name: "Maintenance Plan",
    price: "$199",
    period: "per year",
    description: "Keep your systems running efficiently.",
    features: [
      "2 annual tune-ups",
      "Priority scheduling",
      "15% off all repairs",
      "Filter replacements",
      "Extended warranty",
      "Energy audit"
    ],
    cta: "Start Plan",
    popular: false,
    color: "accent"
  }
];

const additionalServices = [
  { service: "AC Compressor Repair", price: "From $450" },
  { service: "Refrigerant Recharge", price: "From $150" },
  { service: "Thermostat Installation", price: "From $125" },
  { service: "Ice Maker Repair", price: "From $179" },
  { service: "Refrigerator Compressor", price: "From $399" },
  { service: "Ductwork Repair", price: "From $200" },
  { service: "Emergency After-Hours", price: "$0 extra" },
  { service: "Commercial Diagnostic", price: "$149" }
];

const faqs = [
  { q: "Is the diagnostic fee refundable?", a: "The $79 diagnostic fee is applied toward any repairs you choose to complete with us." },
  { q: "Are there any hidden fees?", a: "Never. We provide upfront pricing before any work begins. No surprises." },
  { q: "What's covered by the warranty?", a: "Our 90-day warranty covers both parts and labor on all repairs we perform." }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <MainLayout>
      <PageHeader
        title="Transparent Pricing"
        description="No hidden fees. No surprises. Just honest pricing for quality service."
        breadcrumbs={[{ label: "Pricing" }]}
        variant="hero"
      />

      {/* Main Pricing */}
      <section className="section bg-background">
        <div className="container">
          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
            {pricingPlans.map((plan) => (
              <StaggerItem key={plan.name}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className={`relative h-full rounded-2xl border p-6 transition-all duration-300 ${
                    plan.popular 
                      ? "border-frost bg-card shadow-xl ring-2 ring-frost/20 scale-105" 
                      : "border-border bg-card shadow-sm hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-frost px-4 py-1 text-xs font-semibold text-frost-foreground flex items-center gap-1">
                        <Star className="h-3 w-3" /> Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 shrink-0 ${plan.popular ? "text-frost" : "text-accent"}`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.popular ? "frost" : "default"} 
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link to="/book">{plan.cta}</Link>
                  </Button>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section bg-background-soft">
        <div className="container max-w-4xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Service Pricing</h2>
            <p className="text-muted-foreground">Common repairs and their starting prices.</p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="divide-y divide-border">
                {additionalServices.map((item, i) => (
                  <motion.div 
                    key={item.service}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{item.service}</span>
                    <span className="text-frost font-semibold">{item.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            * Final pricing provided after diagnosis. All estimates are free.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-background">
        <div className="container max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pricing FAQs</h2>
          </AnimatedSection>
          
          <StaggerContainer className="space-y-4" staggerDelay={0.1}>
            {faqs.map((faq) => (
              <StaggerItem key={faq.q}>
                <div className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-frost shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{faq.q}</h4>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Guarantee */}
      <section className="section bg-primary">
        <div className="container text-center">
          <AnimatedSection>
            <ShieldCheck className="h-16 w-16 text-frost mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Our Price Match Guarantee
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Found a lower price from a licensed competitor? We'll match it!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/book">Book Now <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="glass" size="xl">
                <Phone className="h-5 w-5" /> (555) 123-4567
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
