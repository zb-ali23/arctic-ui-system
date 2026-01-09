import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export function FinalCTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-frost via-frost to-[hsl(190,85%,45%)]" />
      
      {/* Animated Shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-80 h-80 border border-white/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-96 h-96 border border-white/20 rounded-full"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />

      <div className="container relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
          >
            <Snowflake className="h-10 w-10 text-white" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Don't Sweat It.
            <br />
            We've Got You Covered.
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust CoolTech for all their cooling needs. 
            Fast service, fair prices, guaranteed satisfaction.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="xl" 
                className="bg-white text-frost hover:bg-white/90 shadow-xl text-lg px-10 h-14"
                asChild
              >
                <Link to="/book">
                  Book Your Service Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <a href="tel:+15551234567">
                <Button 
                  size="xl" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 h-14"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  (555) 123-4567
                </Button>
              </a>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
