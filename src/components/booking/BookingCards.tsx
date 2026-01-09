import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Wrench,
  ChevronRight,
  MoreVertical,
  Copy,
  ExternalLink,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  StatusBadge, 
  PaymentBadge, 
  PriorityBadge,
  StatusDot 
} from "@/components/booking/StatusBadges";
import { 
  Booking, 
  formatBookingDate, 
  formatServicePrice,
  getCustomerFullName,
  getCustomerInitials,
  getRelativeTime
} from "@/types/booking";
import { useState } from "react";

// ============================================
// Booking Card - Compact List Item
// ============================================

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

export function BookingCard({ 
  booking, 
  onClick,
  showActions = true,
  className 
}: BookingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "group p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Service Icon */}
          <div className="w-12 h-12 rounded-xl bg-frost/10 flex items-center justify-center flex-shrink-0">
            <Wrench className="h-6 w-6 text-frost" />
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">
                {booking.service?.name || "Service"}
              </h3>
              <StatusBadge status={booking.status} size="sm" showIcon={false} />
              <PriorityBadge priority={booking.priority} />
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatBookingDate(booking.schedule.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {booking.schedule.time_slot_label}
              </span>
            </div>

            {booking.customer && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {getCustomerInitials(booking.customer)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {getCustomerFullName(booking.customer)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            #{booking.booking_number}
          </span>
          {booking.estimated_price && (
            <span className="font-semibold text-frost">
              ${booking.estimated_price}
            </span>
          )}
          {showActions && (
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Booking Preview Card - Detailed View
// ============================================

interface BookingPreviewProps {
  booking: Booking;
  onViewDetails?: () => void;
  onCopyId?: () => void;
  className?: string;
}

export function BookingPreview({ 
  booking, 
  onViewDetails,
  onCopyId,
  className 
}: BookingPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(booking.booking_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopyId?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusDot status={booking.status} pulse size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{booking.booking_number}</span>
                <button
                  onClick={handleCopyId}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  {copied ? (
                    <span className="text-xs text-green-500">Copied!</span>
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Created {getRelativeTime(booking.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} animated />
            <PaymentBadge status={booking.payment_status} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Service */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
            <Wrench className="h-5 w-5 text-frost" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Service</p>
            <p className="font-medium">{booking.service?.name}</p>
            {booking.service && (
              <p className="text-sm text-frost font-medium">
                {formatServicePrice(booking.service)}
              </p>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5 text-frost" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Appointment</p>
            <p className="font-medium">{formatBookingDate(booking.schedule.date)}</p>
            <p className="text-sm text-muted-foreground">{booking.schedule.time_slot_label}</p>
          </div>
        </div>

        {/* Customer */}
        {booking.customer && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-frost" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{getCustomerFullName(booking.customer)}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {booking.customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {booking.customer.email}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Address */}
        {booking.address && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-frost" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{booking.address.street}</p>
              <p className="text-sm text-muted-foreground">
                {booking.address.city}, {booking.address.state} {booking.address.zip}
              </p>
            </div>
          </div>
        )}

        {/* Technician */}
        {booking.technician && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-frost/20 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-frost" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Assigned Technician</p>
              <p className="font-medium">
                {booking.technician.first_name} {booking.technician.last_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm">{booking.technician.rating}</span>
                <span className="text-sm text-muted-foreground">
                  • {booking.technician.total_jobs} jobs
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {onViewDetails && (
        <div className="p-4 border-t border-border">
          <Button variant="cta" className="w-full" onClick={onViewDetails}>
            View Full Details
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// Booking Summary Card - Minimal
// ============================================

interface BookingSummaryProps {
  booking: Booking;
  className?: string;
}

export function BookingSummary({ booking, className }: BookingSummaryProps) {
  return (
    <div className={cn(
      "p-4 rounded-xl border border-border bg-card",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-sm font-medium">{booking.booking_number}</span>
        <StatusBadge status={booking.status} size="sm" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium">{booking.service?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{formatBookingDate(booking.schedule.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{booking.schedule.time_slot_label}</span>
        </div>
        {booking.estimated_price && (
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="text-muted-foreground">Estimated</span>
            <span className="font-semibold text-frost">${booking.estimated_price}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Booking List Item - Table Row Style
// ============================================

interface BookingListItemProps {
  booking: Booking;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function BookingListItem({ 
  booking, 
  onClick,
  selected,
  className 
}: BookingListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer",
        selected 
          ? "border-frost bg-frost/5" 
          : "border-transparent hover:bg-muted/50",
        className
      )}
    >
      <StatusDot status={booking.status} pulse />
      
      <div className="flex-1 min-w-0 grid grid-cols-5 gap-4 items-center">
        <div className="col-span-2">
          <p className="font-medium truncate">{booking.service?.name}</p>
          <p className="text-xs text-muted-foreground">{booking.booking_number}</p>
        </div>
        
        <div>
          <p className="text-sm">{formatBookingDate(booking.schedule.date)}</p>
          <p className="text-xs text-muted-foreground">{booking.schedule.time_slot_label}</p>
        </div>
        
        <div className="hidden md:block">
          {booking.customer && (
            <p className="text-sm truncate">{getCustomerFullName(booking.customer)}</p>
          )}
        </div>
        
        <div className="flex items-center justify-end gap-2">
          <StatusBadge status={booking.status} size="sm" showIcon={false} />
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
