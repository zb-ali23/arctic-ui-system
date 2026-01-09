import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    category: "Service & Booking",
    questions: [
      {
        q: "How quickly can you come out for a repair?",
        a: "We offer same-day service for most repairs. For emergencies, we typically arrive within 60 minutes. Regular appointments can usually be scheduled within 24-48 hours."
      },
      {
        q: "Do you offer emergency service?",
        a: "Yes! We provide 24/7 emergency service for urgent cooling issues. There's no additional charge for evening or weekend emergency calls."
      },
      {
        q: "What areas do you service?",
        a: "We serve the entire greater metro area, including all surrounding suburbs within a 30-mile radius. Contact us to confirm service availability in your specific location."
      },
      {
        q: "How do I schedule an appointment?",
        a: "You can book online through our website, call us at (555) 123-4567, or send us a WhatsApp message. We'll confirm your appointment within 30 minutes."
      }
    ]
  },
  {
    category: "Pricing & Payment",
    questions: [
      {
        q: "How much does a service call cost?",
        a: "Our diagnostic fee is $79, which covers a complete inspection and diagnosis of your system. This fee is applied toward the cost of any repairs you choose to complete."
      },
      {
        q: "Do you provide free estimates?",
        a: "We provide a complete repair estimate after our diagnostic visit. The diagnostic fee of $79 is applied to your repair cost if you proceed."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, all major credit cards (Visa, Mastercard, Amex, Discover), checks, and offer financing options for larger repairs."
      },
      {
        q: "Do you offer financing?",
        a: "Yes! We offer flexible financing options for repairs over $500. Ask about our 0% APR financing for qualified customers."
      }
    ]
  },
  {
    category: "Repairs & Warranty",
    questions: [
      {
        q: "What brands do you service?",
        a: "We service all major brands including Carrier, Trane, Lennox, Goodman, Rheem, York, Samsung, LG, Whirlpool, GE, Frigidaire, and many more."
      },
      {
        q: "Do you offer a warranty on repairs?",
        a: "Yes! All our repairs come with a 90-day warranty on labor and parts. Maintenance plan members receive an extended 1-year warranty."
      },
      {
        q: "Do you use genuine parts?",
        a: "We use OEM (Original Equipment Manufacturer) parts whenever possible. When OEM parts aren't available, we use high-quality aftermarket parts with matching warranties."
      },
      {
        q: "How long do repairs usually take?",
        a: "Most repairs are completed in 1-2 hours. Complex repairs like compressor replacements may take 3-4 hours. We'll give you a time estimate before starting."
      }
    ]
  },
  {
    category: "Maintenance",
    questions: [
      {
        q: "How often should I have my AC serviced?",
        a: "We recommend annual maintenance for most systems—ideally in spring before the cooling season. High-use systems or older units may benefit from twice-yearly service."
      },
      {
        q: "What does a maintenance visit include?",
        a: "Our maintenance includes cleaning coils, checking refrigerant levels, inspecting electrical connections, testing performance, replacing filters, and checking for potential issues."
      },
      {
        q: "Is a maintenance plan worth it?",
        a: "Absolutely! Regular maintenance prevents 80% of breakdowns, improves efficiency (lowering bills), extends equipment life, and plan members get 15% off all repairs plus priority scheduling."
      }
    ]
  }
];

export default function FAQ() {
  return (
    <MainLayout>
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about our services, pricing, and policies."
        breadcrumbs={[{ label: "FAQ" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {category.questions.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${category.category}-${index}`}
                      className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section bg-background-soft">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Our team is here to help. Contact us and we'll get back to you within the hour.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/book">Book Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
