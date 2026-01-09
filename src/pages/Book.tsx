import { useState } from "react";
import { Link } from "react-router-dom";
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
  Wrench
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { AnimatedSection } from "@/components/ui/animated-section";

const steps = [
  { id: 1, title: "Service", icon: Wrench },
  { id: 2, title: "Details", icon: Home },
  { id: 3, title: "Contact", icon: User },
  { id: 4, title: "Confirm", icon: Check }
];

const services = [
  { id: "ac-repair", name: "AC Repair", price: "From $149" },
  { id: "refrigerator-repair", name: "Refrigerator Repair", price: "From $129" },
  { id: "maintenance", name: "Preventive Maintenance", price: "$129" },
  { id: "emergency", name: "Emergency Service", price: "$99 diagnostic" },
  { id: "commercial", name: "Commercial HVAC", price: "Custom quote" }
];

const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM"
];

export default function Book() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    timeSlot: "",
    address: "",
    city: "",
    zip: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 })
  };

  return (
    <MainLayout>
      <PageHeader
        title="Book a Service"
        description="Schedule your repair or maintenance in just a few steps."
        breadcrumbs={[{ label: "Book Service" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container max-w-4xl">
          {/* Progress Steps */}
          <AnimatedSection className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? "bg-frost text-frost-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      currentStep >= step.id ? "text-frost" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                      currentStep > step.id ? "bg-frost" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Form Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg overflow-hidden">
            {/* Trust Badge */}
            <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-frost/10 text-frost">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Same-day service • No hidden fees • 90-day warranty</span>
            </div>

            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
                    <div className="grid gap-3">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => updateFormData("service", service.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                            formData.service === service.id
                              ? "border-frost bg-frost/5"
                              : "border-border hover:border-frost/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.service === service.id ? "border-frost bg-frost" : "border-muted-foreground"
                            }`}>
                              {formData.service === service.id && (
                                <Check className="h-3 w-3 text-frost-foreground" />
                              )}
                            </div>
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <span className="text-sm text-frost font-medium">{service.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Service Details</h2>
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput 
                          label="Preferred Date" 
                          type="date" 
                          icon={Calendar}
                          value={formData.date}
                          onChange={(e) => updateFormData("date", e.target.value)}
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Preferred Time</label>
                          <select 
                            className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm"
                            value={formData.timeSlot}
                            onChange={(e) => updateFormData("timeSlot", e.target.value)}
                          >
                            <option value="">Select a time</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <FormInput 
                        label="Street Address" 
                        placeholder="123 Main Street" 
                        icon={MapPin}
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput 
                          label="City" 
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => updateFormData("city", e.target.value)}
                        />
                        <FormInput 
                          label="ZIP Code" 
                          placeholder="12345"
                          value={formData.zip}
                          onChange={(e) => updateFormData("zip", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Your Information</h2>
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput 
                          label="First Name" 
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                        />
                        <FormInput 
                          label="Last Name" 
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                        />
                      </div>
                      <FormInput 
                        label="Email" 
                        type="email" 
                        placeholder="john@example.com" 
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                      <FormInput 
                        label="Phone" 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                      />
                      <FormTextarea 
                        label="Additional Notes (Optional)" 
                        placeholder="Describe your issue or any special instructions..."
                        value={formData.notes}
                        onChange={(e) => updateFormData("notes", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>
                    <div className="space-y-4">
                      <div className="rounded-xl bg-muted/50 p-5 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service</span>
                          <span className="font-medium">{services.find(s => s.id === formData.service)?.name || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date & Time</span>
                          <span className="font-medium">{formData.date} • {formData.timeSlot || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address</span>
                          <span className="font-medium text-right">{formData.address}, {formData.city} {formData.zip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact</span>
                          <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-medium">{formData.phone}</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-frost/20 bg-frost/5 p-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-frost mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">What happens next?</p>
                            <p className="text-sm text-muted-foreground">
                              We'll confirm your appointment within 30 minutes via phone or text.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep < 4 ? (
                <Button variant="cta" onClick={nextStep}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button variant="cta" size="lg">
                  Confirm Booking
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
