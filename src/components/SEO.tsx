import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const getSocialImageForPath = (path: string): string => {
  const cleanPath = path.split('?')[0];
  switch (cleanPath) {
    case '/about':
      return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop';
    case '/contact':
      return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';
    case '/privacy':
      return 'https://images.unsplash.com/photo-1508847154043-be12a3bab46a?q=80&w=1200&auto=format&fit=crop';
    case '/terms':
      return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop';
    case '/':
    default:
      return 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=1200&auto=format&fit=crop';
  }
};

export default function SEO({ title, description, url, image }: SEOProps) {
  const { language } = useLanguage();
  
  const cleanUrl = url === '/' ? '' : url;
  const canonicalUrl = `https://geo-stamp-camera.vercel.app${cleanUrl}`;
  const arAlternateUrl = `https://geo-stamp-camera.vercel.app${cleanUrl}`;
  const enAlternateUrl = `https://geo-stamp-camera.vercel.app${cleanUrl}?lang=en`;
  
  const sharingImage = image || getSocialImageForPath(url);

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{title} | Geo-Stamp Camera</title>
      <meta name="description" content={description} />
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
    </Helmet>
  );
}
