import { motion } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Email Confirmation Template Preview
// ============================================

interface EmailTemplateProps {
  bookingId: string;
  customerName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  address: string;
  className?: string;
}

export function EmailConfirmationPreview({
  bookingId,
  customerName,
  serviceName,
  date,
  timeSlot,
  address,
  className
}: EmailTemplateProps) {
  return (
    <div className={cn("max-w-lg mx-auto", className)}>
      {/* Email Header */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-t-xl">
        <Mail className="h-5 w-5 text-frost" />
        <span className="font-medium">Email Confirmation</span>
        <span className="text-xs text-muted-foreground ml-auto">Preview</span>
      </div>

      {/* Email Content */}
      <div className="border border-border rounded-b-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-lg">
        {/* Email Header Bar */}
        <div className="bg-frost p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Booking Confirmed!</h2>
          <p className="text-frost-foreground/80 text-sm">Reference: {bookingId}</p>
        </div>

        {/* Email Body */}
        <div className="p-6 space-y-6">
          <p className="text-foreground">
            Hi <strong>{customerName}</strong>,
          </p>
          <p className="text-muted-foreground">
            Great news! Your service appointment has been confirmed. Here are the details:
          </p>

          {/* Booking Details */}
          <div className="rounded-xl bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-frost" />
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="font-medium">{serviceName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-frost" />
              <div>
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="font-medium">{date} • {timeSlot}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-frost" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{address}</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button className="inline-block px-6 py-3 bg-frost text-frost-foreground font-medium rounded-lg">
              View Booking Details
            </button>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
            <p>Need to make changes? Reply to this email or call us at (123) 456-7890</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SMS Notification Template Preview
// ============================================

interface SMSTemplateProps {
  bookingId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  type: "confirmation" | "reminder" | "ontheway" | "completed";
  className?: string;
}

export function SMSNotificationPreview({
  bookingId,
  serviceName,
  date,
  timeSlot,
  type,
  className
}: SMSTemplateProps) {
  const messages = {
    confirmation: {
      icon: CheckCircle2,
      iconColor: "text-green-500",
      title: "Booking Confirmed",
      message: `✅ Your ${serviceName} is confirmed for ${date} at ${timeSlot}. Booking ID: ${bookingId}. Our technician will arrive on time. Reply HELP for support.`
    },
    reminder: {
      icon: Bell,
      iconColor: "text-amber-500",
      title: "Appointment Reminder",
      message: `⏰ Reminder: Your ${serviceName} appointment is tomorrow ${date} at ${timeSlot}. Our technician will call before arriving. Reply C to confirm or R to reschedule.`
    },
    ontheway: {
      icon: MapPin,
      iconColor: "text-blue-500",
      title: "Technician On The Way",
      message: `🚗 Good news! Your technician John is on the way and will arrive in approximately 15 minutes. Track live: https://track.link/${bookingId}`
    },
    completed: {
      icon: Star,
      iconColor: "text-amber-500",
      title: "Service Completed",
      message: `⭐ Service complete! Thank you for choosing FrostFix. Rate your experience: https://rate.link/${bookingId}. Your 90-day warranty is now active.`
    }
  };

  const config = messages[type];
  const Icon = config.icon;

  return (
    <div className={cn("max-w-sm mx-auto", className)}>
      {/* Phone Frame */}
      <div className="relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-10" />
        
        {/* Phone Screen */}
        <div className="border-4 border-zinc-800 rounded-3xl bg-zinc-900 overflow-hidden pt-8">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-2 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3/4 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* Message Header */}
          <div className="bg-zinc-800 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-frost flex items-center justify-center">
              <span className="text-frost-foreground font-bold text-sm">FF</span>
            </div>
            <div>
              <p className="font-medium text-white">FrostFix</p>
              <p className="text-xs text-zinc-400">SMS</p>
            </div>
          </div>

          {/* Message Content */}
          <div className="p-4 min-h-[200px] bg-zinc-900">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-frost/20 flex items-center justify-center flex-shrink-0">
                <Icon className={cn("h-4 w-4", config.iconColor)} />
              </div>
              <div className="flex-1">
                <div className="bg-zinc-800 rounded-2xl rounded-tl-sm p-3">
                  <p className="text-white text-sm leading-relaxed">{config.message}</p>
                </div>
                <p className="text-xs text-zinc-500 mt-1 ml-2">Just now</p>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-zinc-800 p-3 flex items-center gap-2">
            <div className="flex-1 bg-zinc-700 rounded-full px-4 py-2">
              <span className="text-zinc-400 text-sm">iMessage</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-frost flex items-center justify-center">
              <span className="text-frost-foreground text-lg">↑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center mt-4">
        <span className="text-sm font-medium text-muted-foreground">{config.title}</span>
      </div>
    </div>
  );
}

// ============================================
// Push Notification Template Preview
// ============================================

interface PushNotificationProps {
  title: string;
  message: string;
  time?: string;
  className?: string;
}

export function PushNotificationPreview({
  title,
  message,
  time = "now",
  className
}: PushNotificationProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "max-w-sm mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden border border-border",
        className
      )}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-frost flex items-center justify-center flex-shrink-0">
          <Bell className="h-5 w-5 text-frost-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">FrostFix</p>
            <p className="text-xs text-muted-foreground flex-shrink-0">{time}</p>
          </div>
          <p className="font-medium text-sm mt-0.5">{title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Notification Type Cards
// ============================================

interface NotificationTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "sent" | "pending" | "scheduled";
  time?: string;
}

export function NotificationTypeCard({
  icon,
  title,
  description,
  status,
  time
}: NotificationTypeCardProps) {
  const statusConfig = {
    sent: { label: "Sent", color: "bg-green-500" },
    pending: { label: "Pending", color: "bg-amber-500" },
    scheduled: { label: "Scheduled", color: "bg-blue-500" }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-frost/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{title}</h4>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium text-white",
            statusConfig[status].color
          )}>
            {statusConfig[status].label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        {time && (
          <p className="text-xs text-muted-foreground mt-2">{time}</p>
        )}
      </div>
    </div>
  );
}
