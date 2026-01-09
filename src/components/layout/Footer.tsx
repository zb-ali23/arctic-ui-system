import { Link } from "react-router-dom";
import { 
  Snowflake, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ShieldCheck,
  Award,
  BadgeCheck
} from "lucide-react";

const services = [
  { title: "AC Repair", href: "/services/ac-repair" },
  { title: "Refrigerator Repair", href: "/services/refrigerator-repair" },
  { title: "Preventive Maintenance", href: "/services/maintenance" },
  { title: "Emergency Service", href: "/services/emergency" },
  { title: "Commercial HVAC", href: "/services/commercial" },
];

const quickLinks = [
  { title: "About Us", href: "/about" },
  { title: "Pricing", href: "/pricing" },
  { title: "FAQ", href: "/faq" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
  { title: "Book Service", href: "/book" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pb-24 md:pb-0" role="contentinfo" aria-label="Site footer">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Business Summary */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4" aria-label="CoolTech Home">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                <Snowflake className="h-5 w-5 text-frost" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl">CoolTech</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Professional AC and refrigerator repair services. Fast, reliable, 
              and affordable cooling solutions for homes and businesses since 2010.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-frost" aria-hidden="true" />
                <span>Licensed</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-medium">
                <Award className="h-4 w-4 text-accent-warm" aria-hidden="true" />
                <span>Certified</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-medium">
                <BadgeCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Insured</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services navigation">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Our Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-block py-1 touch-manipulation"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick links navigation">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-block py-1 touch-manipulation"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="not-italic col-span-2 sm:col-span-1">
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-frost shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a 
                    href="tel:+15551234567" 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors touch-manipulation"
                  >
                    (555) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-frost shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a 
                    href="mailto:hello@cooltech.com" 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors touch-manipulation"
                  >
                    hello@cooltech.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-frost shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Service Area</p>
                  <p className="text-sm text-primary-foreground/70">
                    Greater Metro Area
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-frost shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm text-primary-foreground/70">
                    Mon-Sat: 8AM - 8PM
                    <br />
                    <span className="text-frost font-medium">Emergency: 24/7</span>
                  </p>
                </div>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs sm:text-sm text-primary-foreground/60 text-center md:text-left">
              © {new Date().getFullYear()} CoolTech Services. All rights reserved.
            </p>
            
            {/* Social Icons */}
            <nav aria-label="Social media links" className="flex items-center justify-center gap-3 sm:gap-4 order-first md:order-none">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`Follow us on ${social.label}`}
                  className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-white/10 text-primary-foreground/70 hover:bg-white/20 hover:text-primary-foreground transition-colors touch-manipulation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </nav>
            
            {/* Legal Links */}
            <nav aria-label="Legal links" className="flex items-center justify-center gap-4 sm:gap-6">
              <Link 
                to="/privacy" 
                className="text-xs sm:text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors touch-manipulation py-1"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-xs sm:text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors touch-manipulation py-1"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
