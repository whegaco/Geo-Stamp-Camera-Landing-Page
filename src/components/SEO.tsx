import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string;
}

const getSocialImageForPath = (path: string): string => {
  const cleanPath = path.split('?')[0];
  switch (cleanPath) {
    case '/about':
      return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop'; // Technical/Building
    case '/contact':
      return 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop'; // Contact/Network
    case '/privacy':
    case '/terms':
      return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop'; // Documents/Law
    case '/blog':
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'; // Planning/Blueprint
    case '/':
    default:
      return 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop'; // Construction Architecture
  }
};

export default function SEO({ title, description, url, image, keywords }: SEOProps) {
  const { language } = useLanguage();
  
  const defaultKeywordsAr = 'كاميرا, هندسة مدنية, مساحة, توثيق ميداني, جي بي إس, احداثيات, مقاولات, مشاريع, موقع عمل, تصوير هندسي, تطبيق كاميرا';
  const defaultKeywordsEn = 'camera, civil engineering, surveying, field documentation, gps, coordinates, construction, projects, worksite, engineering photography, camera app, geo stamp';
  const finalKeywords = keywords || (language === 'ar' ? defaultKeywordsAr : defaultKeywordsEn);

  const cleanUrl = url === '/' ? '' : url;
  const canonicalUrl = language === 'en' 
    ? `https://geo-stamp-camera.vercel.app${cleanUrl}?lang=en`
    : `https://geo-stamp-camera.vercel.app${cleanUrl}`;
  const arAlternateUrl = `https://geo-stamp-camera.vercel.app${cleanUrl}`;
  const enAlternateUrl = `https://geo-stamp-camera.vercel.app${cleanUrl}?lang=en`;
  
  let sharingImage = image || getSocialImageForPath(url);
  
  // if image is from unsplash, upgrade resolution for social sharing
  if (sharingImage.includes('unsplash.com')) {
    sharingImage = sharingImage.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=630');
    if (!sharingImage.includes('h=630')) {
        sharingImage += '&h=630';
    }
  }

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{title} | Geo-Stamp Camera</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content="index, follow" />
      
      {/* Search Engine Optimization Links */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ar" href={arAlternateUrl} />
      <link rel="alternate" hrefLang="en" href={enAlternateUrl} />
      <link rel="alternate" hrefLang="x-default" href={arAlternateUrl} />
      
      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:title" content={`${title} | Geo-Stamp Camera`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={sharingImage} />
      <meta property="og:image:secure_url" content={sharingImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={`${title} - Geo-Stamp Camera`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Geo-Stamp Camera" />
      <meta property="og:locale" content={language === 'ar' ? 'ar_AR' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'ar' ? 'en_US' : 'ar_AR'} />
      
      {/* Twitter / X */}
      <meta name="twitter:title" content={`${title} | Geo-Stamp Camera`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={sharingImage} />
      <meta name="twitter:image:alt" content={`${title} - Geo-Stamp Camera`} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": language === 'ar' ? 'الرئيسية' : 'Home',
              "item": "https://geo-stamp-camera.vercel.app/" + (language === 'en' ? '?lang=en' : '')
            },
            ...(cleanUrl.startsWith('/blog/') ? [
              {
                "@type": "ListItem",
                "position": 2,
                "name": language === 'ar' ? 'المدونة' : 'Blog',
                "item": "https://geo-stamp-camera.vercel.app/blog" + (language === 'en' ? '?lang=en' : '')
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": canonicalUrl
              }
            ] : cleanUrl !== '' ? [
              {
                "@type": "ListItem",
                "position": 2,
                "name": title,
                "item": canonicalUrl
              }
            ] : [])
          ]
        }) }} />

      {/* Software Application Schema (only on homepage or everywhere) */}
      {cleanUrl === '' && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Geo-Stamp Camera",
            "operatingSystem": "ANDROID",
            "applicationCategory": "BusinessApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }) }} />
      )}
    </Helmet>
  );
}
