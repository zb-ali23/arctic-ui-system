import { Link } from "react-router-dom";
import { Check, ArrowRight, Phone } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Diagnostic Visit",
    price: "$79",
    period: "flat rate",
    description: "Professional diagnosis of your cooling system issues.",
    features: [
      "Complete system inspection",
      "Written diagnosis report",
      "Repair cost estimate",
      "Applied toward repair cost",
      "No obligation to repair"
    ],
    cta: "Book Diagnostic",
    popular: false
  },
  {
    name: "Standard Repair",
    price: "$149",
    period: "starting at",
    description: "Most common AC and refrigerator repairs.",
    features: [
      "Parts and labor included",
      "90-day repair warranty",
      "Same-day service available",
      "All major brands serviced",
      "Free follow-up check",
      "No hidden fees"
    ],
    cta: "Get a Quote",
    popular: true
  },
  {
    name: "Annual Maintenance",
    price: "$199",
    period: "per year",
    description: "Keep your systems running at peak efficiency.",
    features: [
      "2 annual tune-ups included",
      "Priority scheduling",
      "15% off all repairs",
      "Filter replacements included",
      "Extended warranty coverage",
      "Energy efficiency audit"
    ],
    cta: "Start Plan",
    popular: false
  }
];

const additionalServices = [
  { service: "AC Compressor Repair", price: "From $450" },
  { service: "Refrigerant Recharge", price: "From $150" },
  { service: "Thermostat Installation", price: "From $125" },
  { service: "Ice Maker Repair", price: "From $179" },
  { service: "Refrigerator Compressor", price: "From $399" },
  { service: "Emergency Service Fee", price: "$0 extra" },
];

export default function Pricing() {
  return (
    <MainLayout>
      <PageHeader
        title="Transparent Pricing"
        description="No hidden fees. No surprises. Just honest, upfront pricing for quality service."
        breadcrumbs={[{ label: "Pricing" }]}
        variant="hero"
      />

      {/* Main Pricing */}
      <section className="section bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                  plan.popular 
                    ? "border-frost bg-card shadow-lg scale-105 ring-2 ring-frost/20" 
                    : "border-border bg-card shadow hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-frost px-3 py-1 text-xs font-medium text-frost-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "frost" : "default"} 
                  className="w-full"
                  asChild
                >
                  <Link to="/book">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section bg-background-soft">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Service Pricing</h2>
            <p className="text-muted-foreground">
              Common repairs and their starting prices. Final pricing depends on your specific situation.
            </p>
          </div>
          
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {additionalServices.map((item) => (
                <div 
                  key={item.service}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">{item.service}</span>
                  <span className="text-frost font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            * All prices are estimates. Actual pricing provided after diagnosis.
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="section bg-background">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Our Price Match Guarantee
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Found a lower price from a licensed competitor? We'll match it! 
              Quality service at competitive prices, guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/book">
                  Book Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl">
                <Phone className="h-5 w-5" />
                (555) 123-4567
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
