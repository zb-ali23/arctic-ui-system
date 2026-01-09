import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Search, MessageCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

const faqCategories = [
  {
    category: "Service & Booking",
    icon: "📅",
    questions: [
      { q: "How quickly can you come out for a repair?", a: "We offer same-day service for most repairs. For emergencies, we typically arrive within 60 minutes. Regular appointments can usually be scheduled within 24-48 hours." },
      { q: "Do you offer emergency service?", a: "Yes! We provide 24/7 emergency service for urgent cooling issues. There's no additional charge for evening or weekend emergency calls." },
      { q: "What areas do you service?", a: "We serve the entire greater metro area, including all surrounding suburbs within a 30-mile radius. Contact us to confirm service availability in your specific location." },
      { q: "How do I schedule an appointment?", a: "You can book online through our website, call us at (555) 123-4567, or send us a WhatsApp message. We'll confirm your appointment within 30 minutes." }
    ]
  },
  {
    category: "Pricing & Payment",
    icon: "💳",
    questions: [
      { q: "How much does a service call cost?", a: "Our diagnostic fee is $79, which covers a complete inspection and diagnosis of your system. This fee is applied toward the cost of any repairs you choose to complete." },
      { q: "Do you provide free estimates?", a: "We provide a complete repair estimate after our diagnostic visit. The diagnostic fee of $79 is applied to your repair cost if you proceed." },
      { q: "What payment methods do you accept?", a: "We accept cash, all major credit cards (Visa, Mastercard, Amex, Discover), checks, and offer financing options for larger repairs." },
      { q: "Do you offer financing?", a: "Yes! We offer flexible financing options for repairs over $500. Ask about our 0% APR financing for qualified customers." }
    ]
  },
  {
    category: "Repairs & Warranty",
    icon: "🔧",
    questions: [
      { q: "What brands do you service?", a: "We service all major brands including Carrier, Trane, Lennox, Goodman, Rheem, York, Samsung, LG, Whirlpool, GE, Frigidaire, and many more." },
      { q: "Do you offer a warranty on repairs?", a: "Yes! All our repairs come with a 90-day warranty on labor and parts. Maintenance plan members receive an extended 1-year warranty." },
      { q: "Do you use genuine parts?", a: "We use OEM (Original Equipment Manufacturer) parts whenever possible. When OEM parts aren't available, we use high-quality aftermarket parts with matching warranties." },
      { q: "How long do repairs usually take?", a: "Most repairs are completed in 1-2 hours. Complex repairs like compressor replacements may take 3-4 hours. We'll give you a time estimate before starting." }
    ]
  },
  {
    category: "Maintenance",
    icon: "🛠️",
    questions: [
      { q: "How often should I have my AC serviced?", a: "We recommend annual maintenance for most systems—ideally in spring before the cooling season. High-use systems or older units may benefit from twice-yearly service." },
      { q: "What does a maintenance visit include?", a: "Our maintenance includes cleaning coils, checking refrigerant levels, inspecting electrical connections, testing performance, replacing filters, and checking for potential issues." },
      { q: "Is a maintenance plan worth it?", a: "Absolutely! Regular maintenance prevents 80% of breakdowns, improves efficiency (lowering bills), extends equipment life, and plan members get 15% off all repairs plus priority scheduling." }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaqs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <MainLayout>
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about our services."
        breadcrumbs={[{ label: "FAQ" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container max-w-4xl">
          {/* Search */}
          <AnimatedSection className="mb-12">
            <div className="max-w-md mx-auto">
              <FormInput 
                placeholder="Search questions..." 
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </AnimatedSection>

          {/* Category Tabs */}
          <AnimatedSection delay={0.1} className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
              variant={activeCategory === null ? "frost" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Button>
            {faqCategories.map((cat) => (
              <Button
                key={cat.category}
                variant={activeCategory === cat.category ? "frost" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(cat.category)}
              >
                {cat.icon} {cat.category}
              </Button>
            ))}
          </AnimatedSection>

          {/* FAQs */}
          <div className="space-y-10">
            {filteredFaqs
              .filter(cat => !activeCategory || cat.category === activeCategory)
              .map((category) => (
              <AnimatedSection key={category.category}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.category}
                </h2>
                <StaggerContainer className="space-y-3" staggerDelay={0.05}>
                  {category.questions.map((faq) => (
                    <StaggerItem key={faq.q}>
                      <FAQItem question={faq.q} answer={faq.a} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </AnimatedSection>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section bg-background-soft">
        <div className="container">
          <AnimatedSection>
            <div className="rounded-2xl bg-primary p-8 md:p-12 text-center">
              <MessageCircle className="h-12 w-12 text-frost mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Still Have Questions?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Our team is here to help. Contact us and we'll respond within the hour.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero-cta" size="xl" asChild>
                  <Link to="/contact">Contact Us <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button variant="glass" size="xl" asChild>
                  <Link to="/book">Book Service</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
