import fs from 'fs';
import path from 'path';

const articlesCode = fs.readFileSync('src/data/articles.ts', 'utf-8');

// Parse articles
const articles = [];
const matchTitleAr = [...articlesCode.matchAll(/titleAr:\s*['"`](.*?)['"`]/g)];
const matchTitleEn = [...articlesCode.matchAll(/titleEn:\s*['"`](.*?)['"`]/g)];
const matchSlug = [...articlesCode.matchAll(/slug:\s*['"`](.*?)['"`]/g)];
const matchExcerptAr = [...articlesCode.matchAll(/excerptAr:\s*['"`](.*?)['"`]/g)];
const matchExcerptEn = [...articlesCode.matchAll(/excerptEn:\s*['"`](.*?)['"`]/g)];

for (let i = 0; i < matchSlug.length; i++) {
  articles.push({
    titleAr: matchTitleAr[i] ? matchTitleAr[i][1] : '',
    titleEn: matchTitleEn[i] ? matchTitleEn[i][1] : '',
    slug: matchSlug[i][1],
    excerptAr: matchExcerptAr[i] ? matchExcerptAr[i][1] : '',
    excerptEn: matchExcerptEn[i] ? matchExcerptEn[i][1] : ''
  });
}

const templatePath = path.resolve('dist/index.html');
if (!fs.existsSync(templatePath)) {
  console.error("error: dist/index.html not found (run vite build first)");
  process.exit(1);
}

const baseHtml = fs.readFileSync(templatePath, 'utf-8');

// Generate static files for each route
const routes = [
  { path: '/', titleAr: 'Geo-Stamp Camera | كاميرا المهندسين للتوثيق وإحداثيات GPS', titleEn: 'Geo-Stamp Camera | Engineer Field Documentation & GPS Coordinates', descAr: 'تطبيق Geo-Stamp Camera المثالي للمهندسين لتصوير الأعمال الميدانية وتسجيل بيانات المشروع وإحداثيات GPS والوقت وإنشاء تقارير PDF احترافية بسهولة.', descEn: 'Geo-Stamp Camera is the ultimate app for engineers to capture field work, log project data, GPS coordinates, timestamps, and generate professional PDF reports easily.' },
  { path: '/about', titleAr: 'من نحن - Geo-Stamp Camera', titleEn: 'About Us - Geo-Stamp Camera', descAr: 'تعرف على فريق وتاريخ تطبيق Geo-Stamp Camera لتوثيق المشاريع.', descEn: 'Learn about the team and history of Geo-Stamp Camera application for project documentation.' },
  { path: '/contact', titleAr: 'اتصل بنا - Geo-Stamp Camera', titleEn: 'Contact Us - Geo-Stamp Camera', descAr: 'تواصل معنا للدعم الفني والاستفسارات حول تطبيق Geo-Stamp Camera.', descEn: 'Contact us for technical support and inquiries about the Geo-Stamp Camera application.' },
  { path: '/blog', titleAr: 'المدونة - Geo-Stamp Camera', titleEn: 'Blog - Geo-Stamp Camera', descAr: 'مقالات وأخبار حول التوثيق الهندسي والميداني وتكنولوجيا البناء.', descEn: 'Articles and news about engineering and field documentation and construction technology.' },
  { path: '/terms', titleAr: 'شروط الخدمة - Geo-Stamp Camera', titleEn: 'Terms of Service - Geo-Stamp Camera', descAr: 'شروط استخدام تطبيق Geo-Stamp Camera.', descEn: 'Terms of use for the Geo-Stamp Camera application.' },
  { path: '/privacy', titleAr: 'سياسة الخصوصية - Geo-Stamp Camera', titleEn: 'Privacy Policy - Geo-Stamp Camera', descAr: 'سياسة الخصوصية وحماية البيانات في تطبيق Geo-Stamp Camera.', descEn: 'Privacy and data protection policy in the Geo-Stamp Camera application.' },
];

for (const post of articles) {
  routes.push({
    path: `/blog/${post.slug}`,
    titleAr: `${post.titleAr} | Geo-Stamp Camera`,
    titleEn: `${post.titleEn} | Geo-Stamp Camera`,
    descAr: post.excerptAr,
    descEn: post.excerptEn
  });
}

function generatePage(route, lang) {
  const isEn = lang === 'en';
  const prefix = isEn ? 'en/' : '';
  const basePath = path.resolve('dist', prefix, route.path.replace(/^\//, ''));
  fs.mkdirSync(basePath, { recursive: true });

  let html = baseHtml;
  
  const title = isEn ? route.titleEn : route.titleAr;
  const desc = isEn ? route.descEn : route.descAr;
  const langQuery = isEn ? '?lang=en' : '';
  
  // Update html lang attribute
  html = html.replace(/<html lang=".*?">/, `<html lang="${isEn ? 'en' : 'ar'}">`);

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content=".*?"/g, `<meta name="title" content="${title}"`);
  html = html.replace(/<meta property="og:title" content=".*?"/g, `<meta property="og:title" content="${title}"`);
  html = html.replace(/<meta name="twitter:title" content=".*?"/g, `<meta name="twitter:title" content="${title}"`);

  // Replace Description
  if (desc) {
    html = html.replace(/<meta name="description" content=".*?"/g, `<meta name="description" content="${desc}"`);
    html = html.replace(/<meta property="og:description" content=".*?"/g, `<meta property="og:description" content="${desc}"`);
    html = html.replace(/<meta name="twitter:description" content=".*?"/g, `<meta name="twitter:description" content="${desc}"`);
  }

  // Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="https://geo-stamp-camera.vercel.app${route.path}${langQuery}" />`);

  // Inject hidden SEO links for crawling
  let seoLinks = `<nav aria-hidden="true" style="display:none;"><br>`;
  for (const r of routes) {
    if (isEn) {
      seoLinks += `<a href="${r.path}?lang=en">${r.titleEn}</a><br>`;
    } else {
      seoLinks += `<a href="${r.path}">${r.titleAr}</a><br>`;
    }
  }
  // Also add some links for Google Play explicitly
  seoLinks += `<a href="https://play.google.com/store/apps/details?id=com.ali.geostamp" rel="noopener">Download Geo-Stamp Camera App</a><br>`;
  seoLinks += `</nav>`;

  html = html.replace('<div id="root"></div>', `${seoLinks}<div id="root"></div>`);

  fs.writeFileSync(path.join(basePath, 'index.html'), html);
}

for (const route of routes) {
  // Generate both AR and EN
  generatePage(route, 'ar');
  generatePage(route, 'en');
}

console.log('Prerendering SEO static files complete.');
