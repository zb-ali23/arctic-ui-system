import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingButtons() {
  const phoneNumber = "15551234567";
  const whatsappMessage = encodeURIComponent("Hi! I'd like to schedule a repair service.");
  
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <Button
          size="icon-lg"
          className="rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>
      
      {/* Phone Button */}
      <a href="tel:+15551234567" className="group">
        <Button
          size="icon-lg"
          variant="cta"
          className="rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <Phone className="h-6 w-6" />
        </Button>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call Now
        </span>
      </a>
    </div>
  );
}
