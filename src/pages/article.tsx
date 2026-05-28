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
import { articles as localArticles } from '../data/articles';

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

const staticGeoStamperGuide: ArticleData = {
  id: 'static-geo-stamper-guide',
  slug: 'geo-stamper-guide',
  titleEn: 'The Ultimate Guide to Using the Intelligent Geo-Stamping and Verification Agent',
  titleAr: 'الدليل الكامل لاستخدام وكيل الختم الجغرافي والتحقق من الصور الذكي',
  excerptEn: 'Learn how to automatically stamp and inspect field engineering photos, extract GPS coordinates, and embed custom logos to secure and verify site work.',
  excerptAr: 'تعرف بالتفصيل على طريقة وضع لوجو المشروع علي الصور وخطوات تصوير بالتاريخ والوقت وموقع gps (جي بي اس) مع ختم وتفقد الصور الهندسية الميدانية بدقة فائقة.',
  contentEn: `
# 🌟 Smart Geo-Stamping: How to Professionally Document Field Work

In the construction and engineering sector, a photograph is the ultimate "document of truth." However, a simple photo without precise coordinate data or verified timestamps can lose its weight when submitted to project owners, consultants, or legal entities.

This is where the **Geo-Stamp & Verification Agent** comes in, designed to overlay a secure, high-integrity metadata stamp directly onto your pictures.

---

## 🛠️ Step-by-Step: How to Use the Tool

### 📸 Step 1: Upload Your Image & Extract Metadata
Head to our **[Smart Image Geo-Stamping Tool](/tools/geo-stamper)** and drag & drop your on-site photo.
*   **GPS Extraction:** If the photo was taken with location services enabled on your smartphone, our engine automatically parses the EXIF metadata to retrieve and display the exact latitude and longitude coordinates.

### 📝 Step 2: Input Project Details
Fill out the crucial on-site parameters:
1.  **Project Name:** e.g., "Al-Lulua Residential Compound Project".
2.  **Supervisor/Engineer Name:** To legally back the authenticity of the audit.
3.  **Observations & Status:** You can type manual notes like "Concrete reinforcement completed and civil safety rules satisfied."

### 🧠 Step 3: Extract & Describe Automatically with AI
Simply click on **"Analyze and Extract with AI"**.
*   Our computer-vision agent inspects the elements in your image, detects construction items (reinforced steel, bricks, conduits, scaffolds) and automatically writes professional engineering notes directly in your observations field!

### 🎨 Step 4: Customize Your Logo & Frame
Tailor the design preset to fit your company's aesthetic:
*   **Logo Type:** Choose between an engineering emblem, camera lens icon, or upload your own **transparent brand logo (PNG)**!
*   **Placement & Position:** Decide between a panoramic "bottom bar" layout, or beautiful curved dialog panels on the bottom-right, bottom-left, or top-right.
*   **Color Themes:** Enjoy 4 premium options including *Royal Gold*, *High-Visibility Safety Orange*, *Classic Steel Dark*, and *Minimalist Snow White*.

### 💾 Step 5: High Resolution Download
Once satisfied, click **"Export & Download Stamped Photo"** to generate a perfect, production-grade output file at 100% camera resolution on your device.

---

💡 **Pro-Tip for Construction Sites:** Always make sure GPS tracking is enabled on your phone and camera app settings before snapping pictures so the agent can parse and render map coordinates transparently!

---

[🚀 Start Stamping Your Field Photos Offline & Online Now](/tools/geo-stamper)
`,
  contentAr: `
# 🌟 الختم الجغرافي الذكي: دليل تصوير بالتاريخ والوقت وموقع gps وكيفية وضع لوجو المشروع علي الصور باحترافية؟

في قطاعات التشييد، الهندسة، والتطوير العقاري، تعتبر الصور الميدانية الموثقة هي الأساس لكل خطوة فنية. لكن مجرد التقاط صورة عادية بدون مطابقتها مع **إحداثيات جي بي اس (GPS)** دقيقة أو ختم وقت وتاريخ حقيقي يمكن أن يُعرض العمل للرفض من قِبل الاستشاريين أو ملاك المشروع.

لتجنب هذه المشاكل، تم ابتكار **وكيل جيو ستامب (Geo-Stamp Agent)**، ليتيح لك **تصوير بالتاريخ والوقت وموقع gps** مباشر، إلى جانب ميزة **وضع لوجو المشروع علي الصور** وعلامتك المائية لحماية وتوثيق حقوقك الهندسية والميدانية مجاناً وبدقة كاملة.

---

## 🛠️ خطوة بخطوة: شرح تشغيل واستخدام الأداة بالصور والتفصيل

### 📸 الخطوة الأولى: رفع الصورة واستخراج الإحداثيات رقمياً
قم بالدخول إلى صفحة **[وكيل استخراج الصور والختم الهيكلي](/tools/geo-stamper)** ثم اسحب صورتك الملتقطة من كاميرا الهاتف أو انقر لرفعها.
*   **بيانات نظام جي بي اس (GPS):** إذا كانت الصورة تحتوي على إحداثيات موقع جغرافي مدمجة تلقائياً من كاميرا الهاتف الخاص بك (بيانات EXIF Metadata)، سيقوم النظام باستخراجها فوراً وعرض خطوط الطول والعرض بدقة 100% كما هو موضح بشريط الموثوقية الأخضر المضيء.

### 📝 الخطوة الثانية: تخصيص المعلومات والمشروع
أدخل البيانات الميدانية الأساسية المطلوبة على الختم:
1.  **اسم المشروع:** مثل "مشروع كمبوند لؤلؤة العاصمة بالحي السكني" لضمان ربطه بالتقارير.
2.  **المهندس المسؤول:** لتدعيم التوقيع والاعتماد الفني والرقابي في المستندات.
3.  **الملاحظات والمعاينة الميدانية:** يمكنك كتابة أي ملاحظة يدوياً مثل "تم صب الخرسانة المسلحة وتأكيد معايير السلامة الإنشائية بموجب إحداثيات جي بي اس الحية".

### 🧠 الخطوة الثالثة: استخلاص الملاحظات الفنية بالذكاء الاصطناعي
بدل كتابة الملاحظات يدوياً، انقر على زر **"استخلاص وفحص بالذكاء الاصطناعي"**.
*   يقوم وكيل الرؤية الحاسوبية بفحص تفاصيل الصورة فورياً، واكتشاف الأجسام، وحالة العمل (مثل كابلات، تسليح، طوب، توريدات) وتقييم معايير الجودة والسلامة المهنية ليقوم بصياغة ملاحظات فنية دقيقة وتعبئتها في مربع الملاحظات فوراً!

### 🎨 الخطوة الرابعة: وضع لوجو المشروع علي الصور وتخصيص المظهر
اختر طريقة العرض المناسبة لشركة المقاولات أو الاستشارات الهندسية لتعكس المظهر الاحترافي المميز:
*   **وضع لوجو المشروع علي الصور:** يمكنك رفع شعار شركتك المخصص أو لوجو المشروع الهيكلي (بصيغة PNG شفافة) ليتم طباعته على الختم فورياً كعلامة مائية مدمجة لحفظ الحقوق الفكرية ومنع التلاعب.
*   **الموقع والتموضع:** اختر بين "شريط سفلي عريض" للمستندات الكبيرة، أو "مربع جانبي دائرى الحواف" لعدم تظليل معالم الصورة الأساسية.
*   **أنماط الألوان المعتمدة للختم بالتاريخ والوقت وموقع gps:**
    *   *الداكن الفاخر:* لمسة تقنية أنيقة لحفظ تباين الألوان على جميع الخلفيات.
    *   *الملكي الذهبي:* مخصص للمشاريع الفاخرة والعقارات الراقية وتصميمات الفلل المعتمدة.
    *   *السلامة المهنية (برتقالي عالي التباين):* مثالي لتوثيق المخاطر والمشكلات وحالات السلامة بموقع العمل.
    *   *الناصع الأبيض:* لصور النهار والمخططات الواضحة.

### 💾 الخطوة الخامسة: التحميل الفوري بدقة كاملة
بعد ضبط المعاينة المباشرة التفاعلية، انقر على **"استخراج وتحميل الصورة الختامية"**؛ ليقوم محرك الرسوم الفوري بتوليد ملف فوتوغرافي عالي الجودة وحفظه مباشرة في جهازك بنفس دقة الكاميرا الأصلية!

---

💡 **نصيحة مهندس جيو ستامب (Geo-Stamp) الميداني:** احرص دائماً على تمكين تتبع الموقع وجي بي اس (GPS) بهاتفك أثناء التقاط الصور ليقوم وكيل الختم الجغرافي بقراءتها وتضمين إحداثيات الخريطة بدقة فائقة وبشكل فوري يضمن تقديم التقارير الفنية للجهات الرقابية بدون أدنى شك.

---

[ابدأ الآن بتوثيق أول مجموعة صور ميدانية مجاناً عبر وكيل الختم الجغرافي الذكي 🚀](/tools/geo-stamper)
`,
  date: '2026-05-28',
  authorEn: 'Eng. Ahmed Al-Kassem',
  authorAr: 'المهندس / أحمد القاسم',
  readTimeEn: '5 min read',
  readTimeAr: '٥ دقائق قراءة',
  image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  keywordsEn: 'Geo-Stamp, Photo stamp, Engineering photos, GPS coordinates, EXIF generator',
  keywordsAr: 'وضع لوجو المشروع علي الصور, تصوير بالتاريخ والوقت وموقع gps, جي بي اس, ختم الصور الهندسية, جيو ستامب, إحداثيات الصور, كاميرا الموقع, توثيق البناء, تحديد موقع الصور, كاميرا جي بي اس للاندرويد, ختم الصور التاريخ والوقت, كاميرا الخرائط والموقع',
  createdAt: 1779926402000
};

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (slug === 'geo-stamper-guide') {
        setArticle(staticGeoStamperGuide);
        setLoading(false);
        return;
      }

      // Check local files first
      const foundLocal = localArticles.find(a => a.slug === slug);
      if (foundLocal) {
        setArticle({
          id: `local-${foundLocal.id}`,
          slug: foundLocal.slug,
          titleEn: foundLocal.titleEn,
          titleAr: foundLocal.titleAr,
          excerptEn: foundLocal.excerptEn || '',
          excerptAr: foundLocal.excerptAr || '',
          contentEn: foundLocal.contentEn,
          contentAr: foundLocal.contentAr,
          date: foundLocal.dateEn || '2026-05-28',
          authorEn: foundLocal.authorEn || 'Editor',
          authorAr: foundLocal.authorAr || 'التحرير',
          readTimeEn: foundLocal.readTimeEn || '5 min read',
          readTimeAr: foundLocal.readTimeAr || '٥ دقائق قراءة',
          image: foundLocal.image || '',
          keywordsEn: foundLocal.keywordsEn || '',
          keywordsAr: foundLocal.keywordsAr || '',
          createdAt: 1779926402000
        });
        setLoading(false);
        return;
      }

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
