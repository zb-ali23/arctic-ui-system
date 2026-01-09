import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Wrench, 
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  User,
  FileText,
  AlertCircle,
  RefreshCw,
  Home,
  Copy,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { 
  EmptyState, 
  ErrorState, 
  LoadingSpinner 
} from "@/components/ui/feedback-states";

// Simulated booking data
const mockBooking = {
  id: "BK7X9K2M3N",
  status: "confirmed" as BookingStatus,
  service: {
    name: "AC Repair",
    category: "Air Conditioner",
    price: "From $149",
    estimatedTime: "1-2 hours"
  },
  schedule: {
    date: "2024-01-15",
    timeSlot: "10:00 AM - 12:00 PM"
  },
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567"
  },
  address: {
    street: "123 Main Street",
    city: "Austin",
    state: "TX",
    zip: "78701"
  },
  technician: {
    name: "Mike Johnson",
    photo: null,
    rating: 4.9,
    jobsCompleted: 523
  },
  timeline: [
    { status: "submitted", label: "Booking Submitted", time: "Jan 14, 2024 at 3:45 PM", completed: true },
    { status: "confirmed", label: "Booking Confirmed", time: "Jan 14, 2024 at 4:02 PM", completed: true },
    { status: "assigned", label: "Technician Assigned", time: "Jan 14, 2024 at 4:15 PM", completed: true },
    { status: "onway", label: "Technician On The Way", time: null, completed: false },
    { status: "inprogress", label: "Service In Progress", time: null, completed: false },
    { status: "completed", label: "Service Completed", time: null, completed: false }
  ]
};

type BookingStatus = "submitted" | "confirmed" | "assigned" | "onway" | "inprogress" | "completed" | "cancelled";

const statusConfig: Record<BookingStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  submitted: { label: "Submitted", color: "text-blue-500", bgColor: "bg-blue-500", icon: FileText },
  confirmed: { label: "Confirmed", color: "text-green-500", bgColor: "bg-green-500", icon: CheckCircle2 },
  assigned: { label: "Technician Assigned", color: "text-purple-500", bgColor: "bg-purple-500", icon: User },
  onway: { label: "On The Way", color: "text-amber-500", bgColor: "bg-amber-500", icon: Truck },
  inprogress: { label: "In Progress", color: "text-frost", bgColor: "bg-frost", icon: Wrench },
  completed: { label: "Completed", color: "text-green-600", bgColor: "bg-green-600", icon: Star },
  cancelled: { label: "Cancelled", color: "text-red-500", bgColor: "bg-red-500", icon: AlertCircle }
};

export default function BookingStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState(searchParams.get("id") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [booking, setBooking] = useState<typeof mockBooking | null>(
    searchParams.get("id") ? mockBooking : null
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async () => {
    if (!bookingId.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, show booking if ID matches pattern
    if (bookingId.toUpperCase().startsWith("BK")) {
      setBooking({ ...mockBooking, id: bookingId.toUpperCase() });
    } else {
      setError("No booking found with this ID. Please check and try again.");
      setBooking(null);
    }
    
    setIsSearching(false);
  };

  const copyBookingId = async () => {
    if (booking) {
      await navigator.clipboard.writeText(booking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const StatusIcon = booking ? statusConfig[booking.status].icon : CheckCircle2;

  return (
    <MainLayout>
      <PageHeader
        title="Booking Status"
        description="Track your service appointment in real-time"
        breadcrumbs={[{ label: "Booking Status" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container max-w-4xl">
          {/* Search Form */}
          {!booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-2">Track Your Booking</h2>
                <p className="text-muted-foreground mb-6">
                  Enter your booking ID to see the current status of your service appointment.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <FormInput
                      placeholder="Enter booking ID (e.g., BK7X9K2M3N)"
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="h-12"
                    />
                  </div>
                  <Button 
                    variant="cta" 
                    size="lg" 
                    onClick={handleSearch}
                    disabled={isSearching || !bookingId.trim()}
                  >
                    {isSearching ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Searching...
                      </>
                    ) : (
                      "Track Booking"
                    )}
                  </Button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">{error}</p>
                      <p className="text-sm text-destructive/80 mt-1">
                        Can't find your booking? Contact us at (123) 456-7890
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Your booking ID was sent to your email and phone when you made the reservation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Booking Details */}
          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Header */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className={`p-6 ${statusConfig[booking.status].bgColor}`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <StatusIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-white">
                        <p className="text-sm opacity-80">Current Status</p>
                        <h2 className="text-2xl font-bold">{statusConfig[booking.status].label}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm">ID:</span>
                      <span className="font-mono font-bold text-white">{booking.id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyBookingId}
                        className="text-white hover:bg-white/20"
                      >
                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="p-6">
                  <div className="relative">
                    {booking.timeline.map((step, index) => (
                      <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                        {/* Timeline line */}
                        <div className="relative flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            step.completed 
                              ? "bg-green-500 text-white" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {step.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          {index < booking.timeline.length - 1 && (
                            <div className={`w-0.5 flex-1 mt-2 ${
                              step.completed ? "bg-green-500" : "bg-muted"
                            }`} />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pt-1">
                          <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          {step.time && (
                            <p className="text-sm text-muted-foreground">{step.time}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Details */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-frost" />
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{booking.service.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{booking.service.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Time</span>
                      <span className="font-medium">{booking.service.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-frost">{booking.service.price}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-frost" />
                    Appointment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {new Date(booking.schedule.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{booking.schedule.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-frost" />
                    Service Location
                  </h3>
                  <p className="font-medium">{booking.address.street}</p>
                  <p className="text-muted-foreground">
                    {booking.address.city}, {booking.address.state} {booking.address.zip}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open in Maps
                  </Button>
                </div>

                {/* Technician (if assigned) */}
                {booking.technician && booking.status !== "submitted" && (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-frost" />
                      Your Technician
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-frost/10 flex items-center justify-center">
                        <User className="h-7 w-7 text-frost" />
                      </div>
                      <div>
                        <p className="font-semibold">{booking.technician.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{booking.technician.rating}</span>
                          <span>•</span>
                          <span>{booking.technician.jobsCompleted} jobs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Support Section */}
              <div className="rounded-2xl bg-frost/5 border border-frost/20 p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-frost" />
                    <div>
                      <p className="font-medium">Call Support</p>
                      <p className="text-sm text-muted-foreground">24/7 available</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/1234567890"
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Quick responses</p>
                    </div>
                  </a>
                  <button
                    onClick={() => setBooking(null)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Track Another</p>
                      <p className="text-sm text-muted-foreground">Enter new ID</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-border">
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
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" onClick={() => navigate("/")}>
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <Button variant="cta" size="lg" onClick={() => navigate("/book")}>
                  Book Another Service
                </Button>
              </div>
            </motion.div>
          )}

          {/* Empty State when no booking searched */}
          {!booking && !error && !searchParams.get("id") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check Your Booking Status</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter your booking ID above to see real-time updates about your service appointment.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
