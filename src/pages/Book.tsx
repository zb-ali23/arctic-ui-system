import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Check,
  Clock,
  User,
  Home,
  Wrench,
  Snowflake,
  Thermometer,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  Sparkles,
  BadgeCheck,
  Star,
  Loader2,
  RotateCcw,
  Edit3
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { AnimatedSection } from "@/components/ui/animated-section";

// Step configuration
const steps = [
  { id: 1, title: "Category", icon: Snowflake, description: "Choose device type" },
  { id: 2, title: "Service", icon: Wrench, description: "Select service" },
  { id: 3, title: "Problem", icon: MessageSquare, description: "Describe issue" },
  { id: 4, title: "Schedule", icon: Calendar, description: "Pick date & time" },
  { id: 5, title: "Contact", icon: User, description: "Your details" },
  { id: 6, title: "Address", icon: Home, description: "Service location" },
  { id: 7, title: "Review", icon: FileText, description: "Confirm booking" }
];

// Service categories
const categories = [
  { 
    id: "ac", 
    name: "Air Conditioner", 
    icon: Snowflake, 
    description: "Window AC, Split AC, Central AC",
    color: "from-blue-500 to-cyan-400"
  },
  { 
    id: "refrigerator", 
    name: "Refrigerator", 
    icon: Thermometer, 
    description: "Single Door, Double Door, Side-by-Side",
    color: "from-emerald-500 to-teal-400"
  }
];

// Services by category
const servicesByCategory = {
  ac: [
    { id: "ac-repair", name: "AC Repair", price: "From $149", time: "1-2 hours", popular: true },
    { id: "ac-installation", name: "AC Installation", price: "From $299", time: "2-4 hours" },
    { id: "ac-gas-refill", name: "Gas Refill / Recharge", price: "$89", time: "30-60 min" },
    { id: "ac-maintenance", name: "Preventive Maintenance", price: "$79", time: "1 hour" },
    { id: "ac-deep-clean", name: "Deep Cleaning", price: "$69", time: "1-2 hours" },
    { id: "ac-emergency", name: "Emergency Repair", price: "$199", time: "Same day", urgent: true }
  ],
  refrigerator: [
    { id: "fridge-repair", name: "Refrigerator Repair", price: "From $129", time: "1-2 hours", popular: true },
    { id: "fridge-not-cooling", name: "Not Cooling Issue", price: "From $99", time: "1-2 hours" },
    { id: "fridge-compressor", name: "Compressor Repair", price: "From $199", time: "2-3 hours" },
    { id: "fridge-thermostat", name: "Thermostat Replacement", price: "$89", time: "30-60 min" },
    { id: "fridge-gas-leak", name: "Gas Leak Repair", price: "From $149", time: "1-2 hours" },
    { id: "fridge-maintenance", name: "Maintenance Service", price: "$69", time: "1 hour" }
  ]
};

// Common problems
const problemSuggestions = {
  ac: [
    "Not cooling properly",
    "Making unusual noise",
    "Water leaking",
    "Not turning on",
    "Bad smell from AC",
    "Remote not working",
    "Ice forming on unit",
    "High electricity bills"
  ],
  refrigerator: [
    "Not cooling enough",
    "Making strange sounds",
    "Ice buildup in freezer",
    "Water leaking inside",
    "Door seal damaged",
    "Compressor running constantly",
    "Not turning on",
    "Frost in fridge section"
  ]
};

// Time slots
const timeSlots = [
  { id: "morning-1", label: "8:00 AM - 10:00 AM", period: "Morning" },
  { id: "morning-2", label: "10:00 AM - 12:00 PM", period: "Morning" },
  { id: "afternoon-1", label: "12:00 PM - 2:00 PM", period: "Afternoon" },
  { id: "afternoon-2", label: "2:00 PM - 4:00 PM", period: "Afternoon" },
  { id: "evening-1", label: "4:00 PM - 6:00 PM", period: "Evening" },
  { id: "evening-2", label: "6:00 PM - 8:00 PM", period: "Evening" }
];

// US States for dropdown
const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

