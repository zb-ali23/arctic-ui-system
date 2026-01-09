import { 
  Phone, 
  ClipboardCheck, 
  Wrench, 
  ThumbsUp 
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: Phone,
    step: "01",
    title: "Book a Service",
    description: "Call us or book online. We'll schedule a convenient time that works for you."
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Expert Diagnosis",
    description: "Our technician arrives on time, diagnoses the issue, and provides an upfront quote."
  },
  {
    icon: Wrench,
    step: "03",
    title: "Professional Repair",
    description: "With your approval, we complete the repair using quality parts and expert techniques."
  },
  {
    icon: ThumbsUp,
    step: "04",
    title: "Satisfaction Guaranteed",
    description: "We test everything thoroughly and back our work with a 90-day warranty."
  }
];

export function HowItWorksSection() {
  return (
    <section className="section bg-background">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge="How It Works"
            title="Simple, Hassle-Free Service"
            description="Getting your cooling systems fixed has never been easier."
          />
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />

          <StaggerContainer className="space-y-8 lg:space-y-0" staggerDelay={0.15}>
            {steps.map((step, index) => (
              <StaggerItem key={step.step}>
                <div className={`flex items-center gap-8 lg:gap-16 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}>
                  {/* Content */}
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

                  {/* Center Dot */}
                  <div className="hidden lg:flex items-center justify-center relative z-10">
                    <div className="w-12 h-12 rounded-full bg-frost text-frost-foreground flex items-center justify-center font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  {/* Spacer */}
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
