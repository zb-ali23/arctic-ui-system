import { MainLayout } from "@/components/layout/MainLayout";
import { QuickContactStrip } from "@/components/home/QuickContactStrip";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { EmergencySection } from "@/components/home/EmergencySection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ServiceAreasSection } from "@/components/home/ServiceAreasSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

export default function Index() {
  return (
    <MainLayout>
      {/* Quick Contact Strip - Sticky on Scroll */}
      <QuickContactStrip />
      
      {/* 1. Hero Section */}
      <HeroSection />
      
      {/* 2. Services Overview */}
      <ServicesSection />
      
      {/* 3. Why Choose Us */}
      <WhyChooseUsSection />
      
      {/* 4. How It Works */}
      <HowItWorksSection />
      
      {/* 5. Emergency Service Section */}
      <EmergencySection />
      
      {/* 6. Brands We Repair */}
      <BrandsSection />
      
      {/* 7. Stats Section with Animated Counters */}
      <StatsSection />
      
      {/* 8. Testimonials Carousel */}
      <TestimonialsSection />
      
      {/* 9. Service Areas */}
      <ServiceAreasSection />
      
      {/* 10. Final CTA */}
      <FinalCTASection />
    </MainLayout>
  );
}
