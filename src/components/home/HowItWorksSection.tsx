import { Phone, ClipboardCheck, Wrench, ThumbsUp } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const stepIcons = [Phone, ClipboardCheck, Wrench, ThumbsUp];

export function HowItWorksSection() {
  const { howItWorks } = useWebsiteContent();

  const steps = Array.from({ length: 4 }, (_, i) => ({
    icon: stepIcons[i],
    step: String(i + 1).padStart(2, "0"),
    title: (howItWorks as any)[`step_${i + 1}_title`] as string,
    description: (howItWorks as any)[`step_${i + 1}_desc`] as string,
  }));

  return (
    <section className="section bg-background">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge={howItWorks.badge}
            title={howItWorks.title}
            description={howItWorks.description}
          />
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />

          <StaggerContainer className="space-y-8 lg:space-y-0" staggerDelay={0.15}>
            {steps.map((step, index) => (
              <StaggerItem key={step.step}>
                <div className={`flex items-center gap-8 lg:gap-16 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className={`p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow ${
                      index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                    } max-w-md`}>
                      <div className={`flex items-center gap-3 mb-3 ${
                        index % 2 === 0 ? "lg:flex-row-reverse" : ""
                      }`}>
                        <div className="w-10 h-10 rounded-xl bg-frost/10 text-frost flex items-center justify-center">
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-frost uppercase tracking-wider">
                          Step {step.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center justify-center relative z-10">
                    <div className="w-12 h-12 rounded-full bg-frost text-frost-foreground flex items-center justify-center font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
