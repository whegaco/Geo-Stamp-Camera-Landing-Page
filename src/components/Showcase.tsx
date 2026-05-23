import { motion } from 'motion/react';
import { Layers, Download, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ShowcaseMockup from './mockups/ShowcaseMockup';

export default function Showcase() {
  const { t, language } = useLanguage();
  return (
    <section className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-slate-950 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
         <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t('title', 'showcase')}
         </h2>
         <p className="text-slate-400 text-lg max-w-2xl mx-auto">
           {t('desc', 'showcase')}
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Descriptive Content */}
            <motion.div 
               initial={{ opacity: 0, x: language === 'ar' ? -30 : 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="order-2 lg:order-1"
            >
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('s1_title', 'showcase')}</h3>
                    <p className="text-slate-400">{t('s1_desc', 'showcase')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('s2_title', 'showcase')}</h3>
                    <p className="text-slate-400">{t('s2_desc', 'showcase')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Simulated UI Representation / Mobile Frame */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className={`order-1 lg:order-2 relative mx-auto ${language === 'ar' ? 'lg:mr-auto lg:ml-0' : 'lg:ml-auto lg:mr-0'} w-full flex justify-center`}
            >
                <ShowcaseMockup />
                <div className="absolute -inset-4 bg-gradient-to-r from-brand/20 to-blue-500/20 blur-3xl -z-10 rounded-full opacity-50"></div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
