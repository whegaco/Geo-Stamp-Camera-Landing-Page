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
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-brand border-b border-slate-800 pb-6">
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
            <p className="mb-4">
              {language === 'ar'
                ? 'تطبيق Geo-Stamp Camera يعتمد على مستشعرات الكاميرا والـ GPS لتوفير الخدمة. لا نقوم بجمع أو إرسال الخرائط أو الصور أو إحداثيات الموقع أو أي بيانات شخصية إلى أي خوادم خارجية - كافة البيانات يتم معالجتها وحفظها محلياً بأمان على جهازك المحمول.'
                : 'Geo-Stamp Camera utilizes your device\'s camera and GPS sensors to provide its core functionality. We strictly do not collect, transmit, or store your photos, location data, or any other personal information on external servers. All data processing and storage occur securely and locally on your device.'}
            </p>
            <p>
              {language === 'ar'
                ? 'أمان بيانات مشاريعك هو أولويتنا القصوى. صُمم التطبيق ليعمل دون الحاجة لاتصال بالإنترنت لمعالجة وحفظ الصور (Offline First)، مما يضمن السرية التامة للمعلومات الهندسية الحساسة.'
                : 'The security of your project data is our highest priority. The application is designed as an "Offline First" tool, meaning it processes and saves photos without requiring an internet connection, guaranteeing complete confidentiality for sensitive engineering information.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '2. أنواع الصلاحيات وتبرير طلبها' : '2. Required Permissions and Justifications'}
            </h2>
            <ul className="list-disc list-inside space-y-4">
              <li>
                <strong>{language === 'ar' ? 'الكاميرا (Camera): ' : 'Camera: '}</strong>
                {language === 'ar' ? 'مطلوبة حصرياً لالتقاط الصور الحية للتوثيق الميداني للأعمال الإنشائية ومراحل التنفيذ المختلفة. لا يتم تشغيل الكاميرا في الخلفية بأي حال.' : 'Strictly required to capture live photos for the field documentation of construction works and various execution phases. The camera is never accessed in the background.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'الموقع الجغرافي الدقيق (Precise GPS Location): ' : 'Precise Location (GPS): '}</strong>
                {language === 'ar' ? 'تُستخدم بيانات الموقع المشتقة من الأقمار الصناعية لغرض واحد فقط: دمج الإحداثيات (خط العرض وخط الطول) بدقة، بالإضافة إلى حساب الارتفاع عن سطح البحر (إن توفر) كعلامة مائية ونصوص فوق الصور.' : 'Satellite-derived location data is used for one sole purpose: to accurately embed GPS coordinates (latitude and longitude) and altitude (if available) as text and watermarks onto your photos.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'مساحة التخزين وقراءة/كتابة الملفات (Storage Access): ' : 'Storage Access (Read/Write): '}</strong>
                {language === 'ar' ? 'نحتاج هذه الصلاحية لحفظ الصور المختومة وتقارير الـ PDF النهائية وتخزينها في معرض الصور الخاص بجهازك، إضافة لقراءة الصور القديمة في حال رغبتك بإعادة استخدامها ضمن تقارير جديدة.' : 'We require this permission to save stamped photos and final PDF reports directly to your device\'s gallery, and to read existing photos if you choose to include them in new reports.'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '3. ملفات تعريف الارتباط لتطبيقات الويب وإعلانات شبكة Google' : '3. Web Cookies and Google AdSense Advertising Network'}
            </h2>
            <p className="mb-3">
              {language === 'ar'
                ? 'بالنسبة لموقعنا الإلكتروني (وليس التطبيق الخاص بالهاتف المحمول)، تستخدم جهات خارجية (بما في ذلك شركة Google) ملفات تعريف الارتباط (Cookies) بغرض تحسين الأداء وعرض الإعلانات بطريقة تناسب اهتماماتك بناءً على زياراتك السابقة لهذا الموقع أو المواقع الأخرى.'
                : 'Regarding our promotional website (not the mobile application itself), third-party vendors, including Google, use cookies to enhance performance and to serve targeted ads based on our users\' prior visits to this website or other websites on the Internet.'}
            </p>
            <p className="mb-3">
              {language === 'ar'
                ? 'يُمكِّن استخدام ملفات تعريف الارتباط الديموغرافية شركة Google وشركاءها المعتمدين من عرض إعلانات مستهدفة للمستخدمين. يمكنك دوماً التحكم في هذه الإعلانات وتعطيل التخصيص.'
                : 'Google\'s use of advertising cookies enables it and its certified partners to serve targeted advertisements. You can control these ads and disable personalization at any time.'}
            </p>
            <p>
              {language === 'ar'
                ? 'لإلغاء الاشتراك في الإعلانات المخصصة، يرجى زيارة إعدادات إعلانات جوجل على الرابط: https://adssettings.google.com أو من خلال زيارة موقع www.aboutads.info لإلغاء استخدام ملفات الكوكيز في متصفحك.'
                : 'Users may opt out of personalized advertising by visiting Google Ads Settings at: https://adssettings.google.com or by visiting www.aboutads.info to opt out of a third-party vendor\'s use of cookies.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '4. حماية بيانات الأطفال' : '4. COPPA (Children Online Privacy Protection Act)'}
            </h2>
            <p>
              {language === 'ar'
                ? 'التطبيق موجه في المقام الأول للمهندسين والمقاولين المحترفين في بيئات العمل، وهو لا يستهدف الأطفال دون سن الثالثة عشرة (13 عامًا) بأي شكل من الأشكال. نحن لا نجمع عن عمد أي معلومات تعريف شخصية من الأطفال.'
                : 'Our application is strictly intended for professional engineers and contractors in work environments. It is not directed towards children under the age of 13. We do not knowingly collect personal identifiable information from children.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '5. مشاركة البيانات والجهات الخارجية' : '5. Third-Party Data Sharing'}
            </h2>
            <p>
              {language === 'ar'
                ? 'لا نبيع ولا نؤجر ولا نشارك أي بيانات يتم معالجتها من جهازك مع أي شركات تحليل (Analytics) أو وكالات إعلان (Ad Agencies) تابعة لأطراف ثالثة داخل التطبيق نفسه لأننا ببساطة لا نجمعها ونعالجها حصريًا بطريقة محلية صِرفة (100% Local Processing). الصور والتقارير هي ملكيتك الحصرية وأنت من يقرر متى وأين يتم رفعها، سواء للواتساب أو البريد الإلكتروني الخاص بشركتك.'
                : 'We do not sell, rent, or share any processed device data with analytical companies or advertising agencies within the app itself, because we simply do not collect it and we operate strictly with 100% Local Processing. The generated photos and reports are your exclusive property; you alone dictate when and where they are uploaded (such as via WhatsApp or your corporate email).'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '6. تحديثات سياسة الخصوصية' : '6. Privacy Policy Updates'}
            </h2>
            <p>
              {language === 'ar'
                ? 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر وفقاً للتغييرات التنظيمية أو التشغيلية. ستكون أي تغييرات ملحوظة منشورة على هذه الصفحة بشكل فوري، وسنعتبر استمرارك باستخدام التطبيق موافقة ضمنية منك على أحدث الإشعارات المتعلقة بالخصوصية.'
                : 'We may sporadically update this Privacy Policy to reflect operational, legal, or regulatory changes. Any noteworthy modifications will be posted immediately on this page. Your continued use of the app constitutes implicit consent to our most current privacy notices.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '7. اتصل بنا' : '7. Contact Us'}
            </h2>
            <p>
              {language === 'ar'
                ? 'إذا كانت لديك أي استفسارات أو ملاحظات إضافية بخصوص مبادئ سياسة الخصوصية أو معالجة البيانات، يُسعدنا استقبال رسائلك والتواصل معك في أي وقت عبر البريد الإلكتروني الرسمي لمدير التطبيق وتطويره:'
                : 'Should you have further inquiries or concerns regarding our privacy principles or data handling operations, we are pleased to receive your messages at any time via our official developer email address:'}
            </p>
            <p className="mt-4 font-bold text-brand">kassema20@gmail.com</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
