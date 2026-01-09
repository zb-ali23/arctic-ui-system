import { Link, useParams } from "react-router-dom";
import { 
  Wind, 
  Thermometer, 
  Snowflake, 
  Clock, 
  ShieldCheck, 
  Wrench,
  Check,
  ArrowRight,
  Phone
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

const serviceData: Record<string, {
  icon: typeof Wind;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  pricing: { service: string; price: string }[];
}> = {
  "ac-repair": {
    icon: Wind,
    title: "AC Repair & Service",
    description: "Complete air conditioning repair, maintenance, and installation services.",
    longDescription: "Our certified technicians specialize in diagnosing and repairing all types of air conditioning systems. Whether your AC isn't cooling properly, making strange noises, or has stopped working entirely, we have the expertise to fix it quickly and affordably.",
    features: [
      "All major brands serviced (Carrier, Trane, Lennox, etc.)",
      "Central AC and ductless mini-split systems",
      "Compressor and motor repairs",
      "Refrigerant leak detection and recharge",
      "Thermostat installation and repair",
      "Ductwork inspection and repair"
    ],
    benefits: [
      "Same-day service available",
      "90-day labor warranty",
      "Upfront pricing with no hidden fees",
      "Factory-trained technicians",
      "EPA-certified for refrigerant handling"
    ],
    pricing: [
      { service: "Diagnostic Visit", price: "$79" },
      { service: "Basic AC Repair", price: "From $149" },
      { service: "Compressor Repair", price: "From $450" },
      { service: "Complete System Service", price: "From $199" }
    ]
  },
  "refrigerator-repair": {
    icon: Thermometer,
    title: "Refrigerator Repair",
    description: "Expert refrigerator and freezer repair services for all brands.",
    longDescription: "Don't let a broken refrigerator spoil your food and your day. Our technicians are trained to repair all types of refrigerators, from basic top-freezer models to high-end French door units. We carry common parts in our trucks for faster repairs.",
    features: [
      "All refrigerator types (side-by-side, French door, etc.)",
      "Freezer and ice maker repair",
      "Compressor and evaporator repair",
      "Temperature control issues",
      "Water dispenser and filter problems",
      "Strange noises and vibrations"
    ],
    benefits: [
      "Most repairs completed same day",
      "Parts carried on truck",
      "All major brands serviced",
      "90-day warranty on repairs",
      "Honest diagnostics"
    ],
    pricing: [
      { service: "Diagnostic Visit", price: "$79" },
      { service: "Basic Repair", price: "From $129" },
      { service: "Ice Maker Repair", price: "From $179" },
      { service: "Compressor Replacement", price: "From $399" }
    ]
  },
  "maintenance": {
    icon: Snowflake,
    title: "Preventive Maintenance",
    description: "Keep your cooling systems running efficiently with regular maintenance.",
    longDescription: "Prevention is the best medicine for your cooling systems. Our maintenance plans help you avoid costly breakdowns, improve energy efficiency, and extend the lifespan of your equipment. Regular maintenance can save you hundreds of dollars in emergency repairs.",
    features: [
      "Complete system inspection",
      "Coil cleaning and treatment",
      "Refrigerant level check",
      "Electrical connection inspection",
      "Filter replacement",
      "Performance optimization"
    ],
    benefits: [
      "Prevent costly breakdowns",
      "Lower energy bills",
      "Extend equipment lifespan",
      "Priority scheduling",
      "15% discount on repairs"
    ],
    pricing: [
      { service: "One-Time Tune-Up", price: "$129" },
      { service: "Annual Plan (2 visits)", price: "$199/year" },
      { service: "Premium Plan", price: "$349/year" }
    ]
  },
  "emergency": {
    icon: Clock,
    title: "Emergency Service",
    description: "24/7 emergency repair services when you need help fast.",
    longDescription: "Cooling emergencies don't wait for business hours, and neither do we. Our emergency team is available 24/7, 365 days a year. We understand that a broken AC in summer or a failing refrigerator full of food can't wait until morning.",
    features: [
      "Available 24 hours a day",
      "7 days a week, including holidays",
      "Fast response times",
      "Fully stocked service vehicles",
      "Experienced emergency technicians",
      "Temporary solutions if parts needed"
    ],
    benefits: [
      "No overtime or after-hours fees",
      "Average 60-minute response time",
      "Same quality service, day or night",
      "Licensed and insured technicians",
      "Upfront pricing before work begins"
    ],
    pricing: [
      { service: "Emergency Diagnostic", price: "$99" },
      { service: "Emergency Repairs", price: "Standard rates apply" }
    ]
  },
  "commercial": {
    icon: Wrench,
    title: "Commercial HVAC",
    description: "Professional cooling solutions for businesses of all sizes.",
    longDescription: "Keep your business comfortable and productive with our commercial HVAC services. From small offices to large retail spaces, restaurants, and industrial facilities, we have the expertise to handle commercial cooling systems of any size.",
    features: [
      "Rooftop units (RTUs)",
      "Split systems and VRF",
      "Walk-in coolers and freezers",
      "Restaurant refrigeration",
      "Server room cooling",
      "Industrial cooling systems"
    ],
    benefits: [
      "Minimal disruption to your business",
      "Flexible scheduling",
      "Maintenance contracts available",
      "Priority commercial support",
      "Energy efficiency audits"
    ],
    pricing: [
      { service: "Commercial Diagnostic", price: "$149" },
      { service: "Maintenance Contract", price: "Custom quote" },
      { service: "Emergency Service", price: "Available 24/7" }
    ]
  }
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <Button asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const Icon = service.icon;

  return (
    <MainLayout>
      <PageHeader
        title={service.title}
        description={service.description}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title }
        ]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-frost/10 text-frost mb-6">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.longDescription}
                </p>
              </div>

              {/* What We Fix */}
              <div>
                <h2 className="text-2xl font-bold mb-6">What We Service</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="rounded-full bg-accent/10 p-1 mt-0.5">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="rounded-full bg-frost/10 p-1 mt-0.5">
                        <Check className="h-4 w-4 text-frost" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sticky top-24">
                <h3 className="text-xl font-bold mb-4">Pricing</h3>
                <ul className="space-y-3 mb-6">
                  {service.pricing.map((item, i) => (
                    <li key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{item.service}</span>
                      <span className="font-semibold text-foreground">{item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3">
                  <Button variant="cta" size="lg" className="w-full" asChild>
                    <Link to="/book">
                      Book This Service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <Phone className="h-4 w-4" />
                    Call (555) 123-4567
                  </Button>
                </div>
              </div>

              {/* Emergency CTA */}
              <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
                <h4 className="font-semibold mb-2">Need Emergency Service?</h4>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  We're available 24/7 for cooling emergencies.
                </p>
                <Button variant="glass" className="w-full" asChild>
                  <Link to="/services/emergency">
                    Emergency Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
