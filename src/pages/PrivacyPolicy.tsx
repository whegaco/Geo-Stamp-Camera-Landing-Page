import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  
  return (
    <main className="min-h-screen bg-slate-950 font-cairo">
      <SEO 
        title={language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        description={language === 'ar' ? 'سياسة الخصوصية وتفاصيل جمع البيانات لتطبيق Geo-Stamp Camera.' : 'Privacy Policy and data collection details for Geo-Stamp Camera.'}
        url="/privacy"
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-24 text-white">
        <h1 className="text-4xl font-bold mb-8 text-brand">
          {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>
            {language === 'ar' 
              ? 'تاريخ السريان: ' + new Date().toLocaleDateString('ar-EG')
              : 'Effective Date: ' + new Date().toLocaleDateString('en-US')}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '1. جمع البيانات' : '1. Data Collection'}
            </h2>
            <p>
              {language === 'ar'
                ? 'تطبيق Geo-Stamp Camera يعتمد على مستشعرات الكاميرا والـ GPS لتوفير الخدمة. لا نقوم بجمع أو إرسال الخرائط أو الصور أو إحداثيات الموقع إلى أي خوادم خارجية - كافة البيانات يتم معالجتها وحفظها محلياً على جهازك.'
                : 'Geo-Stamp Camera utilizes your device\'s camera and GPS sensors to provide its core functionality. We do not collect, transmit, or store your photos, location data, or any other personal information on external servers. All data processing and storage occur locally on your device.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '2. الصلاحيات المطلوبة' : '2. Required Permissions'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>{language === 'ar' ? 'الكاميرا: ' : 'Camera: '}</strong>
                {language === 'ar' ? 'لالتقاط الصور للتوثيق الميداني.' : 'To capture photos for field documentation.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'الموقع الجغرافي (GPS): ' : 'Location (GPS): '}</strong>
                {language === 'ar' ? 'لإضافة الإحداثيات والوقت بدقة على الصور المرفقة.' : 'To accurately add geographical coordinates and timestamps to your photos.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'التخزين: ' : 'Storage: '}</strong>
                {language === 'ar' ? 'لحفظ الصور المختومة وتقارير الـ PDF على هاتفك.' : 'To save watermarked photos and PDF reports locally.'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '3. مشاركة البيانات' : '3. Data Sharing'}
            </h2>
            <p>
              {language === 'ar'
                ? 'لا نشارك أي بيانات مع أطراف ثالثة لأننا ببساطة لا نجمعها. يتم التحكم في الصور والتقارير بواسطتك فقط، وأنت من يقرر مشاركتها عبر تطبيقات خارجية.'
                : 'Since we do not collect any user data, we do not share any data with third parties. Your photos and reports are fully under your control, and it is up to you to share them via other apps.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '4. اتصل بنا' : '4. Contact Us'}
            </h2>
            <p>
              {language === 'ar'
                ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر: kassema20@gmail.com'
                : 'If you have any questions about this Privacy Policy, please contact us at: kassema20@gmail.com'}
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
