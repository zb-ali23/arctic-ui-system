import { Link } from "react-router-dom";
import { Phone, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

export function EmergencySection() {
  const { emergency } = useWebsiteContent();
  const phoneDigits = emergency.phone.replace(/\s+/g, '');

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dark Blue Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(210,70%,18%)]" />
      
      {/* Animated Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-frost/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-accent-warm/10 rounded-full blur-3xl"
      />

      <div className="container relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          {/* Urgent Badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 rounded-full bg-accent-warm/20 border border-accent-warm/30 px-4 py-2 mb-6"
          >
            <AlertTriangle className="h-4 w-4 text-accent-warm animate-pulse" />
            <span className="text-sm font-medium text-accent-warm">Cooling Emergency?</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {emergency.title}
            <span className="text-frost"> Repair Service</span>
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {emergency.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { icon: Clock, text: emergency.response_time },
              { icon: Phone, text: "No Overtime Fees" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-primary-foreground/90">
                <item.icon className="h-5 w-5 text-frost" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Large Call Button */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <a href={`tel:${phoneDigits}`}>
                <Button 
                  size="xl" 
                  className="bg-accent-warm hover:bg-accent-warm/90 text-accent-warm-foreground shadow-lg shadow-accent-warm/30"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {emergency.cta_text}: {emergency.phone}
                </Button>
              </a>
            </motion.div>
            <Button variant="glass" size="xl" asChild>
              <Link to="/services/emergency">Learn More</Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
