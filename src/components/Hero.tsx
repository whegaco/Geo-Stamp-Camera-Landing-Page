import { motion } from 'motion/react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import HeroMockup from './mockups/HeroMockup';
import AppleIcon from './AppleIcon';


export default function Hero() {
  const { t, language } = useLanguage();
  
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950 to-slate-950 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`order-2 lg:order-1 text-center lg:text-${language === 'ar' ? 'right' : 'left'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-brand font-medium mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
            </span>
            {t('badge', 'hero')}
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            {t('title_1', 'hero')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand to-lime-300">
              {t('title_2', 'hero')}
            </span>
          </h1>
          
          <p className={`text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed ${language === 'en' ? 'text-left lg:text-left' : ''}`}>
            {t('desc', 'hero')}
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center gap-4 justify-center ${language === 'en' ? 'lg:justify-start' : 'lg:justify-start'}`}>
            <a 
              href="https://play.google.com/store/apps/details?id=com.ali.geostamp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-hover transition-all shadow-[0_0_20px_rgba(198,255,0,0.2)] hover:shadow-[0_0_30px_rgba(198,255,0,0.4)] hover:-translate-y-1"
            >
              <Download className="w-6 h-6" />
              {t('btn_download', 'hero')}
            </a>
            
            <a 
              href="#features"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors border border-slate-700 ${language === 'en' ? 'flex-row-reverse' : ''}`}
            >
              {t('btn_features', 'hero')}
              {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </a>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={`mt-6 flex justify-center ${language === 'en' ? 'lg:justify-start' : 'lg:justify-start'}`}
          >
             <a 
               href="mailto:hello@geostampcamera.com?subject=iOS%20Waitlist"
               className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-800/50"
             >
               <AppleIcon className="w-5 h-5" />
               <span className="text-sm font-medium underline decoration-slate-700 underline-offset-4">{t('btn_app_store', 'hero')}</span>
             </a>
          </motion.div>
        </motion.div>

        {/* Hero Interactive UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 lg:order-2 relative"
        >
          <HeroMockup />
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/20 blur-[80px] rounded-full pointers-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full pointers-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
}
