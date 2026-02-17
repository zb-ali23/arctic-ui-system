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
import { Save, RefreshCw, Globe, BarChart3, MessageSquare, Shield, Clock, Phone, Megaphone } from 'lucide-react';

interface HeroContent {
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

interface StatsContent {
  customers_count: string;
  customers_label: string;
  repairs_count: string;
  repairs_label: string;
  experience_count: string;
  experience_label: string;
  rating_value: string;
  rating_label: string;
}

interface WhyChooseUsContent {
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

interface EmergencyContent {
  title: string;
  description: string;
  cta_text: string;
  phone: string;
  response_time: string;
}

interface FooterContent {
  company_description: string;
  copyright_text: string;
  whatsapp_link: string;
  phone_link: string;
}

interface QuickContactContent {
  strip_text: string;
  whatsapp_number: string;
  phone: string;
}

interface FinalCTAContent {
  headline_line1: string;
  headline_line2: string;
  description: string;
  cta_primary: string;
  cta_phone: string;
  phone_display: string;
}

const defaultHero: HeroContent = {
  badge_text: 'Trusted by 5,000+ Customers',
  headline_line1: 'Expert Cooling',
  headline_line2: 'Repair Services',
  subtext: 'Professional AC & refrigerator repair with same-day service. Fast diagnosis, fair pricing, and a 90-day warranty on all repairs.',
  cta_primary: 'Book Service Now',
  cta_phone: '+968 9123 4567',
  trust_badge_1: '24/7 Emergency',
  trust_badge_2: 'Licensed & Insured',
  trust_badge_3: '90-Day Warranty',
  rating_value: '4.9★',
  rating_text: 'Customer Rating',
  rating_reviews: 'Based on 500+ reviews',
};

const defaultStats: StatsContent = {
  customers_count: '5000',
  customers_label: 'Happy Customers',
  repairs_count: '15000',
  repairs_label: 'Repairs Completed',
  experience_count: '15',
  experience_label: 'Years Experience',
  rating_value: '4.9',
  rating_label: 'Customer Rating',
};

const defaultWhyChooseUs: WhyChooseUsContent = {
  section_title: 'Why Choose Us',
  section_description: 'We deliver reliable, professional cooling services with a commitment to quality and customer satisfaction.',
  feature_1_title: 'Same-Day Service',
  feature_1_desc: 'Book today, get fixed today. No waiting around for days.',
  feature_2_title: 'Licensed Technicians',
  feature_2_desc: 'All our technicians are certified and background-checked.',
  feature_3_title: 'Fair Pricing',
  feature_3_desc: 'Transparent pricing with no hidden fees or surprises.',
  feature_4_title: '90-Day Warranty',
  feature_4_desc: 'Every repair backed by our comprehensive warranty.',
};

const defaultEmergency: EmergencyContent = {
  title: 'Need Emergency Repair?',
  description: 'Our technicians are available 24/7 for urgent cooling emergencies.',
  cta_text: 'Call Now',
  phone: '+968 9123 4567',
  response_time: '30 minutes',
};

const defaultFooter: FooterContent = {
  company_description: 'Professional AC & refrigerator repair services. Licensed, insured, and trusted by thousands of customers.',
  copyright_text: '© 2024 CoolFix Pro. All rights reserved.',
  whatsapp_link: 'https://wa.me/96891234567',
  phone_link: 'tel:+96891234567',
};

const defaultQuickContact: QuickContactContent = {
  strip_text: '24/7 Emergency Service Available',
  whatsapp_number: '96891234567',
  phone: '+968 9123 4567',
};

const defaultFinalCTA: FinalCTAContent = {
  headline_line1: "Don't Sweat It.",
  headline_line2: "We've Got You Covered.",
  description: 'Join thousands of satisfied customers who trust CoolTech for all their cooling needs. Fast service, fair prices, guaranteed satisfaction.',
  cta_primary: 'Book Your Service Today',
  cta_phone: 'tel:+96891234567',
  phone_display: '+968 9123 4567',
};

export default function AdminWebsiteContent() {
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [stats, setStats] = useState<StatsContent>(defaultStats);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsContent>(defaultWhyChooseUs);
  const [emergency, setEmergency] = useState<EmergencyContent>(defaultEmergency);
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [quickContact, setQuickContact] = useState<QuickContactContent>(defaultQuickContact);
  const [finalCTA, setFinalCTA] = useState<FinalCTAContent>(defaultFinalCTA);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchAllContent(); }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['website_hero', 'website_stats', 'website_why_choose_us', 'website_emergency', 'website_footer', 'website_quick_contact', 'website_final_cta']);

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
        }
      });
    } catch (error) {
      console.error('Error fetching website content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (key: string, value: object) => {
    setSaving(key);
    try {
      const { data: existing } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      const jsonValue = value as unknown as Json;

      if (existing) {
        await supabase.from('system_settings').update({ value: jsonValue, updated_at: new Date().toISOString() }).eq('key', key);
      } else {
        await supabase.from('system_settings').insert([{ key, value: jsonValue }]);
      }

      toast({ title: 'Saved', description: 'Website content updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save content', variant: 'destructive' });
    } finally {
      setSaving(null);
    }
  };

  const InputField = ({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
    <div>
      <Label className="text-sm">{label}</Label>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Content</h1>
          <p className="text-muted-foreground">Edit all text, numbers, and content displayed on your website</p>
        </div>
        <Button variant="outline" onClick={fetchAllContent} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="hero"><Globe className="mr-2 h-4 w-4" />Hero</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4" />Stats</TabsTrigger>
          <TabsTrigger value="why"><Shield className="mr-2 h-4 w-4" />Why Choose Us</TabsTrigger>
          <TabsTrigger value="emergency"><Clock className="mr-2 h-4 w-4" />Emergency</TabsTrigger>
          <TabsTrigger value="quick-contact"><Phone className="mr-2 h-4 w-4" />Quick Contact</TabsTrigger>
          <TabsTrigger value="final-cta"><Megaphone className="mr-2 h-4 w-4" />Final CTA</TabsTrigger>
          <TabsTrigger value="footer"><MessageSquare className="mr-2 h-4 w-4" />Footer</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content visitors see first</CardDescription>
            </CardHeader>
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
              <Button onClick={() => saveSection('website_hero', hero)} disabled={saving === 'website_hero'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_hero' ? 'Saving...' : 'Save Hero Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Section */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Numbers displayed in the stats bar</CardDescription>
            </CardHeader>
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
              <Button onClick={() => saveSection('website_stats', stats)} disabled={saving === 'website_stats'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_stats' ? 'Saving...' : 'Save Stats'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Why Choose Us */}
        <TabsContent value="why" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us Section</CardTitle>
              <CardDescription>Features and benefits highlighted on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Section Title" value={whyChooseUs.section_title} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, section_title: v })} />
              <InputField label="Section Description" value={whyChooseUs.section_description} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, section_description: v })} multiline />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="grid grid-cols-2 gap-4 p-3 rounded-lg border">
                  <InputField label={`Feature ${i} Title`} value={(whyChooseUs as any)[`feature_${i}_title`]} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, [`feature_${i}_title`]: v })} />
                  <InputField label={`Feature ${i} Description`} value={(whyChooseUs as any)[`feature_${i}_desc`]} onChange={(v) => setWhyChooseUs({ ...whyChooseUs, [`feature_${i}_desc`]: v })} />
                </div>
              ))}
              <Button onClick={() => saveSection('website_why_choose_us', whyChooseUs)} disabled={saving === 'website_why_choose_us'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_why_choose_us' ? 'Saving...' : 'Save Why Choose Us'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency */}
        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Section</CardTitle>
              <CardDescription>Emergency service call-to-action content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Title" value={emergency.title} onChange={(v) => setEmergency({ ...emergency, title: v })} />
              <InputField label="Description" value={emergency.description} onChange={(v) => setEmergency({ ...emergency, description: v })} multiline />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="CTA Text" value={emergency.cta_text} onChange={(v) => setEmergency({ ...emergency, cta_text: v })} />
                <InputField label="Phone" value={emergency.phone} onChange={(v) => setEmergency({ ...emergency, phone: v })} />
                <InputField label="Response Time" value={emergency.response_time} onChange={(v) => setEmergency({ ...emergency, response_time: v })} />
              </div>
              <Button onClick={() => saveSection('website_emergency', emergency)} disabled={saving === 'website_emergency'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_emergency' ? 'Saving...' : 'Save Emergency Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Contact Strip */}
        <TabsContent value="quick-contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Contact Strip</CardTitle>
              <CardDescription>Sticky contact bar that appears when scrolling past the hero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Strip Text" value={quickContact.strip_text} onChange={(v) => setQuickContact({ ...quickContact, strip_text: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="WhatsApp Number (digits only)" value={quickContact.whatsapp_number} onChange={(v) => setQuickContact({ ...quickContact, whatsapp_number: v })} />
                <InputField label="Phone Number" value={quickContact.phone} onChange={(v) => setQuickContact({ ...quickContact, phone: v })} />
              </div>
              <Button onClick={() => saveSection('website_quick_contact', quickContact)} disabled={saving === 'website_quick_contact'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_quick_contact' ? 'Saving...' : 'Save Quick Contact'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final CTA */}
        <TabsContent value="final-cta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Final Call-to-Action</CardTitle>
              <CardDescription>Bottom banner encouraging visitors to book service</CardDescription>
            </CardHeader>
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
              <Button onClick={() => saveSection('website_final_cta', finalCTA)} disabled={saving === 'website_final_cta'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_final_cta' ? 'Saving...' : 'Save Final CTA'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
              <CardDescription>Footer text, copyright, and contact links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Company Description" value={footer.company_description} onChange={(v) => setFooter({ ...footer, company_description: v })} multiline />
              <InputField label="Copyright Text" value={footer.copyright_text} onChange={(v) => setFooter({ ...footer, copyright_text: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="WhatsApp Link (e.g. https://wa.me/96891234567)" value={footer.whatsapp_link} onChange={(v) => setFooter({ ...footer, whatsapp_link: v })} />
                <InputField label="Phone Link (e.g. tel:+96891234567)" value={footer.phone_link} onChange={(v) => setFooter({ ...footer, phone_link: v })} />
              </div>
              <Button onClick={() => saveSection('website_footer', footer)} disabled={saving === 'website_footer'}>
                <Save className="mr-2 h-4 w-4" />{saving === 'website_footer' ? 'Saving...' : 'Save Footer Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
