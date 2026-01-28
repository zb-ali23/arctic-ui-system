import { MapPin } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

const serviceAreas = [
  { city: "Muscat", area: "Ruwi, Muttrah, Qurum", popular: true },
  { city: "Seeb", area: "Al Khuwair, Mawaleh", popular: true },
  { city: "Bawshar", area: "Al Amerat, Ghala", popular: true },
  { city: "Salalah", area: "Southern Oman", popular: true },
  { city: "Sohar", area: "Al Batinah North", popular: false },
  { city: "Nizwa", area: "Ad Dakhiliyah", popular: false },
  { city: "Sur", area: "Ash Sharqiyah", popular: false },
  { city: "Ibri", area: "Ad Dhahirah", popular: false },
];

export function ServiceAreasSection() {
  return (
    <section className="section bg-background-soft">
      <div className="container">
        <AnimatedSection>
          <SectionHeader 
            badge="Coverage"
            title="Service Areas"
            description="We proudly serve the entire greater metro area. Check if we cover your location."
          />
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.05}>
          {serviceAreas.map((area) => (
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
            Don't see your area? <a href="tel:+15551234567" className="text-frost font-medium hover:underline">Call us</a> to confirm coverage.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
