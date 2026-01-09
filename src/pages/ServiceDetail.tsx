import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Wind, 
  Thermometer, 
  Snowflake, 
  Clock, 
  ShieldCheck, 
  Wrench,
  Check,
  ArrowRight,
  Phone,
  Star,
  Users,
  BadgeCheck
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { ReviewCard } from "@/components/ui/review-card";

const serviceData: Record<string, {
  icon: typeof Wind;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: { icon: typeof Check; title: string; description: string }[];
  pricing: { service: string; price: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "ac-repair": {
    icon: Wind,
    title: "AC Repair & Service",
    description: "Complete air conditioning repair, maintenance, and installation services.",
    longDescription: "Our certified technicians specialize in diagnosing and repairing all types of air conditioning systems. Whether your AC isn't cooling properly, making strange noises, or has stopped working entirely, we have the expertise to fix it quickly and affordably. We service all major brands including Carrier, Trane, Lennox, Goodman, and more.",
    features: [
      "Central AC and ductless mini-split systems",
      "Compressor and motor repairs",
      "Refrigerant leak detection and recharge",
      "Thermostat installation and repair",
      "Ductwork inspection and repair",
      "Complete system diagnostics",
      "Energy efficiency optimization",
      "Filter replacement and cleaning"
    ],
    benefits: [
      { icon: Clock, title: "Same-Day Service", description: "Most repairs completed within hours" },
      { icon: ShieldCheck, title: "90-Day Warranty", description: "Parts and labor guaranteed" },
      { icon: BadgeCheck, title: "Licensed Pros", description: "Factory-trained technicians" },
      { icon: Users, title: "5,000+ Customers", description: "Trusted by the community" }
    ],
    pricing: [
      { service: "Diagnostic Visit", price: "$79" },
      { service: "Basic AC Repair", price: "From $149" },
      { service: "Compressor Repair", price: "From $450" },
      { service: "Refrigerant Recharge", price: "From $150" },
      { service: "Complete System Service", price: "From $199" }
    ],
    faqs: [
      { q: "How quickly can you come out?", a: "We offer same-day service for most repairs. Emergency service available 24/7." },
      { q: "Do you service all AC brands?", a: "Yes! We service all major brands including Carrier, Trane, Lennox, and more." },
      { q: "What's included in the diagnostic?", a: "Complete system inspection, written diagnosis, and repair estimate." }
    ]
  },
  "refrigerator-repair": {
    icon: Thermometer,
    title: "Refrigerator Repair",
    description: "Expert refrigerator and freezer repair services for all brands.",
    longDescription: "Don't let a broken refrigerator spoil your food and your day. Our technicians are trained to repair all types of refrigerators, from basic top-freezer models to high-end French door units. We carry common parts in our trucks for faster repairs and can fix most issues in a single visit.",
    features: [
      "All refrigerator types (side-by-side, French door, etc.)",
      "Freezer and ice maker repair",
      "Compressor and evaporator repair",
      "Temperature control issues",
      "Water dispenser and filter problems",
      "Strange noises and vibrations",
      "Door seal replacement",
      "Defrost system repairs"
    ],
    benefits: [
      { icon: Clock, title: "Fast Repairs", description: "Most repairs same day" },
      { icon: Wrench, title: "Parts On Truck", description: "Common parts in stock" },
      { icon: ShieldCheck, title: "All Brands", description: "Samsung, LG, GE & more" },
      { icon: Star, title: "4.9 Rating", description: "500+ 5-star reviews" }
    ],
    pricing: [
      { service: "Diagnostic Visit", price: "$79" },
      { service: "Basic Repair", price: "From $129" },
      { service: "Ice Maker Repair", price: "From $179" },
      { service: "Compressor Replacement", price: "From $399" },
      { service: "Thermostat Repair", price: "From $149" }
    ],
    faqs: [
      { q: "Can you fix any refrigerator brand?", a: "Yes, we service all major brands including Samsung, LG, Whirlpool, GE, and more." },
      { q: "How long does a repair take?", a: "Most repairs are completed in 1-2 hours. Complex repairs may take longer." },
      { q: "Should I repair or replace my fridge?", a: "We'll give you an honest assessment. Generally, if repair costs exceed 50% of replacement, we recommend replacing." }
    ]
  },
  "maintenance": {
    icon: Snowflake,
    title: "Preventive Maintenance",
    description: "Keep your cooling systems running efficiently with regular maintenance.",
    longDescription: "Prevention is the best medicine for your cooling systems. Our maintenance plans help you avoid costly breakdowns, improve energy efficiency, and extend the lifespan of your equipment. Regular maintenance can save you hundreds of dollars in emergency repairs and reduce your energy bills by up to 15%.",
    features: [
      "Complete system inspection",
      "Coil cleaning and treatment",
      "Refrigerant level check",
      "Electrical connection inspection",
      "Filter replacement",
      "Performance optimization",
      "Safety system testing",
      "Written condition report"
    ],
    benefits: [
      { icon: ShieldCheck, title: "Prevent Breakdowns", description: "Catch issues before they fail" },
      { icon: Wrench, title: "Lower Bills", description: "Improved efficiency" },
      { icon: Clock, title: "Priority Service", description: "Skip the line when you need us" },
      { icon: Star, title: "15% Off Repairs", description: "Plan member discount" }
    ],
    pricing: [
      { service: "One-Time Tune-Up", price: "$129" },
      { service: "Annual Plan (2 visits)", price: "$199/year" },
      { service: "Premium Plan (4 visits)", price: "$349/year" }
    ],
    faqs: [
      { q: "How often should I have maintenance?", a: "We recommend at least once per year, ideally in spring before heavy use." },
      { q: "What's included in maintenance?", a: "Cleaning, inspection, refrigerant check, electrical testing, and performance optimization." },
      { q: "Is a maintenance plan worth it?", a: "Yes! It prevents 80% of breakdowns and includes repair discounts that quickly pay for the plan." }
    ]
  },
  "emergency": {
    icon: Clock,
    title: "Emergency Service",
    description: "24/7 emergency repair services when you need help fast.",
    longDescription: "Cooling emergencies don't wait for business hours, and neither do we. Our emergency team is available 24/7, 365 days a year. We understand that a broken AC in summer or a failing refrigerator full of food can't wait until morning. Our average response time is just 60 minutes.",
    features: [
      "Available 24 hours a day, 7 days a week",
      "Including holidays",
      "Fast response times (avg. 60 min)",
      "Fully stocked service vehicles",
      "Experienced emergency technicians",
      "Temporary solutions if parts needed"
    ],
    benefits: [
      { icon: Clock, title: "60-Min Response", description: "Average arrival time" },
      { icon: ShieldCheck, title: "No Overtime Fees", description: "Same rates, any time" },
      { icon: Wrench, title: "Parts On Hand", description: "Common parts in stock" },
      { icon: Phone, title: "Live Dispatch", description: "Real person answers" }
    ],
    pricing: [
      { service: "Emergency Diagnostic", price: "$99" },
      { service: "Emergency Repairs", price: "Standard rates" }
    ],
    faqs: [
      { q: "Is there an extra charge for nights/weekends?", a: "No! We charge the same rates 24/7. No overtime or after-hours fees." },
      { q: "How fast can you get here?", a: "Our average response time is 60 minutes. We prioritize based on urgency." },
      { q: "What if you need to order parts?", a: "We carry common parts on our trucks. If special parts are needed, we can often provide a temporary solution." }
    ]
  },
  "commercial": {
    icon: Wrench,
    title: "Commercial HVAC",
    description: "Professional cooling solutions for businesses of all sizes.",
    longDescription: "Keep your business comfortable and productive with our commercial HVAC services. From small offices to large retail spaces, restaurants, and industrial facilities, we have the expertise to handle commercial cooling systems of any size. We offer flexible scheduling to minimize disruption to your operations.",
    features: [
      "Rooftop units (RTUs)",
      "Split systems and VRF",
      "Walk-in coolers and freezers",
      "Restaurant refrigeration",
      "Server room cooling",
      "Industrial cooling systems",
      "Preventive maintenance contracts",
      "Energy efficiency audits"
    ],
    benefits: [
      { icon: Clock, title: "Flexible Hours", description: "After-hours service available" },
      { icon: ShieldCheck, title: "Minimal Disruption", description: "Keep your business running" },
      { icon: Wrench, title: "All Systems", description: "RTUs, VRF, chillers & more" },
      { icon: Users, title: "Contract Options", description: "Ongoing maintenance plans" }
    ],
    pricing: [
      { service: "Commercial Diagnostic", price: "$149" },
      { service: "Maintenance Contract", price: "Custom quote" },
      { service: "Emergency Service", price: "Available 24/7" }
    ],
    faqs: [
      { q: "Do you work after business hours?", a: "Yes! We can schedule work during off-hours to minimize disruption to your business." },
      { q: "What commercial systems do you service?", a: "All types including RTUs, split systems, VRF, chillers, walk-in coolers, and more." },
      { q: "Do you offer maintenance contracts?", a: "Yes, we offer customized maintenance contracts with priority service and discounted rates." }
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

      {/* Main Content */}
      <section className="section bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* About Section */}
              <AnimatedSection>
                <div className="flex items-start gap-6">
                  <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-frost/10 text-frost">
                    <Icon className="h-10 w-10" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {service.longDescription}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Benefits Grid */}
              <AnimatedSection delay={0.1}>
                <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
                <StaggerContainer className="grid sm:grid-cols-2 gap-4" staggerDelay={0.1}>
                  {service.benefits.map((benefit) => (
                    <StaggerItem key={benefit.title}>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-lg bg-frost/10 text-frost flex items-center justify-center shrink-0">
                          <benefit.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </AnimatedSection>

              {/* What We Fix */}
              <AnimatedSection delay={0.2}>
                <h2 className="text-2xl font-bold mb-6">What We Service</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="rounded-full bg-accent/10 p-1">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              {/* FAQs */}
              <AnimatedSection delay={0.3}>
                <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="p-5 rounded-xl border border-border bg-card"
                    >
                      <h4 className="font-semibold mb-2">{faq.q}</h4>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <AnimatedSection direction="right">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Service Pricing</h3>
                  <ul className="space-y-3 mb-6">
                    {service.pricing.map((item, i) => (
                      <li key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{item.service}</span>
                        <span className="font-semibold text-frost">{item.price}</span>
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
                      (555) 123-4567
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free estimates • No hidden fees
                  </p>
                </div>
              </AnimatedSection>

              {/* Trust Card */}
              <AnimatedSection direction="right" delay={0.2}>
                <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
                  <h4 className="font-semibold mb-3">Our Guarantee</h4>
                  <ul className="space-y-2 text-sm text-primary-foreground/90">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-frost" /> 90-day warranty on all repairs
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-frost" /> Upfront pricing, no surprises
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-frost" /> Licensed & insured technicians
                    </li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section bg-background-soft">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
            <p className="text-muted-foreground">See what our customers say about this service</p>
          </AnimatedSection>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            <StaggerItem>
              <ReviewCard 
                name="Sarah J." 
                rating={5} 
                review="Fixed my AC in under 2 hours. Professional and friendly service!"
                date="1 week ago"
              />
            </StaggerItem>
            <StaggerItem>
              <ReviewCard 
                name="Mike C." 
                rating={5} 
                review="Best repair service I've used. Fair prices and quality work."
                date="2 weeks ago"
              />
            </StaggerItem>
            <StaggerItem>
              <ReviewCard 
                name="Emily R." 
                rating={5} 
                review="Same-day service saved my groceries! Highly recommend."
                date="1 month ago"
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-frost">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-frost-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-frost-foreground/80 mb-8 max-w-xl mx-auto">
              Book your {service.title.toLowerCase()} today and experience the CoolTech difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="xl" className="bg-white text-frost hover:bg-white/90" asChild>
                <Link to="/book">
                  Book Now <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="h-5 w-5" /> Call Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
