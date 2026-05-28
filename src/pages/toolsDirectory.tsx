import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  FileText,
  Calculator,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
  MapPin,
  Layers,
  ShieldCheck,
  Compass,
  Printer,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function ToolsDirectory() {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const toolsList = [
    {
      id: 'geo-stamper',
      title: language === 'ar' ? '📸 الكاميرا الجيوديسية والختم المائي' : '📸 Geodesic Camera & Watermark Stamper',
      shortDesc: language === 'ar' ? 'توثيق الصور الميدانية فوريّاً بإحداثيات الـ GPS والتاريخ الدقيق لمنع التلاعب.' : 'Instantly document field photos with real-time GPS coordinates, timestamps & projects watermarks.',
      fullDesc: language === 'ar' 
        ? 'أداة بالغة الأهمية للمهندسين الاستشاريين والمقاولين في المواقع. تتيح لك رفع صور الموقع وختمها بالتاريخ والوقت الفعلي الدقيق وإحداثيات الموقع (GPS) وتحديد الترويسة للتأكد من مطابقتها لكود البناء السعودي والكودات الإقليمية. تدعم مطابقة وتأكيد جودة الأعمال لمنع النزاعات القانونية بين الملاك والمطورين.'
        : 'A critical system for engineering consultants and site foremen. Upload site snapshots and automatically overlay verified real-time calendars, times, coordinates (GPS), and project subtitles. Fully complies with local and international construction safety codes.',
      path: '/tools/geo-stamper',
      badge: language === 'ar' ? 'الأكثر استخداماً' : 'Most Popular',
      category: 'surveying',
      features: language === 'ar' 
        ? ['ختم إحداثيات GPS فوري مجاناً', 'تسجيل دقيق للتوقيت والتاريخ الجيولوجي', 'صيغ EXIF مطابقة لمتطلبات البلديات', 'تضمين اسم المشروع واسم المقاول واللوجو']
        : ['Free instantaneous GPS coordinate stamping', 'Accurate geological time & calendar tracking', 'Municipal compliant EXIF photo formats', 'Embed customized developer name & brand logos'],
      icon: Camera,
      color: 'from-blue-600/30 to-slate-900 border-blue-500/30',
      tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'report-generator',
      title: language === 'ar' ? '📋 صانع تقارير المعاينة والمطابقة' : '📋 Architectural Site Inspection Report Builder',
      shortDesc: language === 'ar' ? 'توليد تقارير PDF احترافية ومدموغة جغرافياً لتقديمها للاستشاريين والملاك.' : 'Generate beautifully formatted, ready-to-print PDF inspection logs with site compliance checklists.',
      fullDesc: language === 'ar'
        ? 'من خلال واجهة تصميم ذكية لتقارير A4، يمكنك توليد تقارير معاينة خرسانة أو تقارير سلامة مهنية في ثوانٍ. تدمج الأداة شعار شركتك (لوجو)، تفاصيل وتواريخ الفحص، جدول تدقيق البنود وتقييمها (مطابق - مرفوض)، بجانب معرض صور مدموغ بخرائط الـ GPS وأختام التواقيع الرقمية المؤمّنة.'
        : 'A powerful utility to build structured PDF reports that adhere to professional guidelines. It merges your company logo, inspector names, interactive evaluation sheets, and embedded GPS-stamped photo logs with digital consultant validation signature seals.',
      path: '/tools/report-generator',
      badge: language === 'ar' ? 'تقارير رسمية' : 'A4 Ready',
      category: 'reporting',
      features: language === 'ar'
        ? ['تصدير مباشر بصيغة PDF معدة للطباعة فورياً', 'نماذج بنود فحص جاهزة (خرسانات / سلامة مهنية)', 'مع معرض صور تفصيلي بملاحظات المعاينة الميدانية', 'أختام وتواقيع افتراضية معتمدة برابط إحداثيات']
        : ['Instant printable PDF file export on one click', 'Built-in presets (Structural concrete / HSE safety)', 'Comprehensive photo logs with custom engineer notes', 'Virtual dynamic validation stamps & client signs'],
      icon: FileText,
      color: 'from-amber-600/30 to-slate-900 border-amber-500/30',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'materials-calculator',
      title: language === 'ar' ? '🧮 حاسبة كميات مواد البناء وتكلفة الهيكل' : '🧮 Smart Quantities & Concrete Volume Estimator',
      shortDesc: language === 'ar' ? 'حساب دقيق لمكعبات الخرسانة، الحديد، الإسمنت، الرمل والرطوبة بمراعاة الهدر.' : 'Precision material estimator for concrete volumetric mix, rebar weights, and masonry blocks.',
      fullDesc: language === 'ar'
        ? 'أداة هندسية دقيقة للغاية لتقدير الاحتياجات من المواد الخام. احسب متطلبات الأسقف واللبشة والأعمدة والقواعد والأعمال الجدارية والمحارة. توفر محاكاة مالية لتكلفة المواد بالعملة المحلية مع لوحة تفضيلات متطورة لتعديل نسب الخلط (كجم إسمنت للمتر المكعب، ووزن الحديد بالطن).'
        : 'Eliminate manual calculation fatigue. Estimate essential raw volumes for slabs, foundations, columns, plastering, and block walls. Features fully interactive configurations to adjust default mix formulations and local material pricing sheets.',
      path: '/tools/materials-calculator',
      badge: language === 'ar' ? 'حسابات هندسية' : 'Smart Algebra',
      category: 'surveying',
      features: language === 'ar'
        ? ['حساب الخرسانات المسلحة (بلاطات / أعمدة / قواعد)', 'تقدير وزن حديد التسليح الكلي بالطن والسيخ', 'حساب عدد الطوب والبلوك وحجم مونة الأسمنت والماء', 'تخصيص أسعار الإسمنت والرمل والحديد من الإعدادات']
        : ['Calculates exact cubic volumes with safety margins', 'Estimates structural steel weight benchmarks in tons', 'Estimates mortar cement bag quantities and water limits', 'Adjustable unit prices for highly realistic budgets'],
      icon: Calculator,
      color: 'from-emerald-600/30 to-slate-900 border-emerald-500/30',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'qa-checklist',
      title: language === 'ar' ? '📋 قائمة مراقبة واستلام جودة الأعمال الإنشائية' : '📋 Professional Engineering Quality Control Audit',
      shortDesc: language === 'ar' ? 'متابعة بنود استلام الموقع والتسليم الميداني خطوة بخطوة للحد من كوارث التنفيذ.' : 'Step-by-step structural compliance checkbox and audits tool aligned with engineering standards.',
      fullDesc: language === 'ar'
        ? 'بوابة مراقبة الجودة الإنشائية واستلام بنود الموقع خطوة بخطوة. تغطي الفتحات الحفرية والدمك للتربة، استلام الشدات الخشبية والمداميك وتدقيق حديد التسليح ومكعبات اختبار الضغط للصب. تساعد المهندس الفاحص على تنظيم التوجيهات والملاحظات وصناعة أرشيف موثق لكل مشروع.'
        : 'An institutional quality assurance workspace built to guide engineer walkthroughs. Tick off inspections for soil compaction, rebar overlaps, wooden bracings, and Slump tolerances. Automatically saves audit status codes to produce a clear progress timeline.',
      path: '/tools/materials-calculator?tab=checklist',
      badge: language === 'ar' ? 'إدارة الجودة QA' : 'QA Certified',
      category: 'reporting',
      features: language === 'ar'
        ? ['تغطية بنود فحص الحفر والأساسات والصب والتشطيبات', 'تحديث حي وجداول مراقبة سهلة مع تدوين الملاحظات', 'مراجعة المجموع والنسب المئوية الحالية لجاهزية التسليم', 'مطابقة معايير استلام كود البناء وتصدير الكشف للطباعة']
        : ['Covers structural excavation, steel frameworks, & finishes', 'Write in-line observation records and inspector action logs', 'Real-time calculation of overall readiness handover percentages', 'Fully exportable along with the materials bill of quantities'],
      icon: CheckSquare,
      color: 'from-purple-600/30 to-slate-900 border-purple-500/30',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 font-sans antialiased text-white pb-24 pt-28">
      <SEO 
        title={language === 'ar' ? 'أدوات المقاولات المجانية: حاسبة كميات البناء، تقارير PDF وكاميرا الـ GPS' : 'Free Civil Engineering & Construction Tools: Materials Calculator, PDF Site Logs, & GPS Camera'}
        description={language === 'ar' ? 'بوابة الأدوات الهندسية المجانية الأكثر بحثاً: حاسبة الخرسانة والحديد، قوائم تفقد استلام جودة أعمال الموقع، وصانع تقارير المعاينة والمطابقة PDF الجاهزة للطباعة فورياً باللغتين.' : 'Complete web toolkit for civil works: volumetric mix calculator, custom block & rebar quantity estimator, HSE safety compliance checklist, and dynamic A4 inspection PDF report generator.'}
        keywords={language === 'ar' ? 'أدوات مقاولات مجانية, حاسبة كميات البناء, حاسبة الخرسانة والاسمنت, حساب طن الحديد بالسيخ, الكود السعودي للبناء, صانع تقارير هندسية PDF, بنود استلام المهندس المدني, كروكي الموقع بلدي, جيو ستامب طوب, كاميرا الاحداثيات GPS' : 'civil engineering calculators, free concrete estimator, rebar tonnage calculation, PDF inspection report builder, HSE safety audit checklist, GPS camera stamp, EXIF location photos'}
        url="/tools"
      />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top visual heading */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 w-72 h-72 bg-brand/5 blur-3xl rounded-full" />
          
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 border border-brand/20 text-brand rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Compass className="w-3.5 h-3.5" />
            {language === 'ar' ? 'المنصة المتكاملة للمهندسين والمقاولين ٢٠٢٦' : 'All-In-One Operability Hub 2026'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {language === 'ar' ? 'بوابة الأدوات الهندسية والتقارير الميدانية' : 'Geo-Stamp Smart Tools Directory'}
          </h1>
          <p className="text-slate-400 mt-4 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'اختر الأداة المناسبة لبدء التخطيط وتوفير التكاليف. نعمل على تمكين الاستشاريين والمهندسين من توثيق المواقع بدقة بالغة وحصر الكميات دون الحاجة لبرامج معقدة.' 
              : 'Deploy modern client-side calculators & inspectors. Accelerate your on-site review, generate invoices, or compile legal compliance documents in minutes.'}
          </p>
        </div>

        {/* Separated segments of tools */}
        <div className="space-y-14">
          
          {/* Section A: Document and Stamping */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                <span className="w-2 md:w-3 h-5 md:h-6 rounded bg-brand block" />
                {language === 'ar' ? 'أولاً: أدوات المعاينة والمطابقة والتقارير' : 'Category A: Site Audit, Verification & Reports'}
              </h2>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{language === 'ar' ? 'الأدوات الميدانية' : 'Field Operable'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {toolsList.filter(t => t.category === 'reporting').map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${tool.color} p-8 shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-brand/40 hover:-translate-y-1.5`}
                  >
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-slate-950 border border-slate-800 text-brand rounded-2xl">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border ${tool.tagColor}`}>
                          {tool.badge}
                        </span>
                      </div>

                      <div className="space-y-2 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <h3 className="text-xl font-extrabold text-white flex items-center gap-1 hover:text-brand transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          {tool.shortDesc}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/40">
                          {tool.fullDesc}
                        </p>
                      </div>

                      {/* Display Features */}
                      <div className="pt-3 space-y-2 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{language === 'ar' ? 'أبرز الميزات الفنية:' : 'Core capabilities:'}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tool.features.map((feature, idx) => (
                            <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5 justify-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                              <span className="truncate">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                      <Link
                        to={tool.path}
                        className="flex items-center gap-1.5 px-5 py-3 bg-brand hover:bg-brand-hover text-slate-950 text-xs font-black rounded-xl transition-all select-none hover:scale-103 active:scale-97 cursor-pointer"
                      >
                        {language === 'ar' ? 'ابدأ تشغيل الأداة مجاناً' : 'Launch Workspace'}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Section B: Surveying & Calculators */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                <span className="w-2 md:w-3 h-5 md:h-6 rounded bg-brand block" />
                {language === 'ar' ? 'ثانياً: أدوات حصر الكميات والحسابات الهندسية' : 'Category B: Volumetric Mixes & Material Calculators'}
              </h2>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{language === 'ar' ? 'الأدوات المكتبية' : 'Back-office Algebra'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {toolsList.filter(t => t.category === 'surveying').map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${tool.color} p-8 shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-brand/40 hover:-translate-y-1.5`}
                  >
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-slate-950 border border-slate-800 text-brand rounded-2xl">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase border ${tool.tagColor}`}>
                          {tool.badge}
                        </span>
                      </div>

                      <div className="space-y-2 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <h3 className="text-xl font-extrabold text-white flex items-center gap-1 hover:text-brand transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          {tool.shortDesc}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/40">
                          {tool.fullDesc}
                        </p>
                      </div>

                      {/* Display Features */}
                      <div className="pt-3 space-y-2 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{language === 'ar' ? 'أبرز الميزات الفنية:' : 'Core capabilities:'}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tool.features.map((feature, idx) => (
                            <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5 justify-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                              <span className="truncate">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                      <Link
                        to={tool.path}
                        className="flex items-center gap-1.5 px-5 py-3 bg-brand hover:bg-brand-hover text-slate-950 text-xs font-black rounded-xl transition-all select-none hover:scale-103 active:scale-97 cursor-pointer"
                      >
                        {language === 'ar' ? 'ابدأ تشغيل الأداة مجاناً' : 'Launch Workspace'}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Global disclaimer / educational tips panel */}
        <div className="mt-20 bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
          <div className="p-4 bg-brand/10 border border-brand/20 text-brand rounded-2xl flex-shrink-0">
            <Award className="w-8 h-8 animate-pulse" />
          </div>
          <div className="text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h4 className="text-lg font-extrabold text-white">{language === 'ar' ? '🛡️ إخلاء مسؤولية ودقة المعادلات الهندسية' : '🛡️ Quantities Disclaimer & Operational Integrity'}</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {language === 'ar'
                ? 'كافة الحسابات المخرجة من حاسبة كميات البناء ونسب خلط المواد هي حسابات تقديرية استرشادية مبنية على الكودات المعمارية الشائعة وقد لا تغني عن المراجعة الدقيقة لمخططات مشروعك الهندسية التفصيلية المعتمدة من قبل المهندس الإنشائي المسؤول عن رخصة البناء. يتكفل المتصفح بمعالجة كل البيانات محلياً دون أي رفع لخوادم خارجية حماية لسرية بيانات شركتك ومقاولاتك.'
                : 'All analytical estimations in our structural suite are computed locally on client-side sandboxes for data privacy. Calculations reflect standardized global material mixes but should not replace your official blueprint audits signed off by practicing, board-certified civil engineers.'}
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
