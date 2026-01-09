import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Search, Tag } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { AnimatedSection, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/animated-section";

const blogPosts = [
  { slug: "signs-ac-needs-repair", title: "5 Signs Your AC Needs Repair Before Summer", excerpt: "Don't wait for a breakdown. Learn the warning signs.", category: "AC Tips", date: "Jan 5, 2025", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80", featured: true },
  { slug: "refrigerator-not-cooling", title: "Refrigerator Not Cooling? Here's What to Check", excerpt: "Try these troubleshooting steps before calling for service.", category: "DIY Tips", date: "Dec 28, 2024", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80" },
  { slug: "hvac-maintenance-checklist", title: "Complete HVAC Maintenance Checklist", excerpt: "Keep your systems running efficiently with this guide.", category: "Maintenance", date: "Dec 15, 2024", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80" },
  { slug: "energy-efficient-cooling", title: "10 Ways to Keep Cool Without Breaking the Bank", excerpt: "Smart strategies to reduce your cooling costs.", category: "Energy Savings", date: "Dec 1, 2024", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { slug: "when-to-replace-ac", title: "Repair or Replace? Making the Right Decision", excerpt: "When to repair vs invest in a new system.", category: "Buying Guide", date: "Nov 20, 2024", image: "https://images.unsplash.com/photo-1631545806609-4c0a11890200?w=600&q=80" },
  { slug: "indoor-air-quality", title: "How HVAC Affects Indoor Air Quality", excerpt: "The connection between your cooling and air quality.", category: "Health", date: "Nov 10, 2024", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" }
];

const categories = ["All", "AC Tips", "DIY Tips", "Maintenance", "Energy Savings", "Buying Guide", "Health"];

export default function Blog() {
  const featured = blogPosts.find(p => p.featured);
  const posts = blogPosts.filter(p => !p.featured);

  return (
    <MainLayout>
      <PageHeader title="CoolTech Blog" description="Expert tips and guides for your cooling systems." breadcrumbs={[{ label: "Blog" }]} variant="hero" />

      <section className="section bg-background">
        <div className="container">
          <AnimatedSection className="flex flex-col md:flex-row gap-4 mb-12">
            <FormInput placeholder="Search articles..." icon={Search} className="max-w-md" />
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((cat) => (
                <Button key={cat} variant={cat === "All" ? "frost" : "secondary"} size="sm">
                  {cat}
                </Button>
              ))}
            </div>
          </AnimatedSection>

          {featured && (
            <AnimatedSection className="mb-12">
              <Link to={`/blog/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-6 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <span className="text-xs font-medium text-frost mb-2">Featured</span>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> {featured.date}
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          )}

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <ScaleOnHover>
                  <Link to={`/blog/${post.slug}`} className="group block h-full">
                    <article className="h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-video overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium mb-3">{post.category}</span>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                          <span className="text-primary font-medium flex items-center gap-1">Read <ArrowRight className="h-4 w-4" /></span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </MainLayout>
  );
}
