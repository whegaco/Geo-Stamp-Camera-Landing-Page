import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

export default function TermsOfService() {
  const { language } = useLanguage();
  
  return (
    <main className="min-h-screen bg-slate-950 font-cairo">
      <SEO 
        title={language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
        description={language === 'ar' ? 'شروط الخدمة وأحكام الاستخدام لتطبيق Geo-Stamp Camera.' : 'Terms of Service and conditions of use for Geo-Stamp Camera.'}
        keywords={language === 'ar' ? 'شروط الخدمة, اتفاقية المستخدم, أحكام الاستخدام, تطبيق Geo-Stamp Camera' : 'Terms of Service, user agreement, terms of use, Geo-Stamp Camera app'}
        url="/terms"
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-24 text-white">
        <h1 className="text-4xl font-bold mb-8 text-brand">
          {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
        </h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>
            {language === 'ar' 
              ? 'تاريخ السريان: ' + new Date().toLocaleDateString('ar-EG')
              : 'Last Updated: ' + new Date().toLocaleDateString('en-US')}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '1. قبول الشروط' : '1. Acceptance of Terms'}
            </h2>
            <p>
              {language === 'ar'
                ? 'باستخدامك لتطبيق Geo-Stamp Camera، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك استخدام التطبيق.'
                : 'By downloading and using Geo-Stamp Camera, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the app.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '2. الاستخدام المسموح' : '2. Permitted Use'}
            </h2>
            <p>
              {language === 'ar'
                ? 'يُمنح لك ترخيص شخصي، غير حصري، وغير قابل للتحويل لاستخدام التطبيق للتوثيق الميداني وأغراض الأعمال المشروعة. لا يجوز لك استخدام التطبيق لأي أغراض غير قانونية أو لانتهاك خصوصية الآخرين.'
                : 'You are granted a personal, non-exclusive, non-transferable license to use the application for field documentation and legitimate business purposes. You may not use the app for any illegal purposes or to violate the privacy of others.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '3. إخلاء المسؤولية' : '3. Disclaimer of Warranties'}
            </h2>
            <p>
              {language === 'ar'
                ? 'يتم توفير التطبيق "كما هو" دون أي ضمانات. الدقة الجغرافية تعتمد على مستشعرات جهازك ومستوى الاستقبال للأقمار الصناعية (GPS)، ولا نتحمل أي مسؤولية عن أي معلومات غير دقيقة.'
                : 'The application is provided "as is" without any warranties. Geolocation accuracy depends entirely on your device\'s sensors and GPS signal reception. We hold no liability for any inaccurate metadata.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '4. التعديلات' : '4. Modifications'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نحتفظ بالحق في تعديل أو استبدال هذه الشروط في أي وقت. استمرارك في استخدام التطبيق بعد أي تعديل يعني موافقتك على الشروط الجديدة.'
                : 'We reserve the right to modify or replace these terms at any time. Your continued use of the application after any such changes constitutes your acceptance of the new terms.'}
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
