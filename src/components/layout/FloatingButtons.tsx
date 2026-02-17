import { useState, useEffect } from "react";
import { Phone, MessageCircle, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { links } = useWebsiteContent();
  const whatsappMessage = encodeURIComponent("مرحبا! أريد حجز خدمة صيانة. Hi! I'd like to schedule a repair service.");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Floating Buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:hidden">
        <a
          href={`https://wa.me/${links.whatsapp_number}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <Button size="icon" className="h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg touch-manipulation">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </Button>
        </a>
        <a href={links.phone_number} aria-label="Call us now">
          <Button size="icon" variant="cta" className="h-12 w-12 rounded-full shadow-lg touch-manipulation">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </Button>
        </a>
        <AnimatePresence>
          {showScrollTop && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full shadow-lg touch-manipulation" onClick={scrollToTop} aria-label="Scroll to top">
                <ArrowUp className="h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-3">
        <a
          href={`https://wa.me/${links.whatsapp_number}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          aria-label="Chat on WhatsApp"
        >
          <Button size="icon-lg" className="rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 touch-manipulation">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </Button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>

        <a href={links.phone_number} className="group relative" aria-label="Call us now">
          <Button size="icon-lg" variant="cta" className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 touch-manipulation">
            <Phone className="h-6 w-6" aria-hidden="true" />
          </Button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Call Now
          </span>
        </a>

        <AnimatePresence>
          {showScrollTop && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Button size="icon-lg" variant="secondary" className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 touch-manipulation" onClick={scrollToTop} aria-label="Scroll to top">
                <ArrowUp className="h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
