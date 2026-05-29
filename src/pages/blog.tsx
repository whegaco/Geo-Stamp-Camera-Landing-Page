import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Calendar, User, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlurImage from '../components/BlurImage';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';
import { articles as localArticles } from '../data/articles';

interface ArticleItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  date: string;
  authorEn: string;
  authorAr: string;
  readTimeEn: string;
  readTimeAr: string;
  image: string;
  createdAt: number;
}

const staticGeoStamperBlogItem: ArticleItem = {
  id: 'static-geo-stamper-guide',
  slug: 'geo-stamper-guide',
  titleEn: 'The Ultimate Guide to Using the Intelligent Geo-Stamping and Verification Agent',
  titleAr: 'الدليل الكامل لاستخدام وكيل الختم الجغرافي والتحقق من الصور الذكي',
  excerptEn: 'Learn how to automatically stamp and inspect field engineering photos, extract GPS coordinates, and embed custom logos to secure and verify site work.',
  excerptAr: 'تعرف على كيفية ختم وتفقد الصور الهندسية الميدانية، واستخراج إحداثيات GPS، وتضمين شعار شركتك لحفظ حقوقك وتدقيق المواقع.',
  date: '2026-05-28',
  authorEn: 'Eng. Ahmed Al-Kassem',
  authorAr: 'المهندس / أحمد القاسم',
  readTimeEn: '5 min read',
  readTimeAr: '٥ دقائق قراءة',
  image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  createdAt: 1779926402000
};

export default function Blog() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = articles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Map local static articles to match ArticleItem format
    const mappedLocal: ArticleItem[] = localArticles.map((a, idx) => ({
      id: `local-${a.id || idx}`,
      slug: a.slug,
      titleEn: a.titleEn,
      titleAr: a.titleAr,
      excerptEn: a.excerptEn,
      excerptAr: a.excerptAr,
      date: a.dateEn || '2026-05-28',
      authorEn: a.authorEn || 'Editorial Team',
      authorAr: a.authorAr || 'فريق التحرير',
      readTimeEn: a.readTimeEn || '5 min read',
      readTimeAr: a.readTimeAr || '٥ دقائق قراءة',
      image: a.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
      createdAt: 1779926402000 - idx * 10000
    }));

    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    
    const getArticleTime = (art: ArticleItem) => {
      if (art.date) {
        // Handle dates with non-standard characters just in case, but clean them
        const cleanedDate = art.date.replace(/[\u0660-\u0669]/g, ''); // strip any accidentally mixed Arabic numerals
        const t = Date.parse(cleanedDate);
        if (!isNaN(t)) return t;
      }
      return art.createdAt || 0;
    };

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ArticleItem[];
        
        // Merge & De-duplicate by slug
        const combined = [staticGeoStamperBlogItem, ...mappedLocal, ...docs];
        const uniqueBySlug: ArticleItem[] = [];
        const seenSlugs = new Set<string>();

        for (const item of combined) {
          if (!seenSlugs.has(item.slug)) {
            seenSlugs.add(item.slug);
            uniqueBySlug.push(item);
          }
        }

        // Sort by date desc, fallback to index order if times match
        uniqueBySlug.sort((a, b) => getArticleTime(b) - getArticleTime(a));
        
        setArticles(uniqueBySlug);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'articles');
        // Load static guide and local articles on fallback error and sort them too
        const combinedFallback = [staticGeoStamperBlogItem, ...mappedLocal];
        const uniqueBySlugFallback: ArticleItem[] = [];
        const seenSlugsFallback = new Set<string>();

        for (const item of combinedFallback) {
          if (!seenSlugsFallback.has(item.slug)) {
            seenSlugsFallback.add(item.slug);
            uniqueBySlugFallback.push(item);
          }
        }

        uniqueBySlugFallback.sort((a, b) => getArticleTime(b) - getArticleTime(a));
        setArticles(uniqueBySlugFallback);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const title = language === 'ar' ? 'المقالات' : 'Blog';
  const description = language === 'ar' ? 'مقالات وأدلة حصرية للمهندسين والمقاولين في التوثيق الميداني وإدارة المواقع.' : 'Exclusive articles and guides for engineers and contractors in field documentation and site management.';
  const keywords = language === 'ar' ? 'مقالات هندسية, مدونة, توثيق البناء, إحداثيات المواقع, نصائح للمهندسين' : 'engineering articles, blog, construction documentation, site coordinates, engineer tips';

  return (
    <div className="min-h-screen bg-slate-950 font-cairo flex flex-col">
      <SEO title={title} description={description} keywords={keywords} url="/blog" />
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex-1 w-full">
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-brand animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article, index) => (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={article.slug}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-colors group flex flex-col"
                >
                  <Link to={`/blog/${article.slug}`} className="flex flex-col h-full">
                    <BlurImage 
                      src={article.image || 'https://images.unsplash.com/photo-1541888086903-ee4e10c71199?w=800&q=80'} 
                      alt={language === 'ar' ? article.titleAr : article.titleEn} 
                      containerClassName="h-48"
                      imageClassName="group-hover:scale-105"
                    />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5 border border-slate-800 bg-slate-950/50 px-2.5 py-1 rounded-full">
                          <Calendar className="w-3.5 h-3.5 text-brand" />
                          <span>{article.date ? format(new Date(article.date), 'MMM d, yyyy') : format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand hover:bg-brand/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className={`w-5 h-5 ${language === 'ar' ? '' : 'rotate-180'}`} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold transition-colors ${
                      currentPage === page
                        ? 'border-brand bg-brand text-slate-950'
                        : 'border-slate-800 text-slate-400 hover:border-brand hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand hover:bg-brand/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
