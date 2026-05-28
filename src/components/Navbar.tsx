import { motion, useScroll, useSpring } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
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
        >
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            title={language === 'ar' ? 'الرئيسية - Geo-Stamp Camera' : 'Home - Geo-Stamp Camera'}
          >
            <GeoStampLogo className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-white">Geo-Stamp<span className="text-brand">.</span></span>
          </Link>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-2 sm:gap-4"
        >
          <div className="hidden xl:flex items-center gap-3">
            <Link 
              to="/tools"
              className="flex items-center text-brand hover:text-white transition-colors px-2.5 py-1.5 border border-brand/20 hover:border-brand/40 rounded-lg bg-brand/5 hover:bg-brand/10 text-xs font-black text-center"
            >
              {language === 'ar' ? '🧰 بوابة الأدوات الهندسية' : '🧰 Engineering Tools'}
            </Link>
            <Link 
              to="/tools/geo-stamper"
              className="flex items-center text-slate-350 hover:text-white transition-colors px-2.5 py-1.5 border border-slate-900 hover:border-slate-800/80 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-xs font-bold text-center"
            >
              {language === 'ar' ? '📸 الختم الجغرافي' : '📸 Geo-Stamper'}
            </Link>
            <Link 
              to="/tools/report-generator"
              className="flex items-center text-slate-350 hover:text-white transition-colors px-2.5 py-1.5 border border-slate-900 hover:border-slate-800/80 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-xs font-bold text-center"
            >
              {language === 'ar' ? '📋 صانع التقارير' : '📋 Report Builder'}
            </Link>
            <Link 
              to="/tools/materials-calculator"
              className="flex items-center text-slate-350 hover:text-white transition-colors px-2.5 py-1.5 border border-slate-900 hover:border-slate-800/80 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-xs font-bold text-center animate-pulse"
            >
              {language === 'ar' ? '🧮 حاسبة الكميات' : '🧮 Quantities'}
            </Link>
            <Link 
              to="/blog"
              className="flex items-center text-slate-300 hover:text-white transition-colors px-2 py-2 text-sm font-bold"
            >
              {t('blog', 'nav')}
            </Link>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-all px-2.5 py-2.5 rounded-lg hover:bg-slate-800 min-h-[44px] min-w-[44px]"
            aria-label="Toggle language"
          >
            <Globe className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm tracking-wide">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
          

          <a
            href="https://play.google.com/store/apps/details?id=com.ali.geostamp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand text-slate-950 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-brand-hover transition-colors shadow-[0_0_20px_rgba(198,255,0,0.3)] hover:shadow-[0_0_30px_rgba(198,255,0,0.5)]"
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
