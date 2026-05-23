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
        keywords={language === 'ar' ? 'سياسة الخصوصية, حفظ البيانات, خصوصية المستخدم, Geo-Stamp Camera, جمع البيانات, ملفات كوكيز' : 'Privacy Policy, data collection, user privacy, Geo-Stamp Camera, cookies policy, GDPR'}
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
              {language === 'ar' ? '3. ملفات تعريف الارتباط وإعلانات Google AdSense' : '3. Cookies and Google AdSense Advertising'}
            </h2>
            <p className="mb-3">
              {language === 'ar'
                ? 'تستخدم جهات خارجية (بما في ذلك Google) ملفات تعريف الارتباط (Cookies) لعرض الإعلانات بناءً على زياراتك السابقة لهذا الموقع أو المواقع الأخرى على الإنترنت.'
                : 'Third-party vendors, including Google, use cookies to serve ads based on our users\' prior visits to this website or other websites on the Internet.'}
            </p>
            <p className="mb-3">
              {language === 'ar'
                ? 'يُمكِّن استخدام ملفات تعريف الارتباط للإعلانات شركة Google وشركاءها من عرض الإعلانات للمستخدمين بناءً على زيارتهم لموقعنا و/أو مواقع أخرى عبر الإنترنت.'
                : 'Google\'s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.'}
            </p>
            <p>
              {language === 'ar'
                ? 'يمكن للمستخدمين إلغاء الاشتراك في الإعلانات المخصصة عن طريق زيارة إعدادات إعلانات Google على الرابط: https://adssettings.google.com أو من خلال زيارة موقع www.aboutads.info لإلغاء استخدام ملفات الكوكيز لجهات خارجية.'
                : 'Users may opt out of personalized advertising by visiting Google Ads Settings at: https://adssettings.google.com or by visiting www.aboutads.info to opt out of a third-party vendor\'s use of cookies for personalized advertising.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '4. مشاركة البيانات' : '4. Data Sharing'}
            </h2>
            <p>
              {language === 'ar'
                ? 'لا نشارك أي بيانات يتم معالجتها من جهازك مع أطراف ثالثة لأننا ببساطة لا نجمعها محلياً ولا نرفعها على أي خادم. يتم التحكم في الصور والتقارير بواسطة المستخدم فقط، وأنت من يقرر مشاركتها عبر تطبيقات خارجية في أي وقت.'
                : 'Since we do not collect or upload any user device data to external servers, we do not share any location coordinates or photographs with third parties. Your photos and report files are fully under your own control, and it is entirely up to you to share them via other apps.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '5. اتصل بنا' : '5. Contact Us'}
            </h2>
            <p>
              {language === 'ar'
                ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني المباشر: kassema20@gmail.com'
                : 'If you have any questions about this Privacy Policy, please contact us directly via email at: kassema20@gmail.com'}
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
