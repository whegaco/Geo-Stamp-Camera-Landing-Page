import { useLanguage } from '../context/LanguageContext';
import GeoStampLogo from './GeoStampLogo';
import AppleIcon from './AppleIcon';
import { Link } from 'react-router-dom';


export default function Footer() {
  const { t, language } = useLanguage();
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-4">
          <GeoStampLogo className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">Geo-Stamp Camera</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          {t('desc', 'footer')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a 
              href="https://play.google.com/store/apps/details?id=com.ali.geostamp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-white font-bold transition-colors w-full sm:w-auto"
            >
              {t('btn', 'footer')}
            </a>

        </div>
        
        {/* Added Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 text-sm font-medium text-slate-400">
          <Link to="/privacy" className="hover:text-brand transition-colors">{t('link_privacy', 'footer')}</Link>
          <Link to="/terms" className="hover:text-brand transition-colors">{t('link_terms', 'footer')}</Link>
          <Link to="/about" className="hover:text-brand transition-colors">{t('link_about', 'footer')}</Link>
          <Link to="/contact" className="hover:text-brand transition-colors">{t('link_contact', 'footer')}</Link>
        </div>

        <p className="text-slate-600 text-sm">
           &copy; {new Date().getFullYear()} Geo-Stamp Camera. {t('rights', 'footer')}
        </p>
      </div>
    </footer>
  );
}
