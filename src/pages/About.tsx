import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, Award, Clock, ShieldCheck, Target, Heart, Lightbulb, Handshake, ArrowRight, CheckCircle
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { AnimatedCounter } from "@/hooks/use-counter";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const valueIcons = [Target, Heart, ShieldCheck, Lightbulb];

const team = [
  { name: "Michael Torres", role: "Founder & Lead Technician", bio: "25+ years HVAC experience. EPA & NATE certified.", initial: "MT" },
  { name: "Sarah Chen", role: "Operations Manager", bio: "Ensuring smooth service delivery since 2015.", initial: "SC" },
  { name: "David Williams", role: "Senior Technician", bio: "Specialist in commercial refrigeration.", initial: "DW" },
  { name: "Emily Rodriguez", role: "Customer Success", bio: "Your first point of contact for all needs.", initial: "ER" }
];

const milestones = [
  { year: "2010", title: "Founded", description: "Started with one van and a commitment to quality." },
  { year: "2014", title: "Team Expansion", description: "Grew to 5 technicians serving the full metro area." },
  { year: "2018", title: "Commercial Division", description: "Launched dedicated commercial HVAC services." },
  { year: "2022", title: "5,000 Customers", description: "Reached milestone of 5,000 satisfied customers." },
  { year: "2024", title: "Award Winning", description: "Named Best Local HVAC Service by Metro Magazine." }
];

export default function About() {
  const { aboutPage } = useWebsiteContent();

  const certifications = aboutPage.certifications.split(",").map(c => c.trim()).filter(Boolean);

  const values = Array.from({ length: 4 }, (_, i) => ({
    icon: valueIcons[i],
    title: (aboutPage as any)[`value_${i + 1}_title`] as string,
    description: (aboutPage as any)[`value_${i + 1}_desc`] as string,
  }));

  return (
    <MainLayout>
      <PageHeader
        title={aboutPage.page_title}
        description={aboutPage.page_description}
        breadcrumbs={[{ label: "About Us" }]}
        variant="hero"
      />

      {/* Story Section */}
      <section className="section bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
                {aboutPage.story_badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {aboutPage.story_title}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{aboutPage.story_paragraph_1}</p>
                <p>{aboutPage.story_paragraph_2}</p>
                <p>{aboutPage.story_paragraph_3}</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {certifications.map((cert) => (
                  <span key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-accent" />
                    {cert}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 15, suffix: "+", label: "Years Experience", icon: Clock },
                  { value: 5000, suffix: "+", label: "Happy Customers", icon: Users },
                  { value: 50, suffix: "+", label: "Awards Won", icon: Award },
                  { value: 100, suffix: "%", label: "Satisfaction", icon: Heart }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                    <stat.icon className="h-8 w-8 text-frost mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-background-soft">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
              {aboutPage.milestone_badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">{aboutPage.milestone_title}</h2>
          </AnimatedSection>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
            
            <StaggerContainer className="space-y-8" staggerDelay={0.15}>
              {milestones.map((milestone, index) => (
                <StaggerItem key={milestone.year}>
                  <div className={`relative flex items-start gap-6 md:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-frost border-4 border-background -translate-x-1/2 mt-1.5 z-10" />
                    <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                        <span className="text-sm font-bold text-frost">{milestone.year}</span>
                        <h3 className="text-lg font-semibold mt-1">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:block flex-1" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
              {aboutPage.values_badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">{aboutPage.values_title}</h2>
          </AnimatedSection>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="group rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg hover:border-frost/30 transition-all h-full">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-frost/10 text-frost mb-4 group-hover:bg-frost group-hover:text-frost-foreground transition-all">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-background-soft">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our certified professionals bring decades of combined experience.
            </p>
          </AnimatedSection>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-frost to-primary flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                    {member.initial}
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-frost font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary">
        <div className="container text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {aboutPage.cta_title}
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              {aboutPage.cta_description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero-cta" size="xl" asChild>
                <Link to="/book">Book Your Service <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
}
