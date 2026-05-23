import fs from 'fs';

const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/privacy', priority: 0.5, changefreq: 'monthly' },
  { path: '/terms', priority: 0.5, changefreq: 'monthly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog/digital-transformation-paper-to-pdf-reports', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/5-essential-field-apps-civil-engineers-2026', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/geo-stamp-camera-document-photos-with-location-time', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/importance-of-gps-metadata-in-construction', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/how-to-standardize-daily-site-reports-dsr', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/protecting-copyright-authenticity-in-field-photography', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/benefits-of-cloud-storage-for-construction-photos', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/drone-photography-vs-ground-stamping', priority: 0.7, changefreq: 'monthly' }
];

const baseUrl = 'https://geo-stamp-camera.vercel.app';
const lastmod = '2026-05-23';

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
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
  xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>${linkTags}\n`;
  xml += `  </url>\n`;

  // EN url block
  xml += `  <url>\n`;
  xml += `    <loc>${enUrl}</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>${linkTags}\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap successfully regenerated.');
