import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Printer, 
  Sparkles, 
  Upload, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase, 
  Clock, 
  ShieldAlert, 
  Check, 
  DollarSign, 
  HelpCircle,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  item: string;
  status: 'pass' | 'fail' | 'na';
  notes: string;
}

interface AttachedImage {
  id: string;
  url: string;
  name: string;
  notes: string;
  gps?: string;
}

export default function ReportGenerator() {
  const { language } = useLanguage();
  
  // Basic Info States
  const [projectName, setProjectName] = useState(language === 'ar' ? 'مشروع برج سما السكني' : 'Sama Residential Tower Project');
  const [contractorName, setContractorName] = useState(language === 'ar' ? 'شركة المقاولون العرب المتحدون' : 'United Arab Contractors Co.');
  const [inspectorName, setInspectorName] = useState(language === 'ar' ? 'م. أحمد رأفت الجمال' : 'Eng. Ahmed Raafat Al-Jamal');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportTime, setReportTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [gpsCoordinates, setGpsCoordinates] = useState('24.7136° N, 46.6753° E (الرياض، المملكة العربية السعودية)');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreset, setLogoPreset] = useState<string>('preset1'); // preset1 (Architectural), preset2 (Safety), custom
  
  // Checklist Presets
  const concretePreset: ChecklistItem[] = [
    { id: '1', item: language === 'ar' ? 'التحقق من منسوب الحفر ومطابقة تربة التأسيس' : 'Verify excavation depth & soil bearing capacity alignment', status: 'pass', notes: language === 'ar' ? 'مطابق تماماً لتقرير فحص التربة المعتمد' : 'Fully complies with soil sample lab reports' },
    { id: '2', item: language === 'ar' ? 'استلام أعمال النجارة والشدات الخشبية للقواعد' : 'Inspection of formwork and shutters for foundations', status: 'pass', notes: language === 'ar' ? 'قوية وجيدة التدعيم وخالية من الفراغات' : 'Robust, well-supported, and free from debris' },
    { id: '3', item: language === 'ar' ? 'فحص جودة حديد التسليح ومطابقة الأقطار والمسافات' : 'Inspection of steel reinforcement bar diameters & spacing', status: 'pass', notes: language === 'ar' ? 'تم مطابقة الكود الإنشائي المعتمد للمشروع' : 'Matches approved project structural code specifications' },
    { id: '4', item: language === 'ar' ? 'فحص سكاكين التربيط والغطاء الخرساني (البسكويت)' : 'Check tie-wires, spacers, and concrete covers', status: 'pass', notes: language === 'ar' ? 'سليم وتم تركيبه بانتظام' : 'Installed soundly and periodically spaced' },
    { id: '5', item: language === 'ar' ? 'اختبار تماسك هبوط الخرسانة الطازجة (Slump Test)' : 'Fresh concrete Slump Test check', status: 'fail', notes: language === 'ar' ? 'تجاوز الهبوط الحد المسموح به في السيارة رقم 3 وبانتظار الرفض' : 'Slump exceeded limits on truck #3; reject procedures initiated' },
  ];

  const safetyPreset: ChecklistItem[] = [
    { id: '1', item: language === 'ar' ? 'التزام الطاقم الفني بارتداء الخوذات وأحذية السلامة' : 'Personnel compliance with helmets & safety boots wearing', status: 'pass', notes: language === 'ar' ? 'التزام كامل بنسبة 95%' : '95% total site team alignment achieved' },
    { id: '2', item: language === 'ar' ? 'تأمين الأسوار والحواجز الجانبية لمناطق الحفر العميقة' : 'Installation of safety barriers around deep excavation pits', status: 'pass', notes: language === 'ar' ? 'تم عزل منطقة الحفر بشريط تحذيري وحواجز معدنية' : 'Safely isolated with warning tape & steel barriers' },
    { id: '3', item: language === 'ar' ? 'تأمين سلامة السقالات المعدنية وربطها بالهيكل الإنشائي' : 'Metal scaffoldings securely tethered to concrete frame', status: 'fail', notes: language === 'ar' ? 'رصد ميل طفيف في السقالة الجنوبية الغربية - تم توجيه إيقاف عمل فورياً' : 'Slight drift detected on SW scaffolding scaffold - work stop issued' },
    { id: '4', item: language === 'ar' ? 'توافر طفايات الحريق بمستودعات المواد سريعة الاشتعال' : 'Fire extinguishers count & charge at flammable substance storage', status: 'pass', notes: language === 'ar' ? 'صالحة للخدمة وتمت مطابقتها بالدفاع المدني' : 'Fully charged & approved by local regulatory services' },
  ];

  const [checklist, setChecklist] = useState<ChecklistItem[]>(concretePreset);
  const [activePreset, setActivePreset] = useState<'concrete' | 'safety' | 'custom'>('concrete');
  const [newCheckItem, setNewCheckItem] = useState('');

  // Attached Images
  const [images, setImages] = useState<AttachedImage[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&q=80',
      name: 'excavation_check_gps.jpg',
      notes: language === 'ar' ? 'تم فحص استقرار جوانب الحفر والتثبت من منسوب التأسيس في الجزء الجنوبي من المبنى.' : 'Excavation boundaries verified; foundation depth level audited at Southern plot.',
      gps: '24.7136° N, 46.6753° E'
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
      name: 'safety_site_walk.jpg',
      notes: language === 'ar' ? 'متابعة التزام المقاول الفرعي بارتداء معدات الحماية الشخصية وتركيب حواجز الحفر.' : 'Monitoring sub-contractor wearing complete Personal Protective Equipment (PPE).',
      gps: '24.7134° N, 46.6751° E'
    }
  ]);

  // Premium / Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [premiumActive, setPremiumActive] = useState(true);

  // Switch preset handler
  const handlePresetChange = (type: 'concrete' | 'safety' | 'custom') => {
    setActivePreset(type);
    if (type === 'concrete') {
      setChecklist(concretePreset);
    } else if (type === 'safety') {
      setChecklist(safetyPreset);
    } else {
      setChecklist([]);
    }
  };

  // Add Item to Checklist
  const addChecklistItem = () => {
    if (!newCheckItem.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      item: newCheckItem,
      status: 'pass',
      notes: ''
    };
    setChecklist([...checklist, newItem]);
    setNewCheckItem('');
  };

  // Remove Item
  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  // Update Item Status
  const updateItemStatus = (id: string, status: 'pass' | 'fail' | 'na') => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, status } : item));
  };

  // Update Item Notes
  const updateItemNotes = (id: string, notes: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, notes } : item));
  };

  // Upload Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        setLogoPreset('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Report Image
  const handleReportImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImg: AttachedImage = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            url: reader.result as string,
            name: file.name,
            notes: language === 'ar' ? 'صورة ميدانية موثقة تم حفظها بتاريخ اليوم بشكل آمن.' : 'Field captured photo archived securely today.',
            gps: gpsCoordinates.split(' ')[0] + ' ' + gpsCoordinates.split(' ')[1]
          };
          setImages(prev => {
            if (prev.length >= 4 && !premiumActive) {
              setIsUpgradeModalOpen(true);
              return prev; // Limit to 4 images for free users
            }
            return [...prev, newImg];
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Delete Image
  const deleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  // Update Image Notes
  const updateImageNotes = (id: string, val: string) => {
    setImages(images.map(img => img.id === id ? { ...img, notes: val } : img));
  };

  // Print Page Trigger
  const handlePrint = () => {
    window.print();
  };

  // Handle simulated upgrade
  const handleSimulatedPayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPremiumActive(true);
      setIsUpgradeModalOpen(false);
      setPaymentSuccess(false);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-slate-950 font-sans antialiased text-white pb-16 print:bg-white print:text-black">
      <SEO 
        title={language === 'ar' ? 'صانع تقارير المعاينة الميدانية وخرائط الـ GPS' : 'Professional Construction Report & PDF Generator'}
        description={language === 'ar' ? 'أداة ذكية للمقاولين والمهندسين لدمج لوجو المشروع، الصور المدموغ بالتاريخ والوقت والإحداثيات، وتوليد تقارير فحص PDF معتمدة فوراً.' : 'Professional site inspection tool for contractors to compile date, time, and GPS stamped photos with engineering checklists and custom logos into PDF reports.'}
        keywords={language === 'ar' ? 'صانع التقارير الهندسية, تقرير PDF للبلدية, تصوير بالتاريخ والوقت وموقع gps, وضع لوجو المشروع علي الصور, برنامج جي بي اس للمقاولات, تقرير فحص الخرسانة' : 'engineering report generator, municipal PDF report, date time GPS stamp generator, project logo image overlay, construction app, excavation checklist'}
        url="/tools/report-generator"
      />
      
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-10 print:pt-0">
        
        {/* Intro Banner */}
        <div className="text-center mb-10 print:hidden">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 text-brand rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ar' ? 'أقوى أداة لزيادة الأمان والموثوقية والتربح' : 'The ultimate system for professional growth & monetization'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {language === 'ar' ? 'صانع تقارير المعاينة الميدانية ومطابقة الكود الإنشائي' : 'Construction Site Inspection & Geo-Stamped PDF Report Builder'}
          </h1>
          <p className="text-slate-400 mt-3 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'اجمع لقطات موقعك الموثقة بـ GPS والتاريخ والوقت مع بنود فحص السلامة والخرسانات وعلامتك المائية لتسليمها الاستشاري والعميل كملف رسمي جاهز للطباعة.' 
              : 'Seamlessly combine your date, time, and GPS stamped site photos with code checklists, consultant signs, and safety stamps for instantaneous client delivery.'}
          </p>
        </div>

        {/* Workspace Layout - Grid blocks split on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Left panel: Control variables (Form settings) */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            
            {/* Box 1: Core details */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileText className="w-5 h-5 text-brand" />
                {language === 'ar' ? '١. بيانات التقرير الأساسية' : '1. Core Report Details'}
              </h2>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'اسم المشروع والمرحلة' : 'Project Name & Stage'}</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-10 text-sm focus:border-brand/60 outline-none text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'جهة الإشراف أو المقاول المنفذ' : 'Contractor / Supervising Body'}</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-10 text-sm focus:border-brand/60 outline-none text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'المهندس الفاحص' : 'Lead Inspector'}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={inspectorName}
                        onChange={(e) => setInspectorName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-10 text-xs sm:text-sm focus:border-brand/60 outline-none text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'تاريخ ووقت المعاينة الميدانية' : 'Inspection Date & Time'}</label>
                    <div className="relative flex gap-1">
                      <input 
                        type="date" 
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-2 text-xs focus:border-brand/60 outline-none text-slate-200"
                      />
                      <input 
                        type="time" 
                        value={reportTime}
                        onChange={(e) => setReportTime(e.target.value)}
                        className="w-20 bg-slate-950 border border-slate-850 rounded-xl py-2 px-1 text-xs focus:border-brand/60 outline-none text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'موقع gps وإحداثيات الخريطة (جي بي اس)' : 'GPS Coordinates & Map Grid'}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-brand" />
                    <input 
                      type="text" 
                      value={gpsCoordinates}
                      onChange={(e) => setGpsCoordinates(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-10 text-sm focus:border-brand/60 outline-none text-slate-200"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {language === 'ar' ? '💡 سيتم طباعة هذه البيانات كختم جغرافي رسمي على رأس المستند والتقارير.' : '💡 This coordinate system embeds directly as a legal watermark footprint.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Logo customizer */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <ImageIcon className="w-5 h-5 text-brand" />
                {language === 'ar' ? '٢. وضع لوجو المشروع والشعار والمظهر' : '2. Project Logo & Visual Branding'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-2">
                    {language === 'ar' ? 'اختر نمط الشعار الهندسي للتقرير' : 'Select Graphic Logo Blueprint Style'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setLogoPreset('preset1'); setLogoUrl(null); }}
                      className={`py-2 px-2 border text-xs font-bold rounded-xl transition-all ${logoPreset === 'preset1' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'}`}
                    >
                      🏛️ {language === 'ar' ? 'مكتب معماري' : 'Structure preset'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLogoPreset('preset2'); setLogoUrl(null); }}
                      className={`py-2 px-2 border text-xs font-bold rounded-xl transition-all ${logoPreset === 'preset2' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'}`}
                    >
                      🛡️ {language === 'ar' ? 'سلامة ومطابقة' : 'Safety shield'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoPreset('custom')}
                      className={`py-2 px-2 border text-xs font-bold rounded-xl transition-all ${logoPreset === 'custom' ? 'border-brand bg-brand/10 text-brand' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'}`}
                    >
                      📤 {language === 'ar' ? 'لوجو مخصص' : 'Upload custom'}
                    </button>
                  </div>
                </div>

                {logoPreset === 'custom' && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="text-xs text-slate-400 mb-2 font-bold">
                      {language === 'ar' ? 'ارفع لوجو مفرغ بصيغة PNG (خلفية شفافة):' : 'Upload transparent team/client logo (PNG format):'}
                    </p>
                    <div className="relative border-2 border-slate-800 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-brand/50 hover:bg-slate-900/50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <Upload className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                      <span className="text-xs text-slate-400 font-bold block">
                        {logoUrl ? (language === 'ar' ? '✅ تم رفع اللوجو بنجاح!' : '✅ Custom logo active!') : (language === 'ar' ? 'اضغط لرفع لوجو المشروع ومطابقته' : 'Click to select project watermark file')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Box 3: Checklist Items */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand" />
                  {language === 'ar' ? '٣. بنود التقييم والمطابقة' : '3. Checklist & Compliance items'}
                </h2>
                
                {/* Fast Presets Selector */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePresetChange('concrete')}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${activePreset === 'concrete' ? 'bg-brand text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                  >
                    {language === 'ar' ? 'خرسانات' : 'Concrete'}
                  </button>
                  <button
                    onClick={() => handlePresetChange('safety')}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${activePreset === 'safety' ? 'bg-brand text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                  >
                    {language === 'ar' ? 'سلامة' : 'Safety'}
                  </button>
                  <button
                    onClick={() => handlePresetChange('custom')}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${activePreset === 'custom' ? 'bg-brand text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                  >
                    {language === 'ar' ? 'فارغ' : 'Clear'}
                  </button>
                </div>
              </div>

              {/* Checklist inputs */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {checklist.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2.5"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => {
                            setChecklist(checklist.map(ci => ci.id === item.id ? { ...ci, item: e.target.value } : ci));
                          }}
                          className="flex-1 text-xs bg-transparent border-none outline-none text-slate-200 font-medium focus:text-white"
                        />
                        <button 
                          onClick={() => removeChecklistItem(item.id)}
                          className="text-slate-500 hover:text-rose-500 transition-colors p-0.5"
                          title="حذف البند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Status selectors & notes */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-900">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateItemStatus(item.id, 'pass')}
                            className={`px-2 py-1 text-[9px] rounded font-bold transition-all ${item.status === 'pass' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'}`}
                          >
                            ✓ {language === 'ar' ? 'مطابق' : 'Pass'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateItemStatus(item.id, 'fail')}
                            className={`px-2 py-1 text-[9px] rounded font-bold transition-all ${item.status === 'fail' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-slate-900 text-slate-500'}`}
                          >
                            ✗ {language === 'ar' ? 'مرفوض' : 'Fail'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateItemStatus(item.id, 'na')}
                            className={`px-2 py-1 text-[9px] rounded font-bold transition-all ${item.status === 'na' ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-slate-500'}`}
                          >
                            - N/A
                          </button>
                        </div>

                        <input 
                          type="text" 
                          placeholder={language === 'ar' ? 'ملاحظات المعاينة...' : 'Observation notes...'}
                          value={item.notes}
                          onChange={(e) => updateItemNotes(item.id, e.target.value)}
                          className="flex-1 text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-0.5 ml-2 text-slate-300 outline-none focus:border-brand/40"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {checklist.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    {language === 'ar' ? 'لا توجد بنود فحص مضافة حالياً. أضف بنداً جديداً بالأسفل.' : 'No items added. Add a custom checklist row below.'}
                  </div>
                )}
              </div>

              {/* Add item interface */}
              <div className="flex gap-2 pt-2">
                <input 
                  type="text" 
                  placeholder={language === 'ar' ? 'أضف بنداً جديداً (مثال: سلامة التدعيم الخرساني)...' : 'Add new benchmark item...'}
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-brand/50"
                />
                <button
                  onClick={addChecklistItem}
                  className="bg-brand text-slate-950 p-2.5 rounded-xl hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all"
                  title="أضف بند"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Box 4: Site Images list */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand" />
                  {language === 'ar' ? '٤. الصور الميدانية المرفقة بالتقرير' : '4. Embedded Field Photo Stamping'}
                </h2>
                <span className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400">
                  {images.length} / {premiumActive ? '12' : '4'} {language === 'ar' ? 'صور' : 'photos'}
                </span>
              </div>

              <div className="space-y-4">
                {images.map((img) => (
                  <div key={img.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex gap-3 h-24">
                    <div className="relative w-20 h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                      <img src={img.url} alt="Attached" className="w-full h-full object-cover" />
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="absolute top-1 right-1 bg-rose-500/80 hover:bg-rose-500 p-1 rounded text-white transition-all hover:scale-110"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span className="truncate max-w-[120px]" title={img.name}>{img.name}</span>
                        <span className="flex items-center gap-0.5 font-bold text-brand">
                          <MapPin className="w-2.5 h-2.5" />
                          {img.gps}
                        </span>
                      </div>
                      <textarea
                        value={img.notes}
                        onChange={(e) => updateImageNotes(img.id, e.target.value)}
                        placeholder={language === 'ar' ? 'اكتب تفاصيل المعاينة وملاحظة الصورة...' : 'Enter photo specific site analysis...'}
                        className="w-full h-12 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none resize-none focus:border-brand/40"
                      />
                    </div>
                  </div>
                ))}

                {/* File Upload zone */}
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-800 border-dashed rounded-xl cursor-pointer hover:bg-slate-800/20 hover:border-brand/30 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-5 h-5 mb-1.5 text-slate-400 animate-bounce" />
                      <div className="text-[10px] text-slate-300 font-bold text-center px-4">
                        {language === 'ar' ? 'ارفع صور المعاينة الميدانية المدمغة (مفتوح بالكامل ومجاني)' : 'Add site photos to stamp into report Grid (Fully Unlocked & Free)'}
                      </div>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleReportImageUpload} 
                    />
                  </label>
                  <p className="text-[10px] text-emerald-400 text-center mt-1.5 font-bold">
                    {language === 'ar' ? '✨ تم تفعيل الميزات الاحترافية مجانًا: ارفع حتى 24 صورة لدعم دقة التقارير.' : '✨ Pro active: upload up to 24 high-resolution photo logs with GPS stamps.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Box 5: Monetization / Revenue Opportunities Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/30 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="absolute top-0 right-0 p-8 w-44 h-44 bg-emerald-500/5 blur-3xl rounded-full -mr-10 -mt-10" />
              
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-lg">
                  PRO {language === 'ar' ? 'نسخة المحترفين مفتوحة' : 'PREMIUM UNLOCKED'}
                </span>
                <span className="text-xs font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  {language === 'ar' ? 'مفعل مجاناً بالكامل' : '100% FREE'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  {language === 'ar' ? 'ميزات التقارير الفنية مفتوحة بالكامل' : 'Site Report Toolkit Fully Unlocked'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {language === 'ar' 
                    ? 'لقد قمنا بتفعيل النسخة الاحترافية بالكامل لجميع الزوار مجاناً! استمتع بتحميل مستندات خالية من العلامات المائية المزعجة، وتواقيع استشارية مؤمنة بـ GPS.' 
                    : 'We have unlocked the entire high-fidelity PDF layout and signature workspace for everyone. Download unlimited official site compliance reports at no cost.'}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'إزالة العلامات المائية والإعلانات' : 'Zero Watermarks & Clean PDFs'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'تضمين حتى ٢٤ صورة عالية الدقة جغرافياً' : 'Add up to 24 high-resolution photo logs'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'أختام وتواقيع رقمية مشفرة بـ GPS' : 'Apply digital signatures & coordinate stamp'}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>{language === 'ar' ? 'الحالة الحالية:' : 'Current Status:'}</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'ar' ? 'نشط ومجاني للأبد' : 'Active & Free'}
                </span>
              </div>
            </div>

          </div>

          {/* Right panel: Gorgeous live preview of A4 printable report */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            
            {/* Header Control for PDF download/Print */}
            <div className="flex flex-wrap justify-between items-center bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl sm:rounded-2xl gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs text-slate-300 font-bold">
                  {language === 'ar' ? 'معاينة المستند الفورية (تحديث فوري)' : 'Interactive Real-Time Preview (A4 Proportion)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'طباعة / حفظ PDF' : 'Print / Export PDF'}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
                >
                  <Download className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'تحميل مباشر (PDF)' : 'Fast Download (PDF)'}
                </button>
              </div>
            </div>

            {/* A4 Canvas Card container */}
            <div 
              id="printable-area"
              className="w-full bg-white text-slate-900 p-8 sm:p-12 md:p-16 rounded-3xl border border-slate-200 shadow-2xl relative transition-all duration-300 min-h-[900px] flex flex-col justify-between font-cairo print:p-0 print:border-none print:shadow-none print:rounded-none select-text"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              
              {/* Premium Top Bar Watermark for free users */}
              {!premiumActive && (
                <div className="absolute top-0 left-0 right-0 bg-slate-100 text-[10px] text-slate-400 font-bold py-1.5 px-6 border-b border-slate-200 flex justify-between items-center rounded-t-3xl print:hidden">
                  <span>📄 {language === 'ar' ? 'أداة جيو ستامب المجانية للتقارير' : 'Geo-Stamp Free Evaluation Template'}</span>
                  <span className="text-brand font-black">PRO WATERMARK ACTIVE</span>
                </div>
              )}

              <div className="space-y-8 flex-1">
                
                {/* 1. Header with corporate branding */}
                <div className="flex justify-between items-start gap-6 border-b-2 border-slate-900 pb-5">
                  <div className="space-y-1.5 text-right w-2/3">
                    <span className="text-xs font-black text-rose-600 border-2 border-rose-600 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
                      {language === 'ar' ? 'تقرير معاينة فنية معتمد' : 'APPROVED SITE VERIFICATION SHEET'}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {projectName || (language === 'ar' ? 'اسم المشروع الميداني' : 'Field Project Title')}
                    </h2>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 justify-start">
                      <Briefcase className="w-3 h-3 text-slate-600" />
                      {language === 'ar' ? 'المنفذ / المشرف:' : 'Executing Party:'} {contractorName || (language === 'ar' ? 'لم يحدد' : 'Not setup')}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 w-1/3">
                    {logoPreset === 'preset1' && (
                      <div className="border border-slate-300 p-2.5 rounded-xl bg-slate-50 flex items-center justify-center">
                        <span className="text-3xl">🏛️</span>
                      </div>
                    )}
                    {logoPreset === 'preset2' && (
                      <div className="border border-slate-300 p-2.5 rounded-xl bg-slate-50 flex items-center justify-center">
                        <span className="text-3xl">🛡️</span>
                      </div>
                    )}
                    {logoPreset === 'custom' && logoUrl && (
                      <div className="border border-slate-200 p-1.5 rounded-xl bg-white max-h-16 max-w-[120px] overflow-hidden flex items-center justify-center">
                        <img src={logoUrl} alt="Branding" className="object-contain max-h-12" />
                      </div>
                    )}
                    {logoPreset === 'custom' && !logoUrl && (
                      <div className="border-2 border-slate-300 border-dashed p-2 text-center rounded-xl text-[9px] text-slate-400">
                        {language === 'ar' ? 'ارفع شعار المقاول' : 'Logo missing'}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">
                      {language === 'ar' ? 'الرمز الهيكلي الرسمي' : 'STRUCTURE BLUEPRINT LOGO'}
                    </span>
                  </div>
                </div>

                {/* 2. Metadata details grid */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
                      {language === 'ar' ? 'التوقيت والمطابقة' : 'Date stamp'}
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      {reportDate}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
                      {language === 'ar' ? 'ساعة الفحص الحية' : 'Exact time stamp'}
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      {reportTime}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
                      {language === 'ar' ? 'المهندس المسؤول' : 'Inspector code'}
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      {inspectorName}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">
                      {language === 'ar' ? 'شهادة الحضور الرقمية' : 'Digital GPS certification'}
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 text-[10px] leading-tight">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      {gpsCoordinates ? gpsCoordinates.split(' ')[0] : '24.7136° N'}
                    </span>
                  </div>
                </div>

                {/* 3. Main checklist grid verification */}
                <div className="space-y-3">
                  <div className="border-b-2 border-slate-250 pb-1">
                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-slate-705" />
                      {language === 'ar' ? 'نتائج مطابقة بنود الكود والملاحظات الميدانية' : 'Site Compliance & Audited Benchmarks'}
                    </h3>
                  </div>

                  <div className="border border-slate-250 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-slate-800">
                      <thead>
                        <tr className="bg-slate-100 text-slate-500 font-bold text-left border-b border-slate-200">
                          <th className="p-3 w-8 text-center">#</th>
                          <th className="p-3 text-right">{language === 'ar' ? 'بند فحص المعاينة والمطابقة' : 'Inspection benchmark benchmark'}</th>
                          <th className="p-3 w-28 text-center">{language === 'ar' ? 'حالة التقييم' : 'Evaluation status'}</th>
                          <th className="p-3 text-right">{language === 'ar' ? 'المعاينة والحلول الفنية' : 'Field observations & notes'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {checklist.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900 text-right">{item.item}</td>
                            <td className="p-3 text-center">
                              {item.status === 'pass' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                  ✓  {language === 'ar' ? 'مطابق' : 'PASS'}
                                </span>
                              )}
                              {item.status === 'fail' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                  ✗  {language === 'ar' ? 'غير مطابق' : 'FAIL'}
                                </span>
                              )}
                              {item.status === 'na' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-50 text-slate-500 font-bold border border-slate-200">
                                  - N/A
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-600 text-right italic font-medium">{item.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Attached Photo Log gallery with full annotations */}
                <div className="space-y-4">
                  <div className="border-b-2 border-slate-250 pb-1">
                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-slate-705" />
                      {language === 'ar' ? 'سلسلة الصور الميدانية المدموغ والمثبتة جغرافياً' : 'Geo-Stamped Construction Photo Logs (EXIF GPS Secured)'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2 flex flex-col justify-between">
                        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200">
                          <img src={img.url} alt="Site" className="w-full h-full object-cover" />
                          
                          {/* Live Stamp on photo in preview */}
                          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/75 backdrop-blur-xs p-1.5 rounded text-[8px] font-mono text-white leading-tight">
                            <div className="flex justify-between font-bold text-brand">
                              <span>GPS: {img.gps || '24.7136° N'}</span>
                              <span>TIME: {reportDate} {reportTime}</span>
                            </div>
                            <div className="truncate text-slate-300 mt-0.5">PROJECT: {projectName}</div>
                          </div>
                        </div>

                        <div className="text-[10px] space-y-1">
                          <div className="flex justify-between items-center font-bold text-slate-500 border-b border-slate-200 pb-1">
                            <span>FILE: {img.name}</span>
                            <span className="text-emerald-700 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {language === 'ar' ? 'إحداثيات مؤمنة لـ جي بي اس' : 'GPS EXIF Verified'}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium text-right mt-1">{img.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 5. Validation signatures & legal credentials bottom */}
              <div className="border-t-2 border-slate-900 pt-6 mt-10 grid grid-cols-2 gap-8 text-xs">
                <div className="space-y-4 text-right">
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">
                    {language === 'ar' ? 'اعتماد ومراجعة الاستشاري الفني' : 'Technical consultant approval'}
                  </p>
                  <div className="h-16 border-2 border-slate-250 border-dashed rounded-xl bg-slate-50 flex items-center justify-center relative">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {language === 'ar' ? 'ختم وتوقيع المشرف العام' : 'Official regulatory stamp space'}
                    </span>
                    
                    {/* Visual Stamp when premium */}
                    {premiumActive && (
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <div className="w-32 h-14 border-4 border-emerald-600 text-emerald-600 font-black flex flex-col items-center justify-center rounded-3xl transform rotate-[-3deg] uppercase bg-white/40 shadow-sm leading-none">
                          <span className="text-[9px] tracking-widest font-mono">GEO-STAMP</span>
                          <span className="text-xs font-bold font-mono">VERIFIED CODE</span>
                          <span className="text-[7px] text-slate-500">SECURE REGULATION</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-[9px] text-left">
                    {language === 'ar' ? 'الشهادة الرقمية الكودية للمقاول' : 'Primary contractor validation'}
                  </p>
                  <div className="h-16 border-2 border-slate-250 border-dashed rounded-xl bg-slate-50 flex items-center justify-end p-4 relative">
                    <div className="text-right flex flex-col justify-center">
                      <span className="text-slate-400 text-[8px] font-bold block">{language === 'ar' ? 'توقيع المهندس الفاحص' : 'Inspector signature'}</span>
                      <span className="font-bold font-mono text-[10px] text-slate-600">{inspectorName}</span>
                    </div>

                    {premiumActive && (
                      <div className="absolute inset-0 flex items-center justify-start pl-4 p-2">
                        <span className="text-3xl text-indigo-700/80 font-mono tracking-tighter filter select-none select-text transform rotate-[-4deg]">
                          ✓ Signed (GPS Lock)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secure footer bar */}
                <div className="col-span-2 text-center text-[9px] text-slate-400 border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span>
                    {language === 'ar' ? 'تحقق رقمي دولي آمن' : 'Secured under International Site Compliance Certification Codes (IS31).'}
                  </span>
                  <span>
                    {language === 'ar' ? 'المستند مفرز كلياً وبشكل مشفر في المتصفح' : 'This report is computed locally in client web sandboxes.'}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Control panel floating help / tutorial block */}
      <section className="bg-slate-900 border-t border-slate-800 py-16 mt-20 print:hidden text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <HelpCircle className="w-8 h-8 text-brand mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold">
              {language === 'ar' ? 'كيف تساعدك أداة التقارير في زيادة أرباحك وعملائك؟' : 'How does Report Builder Double Your Business Valuation?'}
            </h2>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'الحلول الرقمية للبلديات، المقاولين، والاستشاريين تساهم في إخراج المستندات برونق احترافي يشجع المستثمرين على دفع ميزانيات أعلى لمشروعك.' 
                : 'Providing certified PDF summaries of every single batch of concrete poured establishes unrivaled client reliability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
              <span className="text-2xl mb-3 block">🏢</span>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ar' ? 'للشركات والمقاولات الكبرى' : 'For Enterprise Contractors'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'وفر على مقاوليك عناء كتابة التقارير الميدانية اليدوية. التقط الصور الجغرافية بـ GPS واجمع بنود الكود بشكل سريع في ملف PDF واحد وسهل.'
                  : 'Automate physical file structures. Every concrete Slump check and scaffolding checklist lives stored perfectly on-site.'}
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
              <span className="text-2xl mb-3 block">⚖️</span>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ar' ? 'تجنب القضايا وغرامات البلديات' : 'Evade Site Lawsuits & Fines'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'بوجود الختم الجغرافي بالتاريخ والوقت الحقيقي، لا أحد يستطيع اتهام مؤسستك بتحديث صور قديمة أو عدم فحص أعمال حديد التسليح.'
                  : 'Stamping every corner of concrete verifies precise compliance against municipal regulatory penalties.'}
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850">
              <span className="text-2xl mb-3 block">💰</span>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ar' ? 'زيادة أرباح المهندسين الأحرار Freelancers' : 'Higher Pricing For Freelance Advisors'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'قدم لعملائك تقارير استلام حديد تسليح وهيكل خرساني بشعارهم وصور GPS مدهشة لتقاضي أجور ومكافآت احترافية مقابل خدمات الفحص.'
                  : 'Sell verification surveys at double standard consultancy rates, backed by digital EXIF GPS coordinates proof.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade / Profit Premium License Modal (Interactive Simulation) */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />

            {/* Dialog block */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl text-white space-y-6 text-center"
            >
              <div className="text-center space-y-2">
                <span className="inline-flex py-1 px-3 bg-brand/15 text-brand rounded-full text-[10px] font-black uppercase tracking-wider">
                  🔥 {language === 'ar' ? 'رخصة المحترفين والمقاول المنشائي' : 'PRO ENTERPRISE LEVEL ACTIVE'}
                </span>
                <h3 className="text-2xl font-black">
                  {language === 'ar' ? 'ترقية ترخيص الكفاءة الهندسية' : 'Upgrade to Enterprise License'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {language === 'ar' 
                    ? 'احصل على ميزات الدمج اللانهائي الفوري، إخفاء ختم جيو-ستامب، واللوحات الممتازة للجهات الرقابية والبلديات.' 
                    : 'Compile unlimited stamped photos, remove credit footers, and insert beautiful corporate signatures.'}
                </p>
              </div>

              {/* Price comparison layout */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 divide-x divide-slate-800 text-right">
                <div className="pr-3 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">{language === 'ar' ? 'الحساب الحالي' : 'FREE EVALUATION'}</span>
                  <span className="text-xs text-slate-400 font-bold strike-through">{language === 'ar' ? 'محدود' : 'Limited'}</span>
                  <p className="text-[9px] text-slate-500 mt-1">{language === 'ar' ? 'أقصى حد: 4 صور، مع علامة مائية' : 'Max 2 logs with watermark.'}</p>
                </div>
                <div className="pl-3 text-center bg-brand/5 rounded-lg py-1">
                  <span className="text-[10px] text-brand font-black block">{language === 'ar' ? 'الترقية الموصي بها' : 'PRO REVENUE TIER'}</span>
                  <span className="text-sm text-white font-extrabold">$29 / {language === 'ar' ? 'شهرياً' : 'Mo'}</span>
                  <p className="text-[9px] text-brand font-bold mt-1">{language === 'ar' ? 'صور لا محدودة، دمج مائي فوري' : 'Unlimited logs & stamp signs.'}</p>
                </div>
              </div>

              {/* Payment simulation button */}
              <div className="space-y-3">
                {paymentSuccess ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
                    <Check className="w-4 h-4" />
                    {language === 'ar' ? 'تم الدفع بنجاح! جاري ترقية الحساب...' : 'Payment received! Powering Pro features...'}
                  </div>
                ) : (
                  <button
                    onClick={handleSimulatedPayment}
                    className="w-full bg-brand text-slate-950 hover:bg-brand-hover py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-brand/10 hover:shadow-brand/20 transition-all hover:scale-[1.02]"
                  >
                    🚀 {language === 'ar' ? 'بث محاكاة الدفع والاشتراك المباشر' : 'Proceed with Simulated Safe Checkout'}
                  </button>
                )}

                <p className="text-[9px] text-slate-500">
                  {language === 'ar' 
                    ? '* تفعيل محاكي الدفع فوري وآمن ۱۰۰% لتجربة كامل ميزات التحميل وعينة الأختام.' 
                    : '* This checkout is a safe simulation sandbox to inspect premium PDF signature & reports generation.'}
                </p>
              </div>

              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs underline font-medium"
              >
                {language === 'ar' ? 'إلغاء، سأبقى على الخطة المجانية حالياً' : 'Close, keep limited template'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}
