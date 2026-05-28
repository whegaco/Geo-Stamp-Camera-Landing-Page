import { motion } from 'motion/react';
import { Layers, Sparkles, MapPin, Download, BookOpen, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function AgentStamperPromo() {
  const { language } = useLanguage();

  const isAr = language === 'ar';

  const steps = [
    {
      icon: <Layers className="w-6 h-6 text-brand" />,
      title: isAr ? '1. رفع الصورة' : '1. Upload Photo',
      desc: isAr ? 'اسحب صورتك الهندسية أو حددها من هاتفك مباشرة.' : 'Drag or select your on-site engineering picture easily.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-blue-400" />,
      title: isAr ? '2. قراءة الـ GPS' : '2. Extract Location',
      desc: isAr ? 'يقوم الوكيل فورياً باستيراد إحداثيات خطوط الطول والعرض المدمجة.' : 'Automatically parse and map the EXIF GPS metadata.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      title: isAr ? '3. تحليل ذكي بالرؤية' : '3. AI Field Analysis',
      desc: isAr ? 'يفحص المكونات ونواحي السلامة وتوليد الملاحظات فوراً.' : 'Detect concrete, scaffolds, steel and generate official notes.'
    },
    {
      icon: <Download className="w-6 h-6 text-emerald-400" />,
      title: isAr ? '4. تصدير الصورة مختومة' : '4. Download Output',
      desc: isAr ? 'تحميل الصورة بالدقة الكاملة مضافاً إليها الشعار وعلامة الجودة.' : 'Export marked high-res image embedded with your logo.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      {/* Decorative Blurred Background Shapes */}
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-brand/10 blur-[130px] rounded-full -z-10"></div>
      <div className="absolute -bottom-12 right-1/4 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Banner Grid Header */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-8 space-y-4 text-center lg:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              {isAr ? 'أداة ويب حية جديدة' : 'New Live Web App Tool'}
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
              {isAr ? 'وكيل استخراج وختم الصور الهندسي الميداني' : 'Intelligent Field Geo-Stamper Agent'}
            </h2>
            <p className="text-slate-400 text-base lg:text-lg max-w-3xl leading-relaxed">
              {isAr 
                ? 'أصبح بإمكانك الآن ختم وتدقيق صور الموقع الميدانية مباشرة من متصفحك! يتكامل الوكيل مع الذكاء الاصطناعي لفحص الصورة واقتراح التوصيات ومطابقة إحداثيات الخرائط EXIF بنقرة واحدة.'
                : 'Now you can stamp, sign, and verify on-site engineering photos directly from your browser! The agent uses advanced computer vision to assess safety and generate high-fidelity official watermarked photos.'}
            </p>
          </div>
          
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 w-full justify-center">
            <Link
              to="/tools/geo-stamper"
              className="w-full text-center bg-brand text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-brand-hover transition-all shadow-[0_4px_20px_rgba(198,255,0,0.15)] hover:shadow-[0_4px_30px_rgba(198,255,0,0.3)] flex flex-col items-center justify-center gap-1 block group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-black">
                  {isAr ? 'جرب الآن مباشرة بدون تحميل التطبيق' : 'Try Live Now (No App Required)'}
                </span>
                {isAr ? <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </div>
              <span className="text-[10px] opacity-80 font-medium">
                {isAr ? '١٠٠٪ مجاناً وسريع ومتوافق مع الكاميرا' : '100% Free, instant camera preview'}
              </span>
            </Link>
            
            <Link
              to="/blog/geo-stamper-guide"
              className="w-full text-center bg-slate-950 text-slate-300 border border-slate-800 px-8 py-4 rounded-xl font-bold hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-2 block"
            >
              <BookOpen className="w-5 h-5 text-brand" />
              {isAr ? 'اقرأ الدليل المصور والشرح' : 'Read Pictorial Guide'}
            </Link>
          </div>
        </div>

        {/* Step-by-Step interactive process deck */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 hover:border-brand/40 transition-colors rounded-2xl p-6 relative group"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-5 border border-slate-800 group-hover:bg-brand group-hover:text-slate-950 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mini Screenshot Mockup / Showcase overlay inside promo */}
        <div className="mt-16 bg-slate-950 rounded-3xl p-4 md:p-8 border border-slate-800/80 relative overflow-hidden group hover:border-brand/20 transition-all duration-500">
          <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-slate-950 to-transparent h-12 z-10 pointers-events-none"></div>
          <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-slate-950 to-transparent h-12 z-10 pointers-events-none"></div>
          
          <div className="relative z-20 grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-brand font-mono uppercase tracking-wider">
                {isAr ? 'تقنية معالجة جيو-لوكيشن مدمجة' : 'Geo-Location processing built-in'}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {isAr ? 'دقة متناهية لا تدع مجالاً للشك لتوثيق أعمال المقاولات' : 'Secure Watermarks Confirmed by Consultants'}
              </h3>
              
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                {isAr 
                  ? 'بفضل محرك الرسوم الفوري، يقوم النظام بمطابقة إحداثيات GPS وإضافة الأختام مباشرة على كرت فني مائي يتطابق مع الصور الرسمية للمشاريع الكبرى. يدعم الألوان الذهبية الملكية، برتقالي جودة السلامة، والداكن الاحترافي.'
                  : 'Stamps are auto-scaled matching target photo resolution. No rendering pixelation or layout issues, preserving pristine professional quality for official documentation.'}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-lg">
                  <span className="w-2 h-2 bg-brand rounded-full"></span>
                  {isAr ? 'تخصيص كامل للشعارات والمواقع' : 'Fully Customizable Logos & Placements'}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-lg">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {isAr ? 'استخراج ذكي لتفاصيل EXIF' : 'Instant EXIF Metadata Parsing'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 overflow-hidden relative shadow-2xl transition-all group-hover:scale-[1.02] duration-300">
                <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-end p-4 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1541888086903-ee4e10c71199?w=600&q=80)' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                  
                  {/* Mock Stamp bar inside screenshot mockup */}
                  <div className="relative z-10 bg-black/75 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-white font-sans">مشروع لؤلؤة العاصمة السكني</p>
                      <p className="text-[7px] text-brand font-mono" dir="ltr">GPS: 24.7136, 46.6753</p>
                    </div>
                    <div className="w-6 h-6 rounded bg-brand/10 border border-brand/35 flex items-center justify-center text-[8px] text-brand">
                      LOGO
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">{isAr ? 'النمط الحالي:' : 'Active Theme:'}</span>
                    <span className="text-brand font-bold">{isAr ? 'الذهبي الاستثنائي' : 'Premium Gold Style'}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand h-full w-[85%]"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
