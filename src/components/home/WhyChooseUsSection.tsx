import { 
  ShieldCheck, 
  Clock, 
  Award, 
  Wrench,
  DollarSign,
  Headphones
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

const features = [
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "We understand urgency. Most repairs completed within hours of your call."
  },
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    description: "Fully licensed, bonded, and insured for your complete peace of mind."
  },
  {
    icon: Award,
    title: "90-Day Warranty",
    description: "All repairs backed by our industry-leading 90-day parts and labor warranty."
  },
  {
    icon: DollarSign,
    title: "Upfront Pricing",
    description: "No surprises. Get a complete quote before any work begins."
  },
  {
    icon: Wrench,
    title: "Expert Technicians",
    description: "Factory-trained professionals with 10+ years average experience."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support and emergency service availability."
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="section bg-background-soft">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge="Why Choose Us"
            title="The CoolTech Difference"
            description="We're not just another repair service. Here's why thousands of customers trust us."
          />
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group flex gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-frost/20 transition-all duration-300">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-frost/10 text-frost flex items-center justify-center group-hover:bg-frost group-hover:text-frost-foreground transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
