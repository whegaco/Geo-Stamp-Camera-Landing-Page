import { useLanguage } from '../context/LanguageContext';
import GeoStampLogo from './GeoStampLogo';
import { Link } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';
import { Facebook, Twitter, Instagram, Linkedin, Apple } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SiteConfig {
  googlePlayUrl?: string;
  appStoreUrl?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
}

export default function Footer() {
  const { t, language } = useLanguage();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as SiteConfig);
        }
      } catch (err) {
        console.error('Failed to fetch footer config', err);
      }
    };
    fetchConfig();
  }, []);

  const playUrl = config?.googlePlayUrl || 'https://play.google.com/store/apps/details?id=com.ali.geostamp';

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-4">
          <Link 
            to="/" 
            className="hover:opacity-80 transition-opacity" 
            title={language === 'ar' ? 'الرئيسية - Geo-Stamp Camera' : 'Home - Geo-Stamp Camera'}
          >
            <GeoStampLogo className="w-12 h-12" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">Geo-Stamp Camera</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          {t('desc', 'footer')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {playUrl && (
              <a 
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-white font-bold transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                title={language === 'ar' ? 'تحميل التطبيق من متجر جوجل بلاي' : 'Download application from Google Play Store'}
              >
                {t('btn', 'footer')}
              </a>
            )}
            {config?.appStoreUrl && (
              <a 
                href={config.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-white font-bold transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                title={language === 'ar' ? 'تحميل التطبيق من متجر آبل' : 'Download application from App Store'}
              >
                <Apple className="w-5 h-5" />
                App Store
              </a>
            )}
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
          {config?.socialFacebook && (
            <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand transition-colors aria-label='Facebook'">
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {config?.socialTwitter && (
            <a href={config.socialTwitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand transition-colors aria-label='Twitter'">
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {config?.socialInstagram && (
            <a href={config.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand transition-colors aria-label='Instagram'">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {config?.socialLinkedin && (
            <a href={config.socialLinkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-brand transition-colors aria-label='LinkedIn'">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>
        
        {/* Added Links */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 text-sm font-medium">
          <Link 
            to="/blog" 
            className="px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:text-brand text-slate-400 border border-slate-900/60 hover:border-slate-800 transition-all inline-flex items-center justify-center min-h-[44px]"
            title={language === 'ar' ? 'المقالات - مدونة Geo-Stamp Camera' : 'Blog - Geo-Stamp Camera Articles'}
          >
            {t('link_blog', 'footer')}
          </Link>
          <Link 
            to="/privacy" 
            className="px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:text-brand text-slate-400 border border-slate-900/60 hover:border-slate-800 transition-all inline-flex items-center justify-center min-h-[44px]"
            title={language === 'ar' ? 'سياسة الخصوصية وملفات الكوكيز لـ Geo-Stamp' : 'Privacy Policy and Cookie disclaimer'}
          >
            {t('link_privacy', 'footer')}
          </Link>
          <Link 
            to="/terms" 
            className="px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:text-brand text-slate-400 border border-slate-900/60 hover:border-slate-800 transition-all inline-flex items-center justify-center min-h-[44px]"
            title={language === 'ar' ? 'شروط الخدمة والاتفاقية القانونية للمهندسين والمقاولين' : 'Terms of Service & user policy for engineers'}
          >
            {t('link_terms', 'footer')}
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:text-brand text-slate-400 border border-slate-900/60 hover:border-slate-800 transition-all inline-flex items-center justify-center min-h-[44px]"
            title={language === 'ar' ? 'من نحن - قصة وأهداف تطبيق كاميرا المهندسين' : 'About Us - story of Geo-Stamp Camera'}
          >
            {t('link_about', 'footer')}
          </Link>
          <Link 
            to="/contact" 
            className="px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:text-brand text-slate-400 border border-slate-900/60 hover:border-slate-800 transition-all inline-flex items-center justify-center min-h-[44px]"
            title={language === 'ar' ? 'اتصل بنا - قنوات الدعم ومراجعة مستندات المشاريع' : 'Contact Us - engineering customer support form'}
          >
            {t('link_contact', 'footer')}
          </Link>
        </div>
        
        <VisitorCounter />

        <p className="text-slate-600 text-sm mb-2 mt-8">
           &copy; {new Date().getFullYear()} Geo-Stamp Camera. {t('rights', 'footer')}
        </p>
        <p className="text-slate-500 text-xs">
          {language === 'ar' ? 'تم التطوير بواسطة ' : 'Developed by '}
          <a 
            href="https://ali-kassem-dev.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-brand hover:underline font-bold"
            title={language === 'ar' ? 'علي قاسم - مطور تطبيقات ومواقع' : 'Ali Kassem - Web and App Developer'}
          >
            {language === 'ar' ? 'علي قاسم' : 'Ali Kassem'}
          </a>
        </p>
      </div>
    </footer>
  );
}