// Trust messages for each step
const trustMessages: Record<number, { icon: typeof ShieldCheck; message: string }> = {
  1: { icon: ShieldCheck, message: "Certified technicians • 90-day warranty on all repairs" },
  2: { icon: BadgeCheck, message: "Transparent pricing • No hidden charges" },
  3: { icon: Star, message: "4.9★ rated service • 10,000+ happy customers" },
  4: { icon: Clock, message: "Same-day service available • Flexible scheduling" },
  5: { icon: ShieldCheck, message: "Your data is secure • We never share your info" },
  6: { icon: MapPin, message: "Serving 50+ areas • Free service visit" },
  7: { icon: CheckCircle2, message: "100% satisfaction guaranteed • Easy rescheduling" }
};

// Initial form data
const initialFormData: BookingFormData = {
  category: "",
  service: "",
  problemDescription: "",
  selectedProblems: [],
  date: "",
  timeSlot: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  notes: ""
};

// Form data interface
interface BookingFormData {
  category: string;
  service: string;
  problemDescription: string;
  selectedProblems: string[];
  date: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
}

// Validation errors interface
interface ValidationErrors {
  [key: string]: string;
}

// Touched fields interface
interface TouchedFields {
  [key: string]: boolean;
}

const STORAGE_KEY = "booking_form_data";

