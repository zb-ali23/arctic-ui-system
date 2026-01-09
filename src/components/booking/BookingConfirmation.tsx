import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  MessageCircle,
  FileText,
  Sparkles,
  Copy,
  Share2,
  Download,
  Printer,
  Home,
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BookingDetails {
  bookingId: string;
  serviceName: string;
  servicePrice: string;
  serviceTime: string;
  category: string;
  date: string;
  timeSlot: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface BookingConfirmationProps {
  booking: BookingDetails;
  onBookAnother: () => void;
  onGoHome: () => void;
}

export function BookingConfirmation({ booking, onBookAnother, onGoHome }: BookingConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const copyBookingId = async () => {
    await navigator.clipboard.writeText(booking.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center mb-8"
      >
        {/* Success Icon with Animated Rings */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-400/30"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: 3 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-400/20"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: 3, delay: 0.2 }}
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-2"
        >
          Booking Confirmed! 🎉
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground"
        >
          Your service has been scheduled successfully.
        </motion.p>
      </motion.div>

      {/* Booking ID Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-frost/10 to-frost/5 border border-frost/20 p-6 mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
            <p className="text-2xl font-mono font-bold text-frost">{booking.bookingId}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyBookingId}
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy ID
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Booking Summary Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-border bg-card p-6 mb-6"
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-frost" />
          Booking Summary
        </h3>

        <div className="grid gap-4">
          {/* Service */}
          <div className="flex items-start gap-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-frost" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium">{booking.serviceName}</p>
              <p className="text-sm text-muted-foreground">{booking.category} • Est. {booking.serviceTime}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-frost">{booking.servicePrice}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-frost" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">{formatDate(booking.date)}</p>
              <p className="text-sm text-muted-foreground">{booking.timeSlot}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-frost" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Location</p>
              <p className="font-medium">{booking.address}</p>
              <p className="text-sm text-muted-foreground">
                {booking.city}{booking.state && `, ${booking.state}`} {booking.zip}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-frost" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Details</p>
              <p className="font-medium">{booking.customerName}</p>
              <p className="text-sm text-muted-foreground">{booking.phone} • {booking.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What Happens Next */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl bg-frost/5 border border-frost/20 p-6 mb-6"
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-frost">
          <Clock className="h-5 w-5" />
          What Happens Next?
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-frost text-frost-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Confirmation Call (within 30 mins)</p>
              <p className="text-sm text-muted-foreground">
                Our team will call you to confirm your appointment and discuss any details.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-frost text-frost-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Technician Assignment</p>
              <p className="text-sm text-muted-foreground">
                A certified technician will be assigned based on your location and service needs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-frost text-frost-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Day-of Reminder</p>
              <p className="text-sm text-muted-foreground">
                You'll receive an SMS reminder and tracking link when the technician is on the way.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid sm:grid-cols-2 gap-4 mb-6"
      >
        <a
          href={`https://wa.me/1234567890?text=Hi! I just booked a service (${booking.bookingId}). I have a question.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="font-medium">Chat on WhatsApp</p>
            <p className="text-sm text-muted-foreground">Quick responses</p>
          </div>
        </a>

        <a
          href="tel:+1234567890"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Phone className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium">Call Support</p>
            <p className="text-sm text-muted-foreground">24/7 available</p>
          </div>
        </a>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-6 py-6 border-t border-border mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          90-Day Warranty
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-5 w-5 text-amber-500" />
          4.9★ Rated Service
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-5 w-5 text-frost" />
          On-Time Guarantee
        </div>
      </motion.div>

      {/* Primary Actions */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button variant="cta" size="lg" onClick={onGoHome}>
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Button variant="outline" size="lg" onClick={onBookAnother}>
          Book Another Service
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
