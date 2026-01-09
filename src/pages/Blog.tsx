import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

const blogPosts = [
  {
    slug: "signs-ac-needs-repair",
    title: "5 Signs Your AC Needs Repair Before Summer",
    excerpt: "Don't wait for a breakdown. Learn the warning signs that indicate your air conditioner needs professional attention.",
    category: "AC Maintenance",
    date: "January 5, 2025",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80"
  },
  {
    slug: "refrigerator-not-cooling",
    title: "Refrigerator Not Cooling? Here's What to Check",
    excerpt: "Before calling for service, try these troubleshooting steps to diagnose common refrigerator cooling issues.",
    category: "DIY Tips",
    date: "December 28, 2024",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80"
  },
  {
    slug: "hvac-maintenance-checklist",
    title: "Complete HVAC Maintenance Checklist for Homeowners",
    excerpt: "Keep your heating and cooling systems running efficiently with this comprehensive maintenance guide.",
    category: "Maintenance",
    date: "December 15, 2024",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80"
  },
  {
    slug: "energy-efficient-cooling",
    title: "10 Ways to Keep Your Home Cool Without Breaking the Bank",
    excerpt: "Smart strategies to reduce your cooling costs while staying comfortable all summer long.",
    category: "Energy Savings",
    date: "December 1, 2024",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
  },
  {
    slug: "when-to-replace-ac",
    title: "Repair or Replace? Making the Right Decision for Your AC",
    excerpt: "Learn when it makes more financial sense to repair your aging air conditioner versus investing in a new system.",
    category: "Buying Guide",
    date: "November 20, 2024",
    image: "https://images.unsplash.com/photo-1631545806609-4c0a11890200?w=600&q=80"
  },
  {
    slug: "indoor-air-quality",
    title: "How Your HVAC System Affects Indoor Air Quality",
    excerpt: "Discover the connection between your cooling system and the air you breathe, plus tips for improvement.",
    category: "Health",
    date: "November 10, 2024",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
  }
];

const categories = ["All", "AC Maintenance", "DIY Tips", "Maintenance", "Energy Savings", "Buying Guide", "Health"];

export default function Blog() {
  return (
    <MainLayout>
      <PageHeader
        title="CoolTech Blog"
        description="Expert tips, guides, and insights to help you keep your cooling systems running smoothly."
        breadcrumbs={[{ label: "Blog" }]}
        variant="hero"
      />

      <section className="section bg-background">
        <div className="container">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 max-w-md">
              <FormInput 
                placeholder="Search articles..." 
                icon={Search}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button 
                  key={category} 
                  variant={category === "All" ? "default" : "secondary"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article 
                key={post.slug}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section bg-background-soft">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Cool with Our Newsletter</h2>
          <p className="text-muted-foreground mb-8">
            Get maintenance tips, seasonal advice, and exclusive offers delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <FormInput 
              placeholder="Enter your email"
              type="email"
              className="flex-1"
            />
            <Button variant="cta">Subscribe</Button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
