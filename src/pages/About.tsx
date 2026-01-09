import { Link } from "react-router-dom";
import { 
  Users, 
  Award, 
  Clock, 
  ShieldCheck,
  Target,
  Heart,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in every repair, ensuring your cooling systems work like new."
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Your satisfaction is our priority. We treat every customer like family."
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description: "Honest diagnostics, fair pricing, and transparent communication every time."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We stay current with the latest technologies and repair techniques."
  }
];

const team = [
  {
    name: "Michael Torres",
    role: "Founder & Lead Technician",
    bio: "25+ years of HVAC experience. EPA certified.",
    initial: "MT"
  },
  {
    name: "Sarah Chen",
    role: "Operations Manager",
    bio: "Ensuring smooth service delivery since 2015.",
    initial: "SC"
  },
  {
    name: "David Williams",
    role: "Senior Technician",
    bio: "Specialist in commercial refrigeration systems.",
    initial: "DW"
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Relations",
    bio: "Your first point of contact for all service needs.",
    initial: "ER"
  }
];

export default function About() {
  return (
    <MainLayout>
      <PageHeader
        title="About CoolTech"
        description="Trusted cooling experts serving our community since 2010. Professional, reliable, and committed to your comfort."
        breadcrumbs={[{ label: "About Us" }]}
        variant="hero"
      />

      {/* Story Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built on Trust, Driven by Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CoolTech Services was founded in 2010 by Michael Torres, a veteran 
                  HVAC technician who saw an opportunity to bring honest, reliable cooling 
                  repair services to our community.
                </p>
                <p>
                  What started as a one-man operation working out of a single service van 
                  has grown into a trusted team of certified professionals serving thousands 
                  of homes and businesses across the greater metro area.
                </p>
                <p>
                  Our commitment to quality workmanship, fair pricing, and exceptional 
                  customer service has earned us thousands of 5-star reviews and a reputation 
                  as the go-to cooling experts in our community.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard value="15+" label="Years Experience" icon={Clock} />
              <StatCard value="5,000+" label="Happy Customers" icon={Users} />
              <StatCard value="50+" label="Awards Won" icon={Award} />
              <StatCard value="100%" label="Satisfaction" icon={ShieldCheck} />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-background-soft">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">What We Stand For</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div 
                key={value.title}
                className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-frost/10 text-frost mb-4">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team of certified professionals brings decades of combined experience 
              to every job.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div 
                key={member.name}
                className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-secondary-foreground mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-frost font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Experience the CoolTech Difference?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CoolTech for all their 
            cooling needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero-cta" size="xl" asChild>
              <Link to="/book">
                Book Your Service
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
