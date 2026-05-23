import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

export default function Blog() {
  const { language } = useLanguage();

  const title = language === 'ar' ? 'المقالات' : 'Blog';
  const description = language === 'ar' ? 'مقالات وأدلة حصرية للمهندسين والمقاولين في التوثيق الميداني وإدارة المواقع.' : 'Exclusive articles and guides for engineers and contractors in field documentation and site management.';
  const keywords = language === 'ar' ? 'مقالات هندسية, مدونة, توثيق البناء, إحداثيات المواقع, نصائح للمهندسين' : 'engineering articles, blog, construction documentation, site coordinates, engineer tips';

  return (
    <div className="min-h-screen bg-slate-950 font-cairo">
      <SEO title={title} description={description} keywords={keywords} url="/blog" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {language === 'ar' ? 'مدونة ' : 'The '}
            <span className="text-brand">Geo-Stamp</span>
            {language === 'ar' ? ' الهندسية' : ' Blog'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-colors group flex flex-col"
            >
              <Link to={`/blog/${article.slug}`} className="flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={language === 'ar' ? article.titleAr : article.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5 border border-slate-800 bg-slate-950/50 px-2.5 py-1 rounded-full">
                      <Calendar className="w-3.5 h-3.5 text-brand" />
                      <span>{language === 'ar' ? article.dateAr : article.dateEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border border-slate-800 bg-slate-950/50 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-brand" />
                      <span>{language === 'ar' ? article.readTimeAr : article.readTimeEn}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand transition-colors line-clamp-2">
                    {language === 'ar' ? article.titleAr : article.titleEn}
                  </h2>
                  
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                    {language === 'ar' ? article.excerptAr : article.excerptEn}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                      <User className="w-4 h-4 text-slate-500" />
                      <span>{language === 'ar' ? article.authorAr : article.authorEn}</span>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-brand group-hover:text-slate-950 transition-colors" aria-label="Read article">
                      <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
