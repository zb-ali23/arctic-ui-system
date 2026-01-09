import { useState, useEffect } from "react";
import { Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickContactStrip() {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      
      setIsSticky(currentScrollY > heroHeight);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > heroHeight + 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isSticky && isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40 bg-primary shadow-lg"
        >
          <div className="container py-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <AlertTriangle className="h-4 w-4 text-accent-warm animate-pulse" />
                <span className="text-sm font-medium hidden sm:inline">
                  24/7 Emergency Service Available
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://wa.me/15551234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                </a>
                <a href="tel:+15551234567">
                  <Button size="sm" variant="frost" className="gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">(555) 123-4567</span>
                    <span className="sm:hidden">Call</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
