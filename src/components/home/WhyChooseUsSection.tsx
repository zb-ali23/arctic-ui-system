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
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const featureIcons = [Clock, ShieldCheck, Award, DollarSign, Wrench, Headphones];

export function WhyChooseUsSection() {
  const { whyChooseUs } = useWebsiteContent();

  const features = [
    { icon: featureIcons[0], title: whyChooseUs.feature_1_title, description: whyChooseUs.feature_1_desc },
    { icon: featureIcons[1], title: whyChooseUs.feature_2_title, description: whyChooseUs.feature_2_desc },
    { icon: featureIcons[2], title: whyChooseUs.feature_3_title, description: whyChooseUs.feature_3_desc },
    { icon: featureIcons[3], title: whyChooseUs.feature_4_title, description: whyChooseUs.feature_4_desc },
  ];

  return (
    <section className="section bg-background-soft">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge="Why Choose Us"
            title={whyChooseUs.section_title}
            description={whyChooseUs.section_description}
          />
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-2 gap-8" staggerDelay={0.1}>
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
