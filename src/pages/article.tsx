import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import Markdown from 'react-markdown';
import { Calendar, User, Clock, ChevronRight, ChevronLeft, Share2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import BlurImage from '../components/BlurImage';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';

const TwitterIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

interface ArticleData {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  date: string;
  authorEn: string;
  authorAr: string;
  readTimeEn: string;
  readTimeAr: string;
  image: string;
  keywordsEn: string;
  keywordsAr: string;
  createdAt: number;
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setArticle({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ArticleData);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <Navbar />
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <Footer />
      </div>
    );
  }

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
  const dateStr = article.date ? format(new Date(article.date), 'MMM d, yyyy') : format(new Date(article.createdAt), 'MMM d, yyyy');
  const date = language === 'ar' ? article.date || dateStr : dateStr;
  const author = language === 'ar' ? article.authorAr : article.authorEn;
  const readTime = language === 'ar' ? article.readTimeAr : article.readTimeEn;
  const keywords = language === 'ar' ? article.keywordsAr : article.keywordsEn;

  const shareUrl = `https://geo-stamp-camera.vercel.app/blog/${article.slug}`;
  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <WhatsappIcon />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`,
      color: 'hover:text-[#25D366] hover:bg-[#25D366]/10'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinIcon />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10'
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      color: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10'
    }
  ];

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

      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full relative">
        {/* Sticky Share Bar */}
        <div className={`fixed top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-4 md:right-8' : 'left-4 md:left-8'} z-40 hidden xl:flex flex-col gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-full border border-slate-800 shadow-xl`}>
          <div className="flex flex-col items-center gap-4">
            <span className="text-slate-500 pb-2 border-b border-slate-800">
              <Share2 className="w-5 h-5" />
            </span>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Share on ${link.name}`}
                className={`text-slate-400 p-2 rounded-full transition-all duration-300 ${link.color}`}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

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
            <BlurImage 
              src={article.image || 'https://images.unsplash.com/photo-1541888086903-ee4e10c71199?w=800&q=80'} 
              alt={title}
              containerClassName="absolute inset-0 w-full h-full"
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
          
          {/* Mobile inline share buttons */}
          <div className="xl:hidden p-6 md:p-10 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                {language === 'ar' ? 'شارك المقال:' : 'Share Article:'}
              </span>
              <div className="flex items-center gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Share on ${link.name}`}
                    className={`text-slate-400 p-2 rounded-full bg-slate-800 border border-slate-700 transition-all duration-300 ${link.color}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
}
