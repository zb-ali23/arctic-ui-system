import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

const contactMethods = [
  { icon: Phone, label: "Phone", value: "+968 9123 4567", href: "tel:+96891234567", description: "Sat-Thu 8AM-8PM" },
  { icon: Mail, label: "Email", value: "hello@cooltech.om", href: "mailto:hello@cooltech.om", description: "Response within 1 hour" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/96891234567", description: "Instant messaging" },
  { icon: Clock, label: "Emergency", value: "24/7 Available", href: "tel:+96891234567", description: "No overtime fees" }
];

export default function Contact() {
  return (
    <MainLayout>
      <PageHeader title="Contact Us" description="Get in touch with our team. We're here to help." breadcrumbs={[{ label: "Contact" }]} variant="hero" />

      <section className="section bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                  {contactMethods.map((method) => (
                    <StaggerItem key={method.label}>
                      <a href={method.href} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-frost/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-frost/10 text-frost flex items-center justify-center group-hover:bg-frost group-hover:text-frost-foreground transition-all">
                          <method.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{method.label}</p>
                          <p className="text-frost font-medium">{method.value}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </a>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <div className="mt-8 p-5 rounded-xl bg-primary text-primary-foreground">
                  <MapPin className="h-6 w-6 text-frost mb-3" />
                  <h4 className="font-semibold mb-1">Service Area</h4>
                  <p className="text-sm text-primary-foreground/80">Greater Metro Area & surrounding suburbs within 30 miles.</p>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-3">
              <AnimatedSection direction="right">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormInput label="First Name" placeholder="John" />
                      <FormInput label="Last Name" placeholder="Doe" />
                    </div>
                    <FormInput label="Email" type="email" placeholder="john@example.com" icon={Mail} />
                    <FormInput label="Phone" type="tel" placeholder="(555) 123-4567" icon={Phone} />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <select className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm">
                        <option>General Inquiry</option>
                        <option>Service Question</option>
                        <option>Get a Quote</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                    <FormTextarea label="Message" placeholder="How can we help you?" />
                    <Button variant="cta" size="lg" className="w-full">Send Message <ArrowRight className="h-4 w-4" /></Button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
