import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Downtown",
    rating: 5,
    review: "CoolTech saved my summer! My AC broke down on the hottest day of the year and they had it fixed within 2 hours. The technician was professional, explained everything clearly, and the price was exactly what they quoted. Highly recommend!",
    service: "AC Repair",
    initial: "SJ"
  },
  {
    name: "Michael Chen",
    location: "Westside",
    rating: 5,
    review: "Excellent service from start to finish. My refrigerator was making strange noises and not cooling properly. They diagnosed the issue quickly, had the part on hand, and fixed it same day. Very impressed with their professionalism.",
    service: "Refrigerator Repair",
    initial: "MC"
  },
  {
    name: "Emily Rodriguez",
    location: "Northside",
    rating: 5,
    review: "I've been using CoolTech for 3 years now. Their annual maintenance plan keeps my AC running perfectly and saves me money on my energy bills. When I did need a repair, they came out the same day and gave me a discount as a plan member.",
    service: "Maintenance Plan",
    initial: "ER"
  },
  {
    name: "David Williams",
    location: "Eastside",
    rating: 5,
    review: "Called them for an emergency at 10pm on a Saturday. They answered immediately, arrived within an hour, and had my AC working again before midnight. No overtime charge! These guys are the real deal.",
    service: "Emergency Service",
    initial: "DW"
  },
  {
    name: "Lisa Thompson",
    location: "Suburbs",
    rating: 5,
    review: "Best repair service I've ever used. They fixed my commercial refrigerator quickly and professionally. The technician was knowledgeable and even gave me tips on preventing future issues. Will definitely use again!",
    service: "Commercial Repair",
    initial: "LT"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const current = testimonials[currentIndex];

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
          {/* Main Testimonial Card */}
          <div className="relative h-[320px] md:h-[280px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-lg">
                  <Quote className="h-10 w-10 text-frost/30 mb-4" />
                  
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                    "{current.review}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-secondary-foreground">
                        {current.initial}
                      </div>
                      <div>
                        <div className="font-semibold">{current.name}</div>
                        <div className="text-sm text-muted-foreground">{current.location}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < current.rating
                                ? "fill-accent-warm text-accent-warm"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-frost font-medium">{current.service}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-frost"
                      : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
