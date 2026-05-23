import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
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

export default function Testimonials() {
  const { t, language } = useLanguage();

  const reviews = [
    {
      name: t('t1_name', 'testimonials'),
      role: t('t1_role', 'testimonials'),
      text: t('t1_text', 'testimonials'),
      rating: 5
    },
    {
      name: t('t2_name', 'testimonials'),
      role: t('t2_role', 'testimonials'),
      text: t('t2_text', 'testimonials'),
      rating: 5
    },
    {
      name: t('t3_name', 'testimonials'),
      role: t('t3_role', 'testimonials'),
      text: t('t3_text', 'testimonials'),
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className={`absolute top-0 ${language === 'ar' ? 'right-0' : 'left-0'} w-64 h-64 bg-brand/5 blur-[120px] rounded-full pointer-events-none`}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t('title', 'testimonials')}
          </h2>
          <p className="text-slate-400 text-lg">
            {t('desc', 'testimonials')}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-slate-950 p-8 rounded-2xl border border-slate-800 relative hover:border-brand/30 transition-colors group"
            >
              <Quote className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} w-12 h-12 text-slate-800 group-hover:text-slate-700 transition-colors -z-0`} />
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand text-brand" />
                  ))}
                </div>
                
                <p className={`text-slate-300 leading-relaxed mb-8 text-lg ${language === 'en' ? 'text-left' : ''}`}>
                  "{review.text}"
                </p>
                
                <div className={`flex items-center gap-4 ${language === 'en' ? 'justify-start' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand font-bold text-xl uppercase">
                    {review.name.charAt(0)}
                  </div>
                  <div className={language === 'en' ? 'text-left' : ''}>
                    <h4 className="text-white font-bold">{review.name}</h4>
                    <p className="text-slate-400 text-sm">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