export default function Book() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Refs for auto-focus
  const firstNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved booking data");
      }
    }
    
    // Check for pre-selected category from URL
    const preselectedCategory = searchParams.get("category");
    if (preselectedCategory && ["ac", "refrigerator"].includes(preselectedCategory)) {
      setFormData(prev => ({ ...prev, category: preselectedCategory }));
    }
  }, [searchParams]);

  // Auto-save form data
  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isSubmitted]);

  // Auto-focus on step change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === 4 && dateRef.current) {
        dateRef.current.focus();
      } else if (currentStep === 5 && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (currentStep === 6 && addressRef.current) {
        addressRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const updateFormData = useCallback((field: keyof BookingFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const markFieldTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const toggleProblem = (problem: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProblems: prev.selectedProblems.includes(problem)
        ? prev.selectedProblems.filter(p => p !== problem)
        : [...prev.selectedProblems, problem]
    }));
    // Clear problem error when something is selected
    if (errors.problemDescription) {
      setErrors(prev => ({ ...prev, problemDescription: "" }));
    }
  };

  // Real-time validation for individual fields
  const validateField = useCallback((field: string, value: string): string => {
    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return `${field === "firstName" ? "First" : "Last"} name is required`;
        if (value.length < 2) return "Must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
        break;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[\d\s\-\(\)\+]{10,}$/.test(value.replace(/\s/g, ""))) return "Please enter a valid phone number";
        break;
      case "address":
        if (!value.trim()) return "Address is required";
        break;
      case "city":
        if (!value.trim()) return "City is required";
        break;
      case "zip":
        if (!value.trim()) return "ZIP code is required";
        if (!/^\d{5}(-\d{4})?$/.test(value)) return "Please enter a valid ZIP code";
        break;
    }
    return "";
  }, []);

  const handleFieldBlur = useCallback((field: string, value: string) => {
    markFieldTouched(field);
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [markFieldTouched, validateField]);

  // Check if field is valid (for success state)
  const isFieldValid = useCallback((field: string, value: string): boolean => {
    if (!touched[field]) return false;
    return !validateField(field, value);
  }, [touched, validateField]);

  // Validation for each step
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.category) newErrors.category = "Please select a category";
        break;
      case 2:
        if (!formData.service) newErrors.service = "Please select a service";
        break;
      case 3:
        if (!formData.problemDescription && formData.selectedProblems.length === 0) {
          newErrors.problemDescription = "Please describe your problem or select from suggestions";
        }
        break;
      case 4:
        if (!formData.date) newErrors.date = "Please select a date";
        if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";
        break;
      case 5:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^[\d\s\-\(\)\+]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
          newErrors.phone = "Please enter a valid phone number";
        }
        break;
      case 6:
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.zip.trim()) newErrors.zip = "ZIP code is required";
        break;
    }
    
    setErrors(newErrors);
    
    // Mark all relevant fields as touched
    Object.keys(newErrors).forEach(field => {
      setTouched(prev => ({ ...prev, [field]: true }));
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };
  
  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setDirection(-1);
      setCurrentStep(step);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setTouched({});
    setShowResetConfirm(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = async () => {
    if (!validateStep(7)) return;
    
    setIsSubmitting(true);
    
    try {
      // Get selected service ID from database
      const { data: servicesData } = await supabase
        .from('services')
        .select('id')
        .ilike('name', `%${getServiceName()}%`)
        .limit(1);
      
      const serviceId = servicesData?.[0]?.id;
      
      if (!serviceId) {
        // If no matching service found, just generate a local booking ID
        const id = `BK${Date.now().toString(36).toUpperCase()}`;
        setBookingId(id);
        setIsSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Create or get customer
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .single();

      let customerId: string;
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            source: 'website',
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create customer address
      const { data: addressData, error: addressError } = await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customerId,
          street: formData.address,
          apartment: formData.apartment || null,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          is_default: true,
        })
        .select()
        .single();

      if (addressError) throw addressError;

      // Get time slot ID
      const selectedTimeSlotData = timeSlots.find(ts => ts.id === formData.timeSlot);
      
      // Generate booking number
      const bookingNumber = `BK${Date.now().toString(36).toUpperCase()}`;

      // Determine priority based on service type
      const isEmergency = formData.service.includes('emergency');
      const priority = isEmergency ? 'emergency' : 'normal';

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_number: bookingNumber,
          customer_id: customerId,
          service_id: serviceId,
          address_id: addressData.id,
          scheduled_date: formData.date,
          time_slot_label: selectedTimeSlotData?.label || null,
          priority: priority as 'normal' | 'urgent' | 'emergency',
          status: 'pending',
          customer_notes: formData.notes || null,
          problem_description: formData.problemDescription || null,
          selected_issues: formData.selectedProblems.length > 0 ? formData.selectedProblems : null,
          source: 'website',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      setBookingId(bookingData.booking_number);
      setIsSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Error",
        description: "There was an issue creating your booking. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 100 : -100, opacity: 0 })
  };

  const getServiceName = () => {
    const category = servicesByCategory[formData.category as keyof typeof servicesByCategory];
    return category?.find(s => s.id === formData.service)?.name || "";
  };

  const getServicePrice = () => {
    const category = servicesByCategory[formData.category as keyof typeof servicesByCategory];
    return category?.find(s => s.id === formData.service)?.price || "";
  };

  const getServiceTime = () => {
    const category = servicesByCategory[formData.category as keyof typeof servicesByCategory];
    return category?.find(s => s.id === formData.service)?.time || "";
  };

  // Check if there's any saved progress
  const hasSavedProgress = formData.category || formData.service || formData.firstName;

  // Confirmation Screen
  if (isSubmitted) {
    return (
      <MainLayout>
        <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-frost/5 to-background">
          <div className="container max-w-2xl py-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center"
            >
              {/* Success Icon with confetti effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="relative w-24 h-24 mx-auto mb-8"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                {/* Animated rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-400/30"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-400/20"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, delay: 0.2 }}
                />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Booking Confirmed!
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Your service has been scheduled successfully.
              </motion.p>

              {/* Booking ID */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-lg font-mono font-semibold mb-8"
              >
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="text-foreground">{bookingId}</span>
              </motion.div>

              {/* Booking Summary Card */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-border bg-card p-6 text-left mb-8"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-frost" />
                  Booking Summary
                </h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{getServiceName()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {new Date(formData.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })} • {timeSlots.find(t => t.id === formData.timeSlot)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-right max-w-[200px]">
                      {formData.address}, {formData.city}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Estimated Price</span>
                    <span className="font-semibold text-frost">{getServicePrice()}</span>
                  </div>
                </div>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl bg-frost/10 border border-frost/20 p-6 mb-8"
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-frost">
                  <Sparkles className="h-5 w-5" />
                  What Happens Next?
                </h3>
                <div className="grid gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-frost/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-frost">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Confirmation Call</p>
                      <p className="text-sm text-muted-foreground">
                        Our team will call you within 30 minutes to confirm your appointment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-frost/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-frost">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Technician Assigned</p>
                      <p className="text-sm text-muted-foreground">
                        A certified technician will be assigned to your service.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-frost/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-frost">3</span>
                    </div>
                    <div>
                      <p className="font-medium">On-Time Arrival</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive an SMS when our technician is on the way.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button variant="cta" size="lg" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
                <Button variant="outline" size="lg" onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData(initialFormData);
                  setErrors({});
                  setTouched({});
                }}>
                  Book Another Service
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Book a Service"
        description="Schedule your repair in minutes. We'll confirm within 30 minutes."
        breadcrumbs={[{ label: "Book Service" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container max-w-5xl">
          {/* Progress Steps - Desktop */}
          <AnimatedSection className="mb-10 hidden lg:block">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={step.id > currentStep}
                    className="flex flex-col items-center group"
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep > step.id
                          ? "bg-green-500 text-white"
                          : currentStep === step.id
                          ? "bg-frost text-frost-foreground ring-4 ring-frost/20"
                          : "bg-muted text-muted-foreground"
                      } ${step.id < currentStep ? "cursor-pointer hover:ring-2 hover:ring-frost/30" : ""}`}
                      whileHover={step.id < currentStep ? { scale: 1.05 } : {}}
                      whileTap={step.id < currentStep ? { scale: 0.95 } : {}}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </motion.div>
                    <span className={`text-xs mt-2 font-medium transition-colors ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Progress Steps - Mobile */}
          <AnimatedSection className="mb-8 lg:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {steps[currentStep - 1].description}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-frost rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-frost text-frost-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-3 w-3" /> : step.id}
                </button>
              ))}
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form Area */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
                {/* Trust Badge */}
                <div className="flex items-center gap-3 p-4 bg-frost/5 border-b border-frost/10">
                  {(() => {
                    const TrustIcon = trustMessages[currentStep].icon;
                    return <TrustIcon className="h-5 w-5 text-frost flex-shrink-0" />;
                  })()}
                  <span className="text-sm font-medium text-frost">
                    {trustMessages[currentStep].message}
                  </span>
                </div>

                <div className="p-6 md:p-8">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Step 1: Category Selection */}
                      {currentStep === 1 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">What needs repair?</h2>
                          <p className="text-muted-foreground mb-6">Select the appliance you need help with</p>
                          
                          <div className="grid sm:grid-cols-2 gap-4">
                            {categories.map((category) => (
                              <motion.button
                                key={category.id}
                                onClick={() => {
                                  updateFormData("category", category.id);
                                  updateFormData("service", "");
                                  updateFormData("selectedProblems", []);
                                }}
                                className={`group relative p-6 rounded-2xl border-2 text-left transition-all overflow-hidden ${
                                  formData.category === category.id
                                    ? "border-frost bg-frost/5 shadow-lg"
                                    : "border-border hover:border-frost/50 hover:bg-muted/50"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                                  formData.category === category.id
                                    ? "bg-frost text-frost-foreground"
                                    : "bg-muted text-muted-foreground group-hover:bg-frost/20 group-hover:text-frost"
                                }`}>
                                  <category.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                                {formData.category === category.id && (
                                  <motion.div 
                                    className="absolute top-4 right-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-frost flex items-center justify-center">
                                      <Check className="h-4 w-4 text-frost-foreground" />
                                    </div>
                                  </motion.div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                          
                          {errors.category && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-destructive text-sm mt-4 flex items-center gap-2"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.category}
                            </motion.p>
                          )}
                        </div>
                      )}

                      {/* Step 2: Service Selection */}
                      {currentStep === 2 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Select a Service</h2>
                          <p className="text-muted-foreground mb-6">
                            Choose the service that best matches your needs
                          </p>
                          
                          <div className="grid gap-3">
                            {servicesByCategory[formData.category as keyof typeof servicesByCategory]?.map((service, index) => (
                              <motion.button
                                key={service.id}
                                onClick={() => updateFormData("service", service.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                                  formData.service === service.id
                                    ? "border-frost bg-frost/5"
                                    : "border-border hover:border-frost/50"
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 4 }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    formData.service === service.id 
                                      ? "border-frost bg-frost" 
                                      : "border-muted-foreground"
                                  }`}>
                                    {formData.service === service.id && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      >
                                        <Check className="h-3 w-3 text-frost-foreground" />
                                      </motion.div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-medium">{service.name}</span>
                                      {service.popular && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-frost/10 text-frost rounded-full">
                                          Popular
                                        </span>
                                      )}
                                      {service.urgent && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-orange-500/10 text-orange-500 rounded-full">
                                          Urgent
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      Estimated time: {service.time}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-frost">{service.price}</span>
                              </motion.button>
                            ))}
                          </div>
                          
                          {errors.service && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-destructive text-sm mt-4 flex items-center gap-2"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.service}
                            </motion.p>
                          )}
                        </div>
                      )}

                      {/* Step 3: Problem Description */}
                      {currentStep === 3 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Describe the Problem</h2>
                          <p className="text-muted-foreground mb-6">
                            Help us understand the issue better
                          </p>
                          
                          <div className="mb-6">
                            <p className="text-sm font-medium mb-3">Common issues (select all that apply)</p>
                            <div className="flex flex-wrap gap-2">
                              {problemSuggestions[formData.category as keyof typeof problemSuggestions]?.map((problem) => (
                                <motion.button
                                  key={problem}
                                  onClick={() => toggleProblem(problem)}
                                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                                    formData.selectedProblems.includes(problem)
                                      ? "bg-frost text-frost-foreground"
                                      : "bg-muted hover:bg-muted/80 text-foreground"
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {formData.selectedProblems.includes(problem) && (
                                    <Check className="h-3 w-3 inline mr-1" />
                                  )}
                                  {problem}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          
                          <FormTextarea
                            label="Additional details (optional)"
                            placeholder="Please describe any additional symptoms, when the problem started, or other relevant information..."
                            value={formData.problemDescription}
                            onChange={(e) => updateFormData("problemDescription", e.target.value)}
                            className="min-h-[120px]"
                            showCharCount
                            maxLength={500}
                          />
                          
                          {errors.problemDescription && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-destructive text-sm mt-4 flex items-center gap-2"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {errors.problemDescription}
                            </motion.p>
                          )}
                        </div>
                      )}

                      {/* Step 4: Date & Time Selection */}
                      {currentStep === 4 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Choose Date & Time</h2>
                          <p className="text-muted-foreground mb-6">
                            Select your preferred appointment slot
                          </p>
                          
                          <div className="space-y-6">
                            <FormInput
                              ref={dateRef}
                              label="Preferred Date"
                              type="date"
                              icon={Calendar}
                              value={formData.date}
                              onChange={(e) => updateFormData("date", e.target.value)}
                              onBlur={(e) => handleFieldBlur("date", e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              error={touched.date ? errors.date : undefined}
                              success={isFieldValid("date", formData.date)}
                              required
                            />
                            
                            <div>
                              <p className="text-sm font-medium mb-3">
                                Preferred Time Slot <span className="text-destructive">*</span>
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {timeSlots.map((slot) => (
                                  <motion.button
                                    key={slot.id}
                                    onClick={() => updateFormData("timeSlot", slot.id)}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                                      formData.timeSlot === slot.id
                                        ? "border-frost bg-frost/5"
                                        : "border-border hover:border-frost/50"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <p className="text-xs text-muted-foreground mb-1">{slot.period}</p>
                                    <p className="text-sm font-medium">{slot.label}</p>
                                    {formData.timeSlot === slot.id && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mt-1"
                                      >
                                        <Check className="h-4 w-4 text-frost mx-auto" />
                                      </motion.div>
                                    )}
                                  </motion.button>
                                ))}
                              </div>
                              {errors.timeSlot && (
                                <motion.p 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-destructive text-sm mt-2 flex items-center gap-2"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  {errors.timeSlot}
                                </motion.p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 5: Contact Details */}
                      {currentStep === 5 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
                          <p className="text-muted-foreground mb-6">
                            How can we reach you about your appointment?
                          </p>
                          
                          <div className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <FormInput
                                ref={firstNameRef}
                                label="First Name"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => updateFormData("firstName", e.target.value)}
                                onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                                error={touched.firstName ? errors.firstName : undefined}
                                success={isFieldValid("firstName", formData.firstName)}
                                required
                              />
                              <FormInput
                                label="Last Name"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => updateFormData("lastName", e.target.value)}
                                onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                                error={touched.lastName ? errors.lastName : undefined}
                                success={isFieldValid("lastName", formData.lastName)}
                                required
                              />
                            </div>
                            <FormInput
                              label="Email Address"
                              type="email"
                              placeholder="john@example.com"
                              icon={Mail}
                              value={formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              onBlur={(e) => handleFieldBlur("email", e.target.value)}
                              error={touched.email ? errors.email : undefined}
                              success={isFieldValid("email", formData.email)}
                              helperText="We'll send booking confirmation to this email"
                              required
                            />
                            <FormInput
                              label="Phone Number"
                              type="tel"
                              placeholder="(555) 123-4567"
                              icon={Phone}
                              value={formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              onBlur={(e) => handleFieldBlur("phone", e.target.value)}
                              error={touched.phone ? errors.phone : undefined}
                              success={isFieldValid("phone", formData.phone)}
                              helperText="For appointment reminders and updates"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 6: Service Address */}
                      {currentStep === 6 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Service Address</h2>
                          <p className="text-muted-foreground mb-6">
                            Where should we send our technician?
                          </p>
                          
                          <div className="space-y-5">
                            <FormInput
                              ref={addressRef}
                              label="Street Address"
                              placeholder="123 Main Street"
                              icon={MapPin}
                              value={formData.address}
                              onChange={(e) => updateFormData("address", e.target.value)}
                              onBlur={(e) => handleFieldBlur("address", e.target.value)}
                              error={touched.address ? errors.address : undefined}
                              success={isFieldValid("address", formData.address)}
                              required
                            />
                            <FormInput
                              label="Apartment, Suite, etc. (optional)"
                              placeholder="Apt 4B"
                              value={formData.apartment}
                              onChange={(e) => updateFormData("apartment", e.target.value)}
                            />
                            <div className="grid sm:grid-cols-3 gap-4">
                              <FormInput
                                label="City"
                                placeholder="City"
                                value={formData.city}
                                onChange={(e) => updateFormData("city", e.target.value)}
                                onBlur={(e) => handleFieldBlur("city", e.target.value)}
                                error={touched.city ? errors.city : undefined}
                                success={isFieldValid("city", formData.city)}
                                required
                              />
                              <FormSelect
                                label="State"
                                placeholder="Select state"
                                options={usStates}
                                value={formData.state}
                                onChange={(value) => updateFormData("state", value)}
                              />
                              <FormInput
                                label="ZIP Code"
                                placeholder="12345"
                                value={formData.zip}
                                onChange={(e) => updateFormData("zip", e.target.value)}
                                onBlur={(e) => handleFieldBlur("zip", e.target.value)}
                                error={touched.zip ? errors.zip : undefined}
                                success={isFieldValid("zip", formData.zip)}
                                required
                              />
                            </div>
                            <FormTextarea
                              label="Special Instructions (optional)"
                              placeholder="Gate code, parking instructions, landmark, etc."
                              value={formData.notes}
                              onChange={(e) => updateFormData("notes", e.target.value)}
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 7: Review & Confirm */}
                      {currentStep === 7 && (
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Review Your Booking</h2>
                          <p className="text-muted-foreground mb-6">
                            Please confirm your details before submitting
                          </p>
                          
                          <div className="space-y-4">
                            {/* Service Summary */}
                            <div className="rounded-xl bg-muted/50 p-5 relative group">
                              <button
                                onClick={() => goToStep(2)}
                                className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                              >
                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-frost" />
                                Service Details
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Category</span>
                                  <span className="font-medium">
                                    {categories.find(c => c.id === formData.category)?.name}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Service</span>
                                  <span className="font-medium">{getServiceName()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="font-medium">{getServiceTime()}</span>
                                </div>
                                {formData.selectedProblems.length > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Issues</span>
                                    <span className="font-medium text-right max-w-[200px]">
                                      {formData.selectedProblems.slice(0, 2).join(", ")}
                                      {formData.selectedProblems.length > 2 && ` +${formData.selectedProblems.length - 2} more`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Schedule Summary */}
                            <div className="rounded-xl bg-muted/50 p-5 relative group">
                              <button
                                onClick={() => goToStep(4)}
                                className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                              >
                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-frost" />
                                Appointment
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Date</span>
                                  <span className="font-medium">
                                    {formData.date && new Date(formData.date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Time</span>
                                  <span className="font-medium">
                                    {timeSlots.find(t => t.id === formData.timeSlot)?.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Contact Summary */}
                            <div className="rounded-xl bg-muted/50 p-5 relative group">
                              <button
                                onClick={() => goToStep(5)}
                                className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                              >
                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <User className="h-4 w-4 text-frost" />
                                Contact Information
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Name</span>
                                  <span className="font-medium">
                                    {formData.firstName} {formData.lastName}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email</span>
                                  <span className="font-medium">{formData.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Phone</span>
                                  <span className="font-medium">{formData.phone}</span>
                                </div>
                              </div>
                            </div>

                            {/* Address Summary */}
                            <div className="rounded-xl bg-muted/50 p-5 relative group">
                              <button
                                onClick={() => goToStep(6)}
                                className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                              >
                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-frost" />
                                Service Address
                              </h3>
                              <p className="text-sm">
                                {formData.address}
                                {formData.apartment && `, ${formData.apartment}`}
                                <br />
                                {formData.city}{formData.state && `, ${formData.state}`} {formData.zip}
                              </p>
                            </div>

                            {/* Price Estimate */}
                            <div className="rounded-xl border-2 border-frost/20 bg-frost/5 p-5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold">Estimated Price</p>
                                  <p className="text-sm text-muted-foreground">Final price after inspection</p>
                                </div>
                                <span className="text-2xl font-bold text-frost">{getServicePrice()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      {currentStep > 1 && (
                        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      )}
                      {hasSavedProgress && currentStep === 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowResetConfirm(true)}
                          className="text-muted-foreground"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Start Over
                        </Button>
                      )}
                    </div>
                    
                    {currentStep < 7 ? (
                      <Button variant="cta" onClick={nextStep}>
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        variant="cta" 
                        size="lg" 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            Confirm Booking
                            <Check className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset Confirmation Modal */}
              <AnimatePresence>
                {showResetConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl"
                    >
                      <h3 className="text-lg font-semibold mb-2">Start Over?</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        This will clear all your progress and start fresh. Are you sure?
                      </p>
                      <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReset}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Booking Summary */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-4">Your Booking</h3>
                  <div className="space-y-3 text-sm">
                    {formData.category && (
                      <motion.div 
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">
                          {categories.find(c => c.id === formData.category)?.name}
                        </span>
                      </motion.div>
                    )}
                    {formData.service && (
                      <motion.div 
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{getServiceName()}</span>
                      </motion.div>
                    )}
                    {formData.date && (
                      <motion.div 
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {new Date(formData.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </motion.div>
                    )}
                    {formData.timeSlot && (
                      <motion.div 
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">
                          {timeSlots.find(t => t.id === formData.timeSlot)?.label.split(' - ')[0]}
                        </span>
                      </motion.div>
                    )}
                    {!formData.category && !formData.service && (
                      <p className="text-muted-foreground text-center py-4">
                        Select a service to see details
                      </p>
                    )}
                  </div>
                  
                  {formData.service && (
                    <motion.div 
                      className="mt-4 pt-4 border-t border-border"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Estimated</span>
                        <span className="text-lg font-bold text-frost">{getServicePrice()}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Help Card */}
                <div className="rounded-2xl bg-frost/5 border border-frost/20 p-6">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our team is available 24/7 to assist you
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+1234567890"
                      className="flex items-center gap-3 text-sm font-medium text-frost hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      (123) 456-7890
                    </a>
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm font-medium text-frost hover:underline"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp Us
                    </a>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">90-Day Warranty</p>
                        <p className="text-xs text-muted-foreground">On all repairs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Certified Technicians</p>
                        <p className="text-xs text-muted-foreground">Background verified</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">4.9★ Rating</p>
                        <p className="text-xs text-muted-foreground">10,000+ reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
