import { MapPin } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

export function ServiceAreasSection() {
  const { serviceAreas, links } = useWebsiteContent();

  const areas = Array.from({ length: 8 }, (_, i) => ({
    city: (serviceAreas as any)[`area_${i + 1}_city`] as string,
    area: (serviceAreas as any)[`area_${i + 1}_detail`] as string,
    popular: i < 4,
  })).filter(a => a.city.trim() !== "");

  return (
    <section className="section bg-background-soft">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge={serviceAreas.badge}
            title={serviceAreas.title}
            description={serviceAreas.description}
          />
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.05}>
          {areas.map((area) => (
            <StaggerItem key={area.city}>
              <div className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                area.popular 
                  ? "bg-frost/5 border-frost/20 hover:bg-frost/10 hover:border-frost/40"
                  : "bg-card border-border hover:bg-muted hover:border-muted-foreground/20"
              }`}>
                <div className="flex items-start gap-3">
                  <MapPin className={`h-5 w-5 mt-0.5 ${
                    area.popular ? "text-frost" : "text-muted-foreground"
                  }`} />
                  <div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {area.city}
                    </div>
                    <div className="text-xs text-muted-foreground">{area.area}</div>
                    {area.popular && (
                      <span className="inline-block mt-2 text-xs bg-frost/20 text-frost px-2 py-0.5 rounded-full">
                        Popular Area
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.3} className="text-center mt-8">
          <p className="text-muted-foreground">
            {serviceAreas.footer_text.includes("Call us") ? (
              <>
                {serviceAreas.footer_text.split("Call us")[0]}
                <a href={`tel:${links.phone_number}`} className="text-frost font-medium hover:underline">Call us</a>
                {serviceAreas.footer_text.split("Call us")[1]}
              </>
            ) : serviceAreas.footer_text}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
