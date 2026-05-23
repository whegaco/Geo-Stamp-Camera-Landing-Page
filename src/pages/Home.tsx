import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Showcase from '../components/Showcase';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ParticlesBackground from '../components/ParticlesBackground';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  return (
    <main className="min-h-screen bg-slate-950 font-cairo relative">
      <SEO 
        title={language === 'ar' ? 'الرئيسية' : 'Home'}
        description={language === 'ar' ? 'التطبيق الأمثل للمهندسين والمقاولين لتوثيق الأعمال الميدانية بصور مختومة ببيانات المشروع.' : 'The optimal app for engineers and contractors to document field work with project data-stamped photos.'}
        url="/"
      />
      <ParticlesBackground />
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
