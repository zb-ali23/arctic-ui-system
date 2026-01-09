import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";

const brands = [
  { name: "Carrier", logo: "C" },
  { name: "Trane", logo: "T" },
  { name: "Lennox", logo: "L" },
  { name: "Goodman", logo: "G" },
  { name: "Rheem", logo: "R" },
  { name: "York", logo: "Y" },
  { name: "Samsung", logo: "S" },
  { name: "LG", logo: "LG" },
  { name: "Whirlpool", logo: "W" },
  { name: "GE", logo: "GE" },
  { name: "Frigidaire", logo: "F" },
  { name: "Maytag", logo: "M" },
];

export function BrandsSection() {
  return (
    <section className="py-16 bg-background-soft border-y border-border overflow-hidden">
      <div className="container">
        <AnimatedSection className="text-center mb-10">
          <span className="inline-block rounded-full bg-frost/10 px-4 py-1.5 text-sm font-medium text-frost mb-4">
            All Major Brands
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">Brands We Service</h2>
        </AnimatedSection>
      </div>

      {/* Auto-scrolling Logo Strip */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background-soft to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background-soft to-transparent z-10" />
        
        <motion.div
          animate={{ x: [0, -50 * brands.length] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex gap-8"
        >
          {/* Double the brands for seamless loop */}
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="shrink-0 w-32 h-20 rounded-xl bg-card border border-border flex items-center justify-center hover:shadow-lg hover:border-frost/30 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {brand.logo}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{brand.name}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
