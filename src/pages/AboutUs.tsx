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
        
        <div className="space-y-6 text-slate-300 leading-relaxed text-lg text-center md:text-start">
          <p>
            {language === 'ar'
              ? 'تطبيق Geo-Stamp Camera هو الأداة الرائدة للمهندسين المدنيين، المقاولين، وفرق التفتيش لتوثيق أعمالهم الميدانية باحترافية وسهولة.'
              : 'Geo-Stamp Camera is the leading tool for civil engineers, contractors, and inspection teams to document their field work professionally and with ease.'}
          </p>
          <p>
            {language === 'ar'
              ? 'رؤيتنا هي توفير حل بسيط ولكنه قوي يخلصك من الجهد اليدوي المتعلق بإضافة الإحداثيات، والتاريخ، وتفاصيل المشروع على الصور المتعلقة بالمواقع. بفضل تقنياتنا، يمكنك دمج شعار شركتك (Logo) واستخراج تقارير PDF جاهزة للمشاركة بلمسة واحدة.'
              : 'Our vision is to provide a simple yet powerful solution that eliminates the manual effort of adding coordinates, dates, and project details to site photos. With our technology, you can integrate your company logo and extract ready-to-share PDF reports with a single tap.'}
          </p>
          <p>
            {language === 'ar'
              ? 'نحن ملتزمون بالتطوير المستمر والاستماع لمقترحات مستخدمينا لنظل الخيار الأول للتوثيق الهندسي في كافة مواقع الإنشاءات والمشاريع.'
              : 'We are committed to continuous development and listening to our users\' feedback to remain the first choice for engineering documentation across all construction sites and projects.'}
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
