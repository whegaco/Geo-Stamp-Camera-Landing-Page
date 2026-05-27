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
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-brand border-b border-slate-800 pb-6">
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
              {language === 'ar' ? '1. الترخيص وقبول الشروط' : '1. License and Acceptance of Terms'}
            </h2>
            <p className="mb-4">
              {language === 'ar'
                ? 'بتنزيلك واستخدامك لتطبيق Geo-Stamp Camera، فإنك تُبرم اتفاقاً قانونياً ملزماً وتوافق صراحة على الالتزام بشروط الخدمة الموضحة أدناه. التطبيق غير مخصص للأشخاص الذين لا يقبلون بهذه القواعد.'
                : 'By downloading, installing, and utilizing the Geo-Stamp Camera application, you enter into a legally binding agreement and expressly consent to the Terms of Service detailed below. The application is strictly impermissible for utilization by individuals who reject these rules.'}
            </p>
             <p>
              {language === 'ar'
                ? 'يُمنح لك بموجب هذا ترخيص شخصي، محدود، غير حصري، وقابل للإلغاء وغير قابل للتحويل من الباطن، لاستخدام التطبيق كمرافق يومي لإنشاء التقارير الهندسية والميدانية المعتمدة على موقعك الحالي.'
                : 'You are hereby granted a personal, limited, non-exclusive, revocable, and non-sublicensable license to employ the software as a utility to facilitate engineering and field reporting anchored on geolocation data.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '2. شروط الاستخدام المسموح والمحظور' : '2. Acceptable and Prohibited Uses'}
            </h2>
            <p className="mb-4">
              {language === 'ar'
                ? 'تم تصميم هذا البرنامج خصيصًا لتلبية احتياجات المقاولين والاستشاريين ومفتشي المواقع. يجوز لك استخدامه للأغراض القانونية فقط ومجال اختصاصك العملي.'
                : 'This platform is engineered expressly for the necessities of contractors, consultants, and site inspectors. You may only utilize it for legitimate, lawful purposes within your operational scope.'}
            </p>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li>
                <strong>{language === 'ar' ? 'التلاعب: ' : 'Tampering: '}</strong>
                {language === 'ar' ? 'يُمنع منعاً باتاً الهندسة العكسية للتطبيق أو محاولة التلاعب بشيفرة المصدر لمعالجة الإحداثيات وتزوير شهادات الوقت والمكان بشكل غير دقيق يقصد به الاحتيال الإنشائي.' : 'Reverse engineering the application or manipulating source code to maliciously alter location metrics and forge inaccurate timestamp certifications intended for construction fraud is strictly prohibited.'}
              </li>
              <li>
                <strong>{language === 'ar' ? 'انتهاك الخصوصية: ' : 'Privacy Violation: '}</strong>
                {language === 'ar' ? 'أنت توافق على عدم استخدام أداة الكاميرا لتصوير الأشخاص المنعزلين عن سياق العمل، أو تصوير المناطق العسكرية والممتلكات الخاصة المقيدة أمنياً دون إذن مسبق.' : 'You agree not to wield the camera module to photograph individuals isolated from a work-context, or capture strictly secured private architectures and military zones without explicit prior authorization.'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '3. دقة البيانات وإخلاء المسؤولية التقنية' : '3. Data Precision and Disclaimer of Warranties'}
            </h2>
            <p className="mb-4">
              {language === 'ar'
                ? 'يتم توفير خدمات تطبيق Geo-Stamp Camera "كما هي" دون أي ضمانات أو تعهدات مادية أو ضمنية. نحن لا نضمن أن تشغيل الكاميرا سيكون خاليًا من التعطل أو الأخطاء.'
                : 'The Geo-Stamp Camera app services are provided on an "as is" and "as available" basis without any express, physical, or implied warranties. We do not warranty that camera operations will be entirely uninterrupted or error-free.'}
            </p>
             <p>
              {language === 'ar'
                ? 'دقة العلامة المائية للـ GPS (خطوط الطول، العرض، والارتفاع) تعتمد جذرياً وكلياً على جودة شريحة المستشعر داخل هاتف المحمول الخاص بك بالإضافة للغطاء السحابي وعدم وجود حواجز خرسانية. نحن نخلي مسؤوليتنا القانونية كاملة عن أي أضرار ناجمة عن إحداثيات خاطئة تؤدي لخسائر مالية أو أضرار في القياسات الهندسية للمالك أو المقاول.'
                : 'The precision of the GPS watermark (longitude, latitude, elevation) depends fundamentally and entirely upon the quality of the sensor chip inside your mobile hardware, combined with cloud cover interference or concrete barriers. We unequivocally disclaim all legal liability for any consequent damages caused by uncalibrated coordinates leading to financial losses or structural engineering measurement deviations for property owners or contractors.'}
            </p>
          </section>
          
           <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '4. حماية الملكية الفكرية' : '4. Intellectual Property Rights'}
            </h2>
            <p>
              {language === 'ar'
                ? 'تطبيق Geo-Stamp Camera بما يحتويه من تصاميم، خوارزميات تحديد مسار الواجهة، وشعارات هي ملكية فكرية خالصة لرواد التطبيق وتخضع لحماية قوانين حقوق النشر العالمية. المحتوى الذي تنشئه عبر التطبيق (كالصور المحفوظة وتقارير الـ PDF) يصبح ملكيتك الحصرية تماماً ولا ندعي أي حقوق نشر عليها.'
                : 'The Geo-Stamp Camera application, covering its overarching designs, interface algorithms, and logos, remains the exclusive intellectual property of the developers, safeguarded by universal copyright frameworks. The generated footprint (watermarked photos and structured PDF ledgers) manifests as your total, unencumbered intellectual property.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' ? '5. التعديلات اللاحقة للشروط' : '5. Future Modifications'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نحتفظ بالحق التام والمطلق في تعديل، استبدال، أو تنقيح شروط الخدمة في أي وقت يراه الفريق ضروريًا. استمرارك في فتح التطبيق بعد تنفيذ أي تعديل، يعبر إلكترونيًا عن إقرارك المطلق وموافقتك التامة على الشروط المحدثة.'
                : 'We reserve the complete and absolute right to modify, replace, or revise these Terms of Service at whichever interval the team determines necessary. Your sustained execution of the app post-amendments electronically expresses your absolute validation and compliance with the modernized iterations.'}
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
