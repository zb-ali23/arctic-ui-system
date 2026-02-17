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
  whatsapp_link: string;
  phone_link: string;
}

export interface LinksContent {
  whatsapp_number: string;
  phone_number: string;
  phone_display: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  google_maps_url: string;
  email: string;
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

export interface ServicesSectionContent {
  badge: string;
  title: string;
  description: string;
  service_1_title: string;
  service_1_desc: string;
  service_1_category: string;
  service_2_title: string;
  service_2_desc: string;
  service_2_category: string;
  service_3_title: string;
  service_3_desc: string;
  service_3_category: string;
  service_4_title: string;
  service_4_desc: string;
  service_4_category: string;
  service_5_title: string;
  service_5_desc: string;
  service_5_category: string;
  service_6_title: string;
  service_6_desc: string;
  service_6_category: string;
  view_all_text: string;
}

export interface HowItWorksContent {
  badge: string;
  title: string;
  description: string;
  step_1_title: string;
  step_1_desc: string;
  step_2_title: string;
  step_2_desc: string;
  step_3_title: string;
  step_3_desc: string;
  step_4_title: string;
  step_4_desc: string;
}

export interface ServiceAreasContent {
  badge: string;
  title: string;
  description: string;
  area_1_city: string;
  area_1_detail: string;
  area_2_city: string;
  area_2_detail: string;
  area_3_city: string;
  area_3_detail: string;
  area_4_city: string;
  area_4_detail: string;
  area_5_city: string;
  area_5_detail: string;
  area_6_city: string;
  area_6_detail: string;
  area_7_city: string;
  area_7_detail: string;
  area_8_city: string;
  area_8_detail: string;
  footer_text: string;
}

export interface BrandsContent {
  badge: string;
  title: string;
  brands_list: string; // comma separated
}

export interface AboutPageContent {
  page_title: string;
  page_description: string;
  story_badge: string;
  story_title: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  story_paragraph_3: string;
  certifications: string; // comma separated
  milestone_badge: string;
  milestone_title: string;
  values_badge: string;
  values_title: string;
  value_1_title: string;
  value_1_desc: string;
  value_2_title: string;
  value_2_desc: string;
  value_3_title: string;
  value_3_desc: string;
  value_4_title: string;
  value_4_desc: string;
  cta_title: string;
  cta_description: string;
}

export interface ContactPageContent {
  page_title: string;
  page_description: string;
  phone_value: string;
  phone_hours: string;
  email_value: string;
  email_response: string;
  whatsapp_text: string;
  emergency_text: string;
  service_area_title: string;
  service_area_description: string;
  form_title: string;
}

// --- Defaults ---
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
  whatsapp_link: "https://wa.me/96891234567",
  phone_link: "tel:+96891234567",
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

const defaultLinks: LinksContent = {
  whatsapp_number: "96891234567",
  phone_number: "+96891234567",
  phone_display: "+968 9123 4567",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  linkedin_url: "",
  google_maps_url: "",
  email: "info@cooltech.com",
};

export const defaultServicesSection: ServicesSectionContent = {
  badge: "Our Services",
  title: "Professional Cooling Solutions",
  description: "From quick fixes to complete overhauls, we handle all your AC and refrigerator needs with expertise.",
  service_1_title: "AC Repair",
  service_1_desc: "Expert diagnosis and repair for all AC brands. Cooling issues, compressor problems, and more.",
  service_1_category: "AC",
  service_2_title: "Refrigerator Repair",
  service_2_desc: "Complete fridge and freezer repair. Ice makers, cooling issues, and compressor fixes.",
  service_2_category: "Refrigerator",
  service_3_title: "AC Maintenance",
  service_3_desc: "Preventive maintenance to keep your AC running efficiently all season long.",
  service_3_category: "AC",
  service_4_title: "Emergency Service",
  service_4_desc: "24/7 emergency repairs when you need help fast. No overtime charges.",
  service_4_category: "Both",
  service_5_title: "Installation",
  service_5_desc: "Professional installation of new AC units and refrigerators with warranty.",
  service_5_category: "Both",
  service_6_title: "Warranty Service",
  service_6_desc: "Authorized warranty repairs for major brands. Factory-trained technicians.",
  service_6_category: "Both",
  view_all_text: "View All Services",
};

export const defaultHowItWorks: HowItWorksContent = {
  badge: "How It Works",
  title: "Simple, Hassle-Free Service",
  description: "Getting your cooling systems fixed has never been easier.",
  step_1_title: "Book a Service",
  step_1_desc: "Call us or book online. We'll schedule a convenient time that works for you.",
  step_2_title: "Expert Diagnosis",
  step_2_desc: "Our technician arrives on time, diagnoses the issue, and provides an upfront quote.",
  step_3_title: "Professional Repair",
  step_3_desc: "With your approval, we complete the repair using quality parts and expert techniques.",
  step_4_title: "Satisfaction Guaranteed",
  step_4_desc: "We test everything thoroughly and back our work with a 90-day warranty.",
};

export const defaultServiceAreas: ServiceAreasContent = {
  badge: "Coverage",
  title: "Service Areas",
  description: "We proudly serve the entire greater metro area. Check if we cover your location.",
  area_1_city: "Muscat",
  area_1_detail: "Ruwi, Muttrah, Qurum",
  area_2_city: "Seeb",
  area_2_detail: "Al Khuwair, Mawaleh",
  area_3_city: "Bawshar",
  area_3_detail: "Al Amerat, Ghala",
  area_4_city: "Salalah",
  area_4_detail: "Southern Oman",
  area_5_city: "Sohar",
  area_5_detail: "Al Batinah North",
  area_6_city: "Nizwa",
  area_6_detail: "Ad Dakhiliyah",
  area_7_city: "Sur",
  area_7_detail: "Ash Sharqiyah",
  area_8_city: "Ibri",
  area_8_detail: "Ad Dhahirah",
  footer_text: "Don't see your area? Call us to confirm coverage.",
};

export const defaultBrands: BrandsContent = {
  badge: "All Major Brands",
  title: "Brands We Service",
  brands_list: "Carrier,Trane,Lennox,Goodman,Rheem,York,Samsung,LG,Whirlpool,GE,Frigidaire,Maytag",
};

export const defaultAboutPage: AboutPageContent = {
  page_title: "About CoolTech",
  page_description: "Trusted cooling experts serving our community since 2010.",
  story_badge: "Our Story",
  story_title: "Built on Trust, Driven by Excellence",
  story_paragraph_1: "CoolTech Services was founded in 2010 by Michael Torres, a veteran HVAC technician who saw an opportunity to bring honest, reliable cooling repair services to our community.",
  story_paragraph_2: "What started as a one-man operation working out of a single service van has grown into a trusted team of certified professionals serving thousands of homes and businesses across the greater metro area.",
  story_paragraph_3: "Our commitment to quality workmanship, fair pricing, and exceptional customer service has earned us thousands of 5-star reviews and a reputation as the go-to cooling experts.",
  certifications: "EPA Certified,NATE Certified,BBB A+ Rating,Licensed & Bonded,Fully Insured,Factory Authorized",
  milestone_badge: "Our Journey",
  milestone_title: "Company Milestones",
  values_badge: "Our Values",
  values_title: "What We Stand For",
  value_1_title: "Excellence",
  value_1_desc: "We strive for excellence in every repair, ensuring your systems work like new.",
  value_2_title: "Customer First",
  value_2_desc: "Your satisfaction is our priority. We treat every customer like family.",
  value_3_title: "Integrity",
  value_3_desc: "Honest diagnostics, fair pricing, and transparent communication every time.",
  value_4_title: "Innovation",
  value_4_desc: "We stay current with the latest technologies and repair techniques.",
  cta_title: "Ready to Experience the CoolTech Difference?",
  cta_description: "Join thousands of satisfied customers who trust CoolTech.",
};

export const defaultContactPage: ContactPageContent = {
  page_title: "Contact Us",
  page_description: "Get in touch with our team. We're here to help.",
  phone_value: "+968 9123 4567",
  phone_hours: "Sat-Thu 8AM-8PM",
  email_value: "hello@cooltech.om",
  email_response: "Response within 1 hour",
  whatsapp_text: "Chat with us",
  emergency_text: "24/7 Available",
  service_area_title: "Service Area",
  service_area_description: "Greater Metro Area & surrounding suburbs within 30 miles.",
  form_title: "Send Us a Message",
};

export interface WebsiteContent {
  hero: HeroContent;
  stats: StatsContent;
  whyChooseUs: WhyChooseUsContent;
  emergency: EmergencyContent;
  footer: FooterContent;
  quickContact: QuickContactContent;
  finalCTA: FinalCTAContent;
  links: LinksContent;
  servicesSection: ServicesSectionContent;
  howItWorks: HowItWorksContent;
  serviceAreas: ServiceAreasContent;
  brands: BrandsContent;
  aboutPage: AboutPageContent;
  contactPage: ContactPageContent;
  loading: boolean;
}

const ALL_KEYS = [
  "website_hero", "website_stats", "website_why_choose_us", "website_emergency",
  "website_footer", "website_quick_contact", "website_final_cta", "website_links",
  "website_services_section", "website_how_it_works", "website_service_areas",
  "website_brands", "website_about_page", "website_contact_page",
];

const WebsiteContentContext = createContext<WebsiteContent>({
  hero: defaultHero,
  stats: defaultStats,
  whyChooseUs: defaultWhyChooseUs,
  emergency: defaultEmergency,
  footer: defaultFooter,
  quickContact: defaultQuickContact,
  finalCTA: defaultFinalCTA,
  links: defaultLinks,
  servicesSection: defaultServicesSection,
  howItWorks: defaultHowItWorks,
  serviceAreas: defaultServiceAreas,
  brands: defaultBrands,
  aboutPage: defaultAboutPage,
  contactPage: defaultContactPage,
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
  const [links, setLinks] = useState<LinksContent>(defaultLinks);
  const [servicesSection, setServicesSection] = useState<ServicesSectionContent>(defaultServicesSection);
  const [howItWorks, setHowItWorks] = useState<HowItWorksContent>(defaultHowItWorks);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreasContent>(defaultServiceAreas);
  const [brands, setBrands] = useState<BrandsContent>(defaultBrands);
  const [aboutPage, setAboutPage] = useState<AboutPageContent>(defaultAboutPage);
  const [contactPage, setContactPage] = useState<ContactPageContent>(defaultContactPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("system_settings")
          .select("key, value")
          .in("key", ALL_KEYS);

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
            case "website_links": setLinks((prev) => ({ ...prev, ...val })); break;
            case "website_services_section": setServicesSection((prev) => ({ ...prev, ...val })); break;
            case "website_how_it_works": setHowItWorks((prev) => ({ ...prev, ...val })); break;
            case "website_service_areas": setServiceAreas((prev) => ({ ...prev, ...val })); break;
            case "website_brands": setBrands((prev) => ({ ...prev, ...val })); break;
            case "website_about_page": setAboutPage((prev) => ({ ...prev, ...val })); break;
            case "website_contact_page": setContactPage((prev) => ({ ...prev, ...val })); break;
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
    <WebsiteContentContext.Provider value={{
      hero, stats, whyChooseUs, emergency, footer, quickContact, finalCTA, links,
      servicesSection, howItWorks, serviceAreas, brands, aboutPage, contactPage, loading,
    }}>
      {children}
    </WebsiteContentContext.Provider>
  );
}

export function useWebsiteContent() {
  return useContext(WebsiteContentContext);
}
