import { 
  Snowflake, 
  Wind, 
  Thermometer, 
  Wrench, 
  ShieldCheck, 
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { ReviewCard } from "@/components/ui/review-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import heroImage from "@/assets/hero-technician.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Snowflake className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">CoolTech</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
          <Button variant="cta" size="sm">
            <Phone className="h-4 w-4" />
            Call Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional AC technician" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-6 animate-fade-in">
              <ShieldCheck className="h-4 w-4 text-frost" />
              <span className="text-sm font-medium text-white">Licensed & Insured Professionals</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
              Stay Cool.
              <br />
              <span className="text-frost">Stay Fresh.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg animate-slide-up delay-100">
              Expert AC & refrigerator repair services. Fast response, 
              fair prices, and guaranteed satisfaction.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
              <Button variant="hero-cta" size="xl">
                Schedule Service
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="glass" size="xl">
                <Phone className="h-5 w-5" />
                (555) 123-4567
              </Button>
            </div>
            
            <div className="flex items-center gap-6 mt-10 animate-fade-in delay-300">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-xs font-medium text-secondary-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-white">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent-warm text-accent-warm" />
                  ))}
                  <span className="ml-2 font-semibold">4.9</span>
                </div>
                <p className="text-sm text-white/70">500+ Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Services Section */}
      <section id="services" className="section bg-background">
        <div className="container">
          <SectionHeader
            badge="Our Services"
            title="Professional Cooling Solutions"
            description="From routine maintenance to emergency repairs, we've got all your cooling needs covered."
            icon={Wrench}
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              variant="frost"
              icon={Wind}
              title="AC Repair & Service"
              description="Complete air conditioning repair, maintenance, and installation services for all brands and models."
              iconClassName="bg-frost/10 text-frost"
            />
            <ServiceCard
              variant="frost"
              icon={Thermometer}
              title="Refrigerator Repair"
              description="Expert refrigerator and freezer repair services. We fix cooling issues, compressors, and more."
              iconClassName="bg-frost/10 text-frost"
            />
            <ServiceCard
              variant="frost"
              icon={Snowflake}
              title="Preventive Maintenance"
              description="Regular maintenance plans to keep your cooling systems running efficiently all year round."
              iconClassName="bg-frost/10 text-frost"
            />
            <ServiceCard
              variant="frost"
              icon={Clock}
              title="Emergency Service"
              description="24/7 emergency repair services. When your cooling fails, we're here to help—fast."
              iconClassName="bg-frost/10 text-frost"
            />
            <ServiceCard
              variant="frost"
              icon={ShieldCheck}
              title="Warranty Service"
              description="Authorized warranty service for major brands. Factory-trained technicians you can trust."
              iconClassName="bg-frost/10 text-frost"
            />
            <ServiceCard
              variant="frost"
              icon={Wrench}
              title="Commercial HVAC"
              description="Commercial cooling solutions for businesses. Keep your customers and employees comfortable."
              iconClassName="bg-frost/10 text-frost"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section bg-background-soft">
        <div className="container">
          <SectionHeader
            badge="Transparent Pricing"
            title="Simple, Honest Pricing"
            description="No hidden fees. No surprises. Just fair prices for quality work."
          />
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingCard
              title="Diagnostic Visit"
              price="$79"
              period="flat rate"
              description="Professional diagnosis of your cooling system"
              features={[
                "Complete system inspection",
                "Written diagnosis report",
                "Repair estimate included",
                "Applied to repair cost"
              ]}
              buttonText="Book Diagnostic"
            />
            <PricingCard
              variant="featured"
              badge="Most Popular"
              title="Standard Repair"
              price="$149"
              period="starting at"
              description="Most common AC and refrigerator repairs"
              features={[
                "Parts & labor included",
                "90-day warranty",
                "Same-day service available",
                "All major brands",
                "Free follow-up check"
              ]}
              buttonText="Get Quote"
            />
            <PricingCard
              title="Maintenance Plan"
              price="$199"
              period="per year"
              description="Annual maintenance for peace of mind"
              features={[
                "2 annual tune-ups",
                "Priority scheduling",
                "15% off all repairs",
                "Extended warranty"
              ]}
              buttonText="Start Plan"
            />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section bg-background">
        <div className="container">
          <SectionHeader
            badge="Customer Reviews"
            title="What Our Customers Say"
            description="Don't just take our word for it—hear from our satisfied customers."
            icon={Star}
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReviewCard
              name="Sarah Johnson"
              rating={5}
              review="CoolTech saved my summer! My AC broke down on the hottest day of the year and they had it fixed within hours. Professional, friendly, and fair pricing."
              date="2 weeks ago"
            />
            <ReviewCard
              name="Michael Chen"
              rating={5}
              review="Excellent service from start to finish. The technician explained everything clearly and fixed my refrigerator quickly. Highly recommend!"
              date="1 month ago"
            />
            <ReviewCard
              name="Emily Rodriguez"
              rating={5}
              review="I've been using CoolTech for years. Their maintenance plan keeps my AC running perfectly. Great value and peace of mind."
              date="2 months ago"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-background-soft">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader
                align="left"
                badge="Get in Touch"
                title="Ready to Stay Cool?"
                description="Contact us today for a free quote or to schedule your service."
              />
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-secondary p-3 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Phone</h4>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-secondary p-3 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-muted-foreground">hello@cooltech.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-secondary p-3 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-muted-foreground">Serving the greater metro area</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-card-foreground mb-6">Request a Quote</h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput 
                    label="First Name" 
                    placeholder="John"
                  />
                  <FormInput 
                    label="Last Name" 
                    placeholder="Doe"
                  />
                </div>
                <FormInput 
                  label="Email" 
                  type="email" 
                  placeholder="john@example.com"
                  icon={Mail}
                />
                <FormInput 
                  label="Phone" 
                  type="tel" 
                  placeholder="(555) 123-4567"
                  icon={Phone}
                />
                <FormTextarea 
                  label="Message" 
                  placeholder="Tell us about your cooling issue..."
                  helperText="Include details about your appliance brand and model if known."
                />
                <Button variant="cta" size="lg" className="w-full">
                  Submit Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                <Snowflake className="h-5 w-5 text-frost" />
              </div>
              <span className="font-bold text-xl">CoolTech</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              © 2025 CoolTech Services. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
