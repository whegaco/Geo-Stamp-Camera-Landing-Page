import { motion, useScroll, useSpring } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GeoStampLogo from './GeoStampLogo';
import AppleIcon from './AppleIcon';


export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <GeoStampLogo className="w-10 h-10" />
          <span className="text-2xl font-bold tracking-tight text-white">Geo-Stamp<span className="text-brand">.</span></span>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-4"
        >
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
            aria-label="Toggle language"
          >
            <Globe className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
          
          <a
            href="mailto:hello@geostampcamera.com?subject=iOS%20Waitlist"
            className="hidden sm:flex items-center gap-2 bg-slate-800 text-slate-200 px-5 py-2.5 rounded-full font-bold hover:bg-slate-700 transition-colors border border-slate-700 text-sm"
          >
            <AppleIcon className="w-4 h-4" />
            {t('app_store', 'nav')}
          </a>
          
          <a
            href="https://play.google.com/store/apps/details?id=com.ali.geostamp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand text-slate-950 px-6 py-2.5 rounded-full font-bold hover:bg-brand-hover transition-colors shadow-[0_0_20px_rgba(198,255,0,0.3)] hover:shadow-[0_0_30px_rgba(198,255,0,0.5)]"
          >
            {t('download', 'nav')}
          </a>
        </motion.div>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div 
        className={`absolute bottom-[-1px] left-0 right-0 h-[3.5px] bg-brand shadow-[0_1px_10px_rgba(198,255,0,0.6)] ${language === 'ar' ? 'origin-right' : 'origin-left'}`}
        style={{ scaleX }}
      />
    </nav>
  );
}
