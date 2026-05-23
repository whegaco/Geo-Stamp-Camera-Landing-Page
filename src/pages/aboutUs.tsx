import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import GeoStampLogo from '../components/GeoStampLogo';
import SEO from '../components/SEO';

export default function AboutUs() {
  const { language } = useLanguage();
  
  return (
    <main className="min-h-screen bg-slate-950 font-cairo">
      <SEO 
        title={language === 'ar' ? 'من نحن' : 'About Us'}
        description={language === 'ar' ? 'تعرف على قصة تطبيق Geo-Stamp Camera والأداة الرائدة للمهندسين المدنيين والمقاولين.' : 'Learn about the story of Geo-Stamp Camera, the leading tool for civil engineers and contractors.'}
        keywords={language === 'ar' ? 'من نحن, عن التطبيق, تطبيق كاميرا المهندسين, Geo-Stamp Camera, فريق العمل, تطوير التطبيقات الهندسية' : 'About Us, About Geo-Stamp Camera, engineers camera app, development team, engineering applications'}
        url="/about"
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-24 text-white">
        
        <div className="flex flex-col items-center mb-12">
          <GeoStampLogo className="w-24 h-24 mb-6" />
          <h1 className="text-4xl font-bold text-center text-brand mb-4">
            {language === 'ar' ? 'من نحن' : 'About Us'}
          </h1>
        </div>
        
        <div className="space-y-12 text-slate-300 leading-relaxed text-lg">
          <div className="space-y-6">
            <p className="text-xl text-center text-slate-200">
              {language === 'ar'
                ? 'تطبيق Geo-Stamp Camera هو الحل التنفيذي المتكامل والمصمم خصيصاً للمهندسين الميدانيين والمقاولين في قطاع التشييد والبناء لتوثيق وتقييم المشروعات بدقة فائقة.'
                : 'Geo-Stamp Camera is the premier utility designed specifically for civil engineers, site inspectors, and contractors in the construction sector to document, verify, and report field work with absolute accuracy.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-xl font-bold text-white mb-3">
                {language === 'ar' ? '🎯 رسالتنا وأهدافنا' : '🎯 Our Mission'}
              </h3>
              <p className="text-sm text-slate-400">
                {language === 'ar'
                  ? 'تمكين الشركات والفرق الهندسية من رقمنة عمليات التوثيق الميداني والحد من المنازعات القانونية أو الأخطاء الإنشائية بفضل تقارير دقيقة ومحمية بشهادات الزمان والمكان الجغرافي الفوري.'
                  : 'To empower engineering teams and construction firms to digitize field oversight and reduce execution disputes through immutable location and time certifications on every captured photo.'}
              </p>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
              <h3 className="text-xl font-bold text-white mb-3">
                {language === 'ar' ? '💡 رؤية التوثيق الاحترافي' : '💡 The vision of Professional Logging'}
              </h3>
              <p className="text-sm text-slate-400">
                {language === 'ar'
                  ? 'نسعى لتبسيط المهام اليومية في الموقع لتوفير الجهد اليدوي. يتيح لك تطبيقنا إدراج شعار جهة الإشراف، واسم المشروع، والمقاول المسؤول، وإحداثيات الموقع فوريًا لإنشاء تقارير PDF متكاملة وصالحة للمراجعة الفنية.'
                  : 'We solve the daily friction of manual coordinate logging. Our platform integrates project parameters, contractor references, client logos, and high-precision physical GPS data to instantaneously format printable engineering sheets.'}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-900">
            <h2 className="text-2xl font-bold text-white text-center md:text-start">
              {language === 'ar' ? 'لماذا يعتمد المهندسون على Geo-Stamp Camera؟' : 'Why Engineers Rely on Geo-Stamp Camera?'}
            </h2>
            <ul className="list-decimal list-inside space-y-3 text-slate-400 text-sm md:text-base">
              <li>
                <strong>{language === 'ar' ? 'توثيق البيانات الفنية الحيوية: ' : 'Document Crucial Engineering Data: '}</strong>
                {language === 'ar' ? 'تتحرى الكاميرا تلقائياً الإحداثيات الجغرافية (خطوط الطول والعرَض)، والاتجاه، والارتفاع، بدقة قصوى.' : 'The built-in camera automatically stamps coordinates, height, bearings, and localized altitude onto your documentation.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'تنظيم المشاريع وتصنيفها: ' : 'Seamless Project Categorization: '}</strong>
                {language === 'ar' ? 'إتاحة كتابة تفاصيل البنود والملاحظات الحية (مثل صب الخرسانة، أعمال الحفر، أو حديد التسليح) مباشرة.' : 'Allows sorting photos directly by project tasks (e.g., concrete pouring, excavation status, reinforcement check).'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'حماية الملكية والعلامة التجارية: ' : 'Brand Identification & Watermarking: '}</strong>
                {language === 'ar' ? 'إمكانية إرفاق شعار شركة المقاولات أو جهاز الإشراف كعلامة مائية فوق كافة اللقطات لمنع التزوير.' : 'Option to embed municipal approvals or consultant/consultancy corporate logos directly to safeguard copyright.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'متطلبات الأمان والخصوصية المطلقة: ' : 'Complete Privacy-First Paradigm: '}</strong>
                {language === 'ar' ? 'تُعالج كافة العمليات والبيانات والصور محلياً 100% دون أي فرصة لانتهاك سرية مشاريعكم الهندسية.' : 'All captures stand isolated local-only to maintain site security boundaries and protect state-important projects information.'}
              </li>
            </ul>
          </div>

          <div className="text-center pt-6">
            <p className="text-sm text-slate-400">
              {language === 'ar'
                ? 'نتعهد بالمضي قدماً في دعم وتوسيع ميزات الجيل القادم من تطبيق Geo-Stamp لمواصلة ثقة المهندسين والمؤسسات الكبرى.'
                : 'We are committed to introducing top-tier capabilities in our Geo-Stamp application to remain the most trusted choice for engineers globally.'}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
