import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { articles } from '../data/articles';
import Markdown from 'react-markdown';
import { Calendar, User, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 font-cairo flex items-center justify-center p-6 text-center">
        <SEO title="Article Not Found | Geo-Stamp Camera" description="The requested article could not be found." url={`/blog/${slug}`} />
        <Navbar />
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === 'ar' ? 'المقال غير موجود' : 'Article Not Found'}
          </h1>
          <Link to="/blog" className="text-brand hover:underline inline-flex items-center gap-2">
            {language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = language === 'ar' ? article.titleAr : article.titleEn;
  const description = language === 'ar' ? article.excerptAr : article.excerptEn;
  const content = language === 'ar' ? article.contentAr : article.contentEn;
  const date = language === 'ar' ? article.dateAr : article.dateEn;
  const author = language === 'ar' ? article.authorAr : article.authorEn;
  const readTime = language === 'ar' ? article.readTimeAr : article.readTimeEn;
  const keywords = language === 'ar' ? article.keywordsAr : article.keywordsEn;

  return (
    <div className="min-h-screen bg-slate-950 font-cairo flex flex-col">
      <SEO 
        title={title} 
        description={description} 
        keywords={keywords}
        url={`/blog/${article.slug}`} 
        image={article.image}
      />
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <Link 
          to="/blog" 
          className="inline-flex flex-row-reverse sm:flex-row items-center gap-2 text-slate-400 hover:text-brand transition-colors mb-8 font-medium text-sm"
        >
          {language === 'ar' ? (
            <>
              <ChevronRight className="w-4 h-4" />
              <span>العودة للمدونة</span>
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </>
          )}
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="relative h-64 md:h-96">
            <img 
              src={article.image} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300 mb-4">
                <span className="bg-brand text-slate-950 px-3 py-1 rounded-full">
                  {date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {title}
              </h1>
            </div>
          </div>
          
          <div className="p-6 md:p-10">
            <div className="prose prose-invert prose-slate prose-lg md:prose-xl max-w-none text-slate-300 leading-relaxed custom-prose">
              <Markdown 
                components={{
                  a: ({node, ...props}) => {
                    if (props.href?.startsWith('/')) {
                      return <Link to={props.href} {...props} className="text-brand hover:underline" />
                    }
                    return <a target="_blank" rel="noopener noreferrer" className="text-brand hover:underline" {...props} />
                  }
                }}
              >
                {content}
              </Markdown>
            </div>
          </div>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
}
