import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Globe, BarChart3, MessageSquare, Shield, Clock, Phone, Megaphone, Link2, Wrench, MapPin, Tag, FileText, Users } from 'lucide-react';
import type {
  HeroContent, StatsContent, WhyChooseUsContent, EmergencyContent, FooterContent,
  QuickContactContent, FinalCTAContent, LinksContent, ServicesSectionContent,
  HowItWorksContent, ServiceAreasContent, BrandsContent, AboutPageContent, ContactPageContent,
} from '@/hooks/useWebsiteContent';
import {
  defaultServicesSection, defaultHowItWorks, defaultServiceAreas,
  defaultBrands, defaultAboutPage, defaultContactPage,
} from '@/hooks/useWebsiteContent';

const defaultHero: HeroContent = {
  badge_text: 'Trusted by 5,000+ Customers', headline_line1: 'Expert Cooling', headline_line2: 'Repair Services',
  subtext: 'Professional AC & refrigerator repair with same-day service. Fast diagnosis, fair pricing, and a 90-day warranty on all repairs.',
  cta_primary: 'Book Service Now', cta_phone: '+968 9123 4567',
  trust_badge_1: '24/7 Emergency', trust_badge_2: 'Licensed & Insured', trust_badge_3: '90-Day Warranty',
  rating_value: '4.9★', rating_text: 'Customer Rating', rating_reviews: 'Based on 500+ reviews',
};
const defaultStats: StatsContent = {
  customers_count: '5000', customers_label: 'Happy Customers', repairs_count: '15000', repairs_label: 'Repairs Completed',
  experience_count: '15', experience_label: 'Years Experience', rating_value: '4.9', rating_label: 'Customer Rating',
};
const defaultWhyChooseUs: WhyChooseUsContent = {
  section_title: 'Why Choose Us', section_description: 'We deliver reliable, professional cooling services.',
  feature_1_title: 'Same-Day Service', feature_1_desc: 'Book today, get fixed today.',
  feature_2_title: 'Licensed Technicians', feature_2_desc: 'All certified and background-checked.',
  feature_3_title: 'Fair Pricing', feature_3_desc: 'No hidden fees or surprises.',
  feature_4_title: '90-Day Warranty', feature_4_desc: 'Every repair backed by warranty.',
};
const defaultEmergency: EmergencyContent = { title: 'Need Emergency Repair?', description: 'Available 24/7 for urgent emergencies.', cta_text: 'Call Now', phone: '+968 9123 4567', response_time: '30 minutes' };
const defaultFooter: FooterContent = { company_description: 'Professional AC & refrigerator repair services.', copyright_text: '© 2024 CoolFix Pro.', whatsapp_link: 'https://wa.me/96891234567', phone_link: 'tel:+96891234567' };
const defaultQuickContact: QuickContactContent = { strip_text: '24/7 Emergency Service Available', whatsapp_number: '96891234567', phone: '+968 9123 4567' };
const defaultFinalCTA: FinalCTAContent = { headline_line1: "Don't Sweat It.", headline_line2: "We've Got You Covered.", description: 'Join thousands of satisfied customers.', cta_primary: 'Book Your Service Today', cta_phone: 'tel:+96891234567', phone_display: '+968 9123 4567' };
const defaultLinks: LinksContent = { whatsapp_number: '96891234567', phone_number: '+96891234567', phone_display: '+968 9123 4567', facebook_url: '', instagram_url: '', twitter_url: '', linkedin_url: '', google_maps_url: '', email: 'info@cooltech.com' };

const ALL_KEYS = [
  'website_hero', 'website_stats', 'website_why_choose_us', 'website_emergency',
  'website_footer', 'website_quick_contact', 'website_final_cta', 'website_links',
  'website_services_section', 'website_how_it_works', 'website_service_areas',
  'website_brands', 'website_about_page', 'website_contact_page',
];

