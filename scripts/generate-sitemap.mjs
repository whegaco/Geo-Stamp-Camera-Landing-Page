import fs from 'fs';

// Helper to convert "May 23, 2026" to "2026-05-23"
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '2026-05-23';
  return date.toISOString().split('T')[0];
}

const articlesCode = fs.readFileSync('src/data/articles.ts', 'utf-8');
const articlesStat = fs.statSync('src/data/articles.ts');
const articlesLastMod = articlesStat.mtime.toISOString().split('T')[0];
const slugs = [...articlesCode.matchAll(/slug:\s*['"`](.*?)['"`]/g)].map(m => m[1]);
const dates = [...articlesCode.matchAll(/dateEn:\s*['"`](.*?)['"`]/g)].map(m => m[1]);

if (slugs.length === 0) {
  throw new Error('No article slugs found in src/data/articles.ts');
}

const articlePages = slugs.map((slug, i) => ({
  path: `/blog/${slug.toLowerCase()}`,
  priority: 0.7,
  changefreq: 'monthly',
  lastmod: articlesLastMod
}));

const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly', lastmod: '2026-05-23' },
  { path: '/tools', priority: 0.9, changefreq: 'weekly', lastmod: '2026-05-25' },
  { path: '/tools/geo-stamper', priority: 1.0, changefreq: 'weekly', lastmod: '2026-05-25' },
  { path: '/tools/report-generator', priority: 0.9, changefreq: 'weekly', lastmod: '2026-05-25' },
  { path: '/tools/materials-calculator', priority: 0.9, changefreq: 'weekly', lastmod: '2026-05-25' },
  { path: '/privacy', priority: 0.5, changefreq: 'monthly', lastmod: '2026-05-15' },
  { path: '/terms', priority: 0.5, changefreq: 'monthly', lastmod: '2026-05-15' },
  { path: '/about', priority: 0.8, changefreq: 'monthly', lastmod: '2026-05-20' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly', lastmod: '2026-05-20' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly', lastmod: '2026-05-23' },
  ...articlePages
];

const baseUrl = 'https://geo-stamp-camera.vercel.app';

let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

for (const page of pages) {
  const cleanPath = page.path === '/' ? '/' : page.path;
  const arUrl = page.path === '/' ? baseUrl + '/' : `${baseUrl}${cleanPath}`;
  const enUrl = page.path === '/' ? baseUrl + '/?lang=en' : `${baseUrl}${cleanPath}?lang=en`;

  const linkTags = `
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${arUrl}" />`;

  // AR url block
  xml += `  <url>\n`;
  xml += `    <loc>${arUrl}</loc>\n`;
  xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority.toFixed(1)}</priority>${linkTags}\n`;
  xml += `  </url>\n`;

  // EN url block
  xml += `  <url>\n`;
  xml += `    <loc>${enUrl}</loc>\n`;
  xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority.toFixed(1)}</priority>${linkTags}\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap successfully regenerated.');
