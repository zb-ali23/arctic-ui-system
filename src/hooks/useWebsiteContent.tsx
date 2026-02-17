import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HeroContent {
  badge_text: string;
  headline_line1: string;
  headline_line2: string;
  subtext: string;
  cta_primary: string;
  cta_phone: string;
  trust_badge_1: string;
  trust_badge_2: string;
  trust_badge_3: string;
  rating_value: string;
  rating_text: string;
  rating_reviews: string;
}

export interface StatsContent {
  customers_count: string;
  customers_label: string;
  repairs_count: string;
  repairs_label: string;
  experience_count: string;
  experience_label: string;
  rating_value: string;
  rating_label: string;
}

export interface WhyChooseUsContent {
  section_title: string;
  section_description: string;
  feature_1_title: string;
  feature_1_desc: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_3_title: string;
  feature_3_desc: string;
  feature_4_title: string;
  feature_4_desc: string;
}

export interface EmergencyContent {
  title: string;
  description: string;
  cta_text: string;
  phone: string;
  response_time: string;
}

export interface FooterContent {
  company_description: string;
  copyright_text: string;
}

export interface QuickContactContent {
  strip_text: string;
  whatsapp_number: string;
  phone: string;
}

export interface FinalCTAContent {
  headline_line1: string;
  headline_line2: string;
  description: string;
  cta_primary: string;
  cta_phone: string;
  phone_display: string;
}

export interface WebsiteContent {
  hero: HeroContent;
  stats: StatsContent;
  whyChooseUs: WhyChooseUsContent;
  emergency: EmergencyContent;
  footer: FooterContent;
  quickContact: QuickContactContent;
  finalCTA: FinalCTAContent;
  loading: boolean;
}

const defaultHero: HeroContent = {
  badge_text: "Trusted by 5,000+ Customers",
  headline_line1: "Expert Cooling",
  headline_line2: "Repair Services",
  subtext: "Professional AC & refrigerator repair with same-day service. Fast diagnosis, fair pricing, and a 90-day warranty on all repairs.",
  cta_primary: "Book Service Now",
  cta_phone: "+968 9123 4567",
  trust_badge_1: "24/7 Emergency",
  trust_badge_2: "Licensed & Insured",
  trust_badge_3: "90-Day Warranty",
  rating_value: "4.9★",
  rating_text: "Customer Rating",
  rating_reviews: "Based on 500+ reviews",
};

const defaultStats: StatsContent = {
  customers_count: "5000",
  customers_label: "Happy Customers",
  repairs_count: "15000",
  repairs_label: "Repairs Completed",
  experience_count: "15",
  experience_label: "Years Experience",
  rating_value: "4.9",
  rating_label: "Customer Rating",
};

const defaultWhyChooseUs: WhyChooseUsContent = {
  section_title: "The CoolTech Difference",
  section_description: "We're not just another repair service. Here's why thousands of customers trust us.",
  feature_1_title: "Same-Day Service",
  feature_1_desc: "We understand urgency. Most repairs completed within hours of your call.",
  feature_2_title: "Licensed & Insured",
  feature_2_desc: "Fully licensed, bonded, and insured for your complete peace of mind.",
  feature_3_title: "90-Day Warranty",
  feature_3_desc: "All repairs backed by our industry-leading 90-day parts and labor warranty.",
  feature_4_title: "Upfront Pricing",
  feature_4_desc: "No surprises. Get a complete quote before any work begins.",
};

const defaultEmergency: EmergencyContent = {
  title: "24/7 Emergency",
  description: "AC down on the hottest day? Refrigerator failing? We're available around the clock. Fast response, no overtime charges.",
  cta_text: "Call Now",
  phone: "+968 9123 4567",
  response_time: "60-Min Average Response",
};

const defaultFooter: FooterContent = {
  company_description: "Professional AC and refrigerator repair services. Fast, reliable, and affordable cooling solutions for homes and businesses since 2010.",
  copyright_text: "CoolTech Services",
};

const defaultQuickContact: QuickContactContent = {
  strip_text: "24/7 Emergency Service Available",
  whatsapp_number: "96891234567",
  phone: "+968 9123 4567",
};

const defaultFinalCTA: FinalCTAContent = {
  headline_line1: "Don't Sweat It.",
  headline_line2: "We've Got You Covered.",
  description: "Join thousands of satisfied customers who trust CoolTech for all their cooling needs. Fast service, fair prices, guaranteed satisfaction.",
  cta_primary: "Book Your Service Today",
  cta_phone: "tel:+96891234567",
  phone_display: "+968 9123 4567",
};

const WebsiteContentContext = createContext<WebsiteContent>({
  hero: defaultHero,
  stats: defaultStats,
  whyChooseUs: defaultWhyChooseUs,
  emergency: defaultEmergency,
  footer: defaultFooter,
  quickContact: defaultQuickContact,
  finalCTA: defaultFinalCTA,
  loading: true,
});

export function WebsiteContentProvider({ children }: { children: ReactNode }) {
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [stats, setStats] = useState<StatsContent>(defaultStats);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsContent>(defaultWhyChooseUs);
  const [emergency, setEmergency] = useState<EmergencyContent>(defaultEmergency);
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [quickContact, setQuickContact] = useState<QuickContactContent>(defaultQuickContact);
  const [finalCTA, setFinalCTA] = useState<FinalCTAContent>(defaultFinalCTA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("system_settings")
          .select("key, value")
          .in("key", [
            "website_hero",
            "website_stats",
            "website_why_choose_us",
            "website_emergency",
            "website_footer",
            "website_quick_contact",
            "website_final_cta",
          ]);

        if (error) throw error;

        data?.forEach((item) => {
          const val = item.value as Record<string, string>;
          switch (item.key) {
            case "website_hero": setHero((prev) => ({ ...prev, ...val })); break;
            case "website_stats": setStats((prev) => ({ ...prev, ...val })); break;
            case "website_why_choose_us": setWhyChooseUs((prev) => ({ ...prev, ...val })); break;
            case "website_emergency": setEmergency((prev) => ({ ...prev, ...val })); break;
            case "website_footer": setFooter((prev) => ({ ...prev, ...val })); break;
            case "website_quick_contact": setQuickContact((prev) => ({ ...prev, ...val })); break;
            case "website_final_cta": setFinalCTA((prev) => ({ ...prev, ...val })); break;
          }
        });
      } catch (error) {
        console.error("Error fetching website content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <WebsiteContentContext.Provider value={{ hero, stats, whyChooseUs, emergency, footer, quickContact, finalCTA, loading }}>
      {children}
    </WebsiteContentContext.Provider>
  );
}

export function useWebsiteContent() {
  return useContext(WebsiteContentContext);
}
