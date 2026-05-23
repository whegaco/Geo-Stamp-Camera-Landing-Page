import { motion } from 'motion/react';
import { MapPin, FileText, Image as ImageIcon, PenTool, Settings, Smartphone, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Features() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('f1_title', 'features'),
      description: t('f1_desc', 'features'),
      tip: t('f1_tip', 'features')
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: t('f2_title', 'features'),
      description: t('f2_desc', 'features'),
      tip: t('f2_tip', 'features')
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('f3_title', 'features'),
      description: t('f3_desc', 'features'),
      tip: t('f3_tip', 'features')
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: t('f4_title', 'features'),
      description: t('f4_desc', 'features'),
      tip: t('f4_tip', 'features')
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: t('f5_title', 'features'),
      description: t('f5_desc', 'features'),
      tip: t('f5_tip', 'features')
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t('f6_title', 'features'),
      description: t('f6_desc', 'features'),
      tip: t('f6_tip', 'features')
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t('title', 'features')}
          </h2>
          <p className="text-slate-400 text-lg">
            {t('desc', 'features')}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800 hover:border-brand/50 transition-colors group relative"
            >
              <div className={`absolute top-5 md:top-6 ${language === 'ar' ? 'left-5 md:left-6' : 'right-5 md:right-6'} group/tooltip z-30`}>
                <Info className="w-5 h-5 text-slate-500 group-hover:text-brand transition-colors cursor-help" />
                <div className={`absolute opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 bottom-full ${language === 'ar' ? 'left-0 md:-left-3' : 'right-0 md:-right-3'} mb-2 w-48 md:w-56 bg-slate-800 text-xs text-slate-200 p-3 rounded-lg shadow-xl border border-slate-700`}>
                  {feature.tip}
                  <div className={`absolute top-full ${language === 'ar' ? 'left-2 md:left-5' : 'right-2 md:right-5'} border-4 border-transparent border-t-slate-800`}></div>
                </div>
              </div>

              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-xl flex items-center justify-center text-brand mb-5 md:mb-6 border border-slate-800 group-hover:bg-brand group-hover:text-slate-950 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className={`text-slate-400 leading-relaxed ${language === 'en' ? 'text-left' : ''}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
