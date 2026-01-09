import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  Phone, 
  ArrowRight,
  Snowflake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-technician.jpg";

export function HeroSection() {
  return (
    <section 
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Animated Background Shapes - Reduced motion for performance */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-1/2 -right-1/4 w-[50vw] md:w-[800px] h-[50vw] md:h-[800px] rounded-full bg-frost/5 blur-3xl will-change-transform"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-1/2 -left-1/4 w-[40vw] md:w-[600px] h-[40vw] md:h-[600px] rounded-full bg-primary/10 blur-3xl will-change-transform"
        />
      </div>

      {/* Hero Image with Lazy Loading */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img 
          src={heroImage} 
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-24 sm:py-32 lg:py-40 pb-32 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 sm:px-4 py-2 mb-4 sm:mb-6"
            >
              <Snowflake className="h-4 w-4 text-frost animate-pulse" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-white">Trusted by 5,000+ Customers</span>
            </motion.div>

            {/* Headline - Mobile-first sizing */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Expert Cooling
              <br />
              <span className="text-frost">Repair Services</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Professional AC & refrigerator repair with same-day service. 
              Fast diagnosis, fair pricing, and a 90-day warranty on all repairs.
            </motion.p>

            {/* CTAs - Stack on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center lg:justify-start"
            >
              <Button variant="hero-cta" size="xl" asChild className="w-full sm:w-auto min-h-[52px] touch-manipulation">
                <Link to="/book">
                  Book Service Now
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button 
                variant="glass" 
                size="xl" 
                className="w-full sm:w-auto gap-2 min-h-[52px] touch-manipulation"
                asChild
              >
                <a href="tel:+15551234567" aria-label="Call us at (555) 123-4567">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  (555) 123-4567
                </a>
              </Button>
            </motion.div>

            {/* Trust Badges - Responsive grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start"
              role="list"
              aria-label="Trust badges"
            >
              {[
                { icon: Clock, text: "24/7 Emergency" },
                { icon: ShieldCheck, text: "Licensed & Insured" },
                { icon: Award, text: "90-Day Warranty" },
              ].map((badge) => (
                <div 
                  key={badge.text}
                  role="listitem"
                  className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2"
                >
                  <badge.icon className="h-4 sm:h-5 w-4 sm:w-5 text-frost" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-white">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Optional Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Floating Stats Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">4.9★</div>
                  <div className="text-sm text-muted-foreground">Customer Rating</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on 500+ reviews</div>
                </div>
              </motion.div>

              {/* Another Floating Card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-0 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Same-Day Service</div>
                    <div className="text-xs text-muted-foreground">Available today</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
        </motion.div>
      </motion.div>
    </section>
  );
}
