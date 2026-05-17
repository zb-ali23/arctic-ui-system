import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Snowflake, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const services = [
  { title: "AC Repair & Service", href: "/services/ac-repair", description: "Complete air conditioning repair and maintenance" },
  { title: "Refrigerator Repair", href: "/services/refrigerator-repair", description: "Expert fridge and freezer repairs" },
  { title: "Preventive Maintenance", href: "/services/maintenance", description: "Keep your systems running efficiently" },
  { title: "Emergency Service", href: "/services/emergency", description: "24/7 emergency cooling repairs" },
  { title: "Commercial HVAC", href: "/services/commercial", description: "Solutions for businesses" },
];

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services", hasDropdown: true },
  { title: "About", href: "/about" },
  { title: "Pricing", href: "/pricing" },
  { title: "FAQ", href: "/faq" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = isScrolled || !isHome
    ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
    : "bg-transparent";

  const textColor = isScrolled || !isHome ? "text-foreground" : "text-white";
  const logoColor = isScrolled || !isHome ? "bg-primary" : "bg-white/20 backdrop-blur-sm";
  const logoIconColor = isScrolled || !isHome ? "text-primary-foreground" : "text-frost";

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", headerBg)}>
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl transition-colors", logoColor)}>
            <Snowflake className={cn("h-5 w-5", logoIconColor)} />
          </div>
          <span className={cn("font-bold text-xl transition-colors", textColor)}>CoolTech</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                {link.hasDropdown ? (
                  <>
                    <NavigationMenuTrigger 
                      className={cn(
                        "bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10",
                        textColor
                      )}
                    >
                      {link.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        {services.map((service) => (
                          <li key={service.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={service.href}
                                className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                              >
                                <div className="text-sm font-medium leading-none">{service.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {service.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                        <li className="col-span-2">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/services"
                              className="flex items-center justify-center gap-2 rounded-lg bg-secondary p-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            >
                              View All Services
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors hover:opacity-80",
                      textColor,
                      location.pathname === link.href && "opacity-100 font-semibold"
                    )}
                  >
                    {link.title}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant={isScrolled || !isHome ? "ghost" : "glass"} size="sm" asChild>
            <Link to="/admin/login" title="Portal Login">
              <User className="h-4 w-4 mr-1.5" />
              Login
            </Link>
          </Button>
          <Button variant={isScrolled || !isHome ? "outline" : "glass"} size="sm" asChild>
            <Link to="/book">Book Service</Link>
          </Button>
          <Button variant="cta" size="sm">
            <Phone className="h-4 w-4" />
            (555) 123-4567
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className={textColor}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                    <Snowflake className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl">CoolTech</span>
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              
              <nav className="flex-1 overflow-auto p-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      {link.hasDropdown ? (
                        <div className="space-y-1">
                          <Link
                            to={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                          >
                            {link.title}
                            <ChevronDown className="h-4 w-4" />
                          </Link>
                          <ul className="ml-4 space-y-1 border-l-2 border-border pl-4">
                            {services.map((service) => (
                              <li key={service.href}>
                                <Link
                                  to={service.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {service.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-3 rounded-lg font-medium transition-colors hover:bg-muted",
                            location.pathname === link.href 
                              ? "bg-muted text-primary" 
                              : "text-foreground"
                          )}
                        >
                          {link.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="p-4 border-t border-border space-y-3">
                <Button variant="cta" size="lg" className="w-full" asChild>
                  <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                    Book Service Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 123-4567
                </Button>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2 text-center">Staff & Partners</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-1" />
                        Admin
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link to="/technician/auth" onClick={() => setMobileMenuOpen(false)}>
                        Technician
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
