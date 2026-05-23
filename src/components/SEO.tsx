import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
  title: string;
  description: string;
  url: string;
}

export default function SEO({ title, description, url }: SEOProps) {
  const { language } = useLanguage();
  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{title} | Geo-Stamp Camera</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={`${title} | Geo-Stamp Camera`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://geo-stamp-camera.vercel.app${url}`} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={`${title} | Geo-Stamp Camera`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
