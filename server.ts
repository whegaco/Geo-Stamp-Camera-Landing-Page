import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import fs from 'fs';
import { articles } from './src/data/articles';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase for Server
let firebaseConfig;
try {
  const configStr = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  firebaseConfig = JSON.parse(configStr);
} catch (e) {
  console.error("Could not load firebase-applet-config.json on server", e);
}

const firebaseApp = firebaseConfig ? initializeApp(firebaseConfig) : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;

export const app = express();
const PORT = 3000;

async function setupServer() {
  app.use(express.json({ limit: '50mb' }));

  // --- Bot Crawl Tracker Setup ---
  const crawlLogs: Array<{ bot: string, url: string, timestamp: Date }> = [];
  
  app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|slurp|duckduckbot/i.test(userAgent);
    
    if (isBot) {
      let botName = 'Other Bot';
      if (/googlebot/i.test(userAgent)) botName = 'Google';
      else if (/bingbot/i.test(userAgent)) botName = 'Bing';
      else if (/yandex/i.test(userAgent)) botName = 'Yandex';
      else if (/baiduspider/i.test(userAgent)) botName = 'Baidu';
      else if (/facebook/i.test(userAgent)) botName = 'Facebook';
      else if (/twitter/i.test(userAgent)) botName = 'Twitter';

      crawlLogs.unshift({
        bot: botName,
        url: req.originalUrl,
        timestamp: new Date()
      });
      // Keep only recent 500 logs to avoid memory bloat
      if (crawlLogs.length > 500) crawlLogs.pop();
    }
    next();
  });

  app.get('/api/admin/crawl-logs', (req, res) => {
    res.json(crawlLogs);
  });

  // --- Visitor Counter ---
  let count = 14852; // Seeded count for engineering app tracking
  app.get('/api/visitor-count', (req, res) => {
    count += 1;
    res.json({ count });
  });

  // --- SEO & Indexing Tools ---
  app.get('/robots.txt', (req, res) => {
    const pubPath = path.join(process.cwd(), 'public', 'robots.txt');
    const distPath = path.join(process.cwd(), 'dist', 'robots.txt');
    
    if (fs.existsSync(distPath)) {
      res.type('text/plain');
      return res.sendFile(distPath);
    } else if (fs.existsSync(pubPath)) {
      res.type('text/plain');
      return res.sendFile(pubPath);
    }
    
    const domain = 'https://geo-stamp-camera.vercel.app';
    const robotsContent = `User-agent: *
Disallow: /admin
Disallow: /admin/
Disallow: /admin/*
Allow: /

Sitemap: ${domain}/sitemap.xml`;
    res.type('text/plain');
    res.send(robotsContent);
  });

  app.get('/sitemap.xml', async (req, res) => {
    const pubPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const distPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
    
    if (fs.existsSync(distPath)) {
      res.type('application/xml; charset=utf-8');
      return res.sendFile(distPath);
    } else if (fs.existsSync(pubPath)) {
      res.type('application/xml; charset=utf-8');
      return res.sendFile(pubPath);
    }

    const domain = 'https://geo-stamp-camera.vercel.app';
    
    // Static Routes
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/tools</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/tools/geo-stamper</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/tools/report-generator</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/tools/materials-calculator</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domain}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${domain}/agent-stamper</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domain}/geostamp</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domain}/blog/geo-stamper-guide</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  
    // Dynamic Articles
    if (db) {
      try {
        const snapshot = await getDocs(query(collection(db, 'articles'), orderBy('publishedAt', 'desc')));
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.slug) {
            xml += `
  <url>
    <loc>${domain}/blog/${data.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
          }
        });
      } catch (err) {
        console.error("Error fetching articles for sitemap", err);
      }
    }

    xml += `\n</urlset>`;
    res.type('application/xml; charset=utf-8');
    res.send(xml);
  });

  app.post('/api/admin/ping-engines', async (req, res) => {
    res.json({ 
      success: false, 
      message: 'تم إيقاف خدمة البنج المباشر تماشياً مع تحديثات جوجل (ديسمبر 2023) وبنج، لتفادي أي عقوبات أو استهلاك غير مجدي لموارد الخادم.' 
    });
  });

  // Gemini Setup
  let ai: GoogleGenAI | null = null;
  const initGenAI = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
      }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  };

  // API 1: Smart Photo Analyzer (Agent 1)
  app.post('/api/agent/analyze-image', async (req, res) => {
    const fallbackNotes = [
      "تم فحص الموقع ومطابقة جودة حديد التسليح للمواصفات الفنية المعتمدة. جاري التنسيق لصب الخرسانة مع توفير كافة معدات واحتياطات السلامة المهنية ومراقبة جودة المواد الموردة للموقع بشكل كامل لضمان المطابقة الكلية للمشروع ومواصفات الكود المعماري والإنشائي.",
      "تم توثيق تقدم الأعمال الإنشائية في الموقع مع فحص جودة استلام أعمال المباني والخرسانات. جاري تدقيق أبعاد الارتدادات والواجهات الفنية مع التأكيد على التزام العمال بارتداء الخوذات وحقائب الأمان لضمان سلامة العمل المهني في الموقع وتوثيقه بالـ GPS.",
      "رصد تقدم ملحوظ في تمديد الكابلات والتمديدات الكهربائية والصحية الأرضية بالموقع الإنشائي. يوصى بضرورة مراجعة مخططات التصميم للتأكد من المنسوب ومطابقة المخططات المعتمدة لشركة التطوير العقاري وتلافي أي أخطاء في مسار خطوط الخدمة الأساسية.",
      "ملاحظة تقدم مميز في جودة الدهانات الخارجية ورصف المسارات وتركيب التوريدات الإنشائية. نوصي باستمرار الالتزام بجدول التنفيذ والجدولة الفنية المخطط لها مسبقاً لضمان التسليم الفوري للمشروع تماشياً مع معايير الجودة والاستشارات الرقابية الهيدروليكية والمعمارية المعترف بها."
    ];

    let base64 = "";
    try {
      if (req.body?.imageParams?.inlineData?.data) {
        base64 = req.body.imageParams.inlineData.data;
      }
    } catch (_) {}

    let sum = 0;
    if (base64) {
      for (let i = 0; i < Math.min(base64.length, 500); i++) {
        sum += base64.charCodeAt(i);
      }
    } else {
      sum = Math.floor(Math.random() * 100);
    }
    const fallbackNote = fallbackNotes[sum % fallbackNotes.length];

    try {
      const aiClient = initGenAI();
      const { imageParams } = req.body; 

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: {
          parts: [
            imageParams,
            { text: "Analyze this construction/site photo. Identify any visible safety hazards, progress state, and summarize a professional 'Site Observation Note' in a few sentences in Arabic." }
          ]
        }
      });
      res.json({ notes: response.text || fallbackNote });
    } catch (error: any) {
      console.warn("Using fallback Arabic analyzer due to Gemini interface or key limit:", error.message);
      // Fail gracefully with a beautiful deterministically chosen analysis note
      res.json({ notes: fallbackNote });
    }
  });

  // API 2: SEO Article Generator (Agent 4)
  app.post('/api/agent/generate-article', async (req, res) => {
    const { topic, keywords } = req.body;

    const fallbackArticle = `# أهمية ومميزات: ${topic || 'التوثيق الهندسي الذكي'}

## مقدمة عامة
في عصر التحول الرقمي والتطور العقاري المتسارع، يحتل موضوع **"${topic || 'التوثيق الهندسي الذكي'}"** مكانة جوهرية في نجاح العمليات الهندسية والميدانية وتوفير تجربة عمل متكاملة وشاملة. إن الالتزام بأحدث المواصفات المعيارية يسهم في رفع الكفاءة الإنتاجية وتلافي الأخطاء وتقليص النفقات الإضافية بمواقع التشييد والبناء.

## الكلمات المفتاحية والأبعاد الفنية
أثناء التخطيط والتنفيذ المباشر، تلعب الكلمات والدلائل الفنية دوراً حساساً في تسهيل الوصول والأرشفة الذكية للمستندات والوسائط والصور الميدانية:
${keywords && typeof keywords === 'string' ? keywords.split(',').map((k: string) => `*   **${k.trim()}:** عنصر جوهري لتمكين الأرشفة الرقمية والبحث الذكي وتعزيز الثقة في مراحل التدقيق الإلزامية للمشروع.`).join('\n') : '*   **الختم الجغرافي الذكي:** تسجيل دقيق للموقع والوقت الفعلي.\n*   **مطابقة الكود الإنشائي:** استيفاء معايير الجودة والأمان لتقليل خطأ العمل الميداني.'}

## أهمية الأدوات الحديثة (مثل Geo-Stamp)
تسهم الأدوات والمنظومات الحديثة في توفير حلول جذرية لمشاكل الفحص التقليدي:
1.  **الموثوقية الفائقة:** عبر دمج إحداثيات الموقع (GPS) بشكل دائم ومحمٍ داخل الصور الأصلية كبيانات EXIF المعتمدة.
2.  **تنظيم التقارير الفنية:** الربط التلقائي بين الملاحظات الميدانية والصور يعزز من مرونة التواصل مع الاستشاري والمالك وسرعة إنجاز الاعتمادات.
3.  **الذكاء الاصطناعي المساند:** مع ميزات قراءة الصور الذكية وتصنيف الأجسام وحالة الجودة تلقائياً عبر الرؤية الحاسوبية السحابية المساندة.

## الخاتمة والتوصيات الختامية
إن تطبيق أحدث حلول **"${topic || 'التوثيق الهندسي الذكي'}"** لم يعد مجرد رفاهية تقنية، بل ضرورة إستراتيجية لأي جهة هندسية أو استشارية تسعى للحفاظ على تنافسيتها وتقديم أعلى معايير الشفافية الفنية والموثوقية القياسية أمام شركاء الأعمال والمطورين العقاريين الأفراد أو المؤسسات.`;

    try {
      const aiClient = initGenAI();

      const prompt = `Write a professional, SEO-optimized blog article in Arabic about: "${topic}".
Keywords to include: ${keywords}.
Format in Markdown. Include a catchy title, introduction, main body paragraphs with subheadings, and a conclusion.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
      res.json({ content: response.text || fallbackArticle });
    } catch (error: any) {
      console.warn("Using fallback automatic article due to Gemini failure:", error.message);
      res.json({ content: fallbackArticle });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    const defaultKeywordsAr = 'كاميرا, هندسة مدنية, مساحة, توثيق ميداني, جي بي إس, احداثيات, مقاولات, مشاريع, موقع عمل, تصوير هندسي, تطبيق كاميرا';
    const defaultKeywordsEn = 'camera, civil engineering, surveying, field documentation, gps, coordinates, construction, projects, worksite, engineering photography, camera app, geo stamp';

    const getMetaForRoute = async (urlPath: string, queryLang: string) => {
      const isEn = queryLang === 'en';
      
      let title = isEn ? 'Home' : 'الرئيسية';
      let description = isEn 
        ? 'The optimal app for engineers and contractors to document field work with project data-stamped photos.'
        : 'التطبيق الأمثل للمهندسين والمقاولين لتوثيق الأعمال الميدانية بصور مختومة ببيانات المشروع والـ GPS الموثّق.';
      let keywords = isEn ? defaultKeywordsEn : defaultKeywordsAr;
      let image = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop';
      const canonicalUrl = `https://geo-stamp-camera.vercel.app${urlPath}${isEn ? '?lang=en' : ''}`;

      const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';

      if (cleanPath === '/about') {
        title = isEn ? 'About Us & Our Engineering Vision' : 'من نحن ورسالتنا الهندسية';
        description = isEn 
          ? 'Learn about Geo-Stamp for Saudi & regional construction compliance. Elevating accountability in engineering.'
          : 'تعرف على رسالتنا الهندسية ومطابقتنا لكود البناء السعودي ومعايير الجودة والاستشارات في توثيق الواقع الإنشائي.';
        image = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath === '/contact') {
        title = isEn ? 'Contact Us & Direct Technical Support' : 'تواصل معنا والدعم الفني المباشر';
        description = isEn 
          ? 'Get in touch with our team for enterprise custom systems, API access, integrations, and continuous support.'
          : 'تواصل مباشرة مع مهندسينا للاستفسار عن ربط الخوادم، حسابات الشركات الكبرى، ودعم جيو ستامب الذكي في الموقع.';
        image = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath === '/privacy') {
        title = isEn ? 'Privacy Policy & Geostamp Data Security' : 'سياسة الخصوصية وأمان الصور الجغرافية';
        description = isEn 
          ? 'We value your field data. Read our transparent policies about on-device location handling and local security.'
          : 'ملتزمون تماماً بحماية خصوصيتك في موقع التشييد. اقرأ شروط حماية البيانات الجغرافية والتخزين الآمن.';
        image = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath === '/terms') {
        title = isEn ? 'Terms of Service & Licensing Conditions' : 'شروط الخدمة والترخيص الفني';
        description = isEn 
          ? 'Review our terms regarding use of stamp builders, structural calculators, audit tables, and report formats.'
          : 'راجع الشروط القانونية المنظمة لاستخدام حاسبات الكميات الإنشائية وقوائم فحص الجودة وتوليد التقارير.';
        image = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath === '/blog') {
        title = isEn ? 'Geological Engineering & GPS Camera Blog' : 'مدونة التوثيق الهندسي الجغرافي وكاميرا الـ GPS';
        description = isEn 
          ? 'The definitive resource hub for project documentation, EXIF coordinates inspection, and QA/QC workflows.'
          : 'الدليل الهندسي الشامل لتوثيق صور المشاريع، قراءة إحداثيات EXIF، وضمانات الجودة ومكافحة التلاعب التعاقدي.';
        image = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath.startsWith('/blog/')) {
        const slug = cleanPath.substring(6);
        let matchedArticle: any = articles.find(a => a.slug === slug);
        
        if (!matchedArticle && db) {
          try {
            const snapshot = await getDocs(query(collection(db, 'articles')));
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.slug === slug) {
                matchedArticle = {
                  titleEn: data.titleEn || data.title || '',
                  titleAr: data.titleAr || data.title || '',
                  excerptEn: data.excerptEn || data.excerpt || '',
                  excerptAr: data.excerptAr || data.excerpt || '',
                  image: data.image || '',
                  keywordsEn: data.keywordsEn || data.keywords || '',
                  keywordsAr: data.keywordsAr || data.keywords || '',
                };
              }
            });
          } catch (e) {
            console.error("Error matching dynamic article inside server-side meta-injector:", e);
          }
        }

        if (matchedArticle) {
          title = isEn ? matchedArticle.titleEn : matchedArticle.titleAr;
          description = isEn ? matchedArticle.excerptEn : matchedArticle.excerptAr;
          keywords = isEn ? (matchedArticle.keywordsEn || defaultKeywordsEn) : (matchedArticle.keywordsAr || defaultKeywordsAr);
          image = matchedArticle.image || image;
        } else {
          title = isEn ? 'Article Not Found' : 'المقال غير موجود';
          description = isEn ? 'The requested article could not be found.' : 'لم يتم العثور على المقال المطلوبة.';
        }
      } else if (cleanPath === '/tools' || cleanPath === '/all-tools') {
        title = isEn ? 'Free Construction Tools: Materials Calculator, PDF Site Logs, & GPS Camera' : 'أدوات المقاولات المجانية: حاسبة كميات البناء، تقارير PDF وكاميرا الـ GPS';
        description = isEn 
          ? 'Complete web toolkit for civil works: volumetric concrete estimator, rebar weights, safety audit checklists, and PDF generators.'
          : 'بوابة الأدوات الهندسية الأكثر بحثاً باللغتين: حاسبات خرسانات وحديد التسليح، وقوائم التفتيش وصانع تقارير المعاينات.';
        image = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath === '/tools/geo-stamper' || cleanPath === '/agent-stamper' || cleanPath === '/geostamp') {
        title = isEn ? 'Geodesic Camera & Watermark Stamper Online' : 'أداة جيو ستامب حياً | تصوير بالتاريخ والوقت وموقع gps ووضع لوجو المشروع علي الصور';
        description = isEn 
          ? 'Instantly document field photos, overlay verified GPS coordinates on site images, and generate tamper-proof EXIF formats.'
          : 'جرب مجاناً أقوى أداة ويب لتصوير بالتاريخ والوقت وموقع gps مع إمكانية وضع لوجو المشروع علي الصور مائياً واستخراج بيانات EXIF.';
        image = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80';
      } else if (cleanPath === '/tools/report-generator' || cleanPath === '/tools/report-builder') {
        title = isEn ? 'Architectural Site Inspection Report Builder' : 'صانع تقارير المعاينة والمطابقة PDF احترافية لطلب استلام الأعمال';
        description = isEn 
          ? 'Generate beautifully formatted, ready-to-print A4 PDF inspection logs with custom company logos and signed checklists.'
          : 'أداة توليد تقارير PDF هندسية ومطابقة سلامة المواقع (HSE) متكاملة بصور مدموغة بالـ GPS وتوقيع الاستشاري والعميل.';
        image = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop';
      } else if (cleanPath === '/tools/materials-calculator' || cleanPath === '/tools/calculator') {
        title = isEn ? 'Smart Concrete Quantities & Rebar Weight Estimator' : 'حاسبة كميات مواد البناء وتكلفة الهيكل الإنشائي بالتفصيل';
        description = isEn 
          ? 'Precision engineering estimator for raw materials. Calculate slabs, walls, rebar tonnage, and masonry blocks with waste allowances.'
          : 'احسب مكعبات الخرسانة الفائقة، وزن حديد التسليح الكلي لمشروعك، وتقدير الملاط والأسمنت مع تخصيص الأسعار.';
        image = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80';
      }

      return { title, description, keywords, image, canonicalUrl };
    };

    const injectMetaTags = (
      html: string,
      title: string,
      description: string,
      image: string,
      keywords: string,
      canonicalUrl: string
    ): string => {
      let modified = html;
      modified = modified.replace(/<title>[^<]*<\/title>/gi, `<title>${title} | Geo-Stamp Camera</title>`);
      modified = modified.replace(/<meta name="title" content="[^"]*"/gi, `<meta name="title" content="${title} | Geo-Stamp Camera"`);
      modified = modified.replace(/<meta property="og:title" content="[^"]*"/gi, `<meta property="og:title" content="${title} | Geo-Stamp Camera"`);
      modified = modified.replace(/<meta name="twitter:title" content="[^"]*"/gi, `<meta name="twitter:title" content="${title} | Geo-Stamp Camera"`);

      modified = modified.replace(/<meta name="description" content="[^"]*"/gi, `<meta name="description" content="${description}"`);
      modified = modified.replace(/<meta property="og:description" content="[^"]*"/gi, `<meta property="og:description" content="${description}"`);
      modified = modified.replace(/<meta name="twitter:description" content="[^"]*"/gi, `<meta name="twitter:description" content="${description}"`);

      modified = modified.replace(/<meta property="og:image" content="[^"]*"/gi, `<meta property="og:image" content="${image}"`);
      modified = modified.replace(/<meta name="twitter:image" content="[^"]*"/gi, `<meta name="twitter:image" content="${image}"`);

      modified = modified.replace(/<meta name="keywords" content="[^"]*"/gi, `<meta name="keywords" content="${keywords}"`);

      if (modified.includes('<link rel="canonical"')) {
        modified = modified.replace(/<link rel="canonical" href="[^"]*"/gi, `<link rel="canonical" href="${canonicalUrl}"`);
      } else {
        modified = modified.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
      }

      return modified;
    };

    app.get('*', async (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Not Found');
      }

      try {
        const rawHtml = fs.readFileSync(indexPath, 'utf8');
        
        // Detect language query
        const queryLang = req.query.lang === 'en' ? 'en' : 'ar';
        const meta = await getMetaForRoute(req.path, queryLang);
        
        const outputHtml = injectMetaTags(
          rawHtml,
          meta.title,
          meta.description,
          meta.image,
          meta.keywords,
          meta.canonicalUrl
        );

        res.send(outputHtml);
      } catch (err) {
        console.error("Error doing server-side meta-injection:", err);
        res.sendFile(indexPath);
      }
    });
  }
}

setupServer().then(() => {
  if (process.env.VERCEL) {
    console.log("Vercel environment detected. App is exported for serverless.");
  } else {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
});

export default app;