export default function AdminWebsiteContent() {
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchAllContent(); }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('system_settings').select('key, value').in('key', ALL_KEYS);
      if (error) throw error;
      data?.forEach(item => {
        const val = item.value as Record<string, string>;
        switch (item.key) {
          case 'website_hero': setHero(prev => ({ ...prev, ...val })); break;
          case 'website_stats': setStats(prev => ({ ...prev, ...val })); break;
          case 'website_why_choose_us': setWhyChooseUs(prev => ({ ...prev, ...val })); break;
          case 'website_emergency': setEmergency(prev => ({ ...prev, ...val })); break;
          case 'website_footer': setFooter(prev => ({ ...prev, ...val })); break;
          case 'website_quick_contact': setQuickContact(prev => ({ ...prev, ...val })); break;
          case 'website_final_cta': setFinalCTA(prev => ({ ...prev, ...val })); break;
          case 'website_links': setLinks(prev => ({ ...prev, ...val })); break;
          case 'website_services_section': setServicesSection(prev => ({ ...prev, ...val })); break;
          case 'website_how_it_works': setHowItWorks(prev => ({ ...prev, ...val })); break;
          case 'website_service_areas': setServiceAreas(prev => ({ ...prev, ...val })); break;
          case 'website_brands': setBrands(prev => ({ ...prev, ...val })); break;
          case 'website_about_page': setAboutPage(prev => ({ ...prev, ...val })); break;
          case 'website_contact_page': setContactPage(prev => ({ ...prev, ...val })); break;
        }
      });
    } catch (error) {
      console.error('Error fetching website content:', error);
    } finally { setLoading(false); }
  };

  const saveSection = async (key: string, value: object) => {
    setSaving(key);
    try {
      const { data: existing } = await supabase.from('system_settings').select('id').eq('key', key).maybeSingle();
      const jsonValue = value as unknown as Json;
      if (existing) {
        await supabase.from('system_settings').update({ value: jsonValue, updated_at: new Date().toISOString() }).eq('key', key);
      } else {
        await supabase.from('system_settings').insert([{ key, value: jsonValue }]);
      }
      toast({ title: 'Saved', description: 'Website content updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' });
    } finally { setSaving(null); }
  };

  const InputField = ({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
    <div>
      <Label className="text-sm">{label}</Label>
      {multiline ? <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} /> : <Input value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );

  const SaveBtn = ({ sectionKey, label }: { sectionKey: string; label: string }) => (
    <Button onClick={() => {
      const map: Record<string, object> = {
        website_hero: hero, website_stats: stats, website_why_choose_us: whyChooseUs, website_emergency: emergency,
        website_footer: footer, website_quick_contact: quickContact, website_final_cta: finalCTA, website_links: links,
        website_services_section: servicesSection, website_how_it_works: howItWorks, website_service_areas: serviceAreas,
        website_brands: brands, website_about_page: aboutPage, website_contact_page: contactPage,
      };
      saveSection(sectionKey, map[sectionKey]);
    }} disabled={saving === sectionKey}>
      <Save className="mr-2 h-4 w-4" />{saving === sectionKey ? 'Saving...' : label}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Content</h1>
          <p className="text-muted-foreground">Edit all text, numbers, and content displayed on your website</p>
        </div>
        <Button variant="outline" onClick={fetchAllContent} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero"><Globe className="mr-1 h-3.5 w-3.5" />Hero</TabsTrigger>
          <TabsTrigger value="services"><Wrench className="mr-1 h-3.5 w-3.5" />Services</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="mr-1 h-3.5 w-3.5" />Stats</TabsTrigger>
          <TabsTrigger value="why"><Shield className="mr-1 h-3.5 w-3.5" />Why Us</TabsTrigger>
          <TabsTrigger value="how-it-works"><Clock className="mr-1 h-3.5 w-3.5" />How It Works</TabsTrigger>
          <TabsTrigger value="emergency"><Phone className="mr-1 h-3.5 w-3.5" />Emergency</TabsTrigger>
          <TabsTrigger value="brands"><Tag className="mr-1 h-3.5 w-3.5" />Brands</TabsTrigger>
          <TabsTrigger value="service-areas"><MapPin className="mr-1 h-3.5 w-3.5" />Areas</TabsTrigger>
          <TabsTrigger value="quick-contact"><Phone className="mr-1 h-3.5 w-3.5" />Quick Contact</TabsTrigger>
          <TabsTrigger value="final-cta"><Megaphone className="mr-1 h-3.5 w-3.5" />Final CTA</TabsTrigger>
          <TabsTrigger value="footer"><MessageSquare className="mr-1 h-3.5 w-3.5" />Footer</TabsTrigger>
          <TabsTrigger value="links"><Link2 className="mr-1 h-3.5 w-3.5" />Links</TabsTrigger>
          <TabsTrigger value="about"><FileText className="mr-1 h-3.5 w-3.5" />About Page</TabsTrigger>
          <TabsTrigger value="contact"><Users className="mr-1 h-3.5 w-3.5" />Contact Page</TabsTrigger>
        </TabsList>

        {/* Hero */}
        <TabsContent value="hero" className="space-y-4">
          <Card><CardHeader><CardTitle>Hero Section</CardTitle><CardDescription>Main banner content visitors see first</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Badge Text" value={hero.badge_text} onChange={(v) => setHero({ ...hero, badge_text: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Headline Line 1" value={hero.headline_line1} onChange={(v) => setHero({ ...hero, headline_line1: v })} />
                <InputField label="Headline Line 2" value={hero.headline_line2} onChange={(v) => setHero({ ...hero, headline_line2: v })} />
              </div>
              <InputField label="Subtext" value={hero.subtext} onChange={(v) => setHero({ ...hero, subtext: v })} multiline />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="CTA Button Text" value={hero.cta_primary} onChange={(v) => setHero({ ...hero, cta_primary: v })} />
                <InputField label="Phone Number" value={hero.cta_phone} onChange={(v) => setHero({ ...hero, cta_phone: v })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Trust Badge 1" value={hero.trust_badge_1} onChange={(v) => setHero({ ...hero, trust_badge_1: v })} />
                <InputField label="Trust Badge 2" value={hero.trust_badge_2} onChange={(v) => setHero({ ...hero, trust_badge_2: v })} />
                <InputField label="Trust Badge 3" value={hero.trust_badge_3} onChange={(v) => setHero({ ...hero, trust_badge_3: v })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Rating Value" value={hero.rating_value} onChange={(v) => setHero({ ...hero, rating_value: v })} />
                <InputField label="Rating Text" value={hero.rating_text} onChange={(v) => setHero({ ...hero, rating_text: v })} />
                <InputField label="Rating Reviews" value={hero.rating_reviews} onChange={(v) => setHero({ ...hero, rating_reviews: v })} />
              </div>
              <SaveBtn sectionKey="website_hero" label="Save Hero Content" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services" className="space-y-4">
          <Card><CardHeader><CardTitle>Services Section</CardTitle><CardDescription>Service cards displayed on the homepage</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Badge" value={servicesSection.badge} onChange={(v) => setServicesSection({ ...servicesSection, badge: v })} />
              <InputField label="Title" value={servicesSection.title} onChange={(v) => setServicesSection({ ...servicesSection, title: v })} />
              <InputField label="Description" value={servicesSection.description} onChange={(v) => setServicesSection({ ...servicesSection, description: v })} multiline />
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="grid grid-cols-3 gap-4 p-3 rounded-lg border">
                  <InputField label={`Service ${i} Title`} value={(servicesSection as any)[`service_${i}_title`]} onChange={(v) => setServicesSection({ ...servicesSection, [`service_${i}_title`]: v })} />
                  <InputField label={`Service ${i} Description`} value={(servicesSection as any)[`service_${i}_desc`]} onChange={(v) => setServicesSection({ ...servicesSection, [`service_${i}_desc`]: v })} />
                  <InputField label={`Service ${i} Category`} value={(servicesSection as any)[`service_${i}_category`]} onChange={(v) => setServicesSection({ ...servicesSection, [`service_${i}_category`]: v })} />
                </div>
              ))}
              <InputField label="View All Text" value={servicesSection.view_all_text} onChange={(v) => setServicesSection({ ...servicesSection, view_all_text: v })} />
              <SaveBtn sectionKey="website_services_section" label="Save Services Section" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats" className="space-y-4">
          <Card><CardHeader><CardTitle>Statistics</CardTitle><CardDescription>Numbers displayed in the stats bar</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Customers Count" value={stats.customers_count} onChange={(v) => setStats({ ...stats, customers_count: v })} />
                <InputField label="Customers Label" value={stats.customers_label} onChange={(v) => setStats({ ...stats, customers_label: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Repairs Count" value={stats.repairs_count} onChange={(v) => setStats({ ...stats, repairs_count: v })} />
                <InputField label="Repairs Label" value={stats.repairs_label} onChange={(v) => setStats({ ...stats, repairs_label: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Experience Count" value={stats.experience_count} onChange={(v) => setStats({ ...stats, experience_count: v })} />
                <InputField label="Experience Label" value={stats.experience_label} onChange={(v) => setStats({ ...stats, experience_label: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Rating Value" value={stats.rating_value} onChange={(v) => setStats({ ...stats, rating_value: v })} />
                <InputField label="Rating Label" value={stats.rating_label} onChange={(v) => setStats({ ...stats, rating_label: v })} />
              </div>
              <SaveBtn sectionKey="website_stats" label="Save Stats" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Why Choose Us */}
        <TabsContent value="why" className="space-y-4">
          <Card><CardHeader><CardTitle>Why Choose Us</CardTitle><CardDescription>Features highlighted on homepage</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Section Title" value={whyChooseUs.section_title} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, section_title: v })} />
              <InputField label="Section Description" value={whyChooseUs.section_description} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, section_description: v })} multiline />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="grid grid-cols-2 gap-4 p-3 rounded-lg border">
                  <InputField label={`Feature ${i} Title`} value={(whyChooseUs as any)[`feature_${i}_title`]} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, [`feature_${i}_title`]: v })} />
                  <InputField label={`Feature ${i} Description`} value={(whyChooseUs as any)[`feature_${i}_desc`]} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, [`feature_${i}_desc`]: v })} />
                </div>
              ))}
              <SaveBtn sectionKey="website_why_choose_us" label="Save Why Choose Us" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* How It Works */}
        <TabsContent value="how-it-works" className="space-y-4">
          <Card><CardHeader><CardTitle>How It Works</CardTitle><CardDescription>Step-by-step process on the homepage</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Badge" value={howItWorks.badge} onChange={(v) => setHowItWorks({ ...howItWorks, badge: v })} />
              <InputField label="Title" value={howItWorks.title} onChange={(v) => setHowItWorks({ ...howItWorks, title: v })} />
              <InputField label="Description" value={howItWorks.description} onChange={(v) => setHowItWorks({ ...howItWorks, description: v })} multiline />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="grid grid-cols-2 gap-4 p-3 rounded-lg border">
                  <InputField label={`Step ${i} Title`} value={(howItWorks as any)[`step_${i}_title`]} onChange={(v) => setHowItWorks({ ...howItWorks, [`step_${i}_title`]: v })} />
                  <InputField label={`Step ${i} Description`} value={(howItWorks as any)[`step_${i}_desc`]} onChange={(v) => setHowItWorks({ ...howItWorks, [`step_${i}_desc`]: v })} />
                </div>
              ))}
              <SaveBtn sectionKey="website_how_it_works" label="Save How It Works" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency */}
        <TabsContent value="emergency" className="space-y-4">
          <Card><CardHeader><CardTitle>Emergency Section</CardTitle><CardDescription>Emergency service CTA</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Title" value={emergency.title} onChange={(v) => setEmergency({ ...emergency, title: v })} />
              <InputField label="Description" value={emergency.description} onChange={(v) => setEmergency({ ...emergency, description: v })} multiline />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="CTA Text" value={emergency.cta_text} onChange={(v) => setEmergency({ ...emergency, cta_text: v })} />
                <InputField label="Phone" value={emergency.phone} onChange={(v) => setEmergency({ ...emergency, phone: v })} />
                <InputField label="Response Time" value={emergency.response_time} onChange={(v) => setEmergency({ ...emergency, response_time: v })} />
              </div>
              <SaveBtn sectionKey="website_emergency" label="Save Emergency" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brands */}
        <TabsContent value="brands" className="space-y-4">
          <Card><CardHeader><CardTitle>Brands We Service</CardTitle><CardDescription>Auto-scrolling brand logos on homepage</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Badge" value={brands.badge} onChange={(v) => setBrands({ ...brands, badge: v })} />
              <InputField label="Title" value={brands.title} onChange={(v) => setBrands({ ...brands, title: v })} />
              <InputField label="Brands (comma-separated)" value={brands.brands_list} onChange={(v) => setBrands({ ...brands, brands_list: v })} multiline />
              <p className="text-xs text-muted-foreground">Enter brand names separated by commas. e.g. Carrier,Trane,Samsung,LG</p>
              <SaveBtn sectionKey="website_brands" label="Save Brands" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Areas */}
        <TabsContent value="service-areas" className="space-y-4">
          <Card><CardHeader><CardTitle>Service Areas</CardTitle><CardDescription>Locations you serve (first 4 are marked as popular)</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Badge" value={serviceAreas.badge} onChange={(v) => setServiceAreas({ ...serviceAreas, badge: v })} />
              <InputField label="Title" value={serviceAreas.title} onChange={(v) => setServiceAreas({ ...serviceAreas, title: v })} />
              <InputField label="Description" value={serviceAreas.description} onChange={(v) => setServiceAreas({ ...serviceAreas, description: v })} multiline />
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="grid grid-cols-2 gap-4 p-3 rounded-lg border">
                  <InputField label={`Area ${i} City`} value={(serviceAreas as any)[`area_${i}_city`]} onChange={(v) => setServiceAreas({ ...serviceAreas, [`area_${i}_city`]: v })} />
                  <InputField label={`Area ${i} Detail`} value={(serviceAreas as any)[`area_${i}_detail`]} onChange={(v) => setServiceAreas({ ...serviceAreas, [`area_${i}_detail`]: v })} />
                </div>
              ))}
              <InputField label="Footer Text" value={serviceAreas.footer_text} onChange={(v) => setServiceAreas({ ...serviceAreas, footer_text: v })} />
              <SaveBtn sectionKey="website_service_areas" label="Save Service Areas" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Contact */}
        <TabsContent value="quick-contact" className="space-y-4">
          <Card><CardHeader><CardTitle>Quick Contact Strip</CardTitle><CardDescription>Sticky contact bar on scroll</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Strip Text" value={quickContact.strip_text} onChange={(v) => setQuickContact({ ...quickContact, strip_text: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="WhatsApp Number" value={quickContact.whatsapp_number} onChange={(v) => setQuickContact({ ...quickContact, whatsapp_number: v })} />
                <InputField label="Phone Number" value={quickContact.phone} onChange={(v) => setQuickContact({ ...quickContact, phone: v })} />
              </div>
              <SaveBtn sectionKey="website_quick_contact" label="Save Quick Contact" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final CTA */}
        <TabsContent value="final-cta" className="space-y-4">
          <Card><CardHeader><CardTitle>Final Call-to-Action</CardTitle><CardDescription>Bottom banner encouraging bookings</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Headline Line 1" value={finalCTA.headline_line1} onChange={(v) => setFinalCTA({ ...finalCTA, headline_line1: v })} />
                <InputField label="Headline Line 2" value={finalCTA.headline_line2} onChange={(v) => setFinalCTA({ ...finalCTA, headline_line2: v })} />
              </div>
              <InputField label="Description" value={finalCTA.description} onChange={(v) => setFinalCTA({ ...finalCTA, description: v })} multiline />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="CTA Button Text" value={finalCTA.cta_primary} onChange={(v) => setFinalCTA({ ...finalCTA, cta_primary: v })} />
                <InputField label="Phone Display" value={finalCTA.phone_display} onChange={(v) => setFinalCTA({ ...finalCTA, phone_display: v })} />
              </div>
              <SaveBtn sectionKey="website_final_cta" label="Save Final CTA" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer" className="space-y-4">
          <Card><CardHeader><CardTitle>Footer Content</CardTitle><CardDescription>Footer text and contact links</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Company Description" value={footer.company_description} onChange={(v) => setFooter({ ...footer, company_description: v })} multiline />
              <InputField label="Copyright Text" value={footer.copyright_text} onChange={(v) => setFooter({ ...footer, copyright_text: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="WhatsApp Link" value={footer.whatsapp_link} onChange={(v) => setFooter({ ...footer, whatsapp_link: v })} />
                <InputField label="Phone Link" value={footer.phone_link} onChange={(v) => setFooter({ ...footer, phone_link: v })} />
              </div>
              <SaveBtn sectionKey="website_footer" label="Save Footer" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links */}
        <TabsContent value="links" className="space-y-4">
          <Card><CardHeader><CardTitle>All Links</CardTitle><CardDescription>Manage all links used across the website</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Contact Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="WhatsApp Number (digits only)" value={links.whatsapp_number} onChange={(v) => setLinks({ ...links, whatsapp_number: v })} />
                  <InputField label="Phone Display" value={links.phone_display} onChange={(v) => setLinks({ ...links, phone_display: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Phone Link (tel:...)" value={links.phone_number} onChange={(v) => setLinks({ ...links, phone_number: v })} />
                  <InputField label="Email" value={links.email} onChange={(v) => setLinks({ ...links, email: v })} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Social Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Facebook URL" value={links.facebook_url} onChange={(v) => setLinks({ ...links, facebook_url: v })} />
                  <InputField label="Instagram URL" value={links.instagram_url} onChange={(v) => setLinks({ ...links, instagram_url: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Twitter / X URL" value={links.twitter_url} onChange={(v) => setLinks({ ...links, twitter_url: v })} />
                  <InputField label="LinkedIn URL" value={links.linkedin_url} onChange={(v) => setLinks({ ...links, linkedin_url: v })} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Other</h3>
                <InputField label="Google Maps URL" value={links.google_maps_url} onChange={(v) => setLinks({ ...links, google_maps_url: v })} />
              </div>
              <SaveBtn sectionKey="website_links" label="Save All Links" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Page */}
        <TabsContent value="about" className="space-y-4">
          <Card><CardHeader><CardTitle>About Page</CardTitle><CardDescription>All content on the About page</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Page Title" value={aboutPage.page_title} onChange={(v) => setAboutPage({ ...aboutPage, page_title: v })} />
                <InputField label="Page Description" value={aboutPage.page_description} onChange={(v) => setAboutPage({ ...aboutPage, page_description: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Story Badge" value={aboutPage.story_badge} onChange={(v) => setAboutPage({ ...aboutPage, story_badge: v })} />
                <InputField label="Story Title" value={aboutPage.story_title} onChange={(v) => setAboutPage({ ...aboutPage, story_title: v })} />
              </div>
              <InputField label="Story Paragraph 1" value={aboutPage.story_paragraph_1} onChange={(v) => setAboutPage({ ...aboutPage, story_paragraph_1: v })} multiline />
              <InputField label="Story Paragraph 2" value={aboutPage.story_paragraph_2} onChange={(v) => setAboutPage({ ...aboutPage, story_paragraph_2: v })} multiline />
              <InputField label="Story Paragraph 3" value={aboutPage.story_paragraph_3} onChange={(v) => setAboutPage({ ...aboutPage, story_paragraph_3: v })} multiline />
              <InputField label="Certifications (comma-separated)" value={aboutPage.certifications} onChange={(v) => setAboutPage({ ...aboutPage, certifications: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Milestone Badge" value={aboutPage.milestone_badge} onChange={(v) => setAboutPage({ ...aboutPage, milestone_badge: v })} />
                <InputField label="Milestone Title" value={aboutPage.milestone_title} onChange={(v) => setAboutPage({ ...aboutPage, milestone_title: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Values Badge" value={aboutPage.values_badge} onChange={(v) => setAboutPage({ ...aboutPage, values_badge: v })} />
                <InputField label="Values Title" value={aboutPage.values_title} onChange={(v) => setAboutPage({ ...aboutPage, values_title: v })} />
              </div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="grid grid-cols-2 gap-4 p-3 rounded-lg border">
                  <InputField label={`Value ${i} Title`} value={(aboutPage as any)[`value_${i}_title`]} onChange={(v) => setAboutPage({ ...aboutPage, [`value_${i}_title`]: v })} />
                  <InputField label={`Value ${i} Description`} value={(aboutPage as any)[`value_${i}_desc`]} onChange={(v) => setAboutPage({ ...aboutPage, [`value_${i}_desc`]: v })} />
                </div>
              ))}
              <InputField label="CTA Title" value={aboutPage.cta_title} onChange={(v) => setAboutPage({ ...aboutPage, cta_title: v })} />
              <InputField label="CTA Description" value={aboutPage.cta_description} onChange={(v) => setAboutPage({ ...aboutPage, cta_description: v })} />
              <SaveBtn sectionKey="website_about_page" label="Save About Page" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Page */}
        <TabsContent value="contact" className="space-y-4">
          <Card><CardHeader><CardTitle>Contact Page</CardTitle><CardDescription>Contact methods and form details</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Page Title" value={contactPage.page_title} onChange={(v) => setContactPage({ ...contactPage, page_title: v })} />
                <InputField label="Page Description" value={contactPage.page_description} onChange={(v) => setContactPage({ ...contactPage, page_description: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Phone Value" value={contactPage.phone_value} onChange={(v) => setContactPage({ ...contactPage, phone_value: v })} />
                <InputField label="Phone Hours" value={contactPage.phone_hours} onChange={(v) => setContactPage({ ...contactPage, phone_hours: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Email Value" value={contactPage.email_value} onChange={(v) => setContactPage({ ...contactPage, email_value: v })} />
                <InputField label="Email Response Time" value={contactPage.email_response} onChange={(v) => setContactPage({ ...contactPage, email_response: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="WhatsApp Text" value={contactPage.whatsapp_text} onChange={(v) => setContactPage({ ...contactPage, whatsapp_text: v })} />
                <InputField label="Emergency Text" value={contactPage.emergency_text} onChange={(v) => setContactPage({ ...contactPage, emergency_text: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Service Area Title" value={contactPage.service_area_title} onChange={(v) => setContactPage({ ...contactPage, service_area_title: v })} />
                <InputField label="Service Area Description" value={contactPage.service_area_description} onChange={(v) => setContactPage({ ...contactPage, service_area_description: v })} />
              </div>
              <InputField label="Form Title" value={contactPage.form_title} onChange={(v) => setContactPage({ ...contactPage, form_title: v })} />
              <SaveBtn sectionKey="website_contact_page" label="Save Contact Page" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
