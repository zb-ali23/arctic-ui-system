import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_title: string | null;
  content: string;
  rating: number | null;
  service_type: string | null;
  customer_avatar: string | null;
}

const fallbackTestimonials: Testimonial[] = [
  { id: "1", customer_name: "Sarah Johnson", customer_title: "Downtown", content: "CoolTech saved my summer! My AC broke down on the hottest day of the year and they had it fixed within 2 hours.", rating: 5, service_type: "AC Repair", customer_avatar: null },
  { id: "2", customer_name: "Michael Chen", customer_title: "Westside", content: "Excellent service from start to finish. My refrigerator was making strange noises and not cooling properly. They diagnosed the issue quickly.", rating: 5, service_type: "Refrigerator Repair", customer_avatar: null },
  { id: "3", customer_name: "Emily Rodriguez", customer_title: "Northside", content: "I've been using CoolTech for 3 years now. Their annual maintenance plan keeps my AC running perfectly.", rating: 5, service_type: "Maintenance Plan", customer_avatar: null },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, customer_name, customer_title, content, rating, service_type, customer_avatar")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    };
    fetchTestimonials();
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 300 : -300, opacity: 0 })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) return prev === testimonials.length - 1 ? 0 : prev + 1;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const current = testimonials[currentIndex];
  if (!current) return null;

  const initials = current.customer_name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <section className="section bg-background">
      <div className="container">
        <AnimatedSection>
          <SectionHeader
            badge="Customer Reviews"
            title="What Our Customers Say"
            description="Don't just take our word for it—hear from our satisfied customers."
          />
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-[320px] md:h-[280px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-lg">
                  <Quote className="h-10 w-10 text-frost/30 mb-4" />
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                    "{current.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-secondary-foreground">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold">{current.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{current.customer_title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < (current.rating || 5) ? "fill-accent-warm text-accent-warm" : "fill-muted text-muted"}`} />
                        ))}
                      </div>
                      {current.service_type && <div className="text-xs text-frost font-medium">{current.service_type}</div>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={() => paginate(-1)} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); }}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-frost" : "bg-muted hover:bg-muted-foreground/50"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => paginate(1)} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
