import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "service";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  service?: {
    name: string;
    description: string;
    priceRange?: string;
  };
  noIndex?: boolean;
}

const BASE_URL = "https://cooltech-services.com";
const SITE_NAME = "CoolTech Services";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export function SEOHead({
  title,
  description = "Expert AC and refrigerator repair services with same-day appointments. Licensed technicians, 90-day warranty, and 24/7 emergency service.",
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  article,
  service,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title 
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Professional AC & Refrigerator Repair`;
  
  const fullUrl = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific meta tags */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag) => (
            <meta property="article:tag" content={tag} key={tag} />
          ))}
        </>
      )}

      {/* Service specific structured data */}
      {service && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.name,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": SITE_NAME,
            },
            ...(service.priceRange && { priceRange: service.priceRange }),
          })}
        </script>
      )}
    </Helmet>
  );
}