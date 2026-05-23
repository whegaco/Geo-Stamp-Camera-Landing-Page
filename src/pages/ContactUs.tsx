import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Globe } from 'lucide-react';
import SEO from '../components/SEO';

export default function ContactUs() {
  const { language, t } = useLanguage();
  
  return (
    <main className="min-h-screen bg-slate-950 font-cairo">
      <SEO 
        title={language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
        description={language === 'ar' ? 'تواصل معنا لأي أسئلة واستفسارات أو مساعدة بخصوص تطبيق Geo-Stamp Camera.' : 'Contact us for any questions, inquiries, or support regarding the Geo-Stamp Camera app.'}
        url="/contact"
      />
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-24 text-white">
        
        <h1 className="text-4xl font-bold mb-4 text-brand text-center">
          {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
        </h1>
        <p className="text-center text-slate-400 mb-12 text-lg">
          {language === 'ar' 
            ? 'نحن هنا لمساعدتك والإجابة على أي استفسارات تتعلق بتطبيق Geo-Stamp Camera.' 
            : 'We are here to help you and answer any questions regarding the Geo-Stamp Camera app.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center text-center hover:border-brand/50 transition-colors">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-brand mb-4">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Support'}
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              {language === 'ar' ? 'للأسئلة العامة، الدعم الفني، وطلبات الأعمال.' : 'For general inquiries, technical support, and business requests.'}
            </p>
            <a href="mailto:kassema20@gmail.com" className="text-brand font-bold hover:underline">
              kassema20@gmail.com
            </a>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center text-center hover:border-brand/50 transition-colors">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-brand mb-4">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ar' ? 'الموقع الرسمي' : 'Official Website'}
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
               {language === 'ar' ? 'تعرف أكثر على ميزاتنا والتحديثات الجديدة.' : 'Learn more about our features and new updates.'}
            </p>
            <a href="https://geo-stamp-camera.vercel.app" className="text-brand font-bold hover:underline">
              geo-stamp-camera.vercel.app
            </a>
          </div>

        </div>

        <div className="mt-12 bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
             {language === 'ar' ? 'ملاحظات المستخدمين' : 'User Feedback'}
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto">
             {language === 'ar'
               ? 'رأيك يهمنا في تطوير تطبيق Geo-Stamp. إذا كان لديك مقترحات لخصائص جديدة أو وجدت مشكلة تقنية، لا تتردد في مراسلتنا!'
               : 'Your feedback matters in developing the Geo-Stamp app. If you have feature suggestions or found a bug, don\'t hesitate to message us!'}
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
