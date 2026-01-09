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
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Business Summary */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                <Snowflake className="h-5 w-5 text-frost" />
              </div>
              <span className="font-bold text-xl">CoolTech</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Professional AC and refrigerator repair services. Fast, reliable, 
              and affordable cooling solutions for homes and businesses since 2010.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-frost" />
                Licensed
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium">
                <Award className="h-4 w-4 text-accent-warm" />
                Certified
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium">
                <BadgeCheck className="h-4 w-4 text-accent" />
                Insured
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-frost shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a href="tel:+15551234567" className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
                    (555) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-frost shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:hello@cooltech.com" className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
                    hello@cooltech.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-frost shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Service Area</p>
                  <p className="text-sm text-primary-foreground/70">
                    Greater Metro Area
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-frost shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm text-primary-foreground/70">
                    Mon-Sat: 8AM - 8PM
                    <br />
                    Emergency: 24/7
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} CoolTech Services. All rights reserved.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-primary-foreground/70 hover:bg-white/20 hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
