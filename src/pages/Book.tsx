import { Link } from "react-router-dom";
import { Phone, Mail, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";

export default function Book() {
  return (
    <MainLayout>
      <PageHeader
        title="Book a Service"
        description="Schedule your repair or maintenance appointment in just a few clicks."
        breadcrumbs={[{ label: "Book Service" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-frost/10 text-frost">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Same-day service available • No hidden fees • 90-day warranty</span>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormInput label="First Name" placeholder="John" required />
                <FormInput label="Last Name" placeholder="Doe" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormInput label="Email" type="email" placeholder="john@example.com" icon={Mail} required />
                <FormInput label="Phone" type="tel" placeholder="(555) 123-4567" icon={Phone} required />
              </div>
              <FormInput label="Address" placeholder="123 Main St, City, State ZIP" required />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <select className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm">
                    <option>AC Repair</option>
                    <option>Refrigerator Repair</option>
                    <option>Maintenance</option>
                    <option>Emergency Service</option>
                    <option>Other</option>
                  </select>
                </div>
                <FormInput label="Preferred Date" type="date" icon={Calendar} />
              </div>
              
              <FormTextarea 
                label="Describe Your Issue" 
                placeholder="Tell us about the problem you're experiencing..."
                helperText="Include appliance brand/model if known"
              />

              <Button variant="cta" size="xl" className="w-full">
                Submit Booking Request <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
