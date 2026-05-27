import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, language } = useLanguage();

  const faqs = [
    {
      question: t('q1', 'faq'),
      answer: t('a1', 'faq')
    },
    {
      question: t('q2', 'faq'),
      answer: t('a2', 'faq')
    },
    {
      question: t('q3', 'faq'),
      answer: t('a3', 'faq')
    },
    {
      question: t('q4', 'faq'),
      answer: t('a4', 'faq')
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative">
      <Helmet>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t('title', 'faq')}
          </h2>
          <p className="text-slate-400 text-lg">
            {t('desc', 'faq')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                activeIndex === index ? 'bg-slate-900 border-brand/50' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full flex items-center justify-between p-6 ${language === 'ar' ? 'text-right' : 'text-left'} focus:outline-none`}
              >
                <span className={`font-bold text-lg transition-colors ${activeIndex === index ? 'text-brand' : 'text-white'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-6 h-6 text-slate-400 transition-transform duration-300 flex-shrink-0 ${language === 'ar' ? 'mr-4' : 'ml-4'} ${
                    activeIndex === index ? 'rotate-180 text-brand' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className={`px-6 pb-6 text-slate-400 leading-relaxed ${language === 'en' ? 'text-left' : ''}`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
