import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";

export default function Contact() {
  return (
    <MainLayout>
      <PageHeader
        title="Contact Us"
        description="Get in touch with our team. We're here to help with all your cooling needs."
        breadcrumbs={[{ label: "Contact" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6 mb-8">
                {[
                  { icon: Phone, label: "Phone", value: "(555) 123-4567", href: "tel:+15551234567" },
                  { icon: Mail, label: "Email", value: "hello@cooltech.com", href: "mailto:hello@cooltech.com" },
                  { icon: MapPin, label: "Service Area", value: "Greater Metro Area" },
                  { icon: Clock, label: "Hours", value: "Mon-Sat: 8AM-8PM | Emergency: 24/7" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary p-3 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-muted-foreground hover:text-primary">{item.value}</a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput label="First Name" placeholder="John" />
                  <FormInput label="Last Name" placeholder="Doe" />
                </div>
                <FormInput label="Email" type="email" placeholder="john@example.com" icon={Mail} />
                <FormInput label="Phone" type="tel" placeholder="(555) 123-4567" icon={Phone} />
                <FormTextarea label="Message" placeholder="How can we help you?" />
                <Button variant="cta" size="lg" className="w-full">
                  Send Message <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
