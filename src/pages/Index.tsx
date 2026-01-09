import { 
  Snowflake, Wind, Thermometer, Clock, ShieldCheck, Wrench,
  Phone, Mail, MapPin, CheckCircle, Star, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { ReviewCard } from "@/components/ui/review-card";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import heroImage from "@/assets/hero-technician.jpg";

export default function Index() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Professional AC technician" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>
        <div className="container relative z-10 py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-6">
              <ShieldCheck className="h-4 w-4 text-frost" />
              <span className="text-sm font-medium text-white">Licensed & Insured Professionals</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Stay Cool.<br /><span className="text-frost">Stay Fresh.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
              Expert AC & refrigerator repair services. Fast response, fair prices, and guaranteed satisfaction.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/book">Schedule Service <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="glass" size="xl"><Phone className="h-5 w-5" />(555) 123-4567</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background-soft border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value="15+" label="Years Experience" icon={Clock} />
            <StatCard value="5000+" label="Jobs Completed" icon={CheckCircle} />
            <StatCard value="24/7" label="Emergency Service" icon={Phone} />
            <StatCard value="100%" label="Satisfaction Rate" icon={Star} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-background">
        <div className="container">
          <SectionHeader badge="Our Services" title="Professional Cooling Solutions" description="From routine maintenance to emergency repairs, we've got all your cooling needs covered." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wind, title: "AC Repair & Service", desc: "Complete air conditioning repair and maintenance for all brands." },
              { icon: Thermometer, title: "Refrigerator Repair", desc: "Expert fridge and freezer repairs. We fix cooling issues fast." },
              { icon: Snowflake, title: "Preventive Maintenance", desc: "Keep your systems running efficiently all year round." },
            ].map((s) => (
              <ServiceCard key={s.title} variant="frost" icon={s.icon} title={s.title} description={s.desc} iconClassName="bg-frost/10 text-frost" />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild><Link to="/services">View All Services</Link></Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section bg-background-soft">
        <div className="container">
          <SectionHeader badge="Customer Reviews" title="What Our Customers Say" />
          <div className="grid md:grid-cols-3 gap-6">
            <ReviewCard name="Sarah Johnson" rating={5} review="CoolTech saved my summer! Fixed my AC within hours." date="2 weeks ago" />
            <ReviewCard name="Michael Chen" rating={5} review="Excellent service! The technician explained everything clearly." date="1 month ago" />
            <ReviewCard name="Emily Rodriguez" rating={5} review="Their maintenance plan keeps my AC running perfectly." date="2 months ago" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Stay Cool?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">Contact us today for a free quote or to schedule your service.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero-cta" size="xl" asChild><Link to="/book">Book Service <ArrowRight className="h-5 w-5" /></Link></Button>
            <Button variant="glass" size="xl" asChild><Link to="/contact">Contact Us</Link></Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
