import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calculator, 
  CheckSquare, 
  Layers, 
  Settings, 
  Printer, 
  HelpCircle, 
  Activity, 
  ChevronRight, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  TrendingUp,
  Sliders,
  FileText,
  DollarSign
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'pass' | 'fail';
  notes: string;
}

export default function MaterialsCalculator() {
  const { language } = useLanguage();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'calculator' | 'checklist'>('calculator');

  // --- Calculator States ---
  const [calcType, setCalcType] = useState<'slab' | 'column' | 'foundation' | 'brick' | 'plaster'>('slab');
  
  // Slab & Foundation inputs
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<number>(0.20); // in meters

  // Columns Inputs
  const [numColumns, setNumColumns] = useState<number>(12);
  const [colWidth, setColWidth] = useState<number>(0.3); // meters
  const [colDepth, setColDepth] = useState<number>(0.6); // meters
  const [colHeight, setColHeight] = useState<number>(3.2); // meters

  // Brick Wall Inputs
  const [wallArea, setWallArea] = useState<number>(150); // m²
  const [brickLength, setBrickLength] = useState<number>(20); // cm
  const [brickWidth, setBrickWidth] = useState<number>(10); // cm
  const [brickHeight, setBrickHeight] = useState<number>(6); // cm

  // Plaster inputs
  const [plasterArea, setPlasterArea] = useState<number>(200); // m²
  const [plasterThickness, setPlasterThickness] = useState<number>(2); // cm

  // Mix ratios & engineers custom variables (Config panel)
  const [cementRatio, setCementRatio] = useState<number>(350); // kg/m³
  const [steelRatio, setSteelRatio] = useState<number>(90); // kg/m³ for slabs
  const [safetyFactor, setSafetyFactor] = useState<number>(10); // % wastage

  // Unit default prices (SAR / Egyptian Pounds / USD equivalent)
  const [cementPrice, setCementPrice] = useState<number>(35); // per 50kg bag
  const [steelPrice, setSteelPrice] = useState<number>(2800); // per ton
  const [sandPrice, setSandPrice] = useState<number>(85); // per m³
  const [gravelPrice, setGravelPrice] = useState<number>(120); // per m³
  const [brickPrice, setBrickPrice] = useState<number>(1.2); // per brick
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // --- Checklist States ---
  const initialChecklist: ChecklistItem[] = [
    // Excavation & Foundations
    { id: '1', category: 'foundations', item: language === 'ar' ? 'التحقق من منسوب الحفر ومطابقة زوايا المبنى' : 'Verify excavation depth levels & building boundaries alignment', status: 'pass', notes: language === 'ar' ? 'تمت المطابقة والمراجعة مع الإحداثيات' : 'Verified and adjusted to GPS landmarks' },
    { id: '2', category: 'foundations', item: language === 'ar' ? 'فحص جودة رش مياه الرش دك التربة واختبار الدمك' : 'Inspect soil compaction and testing status', status: 'pass', notes: language === 'ar' ? 'تقرير اختبار الدمك بنسبة ٩٧٪ مقبول' : 'Compaction test results at 97% accepted' },
    { id: '3', category: 'foundations', item: language === 'ar' ? 'استلام طبقة النظافة الخرسانية وسماكتها' : 'Receive lean/blinding concrete layer placement & thickness', status: 'pass', notes: language === 'ar' ? 'سماكة ١٠ سم مفرودة بنتظام' : 'Perfect 10cm alignment placed' },
    { id: '4', category: 'foundations', item: language === 'ar' ? 'فحص عزل الأساسات وعزل القواعد بالبيتومين' : 'Check foundation waterproofing & bitumen paint application', status: 'pending', notes: '' },
    
    // Structural Iron & Formwork
    { id: '5', category: 'structural', item: language === 'ar' ? 'استلام أبعاد وارتفاعات ومحاور الأعمدة الخرسانية' : 'Inspect dimensions, elevations and axis of concrete columns', status: 'pending', notes: '' },
    { id: '6', category: 'structural', item: language === 'ar' ? 'استلام حديد التسليح (أقطار، كائنات، وتربيط)' : 'Receive reinforcing bars (diamonds, tie-wires & spacers)', status: 'pass', notes: language === 'ar' ? 'تم فحص البسكويت لضمان التغطية' : 'Spacers installed properly to ensure coverage' },
    { id: '7', category: 'structural', item: language === 'ar' ? 'التحقق من وجود حوائط وأحزمة التدعيم والجاكات' : 'Check existence of bracing, metal jacks, and wooden frames', status: 'fail', notes: language === 'ar' ? 'تحتاج الواجهة الغربية لتدعيم إضافي قبل الصب' : 'Western side requires additional support jacks before casting' },
    
    // Pouring Concrete
    { id: '8', category: 'pouring', item: language === 'ar' ? 'التأكد من توفير الهزازات الميكانيكية للخرسانة' : 'Ensure availability of mechanical concrete vibrators on site', status: 'pass', notes: language === 'ar' ? 'تم توفير جهازين للهز مع السائق' : 'Two functional vibrators on-site with backup' },
    { id: '9', category: 'pouring', item: language === 'ar' ? 'فحص شهادات وصول سيارات الخرسانة وفحص الهبوط (Slump)' : 'Verify concrete truck delivery receipts and Slump measurements', status: 'pass', notes: language === 'ar' ? 'الهبوط بمتوسط ١٢ سم مطابق للكود' : '12cm average slump complies with standards' },
    { id: '10', category: 'pouring', item: language === 'ar' ? 'أخذ المكعبات القياسية للاختبار (٦ مكعبات لكل عنصر)' : 'Collect concrete sample test cubes (6 cubes per structure)', status: 'pending', notes: '' },

    // Brickwork & Finishing
    { id: '11', category: 'masonry', item: language === 'ar' ? 'استلام مدماك القد الأول ومطابقة الزوايا والتربيط' : 'Inspect layout course of masonry (first row brick bounds)', status: 'pending', notes: '' },
    { id: '12', category: 'masonry', item: language === 'ar' ? 'استلام استقامة الجدران رأسياً وأفقياً الشاقول' : 'Check horizontal & vertical wall alignment with plumb bob', status: 'pending', notes: '' },
    { id: '13', category: 'masonry', item: language === 'ar' ? 'مراجعة تثبيت الشبك المعدني عند تقاطعات الخرسانة والطوب' : 'Review wire mesh reinforcement at concrete-to-brick joints', status: 'pending', notes: '' }
  ];

  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newCheckText, setNewCheckText] = useState('');
  const [newCheckCat, setNewCheckCat] = useState('foundations');

  // --- Calculations Logic ---
  const calculatedResults = useMemo(() => {
    let volume = 0; // m³
    let bricksCount = 0;
    const cementRatioAdj = cementRatio / 50; // bags per m³
    
    let cementNeeded = 0; // bags
    let sandNeeded = 0; // m³
    let gravelNeeded = 0; // m³
    let steelNeeded = 0; // tons
    let waterNeeded = 0; // liters

    const factor = 1 + (safetyFactor / 100);

    if (calcType === 'slab' || calcType === 'foundation') {
      volume = length * width * thickness;
      cementNeeded = volume * cementRatioAdj * factor;
      sandNeeded = volume * 0.4 * factor;
      gravelNeeded = volume * 0.8 * factor;
      // Steel calculation based on steelRatio (kg/m³)
      steelNeeded = ((volume * steelRatio) / 1000) * factor;
      waterNeeded = volume * 175 * factor; // roughly 175 liters per m³
    } else if (calcType === 'column') {
      volume = numColumns * (colWidth * colDepth * colHeight);
      cementNeeded = volume * cementRatioAdj * factor;
      sandNeeded = volume * 0.41 * factor;
      gravelNeeded = volume * 0.82 * factor;
      // Column steel requirement is typically higher (e.g., 120 kg/m³)
      const colSteelRatio = 120;
      steelNeeded = ((volume * colSteelRatio) / 1000) * factor;
      waterNeeded = volume * 180 * factor;
    } else if (calcType === 'brick') {
      // Calculate single brick volume with mortar (approx adding 1cm to all sides)
      const bL = (brickLength + 1) / 100; // to meters
      const bW = (brickWidth + 1) / 100;
      const bH = (brickHeight + 1) / 100;
      const singleBrickSurfaceAr = bL * bH; // surface area on wall face

      // wall thickness factor based on brick width
      bricksCount = Math.ceil((wallArea / singleBrickSurfaceAr) * factor);
      
      // Mortar volume calculation for the bricks
      // average wall volume of bricks alone vs total wall volume
      const totalWallVol = wallArea * (brickWidth / 100);
      const pureBricksVol = bricksCount * ((brickLength / 100) * (brickWidth / 100) * (brickHeight / 100));
      const mortarVol = Math.max(0, (totalWallVol - pureBricksVol) * 1.1);

      // Mortar materials (usually 1:3 ratio, e.g. 400kg cement per m³ of sand)
      cementNeeded = mortarVol * (400 / 50) * factor;
      sandNeeded = mortarVol * 1.0 * factor;
      waterNeeded = mortarVol * 210 * factor;
    } else if (calcType === 'plaster') {
      const plasterThickM = plasterThickness / 100; // cm to meters
      volume = plasterArea * plasterThickM;
      
      // Plaster mix (normally 1:3 or 1:4 mix - ~450kg cement per m³ sand)
      cementNeeded = volume * (450 / 50) * factor;
      sandNeeded = volume * 1.05 * factor;
      waterNeeded = volume * 220 * factor;
    }

    // Cost Breakdown
    const costCement = cementNeeded * cementPrice;
    const costSteel = steelNeeded * steelPrice;
    const costSand = sandNeeded * sandPrice;
    const costGravel = gravelNeeded * gravelPrice;
    const costBricks = bricksCount * brickPrice;
    const totalCost = costCement + costSteel + costSand + costGravel + costBricks;

    return {
      volume: parseFloat(volume.toFixed(2)),
      cementBags: Math.ceil(cementNeeded),
      sandM3: parseFloat(sandNeeded.toFixed(2)),
      gravelM3: parseFloat(gravelNeeded.toFixed(2)),
      steelTons: parseFloat(steelNeeded.toFixed(3)),
      bricksCount: bricksCount,
      waterLiters: Math.ceil(waterNeeded),
      costBreakdown: {
        cement: Math.round(costCement),
        steel: Math.round(costSteel),
        sand: Math.round(costSand),
        gravel: Math.round(costGravel),
        bricks: Math.round(costBricks),
        total: Math.round(totalCost)
      }
    };
  }, [
    calcType, length, width, thickness, numColumns, colWidth, colDepth, colHeight,
    wallArea, brickLength, brickWidth, brickHeight, plasterArea, plasterThickness,
    cementRatio, steelRatio, safetyFactor, cementPrice, steelPrice, sandPrice, gravelPrice, brickPrice
  ]);

  // --- Checklist Calculations ---
  const stats = useMemo(() => {
    const total = checklist.length;
    const passed = checklist.filter(i => i.status === 'pass').length;
    const failed = checklist.filter(i => i.status === 'fail').length;
    const pending = checklist.filter(i => i.status === 'pending').length;
    const rate = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, passed, failed, pending, rate };
  }, [checklist]);

  // Update Item Status
  const toggleItemStatus = (id: string, newStatus: 'pending' | 'pass' | 'fail') => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Add Custom Check
  const addCustomCheck = () => {
    if (!newCheckText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      category: newCheckCat,
      item: newCheckText,
      status: 'pending',
      notes: ''
    };
    setChecklist(prev => [...prev, newItem]);
    setNewCheckText('');
  };

  // Delete Item
  const deleteCheckItem = (id: string) => {
    setChecklist(prev => prev.filter(i => i.id !== id));
  };

  // Update observation text
  const updateObsText = (id: string, text: string) => {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, notes: text } : i));
  };

  // Filter criteria
  const filteredChecklist = useMemo(() => {
    if (filterCategory === 'all') return checklist;
    return checklist.filter(i => i.category === filterCategory);
  }, [checklist, filterCategory]);

  return (
    <main className="min-h-screen bg-slate-950 font-sans antialiased text-white pb-20 pt-28 print:bg-white print:text-black print:p-0">
      <SEO 
        title={language === 'ar' ? 'حاسبة كميات البناء وقائمة تفقد الجودة الهندسية' : 'Smart Construction Calculator & QA checklist App'}
        description={language === 'ar' ? 'أداة هندسية تفاعلية مجانية لحساب تسعير وكميات الإسمنت والحديد والخرسانة والطوب مع بنود فحص جودة استلام الأعمال الإنشائية.' : 'Free interactive quantities estimation tool for building concrete, steel, plastering & bricks with on-site QA inspection checklists.'}
        keywords={language === 'ar' ? 'حاسبة كميات الخرسانة, تسعير مواد البناء, حساب طن الحديد, بنود استلام المهندس, كود البناء السعودي, حساب الإسمنت والرمل والزلط' : 'concrete volume calculator, masonry estimator, construction materials pricing, structural QA checklists, audit log sheets'}
        url="/tools/materials-calculator"
      />

      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Banner with modern tech elements */}
        <div className="text-center mb-10 print:hidden">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand/10 border border-brand/20 text-brand rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ar' ? 'أدوات تخطيط المواقع والأعمال الميدانية لعام ٢٠٢٦' : 'Site Planning & Field Operability Suite 2026'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {language === 'ar' ? 'حاسبة كميات مواد البناء وقائمة تفقد الجودة' : 'Site Materials Estimator & Construction Quality Auditor'}
          </h1>
          <p className="text-slate-400 mt-2 text-base md:text-lg max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'احسب كفاءة الموارد ومكعبات الخرسانة وحديد التسليح بدقة تامة مع قائمة مراقبة استلام بنود الموقع الميدانية المطابقة للكود.' 
              : 'Estimate raw materials demand & inspect active progress grids in real time using automated equations and engineering benchmarks.'}
          </p>

          {/* Quick tab switchers */}
          <div className="flex flex-col sm:flex-row justify-center mt-8 gap-3 max-w-md sm:max-w-none mx-auto w-full px-2">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border w-full sm:w-auto min-h-[48px] ${activeTab === 'calculator' ? 'bg-brand text-slate-950 border-brand shadow-[0_4px_20px_rgba(198,255,0,0.15)]' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'}`}
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{language === 'ar' ? 'حاسبة كميات البناء الذكية' : 'Quantities Estimator'}</span>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border w-full sm:w-auto min-h-[48px] ${activeTab === 'checklist' ? 'bg-brand text-slate-950 border-brand shadow-[0_4px_20px_rgba(198,255,0,0.15)]' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'}`}
            >
              <CheckSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{language === 'ar' ? 'قائمة فحص استلام البنود' : 'QA Quality Checklists'}</span>
            </button>
          </div>
        </div>

        {/* Outer card shell with high fidelity styling */}
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' ? (
            <motion.div 
              key="calc-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form panel controls */}
              <div className="lg:col-span-5 space-y-6 print:hidden">
                
                {/* Element style selector */}
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Layers className="w-4 h-4 text-brand" />
                    {language === 'ar' ? '١. نوع الهيكل ومقاطع البناء' : '1. Structural Element Design Type'}
                  </h3>

                  <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-2 gap-2">
                    {[
                      { id: 'slab', label: language === 'ar' ? '🏠 بلاطة خرسانية / سقف' : '🏠 Concrete Slab' },
                      { id: 'column', label: language === 'ar' ? '🏛️ أعمدة خرسانية' : '🏛️ Foundation Columns' },
                      { id: 'foundation', label: language === 'ar' ? '🪵 قواعد خرسانية' : '🪵 Footings / Base' },
                      { id: 'brick', label: language === 'ar' ? '🧱 جدران طوب وبلوك' : '🧱 Brick Wall Masonry' },
                      { id: 'plaster', label: language === 'ar' ? '📌 أعمال اللياسة / محارة' : '📌 Exterior Plastering' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setCalcType(type.id as any)}
                        className={`text-right p-3 rounded-xl border text-xs font-bold transition-all ${calcType === type.id ? 'bg-brand/15 border-brand text-brand' : 'bg-slate-955 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions variables block */}
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Sliders className="w-4 h-4 text-brand" />
                    {language === 'ar' ? '٢. تحديد الأبعاد الهندسية للمبنى' : '2. Key Design Dimensions'}
                  </h3>

                  <div className="space-y-4">
                    {/* Slab & foundations dimensions info */}
                    {(calcType === 'slab' || calcType === 'foundation') && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
                            <span>{language === 'ar' ? 'الطول الإجمالي (متر)' : 'Total length (m)'}</span>
                            <span className="text-brand font-mono">{length} {language === 'ar' ? 'متر' : 'meters'}</span>
                          </div>
                          <input 
                            type="range" min="1" max="100" step="0.5" value={length}
                            onChange={(e) => setLength(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
                            <span>{language === 'ar' ? 'العرض الإجمالي (متر)' : 'Total width (m)'}</span>
                            <span className="text-brand font-mono">{width} {language === 'ar' ? 'متر' : 'meters'}</span>
                          </div>
                          <input 
                            type="range" min="1" max="100" step="0.5" value={width}
                            onChange={(e) => setWidth(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
                            <span>{language === 'ar' ? 'سماكة الصبة / الارتفاع (متر)' : 'Thickness/Depth (m)'}</span>
                            <span className="text-brand font-mono">{thickness} {language === 'ar' ? 'متر' : 'meters'} ({thickness * 100} سم)</span>
                          </div>
                          <input 
                            type="range" min="0.05" max="2.0" step="0.01" value={thickness}
                            onChange={(e) => setThickness(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
                          />
                        </div>
                      </div>
                    )}

                    {/* Columns Specific inputs */}
                    {calcType === 'column' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'عدد الأعمدة الإجمالي' : 'Total Columns Count'}</label>
                          <input 
                            type="number" value={numColumns} onChange={(e) => setNumColumns(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:border-brand outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'عرض العمود (م)' : 'Column Width (m)'}</label>
                            <input 
                              type="number" step="0.05" value={colWidth} onChange={(e) => setColWidth(parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-white focus:border-brand outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'عمق/طول العمود (م)' : 'Column Depth (m)'}</label>
                            <input 
                              type="number" step="0.05" value={colDepth} onChange={(e) => setColDepth(parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-white focus:border-brand outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'ارتفاع العمود الخرساني (م)' : 'Column Height (m)'}</label>
                          <input 
                            type="number" step="0.1" value={colHeight} onChange={(e) => setColHeight(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-white focus:border-brand outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Brick Specific inputs */}
                    {calcType === 'brick' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'مساحة الجدران الإجمالية (متر مربع)' : 'Total Wall Surface Area (m²)'}</label>
                          <input 
                            type="number" value={wallArea} onChange={(e) => setWallArea(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-white focus:border-brand outline-none"
                          />
                        </div>

                        <p className="text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'أبعاد البلوك/الطوب المستعمل (سم)' : 'Brick units dimensions (cm)'}</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-1">{language === 'ar' ? 'الطول (سم)' : 'Length (cm)'}</label>
                            <input 
                              type="number" value={brickLength} onChange={(e) => setBrickLength(parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-1">{language === 'ar' ? 'العرض (سم)' : 'Width (cm)'}</label>
                            <input 
                              type="number" value={brickWidth} onChange={(e) => setBrickWidth(parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-1">{language === 'ar' ? 'الارتفاع (سم)' : 'Height (cm)'}</label>
                            <input 
                              type="number" value={brickHeight} onChange={(e) => setBrickHeight(parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Plaster inputs */}
                    {calcType === 'plaster' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">{language === 'ar' ? 'مساحة المسطحات المطلوب لياساتها (م²)' : 'Plastering Surface Area (m²)'}</label>
                          <input 
                            type="number" value={plasterArea} onChange={(e) => setPlasterArea(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:border-brand outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
                            <span>{language === 'ar' ? 'سماكة طبقة اللياسة (سم)' : 'Plaster Layer Thickness (cm)'}</span>
                            <span className="text-brand font-mono">{plasterThickness} {language === 'ar' ? 'سم' : 'cm'}</span>
                          </div>
                          <input 
                            type="range" min="1" max="5" step="0.5" value={plasterThickness}
                            onChange={(e) => setPlasterThickness(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Optional Engineers Variables Panel (Accordion style) */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="w-full p-5 hover:bg-slate-800/40 flex justify-between items-center text-left transition-colors"
                  >
                    <span className="text-xs font-black text-slate-300 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-brand" />
                      {language === 'ar' ? '⚙️ إعدادات ومعايير الخلط والنسب الهندسية' : 'Link customized variables & rates'}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showConfig ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showConfig && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-950 border-t border-slate-900"
                      >
                        <div className="p-5 space-y-4 text-xs">
                          {/* Mixed content concrete spec */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold mb-1">{language === 'ar' ? 'محتوى الإسمنت (كجم/م³)' : 'Cement Content (kg/m³)'}</label>
                              <input 
                                type="number" value={cementRatio} onChange={(e) => setCementRatio(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:border-brand/40 outline-none text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold mb-1">{language === 'ar' ? 'نسبة حديد التسليح (كجم/م³)' : 'Steel reinforcement (kg/m³)'}</label>
                              <input 
                                type="number" value={steelRatio} onChange={(e) => setSteelRatio(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:border-brand/40 outline-none text-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800/50">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold mb-1">{language === 'ar' ? 'نسبة الهدر المضافة (%)' : 'Safety Wastage Margin (%)'}</label>
                              <input 
                                type="number" value={safetyFactor} onChange={(e) => setSafetyFactor(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:border-brand/40 outline-none text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold mb-1">{language === 'ar' ? 'سعر طن الحديد' : 'Steel per ton'}</label>
                              <input 
                                type="number" value={steelPrice} onChange={(e) => setSteelPrice(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:border-brand/40 outline-none text-white text-xs"
                              />
                            </div>
                          </div>

                          {/* Unit price overrides */}
                          <p className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider">{language === 'ar' ? 'تعديل أسعار المواد لتفصيل التكلفة' : 'Adjust active standard price indicators'}</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] text-slate-500 font-bold mb-1">{language === 'ar' ? 'كيس إسمنت' : 'Cement bag'}</label>
                              <input 
                                type="number" value={cementPrice} onChange={(e) => setCementPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-500 font-bold mb-1">{language === 'ar' ? 'المتر الرمل' : 'Sand m³'}</label>
                              <input 
                                type="number" value={sandPrice} onChange={(e) => setSandPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-500 font-bold mb-1">{language === 'ar' ? 'البلوك المفرد' : 'Single brick'}</label>
                              <input 
                                type="number" value={brickPrice} onChange={(e) => setBrickPrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Calculator Results view */}
              <div className="lg:col-span-7 space-y-6 print:w-full print:col-span-12 print:block">
                
                {/* Visual dashboard indicator cards */}
                <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between print:bg-white print:border-slate-300 print:shadow-none print:text-black">
                  <div className="absolute top-0 right-0 p-8 w-60 h-60 bg-brand/5 blur-3xl rounded-full" />
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                    <div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                        {language === 'ar' ? 'الحجم الإجمالي المقدر للصب' : 'Calculated Total Volume'}
                      </span>
                      <h4 className="text-2xl md:text-3.5xl font-black text-brand flex items-baseline gap-1 mt-1 font-mono">
                        {calculatedResults.volume} <span className="text-white text-xs font-bold">م³ (متر مكعب)</span>
                      </h4>
                    </div>

                    <div className="p-3 bg-brand/10 border border-brand/20 text-brand rounded-2xl">
                      <TrendingUp className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  {/* Quantity breakdowns grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                    {/* Cement bags */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                      <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-tight">{language === 'ar' ? 'الإسمنت المطلوب' : 'Cement Bags'}</span>
                      <span className="text-lg md:text-xl font-black text-white font-mono print:text-black">{calculatedResults.cementBags}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{language === 'ar' ? 'كيس (زنة ٥٠كجم)' : 'Bags (50kg)'}</span>
                    </div>

                    {/* Steel Tons */}
                    {calcType !== 'brick' && calcType !== 'plaster' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-tight">{language === 'ar' ? 'حديد التسليح' : 'Reinforcing steel'}</span>
                        <span className="text-lg md:text-xl font-black text-white font-mono print:text-black">{calculatedResults.steelTons}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{language === 'ar' ? 'طن حديد' : 'Tons'}</span>
                      </div>
                    )}

                    {/* Bricks count */}
                    {calcType === 'brick' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-tight">{language === 'ar' ? 'عدد البلوك / الطوب' : 'Mortar Bricks'}</span>
                        <span className="text-lg md:text-xl font-black text-white font-mono print:text-black">{calculatedResults.bricksCount}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{language === 'ar' ? 'بلوكة بناء' : 'Units'}</span>
                      </div>
                    )}

                    {/* Sand volume */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                      <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-tight">{language === 'ar' ? 'الرمل الناعم/الخشن' : 'Plentiful Sand'}</span>
                      <span className="text-lg md:text-xl font-black text-white font-mono print:text-black">{calculatedResults.sandM3}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">م³ (متر مكعب)</span>
                    </div>

                    {/* Gravel volume (only if concrete elements) */}
                    {(calcType === 'slab' || calcType === 'column' || calcType === 'foundation') ? (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-tight">{language === 'ar' ? 'الركام / السن / الزلط' : 'Aggregate/Gravel'}</span>
                        <span className="text-lg md:text-xl font-black text-white font-mono print:text-black">{calculatedResults.gravelM3}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">م³ (متر مكعب)</span>
                      </div>
                    ) : (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 print:bg-slate-50 print:border-slate-300">
                        <span className="text-slate-500 text-[10px] font-bold block mb-1 uppercase tracking-tight">{language === 'ar' ? 'الماء التقريبي مخلوطاً' : 'Water Mix'}</span>
                        <span className="text-lg md:text-xl font-black text-white font-mono print:text-black">{calculatedResults.waterLiters}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{language === 'ar' ? 'لتر ماء خلط' : 'Liters'}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial projections bill of materials cost */}
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-850 block space-y-4 print:bg-white print:border-slate-300 print:text-black">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-900/40">
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">{language === 'ar' ? 'إجمالي تكلفة المواد الإرشادية' : 'Estimated Total Materials cost'}</span>
                        <p className="text-[10px] text-slate-500">{language === 'ar' ? '*الأسعار خاضعة للتعديل من لوحة الإعدادات' : '*Calculated on customized local rate indices'}</p>
                      </div>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {calculatedResults.costBreakdown.total.toLocaleString()} {language === 'ar' ? 'ريال / جنيه' : 'Unit value'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">{language === 'ar' ? '🧬 الإسمنت:' : '🧬 Cement:'}</span>
                        <span className="block font-bold mt-0.5 text-slate-300 font-mono">{calculatedResults.costBreakdown.cement.toLocaleString()}</span>
                      </div>
                      {calcType !== 'brick' && calcType !== 'plaster' && (
                        <div>
                          <span className="text-slate-500">{language === 'ar' ? '⚓ الحديد:' : '⚓ Steel:'}</span>
                          <span className="block font-bold mt-0.5 text-slate-300 font-mono">{calculatedResults.costBreakdown.steel.toLocaleString()}</span>
                        </div>
                      )}
                      {calcType === 'brick' && (
                        <div>
                          <span className="text-slate-500">{language === 'ar' ? '🧱 الطوب:' : '🧱 Bricks:'}</span>
                          <span className="block font-bold mt-0.5 text-slate-300 font-mono">{calculatedResults.costBreakdown.bricks.toLocaleString()}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500">{language === 'ar' ? '⏳ الرمل والبحص:' : '⏳ Aggregate/Sand:'}</span>
                        <span className="block font-bold mt-0.5 text-slate-300 font-mono">{(calculatedResults.costBreakdown.sand + calculatedResults.costBreakdown.gravel).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">{language === 'ar' ? '🧪 فاقد وهدر:' : '🧪 Safety factor:'}</span>
                        <span className="block font-bold mt-0.5 text-amber-400 font-mono">{safetyFactor}% Included</span>
                      </div>
                    </div>
                  </div>

                  {/* Print / Save button indicator */}
                  <div className="flex gap-3 mt-6 justify-end print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-705 text-xs text-slate-200 font-bold rounded-xl transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'طباعة كشف حصر الكميات' : 'Print bill of quantities'}
                    </button>
                    <a
                      href="#contact"
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-brand hover:bg-brand-hover text-slate-950 text-xs font-bold rounded-xl transition-all"
                    >
                      {language === 'ar' ? 'مشاركة التقرير مع المقاول' : 'Forward bill to supervisor'}
                    </a>
                  </div>

                </div>

                {/* Professional educational card block */}
                <div className="bg-slate-900/40 border border-slate-850/80 p-6 rounded-2xl flex gap-4 items-start print:hidden">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex-shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{language === 'ar' ? 'كيف نقوم بحساب حديد التسليح ونسب الخلط؟' : 'Structural ratios & material weight algorithms'}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {language === 'ar' 
                        ? 'تعتمد المعادلة على تقدير متوسط الكود الهندسي القياسي. يتم تخصيص ٣٥٠ كجم من الإسمنت لإنتاج الخرسانة المسلحة لكل متر مكعب. حديد التسليح يتم تقديره بنسبة ٨٠-١٠٠ كجم للمتر المكعب في الأسقف وبنسبة ١٢٠ كجم في الأعمدة كقيمة استرشادية، مع إتاحة كامل الحرية للمستخدم للتحكم بالنسب من لوحة الإعدادات المتقدمة باليسار.' 
                        : 'Calculations utilize concrete mixes standard in local construction codes. Slabs/beams estimate 80kg of rebar per m³, walls use masonry proportions, allowing comprehensive user overrides of prices & ratios within our Settings panel.'}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Inspection progress board stats & filter sidebar */}
              <div className="lg:col-span-4 space-y-6 print:hidden">
                
                {/* Handover live meter */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 block">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'ar' ? 'جاهزية استلام المشروع حالياً' : 'Structure Handover Readiness'}
                  </h3>

                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-black text-white font-mono">{stats.rate}%</span>
                    <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-bold">
                      {stats.passed} / {stats.total} {language === 'ar' ? 'بند مستلم ومطابق' : 'items passed'}
                    </span>
                  </div>

                  {/* Progress visual slider */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div className="bg-brand h-full rounded-full transition-all duration-500" style={{ width: `${stats.rate}%` }} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/80">
                      <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'مطابق' : 'Passed'}</span>
                      <span className="font-bold text-emerald-400 font-mono mt-0.5 block">{stats.passed}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/80">
                      <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'مرفوض' : 'Failed'}</span>
                      <span className="font-bold text-rose-400 font-mono mt-0.5 block">{stats.failed}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850/80">
                      <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'قيد الفحص' : 'Pending'}</span>
                      <span className="font-bold text-slate-400 font-mono mt-0.5 block">{stats.pending}</span>
                    </div>
                  </div>
                </div>

                {/* Categories filtering links */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    {language === 'ar' ? 'تصفية بنود الاستلام جغرافياً' : 'Filter by construction cycle'}
                  </span>
                  
                  {[
                    { id: 'all', label: language === 'ar' ? '📂 عرض كافة البنود' : '📂 All Checklist columns' },
                    { id: 'foundations', label: language === 'ar' ? '🪵 أعمال الحفر والأساسات' : '🪵 Excavations & Footings' },
                    { id: 'structural', label: language === 'ar' ? '🏛️ الشدات وحديد التسليح' : '🏛️ Formwork & Steel frames' },
                    { id: 'pouring', label: language === 'ar' ? '🧱 صَب وخلط وإستلام الخرسانات' : '🧱 Concrete Pouring logs' },
                    { id: 'masonry', label: language === 'ar' ? '📌 أعمال المباني والتشطيبات' : '📌 Finishes & Brickwork' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition-all flex justify-between items-center ${filterCategory === cat.id ? 'bg-brand/10 border-brand text-brand shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>{cat.label}</span>
                      <span className="bg-slate-900 text-[10px] px-1.5 py-0.5 rounded text-slate-400 font-mono">
                        {cat.id === 'all' ? checklist.length : checklist.filter(i => i.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Input block targeting new checks */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4">
                  <h4 className="text-xs font-black text-white mb-2">{language === 'ar' ? 'إضافة بند مخصص جديد للفحص' : 'Append custom audited benchmark'}</h4>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? 'مثال: فحص جينات التسليح بالقبو م٣...' : 'e.g. Verify basement moisture locks...'}
                      value={newCheckText}
                      onChange={(e) => setNewCheckText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-brand outline-none"
                    />

                    <select
                      value={newCheckCat}
                      onChange={(e) => setNewCheckCat(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                    >
                      <option value="foundations">{language === 'ar' ? 'أعمال الحفر والأساسات' : 'Excavation & Foundations'}</option>
                      <option value="structural">{language === 'ar' ? 'الشدات وحديد التسليح' : 'Structural & Steel'}</option>
                      <option value="pouring">{language === 'ar' ? 'صب الخرسانة' : 'Concrete Pouring'}</option>
                      <option value="masonry">{language === 'ar' ? 'المباني والتشطيبات' : 'Masonry & Finishes'}</option>
                    </select>

                    <button
                      onClick={addCustomCheck}
                      className="w-full py-2 bg-brand text-slate-950 font-bold rounded-xl text-xs hover:bg-brand-hover transition-colors"
                    >
                      {language === 'ar' ? 'أضف بنداً جديداً' : 'Add checklist item'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Main Checklist logs table */}
              <div className="lg:col-span-8 space-y-4 print:w-full print:col-span-12 print:block">
                
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl print:hidden">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand animate-spin" />
                    <span className="text-xs text-slate-300 font-bold">
                      {language === 'ar' ? 'بنود التقييم الميدانية ومطابقة الكود' : 'Interactive construction check ledger'}
                    </span>
                  </div>

                  <button
                    onClick={() => setChecklist(initialChecklist)}
                    className="flex items-center gap-1 bg-slate-950 hover:bg-slate-800 px-2.5 py-1 rounded text-[10px] text-slate-400 font-bold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {language === 'ar' ? 'إعادة تعيين القائمة' : 'Reset checklist'}
                  </button>
                </div>

                {/* Grid checklist list */}
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1 print:max-h-none print:overflow-visible">
                  {filteredChecklist.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-3 hover:border-slate-800 transition-colors print:bg-white print:border-slate-300 print:text-slate-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-right flex-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-950 rounded-md border border-slate-850">
                            {item.category === 'foundations' && (language === 'ar' ? 'أعمال الحفر والأساسات' : 'Foundations')}
                            {item.category === 'structural' && (language === 'ar' ? 'الشدات والحديد' : 'Formwork & reinforcement')}
                            {item.category === 'pouring' && (language === 'ar' ? 'صب الخرسانة الموقعي' : 'Casting Log')}
                            {item.category === 'masonry' && (language === 'ar' ? 'المباني والتشطيب الإنشائي' : 'Masonry & Plaster')}
                          </span>
                          <h4 className="text-sm font-bold text-white pt-1 print:text-black">{item.item}</h4>
                        </div>

                        {/* Status Button choices */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => toggleItemStatus(item.id, 'pass')}
                            className={`p-1.5 rounded-lg border flex items-center gap-1 font-bold text-[10px] transition-all ${item.status === 'pass' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 print:border-emerald-600 print:text-emerald-700 print:flex' : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300 print:hidden'}`}
                            title={language === 'ar' ? 'مطابق ومجاز' : 'Pass'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'مطابق' : 'Pass'}
                          </button>
                          
                          <button
                            onClick={() => toggleItemStatus(item.id, 'fail')}
                            className={`p-1.5 rounded-lg border flex items-center gap-1 font-bold text-[10px] transition-all ${item.status === 'fail' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 print:border-rose-600 print:text-rose-700 print:flex' : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300 print:hidden'}`}
                            title={language === 'ar' ? 'غير مطابق ويحتاج تصحيح' : 'Reject / Action Required'}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'مرفوض' : 'Fail'}
                          </button>

                          <button
                            onClick={() => toggleItemStatus(item.id, 'pending')}
                            className={`p-1.5 rounded-lg border flex items-center gap-1 font-bold text-[10px] transition-all ${item.status === 'pending' ? 'bg-slate-800 border-slate-700 text-slate-300 print:border-amber-600 print:text-amber-700 print:flex' : 'bg-slate-950 border-slate-850 text-slate-500 print:hidden'}`}
                            title={language === 'ar' ? 'قيد المراجعة المعمقة' : 'Pending inspection'}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'تأجيل' : 'Draft'}
                          </button>
                        </div>
                      </div>

                      {/* Observations note textbox & delete */}
                      <div className="flex gap-2 items-center bg-slate-950 rounded-xl p-2 border border-slate-850 print:bg-slate-50 print:border-slate-300">
                        <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0 px-2">{language === 'ar' ? 'الملاحظات الفنية:' : 'Logs:'}</span>
                        <input 
                          type="text" 
                          value={item.notes}
                          onChange={(e) => updateObsText(item.id, e.target.value)}
                          placeholder={language === 'ar' ? 'ادخل تدوين فحص المهندس هنا...' : 'Enter inspector findings details...'}
                          className="flex-1 bg-transparent text-xs text-slate-200 outline-none border-none placeholder-slate-600 focus:placeholder-slate-400 print:text-black"
                        />
                        <button
                          onClick={() => deleteCheckItem(item.id)}
                          className="text-slate-600 hover:text-rose-500 transition-colors p-1"
                          title="حذف البند"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}

                  {filteredChecklist.length === 0 && (
                    <div className="text-center py-16 bg-slate-900/20 border border-slate-850 rounded-2xl text-slate-500 text-xs">
                      {language === 'ar' ? 'لا يطابق هذا التصنيف أي بنود حالياً.' : 'No active benchmarks exist in this custom layout.'}
                    </div>
                  )}
                </div>

                {/* Print/Export sheet summary card */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950/20 p-6 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-4 print:hidden">
                  <div>
                    <h4 className="text-sm font-black text-white">{language === 'ar' ? 'طباعة تقرير الفحص ومطابقة الاستلام' : 'Print inspection compliance sheet'}</h4>
                    <p className="text-xs text-slate-400 mt-1">{language === 'ar' ? 'توليد ملف كروكي ورقي معتمد بختم وتواقيع المقاول مباشرة.' : 'Export layout formatted checklist sheets with signatures.'}</p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-5 py-3 bg-brand hover:bg-brand-hover text-slate-950 rounded-xl text-xs font-bold transition-all hover:scale-103"
                  >
                    <Printer className="w-4 h-4" />
                    {language === 'ar' ? 'طباعة التقرير الفني' : 'Print verification log'}
                  </button>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Footer component */}
      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}
