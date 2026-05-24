import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ParticlesBackground from '../components/ParticlesBackground';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const Features = lazy(() => import('../components/Features'));
const Showcase = lazy(() => import('../components/Showcase'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const FAQ = lazy(() => import('../components/FAQ'));
const SEOArticle = lazy(() => import('../components/SEOArticle'));
const Footer = lazy(() => import('../components/Footer'));

export default function Home() {
  const { language } = useLanguage();
  return (
    <main className="min-h-screen bg-slate-950 font-cairo relative">
      <SEO 
        title={language === 'ar' ? 'الرئيسية' : 'Home'}
        description={language === 'ar' ? 'التطبيق الأمثل للمهندسين والمقاولين لتوثيق الأعمال الميدانية بصور مختومة ببيانات المشروع.' : 'The optimal app for engineers and contractors to document field work with project data-stamped photos.'}
        keywords={language === 'ar' ? 'Geo-Stamp Camera, كاميرا جي بي إس, توثيق هندسي, مقاولات, صور احداثيات, كاميرا المهندسين, GPS Camera' : 'Geo-Stamp Camera, GPS Camera, engineering documentation, contractors, coordinates photos, engineers camera'}
        url="/"
      />
      <ParticlesBackground />
      <Navbar />
      <Hero />
      
      <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand animate-spin"></div></div>}>
        <Features />
        <Showcase />
        <Testimonials />
        <FAQ />
        <SEOArticle />
        <Footer />
      </Suspense>
    </main>
  );
}
