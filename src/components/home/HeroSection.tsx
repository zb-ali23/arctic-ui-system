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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-frost/5 blur-3xl"
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
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional AC technician" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 mb-6"
            >
              <Snowflake className="h-4 w-4 text-frost animate-pulse" />
              <span className="text-sm font-medium text-white">Trusted by 5,000+ Customers</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
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
              className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed"
            >
              Professional AC & refrigerator repair with same-day service. 
              Fast diagnosis, fair pricing, and a 90-day warranty on all repairs.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/book">
                  Book Service Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" className="gap-2">
                <Phone className="h-5 w-5" />
                (555) 123-4567
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Clock, text: "24/7 Emergency" },
                { icon: ShieldCheck, text: "Licensed & Insured" },
                { icon: Award, text: "90-Day Warranty" },
              ].map((badge) => (
                <div 
                  key={badge.text}
                  className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2"
                >
                  <badge.icon className="h-5 w-5 text-frost" />
                  <span className="text-sm font-medium text-white">{badge.text}</span>
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
