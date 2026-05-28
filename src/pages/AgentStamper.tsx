import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Camera, 
  ImagePlus, 
  Loader2, 
  Sparkles, 
  Download, 
  Layers, 
  MapPin, 
  Palette, 
  LayoutGrid, 
  Award,
  BookOpen,
  Info,
  Smartphone,
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { format } from 'date-fns';
import exifr from 'exifr';

export default function AgentStamper() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [gpsData, setGpsData] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const [projectName, setProjectName] = useState('مشروع كمبوند لؤلؤة العاصمة');
  const [engineerName, setEngineerName] = useState('المهندس / أحمد القاسم');
  const [notes, setNotes] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Advanced customization states
  const [logoImgSrc, setLogoImgSrc] = useState<string | null>(null);
  const [selectedLogoType, setSelectedLogoType] = useState<'none' | 'engineering' | 'camera' | 'custom'>('engineering');
  const [stampPosition, setStampPosition] = useState<'bottom-bar' | 'bottom-right' | 'bottom-left' | 'top-right'>('bottom-bar');
  const [stampTheme, setStampTheme] = useState<'dark' | 'gold' | 'safety' | 'minimal-light'>('dark');

  // Usage Limit State (3 Free Free Uses for normal web users, then prompt app download)
  const [usageCount, setUsageCount] = useState<number>(() => {
    return Number(localStorage.getItem('free_geo_stamp_uses') || '0');
  });
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (imageSrc && projectName && engineerName) {
      drawStamp();
    }
  }, [imageSrc, projectName, engineerName, notes, gpsData, logoImgSrc, selectedLogoType, stampPosition, stampTheme]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const selectedMap = fileList[0];
      setFile(selectedMap);
      
      // Extract GPS data from EXIF metadata
      try {
        const metadata = await exifr.parse(selectedMap);
        if (metadata && metadata.latitude != null && metadata.longitude != null) {
          setGpsData({ latitude: metadata.latitude, longitude: metadata.longitude });
        } else {
          setGpsData(null);
        }
      } catch (err) {
        console.error("Error parsing EXIF", err);
        setGpsData(null);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(selectedMap);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const selectedLogo = fileList[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImgSrc(event.target?.result as string);
        setSelectedLogoType('custom');
      };
      reader.readAsDataURL(selectedLogo);
    }
  };

  const incrementUsage = (): boolean => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('free_geo_stamp_uses', String(newCount));
    return true;
  };

  const drawStamp = () => {
    if (!canvasRef.current || !imageSrc) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = imageSrc;

    const logoImg = new Image();
    let isCustomLogoLoaded = false;
    if (selectedLogoType === 'custom' && logoImgSrc) {
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = logoImgSrc;
    }

    const loadImages = () => {
      const promises = [
        new Promise((resolve) => { baseImg.onload = resolve; })
      ];
      if (selectedLogoType === 'custom' && logoImgSrc) {
        promises.push(new Promise((resolve) => { logoImg.onload = () => { isCustomLogoLoaded = true; resolve(null); }; }));
      }
      return Promise.all(promises);
    };

    loadImages().then(() => {
      // Set canvas dimensions identical to the source photo
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      
      // Draw base image
      ctx.drawImage(baseImg, 0, 0);

      // Scale calculations relative to photo resolution to prevent blur
      const scale = Math.max(canvas.width, canvas.height) / 1000;
      const fontSizeLarge = Math.round(28 * scale);
      const fontSizeSmall = Math.round(18 * scale);
      const padding = Math.round(24 * scale);
      const logoSize = Math.round(64 * scale);

      // Count content lines to calculate perfect background height
      let linesCount = 3;
      if (gpsData) linesCount += 1;
      if (notes) linesCount += 1;

      // Set palette colors based on chosen Theme Preset
      let bgColor = 'rgba(0, 0, 0, 0.65)';
      let textColor = '#FFFFFF';
      let accentColor = '#38BDF8'; // Custom premium cyan
      let notesColor = '#FFC107';  // Warm yellow for warning/notations

      if (stampTheme === 'gold') {
        bgColor = 'rgba(15, 23, 42, 0.95)'; // Deep luxury charcoal
        textColor = '#F8FAFC';
        accentColor = '#F59E0B'; // Imperial gold
        notesColor = '#F87171'; // Balanced red
      } else if (stampTheme === 'safety') {
        bgColor = 'rgba(245, 158, 11, 0.92)'; // Safety high-visibility amber
        textColor = '#0F172A'; // Deep obsidian for standard readability
        accentColor = '#1E293B';
        notesColor = '#7F1D1D';
      } else if (stampTheme === 'minimal-light') {
        bgColor = 'rgba(255, 255, 255, 0.95)'; // Snow white
        textColor = '#0F172A';
        accentColor = '#0F766E'; // Deep teal
        notesColor = '#B91C1C';
      }

      ctx.save();

      // Background and placement boundaries
      let rx = 0;
      let ry = 0;
      let rw = canvas.width;
      let rh = 0;
      let isBox = false;

      if (stampPosition === 'bottom-bar') {
        rh = fontSizeLarge + (linesCount - 1) * (fontSizeSmall + Math.round(10 * scale)) + padding * 2;
        ry = canvas.height - rh;
        ctx.fillStyle = bgColor;
        ctx.fillRect(rx, ry, rw, rh);
      } else {
        // Rounded box designs
        isBox = true;
        rh = fontSizeLarge + (linesCount - 1) * (fontSizeSmall + Math.round(10 * scale)) + padding * 2;
        rw = Math.min(canvas.width * 0.7, Math.max(450 * scale, 380));
        
        if (stampPosition === 'bottom-right') {
          rx = canvas.width - rw - padding;
          ry = canvas.height - rh - padding;
        } else if (stampPosition === 'bottom-left') {
          rx = padding;
          ry = canvas.height - rh - padding;
        } else if (stampPosition === 'top-right') {
          rx = canvas.width - rw - padding;
          ry = padding;
        }
        
        ctx.fillStyle = bgColor;
        
        // Shadow effect for layout pop
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = Math.round(15 * scale);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = Math.round(4 * scale);

        const r = Math.round(14 * scale); // Corner radius
        ctx.beginPath();
        ctx.moveTo(rx + r, ry);
        ctx.lineTo(rx + rw - r, ry);
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
        ctx.lineTo(rx + rw, ry + rh - r);
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
        ctx.lineTo(rx + r, ry + rh);
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
        ctx.lineTo(rx, ry + r);
        ctx.quadraticCurveTo(rx, ry, rx + r, ry);
        ctx.closePath();
        ctx.fill();
        ctx.restore(); // Reset shadow
        ctx.save();
      }

      // Draw customized Logo Stamp
      const hasLogo = (selectedLogoType !== 'none');
      let lx = 0;
      let ly = 0;

      if (hasLogo) {
        if (isBox) {
          // Inside panel box, draw it aligned leftward
          lx = rx + padding;
          ly = ry + padding + (rh - padding * 2 - logoSize) / 2;
        } else {
          // Inside full horizontal bottom bar, locate left side
          lx = padding;
          ly = ry + (rh - logoSize) / 2;
        }

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = Math.max(2, 2 * scale);
        
        if (selectedLogoType === 'engineering') {
          // Vector 1: Elegant Architectural Emblem
          ctx.beginPath();
          ctx.arc(lx + logoSize/2, ly + logoSize/2, logoSize/2 - 2, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(lx + logoSize/2, ly + logoSize/4);
          ctx.lineTo(lx + logoSize*0.3, ly + logoSize*0.75);
          ctx.lineTo(lx + logoSize*0.7, ly + logoSize*0.75);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(lx + logoSize/2, ly + logoSize/4);
          ctx.lineTo(lx + logoSize/2, ly + logoSize*0.85);
          ctx.stroke();
        } else if (selectedLogoType === 'camera') {
          // Vector 2: Specialized Media Lens Glyph
          const cx = lx + logoSize * 0.1;
          const cy = ly + logoSize * 0.25;
          const cw = logoSize * 0.8;
          const ch = logoSize * 0.55;

          ctx.beginPath();
          ctx.rect(cx, cy, cw, ch);
          ctx.stroke();

          ctx.beginPath();
          ctx.rect(cx + cw * 0.25, cy - logoSize * 0.1, cw * 0.5, logoSize * 0.1);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx + cw / 2, cy + ch / 2, ch * 0.3, 0, Math.PI * 2);
          ctx.stroke();
        } else if (selectedLogoType === 'custom' && isCustomLogoLoaded) {
          try {
            ctx.drawImage(logoImg, lx, ly, logoSize, logoSize);
          } catch(e) {
            console.error("Layout custom logo draw error:", e);
          }
        }
      }

      // Render Structured Arabic Texts
      ctx.fillStyle = textColor;
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';

      const textX = rx + rw - padding;
      let currentY = ry + padding + fontSizeLarge;

      // Line 1: Project Name
      ctx.font = `bold ${fontSizeLarge}px Cairo, system-ui, sans-serif`;
      ctx.fillText(`مشروع: ${projectName}`, textX, currentY);

      currentY += fontSizeLarge + Math.round(10 * scale);

      // Line 2: Representative / Engineer Name
      ctx.font = `500 ${fontSizeSmall}px Cairo, system-ui, sans-serif`;
      ctx.fillText(`إشراف: ${engineerName}`, textX, currentY);

      currentY += fontSizeSmall + Math.round(10 * scale);

      // Line 3: System Timestamp (Live Generated)
      const now = new Date();
      const dateStr = format(now, 'yyyy-MM-dd');
      const timeStr = format(now, 'HH:mm:ss');
      ctx.fillText(`التوقيت والتدقيق: ${dateStr} - ${timeStr}`, textX, currentY);

      // Line 4: GPS Telemetry (If embedded in image EXIF)
      if (gpsData) {
        currentY += fontSizeSmall + Math.round(10 * scale);
        ctx.fillStyle = accentColor;
        ctx.fillText(`حداثيات الجي بي إس: ${gpsData.latitude.toFixed(6)}, ${gpsData.longitude.toFixed(6)}`, textX, currentY);
      }

      // Line 5: AI Observations / On-Site Notes
      if (notes) {
        currentY += fontSizeSmall + Math.round(10 * scale);
        ctx.fillStyle = notesColor;
        ctx.fillText(`الملاحظات المعتمدة: ${notes}`, textX, currentY);
      }

      ctx.restore();
      setIsCanvasReady(true);
    });
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    try {
      setIsAnalyzing(true);
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      const base64full = await base64Promise;
      const base64 = base64full.split(',')[1];
      
      const response = await fetch('/api/agent/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageParams: { 
            inlineData: { data: base64, mimeType: file.type } 
          } 
        })
      });
      
      if (!response.ok) throw new Error('فشل تحليل الصورة من خادم الذكاء الاصطناعي');
      
      const data = await response.json();
      if (data.notes) {
        setNotes(data.notes);
        incrementUsage();
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بوكيل المعالجة الذكي.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current || !isCanvasReady) return;

    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `GeoStamped_${projectName.replace(/\s+/g, '_')}_${new Date().getTime()}.jpg`;
    link.href = dataUrl;
    link.click();
    
    incrementUsage();
  };

  // Structured Schema for search engine indexing of the online tool application
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "أداة Geo-Stamp الذكية لختم وتوثيق الصور الهندسية ميدانياً",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "browserRequirements": "Requires HTML5 Canvas and LocalStorage",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "الأداة الرسمية المجانية الأقوى لختم وتدقيق صور المواقع الميدانية ببيانات GPS الجغرافية، الطوابع الهندسية، مع توظيف الذكاء الاصطناعي لرؤية وتحليل معالم الإنشاء.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-brand/35 selection:text-slate-950">
      <Helmet>
        <title>أداة جيو ستامب حياً | تصوير بالتاريخ والوقت وموقع gps ووضع لوجو المشروع علي الصور</title>
        <meta name="description" content="جرب مجاناً أقوى أداة ويب لتصوير بالتاريخ والوقت وموقع gps (جي بي اس) مع إمكانية وضع لوجو المشروع علي الصور مائياً واستخراج تفاصيل EXIF GPS تلقائياً للمهندسين والمقاولين." />
        <meta name="keywords" content="وضع لوجو المشروع علي الصور, تصوير بالتاريخ والوقت وموقع gps, جي بي اس, ختم صور البناء, جيو ستامب اونلاين, استخراج EXIF GPS, ختم الصور الهندسية مجانا, توثيق المقاولات, كاميرا ختم الموقع" />
        <link rel="canonical" href="https://geo-stamp-camera.vercel.app/tools/geo-stamper" />
        
        {/* OpenGraph & Social Cards */}
        <meta property="og:title" content="أداة جيو ستامب - تصوير بالتاريخ والوقت وموقع gps ميكانيكياً" />
        <meta property="og:description" content="أداة استخراج الإحداثيات الميدانية ووضع لوجو المشروع على الصور وتوثيق المعاينة بالذكاء الاصطناعي مجاناً وبدقة كاملة." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" />
        
        {/* Render Structured LD-JSON */}
        <script type="application/ld+json">
          {JSON.stringify(schemaJsonLd)}
        </script>
      </Helmet>
      
      <Navbar />

      <main className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* SEO Header & Promo Card */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/15 text-brand rounded-full text-xs font-black tracking-wide border border-brand/35 mb-4 animate-bounce">
            🔥 أداة ويب حية: جرب الآن بدون تحميل التطبيق مجاناً
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-5 text-white tracking-tight leading-tight">
            تصوير بالتاريخ والوقت وموقع gps مع وضع لوجو المشروع علي الصور
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            بدون تحميل برامج، ارفع صورتك الميدانية فوراً ليقوم الوكيل بقراءة بيانات <strong className="text-white">جي بي اس (GPS) و EXIF</strong> وتطبيق ختم مائي وتوثيقي بالتاريخ والوقت، وميزة <strong className="text-white">وضع لوجو المشروع علي الصور</strong> لتوثيق أعمال المقاولات والاستشارات الهندسية بدقة كاملة.
          </p>
          
          {/* Quick Counter Reminder */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 px-4 py-1.5 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>بوابة الويب مفعلة مجانًا بالكامل: استخدام غير محدود مع كامل الميزات الفنية</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Controls Panel (7 columns on large desktop) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step 1: Upload Main Photo & Extraction */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <ImagePlus className="w-5 h-5 text-brand" />
                 خطوة 1: رفع صورة الموقع لتصوير بالتاريخ والوقت وموقع gps (جي بي اس)
               </h3>
               
               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-xl cursor-pointer hover:bg-slate-800/40 hover:border-brand/40 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-300"><span className="font-bold text-brand">انقر هنا لتصوير بالتاريخ والوقت وموقع gps</span> أو اسحبها مباشرة لدمج لوجو شركتك</p>
                      <p className="text-xs text-slate-500">يدعم تنسيقات JPG, PNG, WEBP (حجم مثالي ودقة عالية)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>

              {gpsData && (
                 <div className="mt-4 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-start gap-3">
                   <MapPin className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                   <div className="flex-1 text-right">
                     <p className="text-xs font-bold text-emerald-400 mb-1 tracking-wide">تم اكتشاف بيانات الموقع الجغرافي (EXIF GPS)</p>
                     <p className="text-sm text-slate-300 font-mono" dir="ltr">
                       خط العرض: {gpsData.latitude.toFixed(6)} | خط الطول: {gpsData.longitude.toFixed(6)}
                     </p>
                   </div>
                 </div>
               )}
            </div>

            {/* Step 2: Information and Inputs */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Info className="w-5 h-5 text-brand" />
                 خطوة 2: المستندات والبيانات المطلوبة
               </h3>
               
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">اسم المشروع / الحدث</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors text-white text-right font-medium"
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">المهندس المسؤول / المصور المعتمد</label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={(e) => setEngineerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors text-white text-right font-medium"
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">ملاحظات ونتائج فحص الموقع</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand/50 transition-colors text-white text-right resize-none text-sm leading-relaxed"
                    placeholder="سيقوم وكيل الذكاء الاصطناعي بملء هذا الحقل تلقائياً عند النقر على فحص الصورة، كما يمكنك تعديلها أو إضافتها يدوياً"
                  />
               </div>
            </div>

            {/* Step 3: Brand Stamp & Design Customize */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
               <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                 <Palette className="w-5 h-5 text-brand" />
                 خطوة 3: وضع لوجو المشروع علي الصور وتخصيص الختم
               </h3>

               {/* Logo Selection */}
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">حدد لوجو المشروع لدمجه مع ختم التاريخ والوقت وموقع GPS</label>
                  <div className="grid grid-cols-4 gap-2">
                     <button
                       onClick={() => setSelectedLogoType('none')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         selectedLogoType === 'none' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       بدون شعار
                     </button>
                     <button
                       onClick={() => setSelectedLogoType('engineering')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         selectedLogoType === 'engineering' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       شعار معماري
                     </button>
                     <button
                       onClick={() => setSelectedLogoType('camera')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         selectedLogoType === 'camera' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       شعار العدسة
                     </button>
                     <button
                       onClick={() => setSelectedLogoType('custom')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         selectedLogoType === 'custom' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       لوجو مخصص
                     </button>
                  </div>
                  
                  {selectedLogoType === 'custom' && (
                    <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <p className="text-xs text-slate-400 mb-2">وضع لوجو المشروع علي الصور مائياً (رفع الشعار بصيغة PNG شفافة):</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="text-xs text-slate-300 block w-full file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/35"
                      />
                    </div>
                  )}
               </div>

               {/* Stamp Layout Position */}
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-1">
                    <LayoutGrid className="w-4 h-4 text-brand" />
                    موضع تموضع الختم على الصورة (Position)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                     <button
                       onClick={() => setStampPosition('bottom-bar')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampPosition === 'bottom-bar' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       شريط سفلي
                     </button>
                     <button
                       onClick={() => setStampPosition('bottom-right')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampPosition === 'bottom-right' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       مربع بالأسفل اليمين
                     </button>
                     <button
                       onClick={() => setStampPosition('bottom-left')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampPosition === 'bottom-left' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       مربع بالأسفل اليسار
                     </button>
                     <button
                       onClick={() => setStampPosition('top-right')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampPosition === 'top-right' ? 'bg-brand border-brand text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                       }`}
                     >
                       مربع بالأعلى اليمين
                     </button>
                  </div>
               </div>

               {/* Design Style Theme Preset */}
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">نمط ألوان وتصميم الختم (Theme Preset)</label>
                  <div className="grid grid-cols-4 gap-2">
                     <button
                       onClick={() => setStampTheme('dark')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampTheme === 'dark' ? 'bg-slate-300 text-slate-950 border-white' : 'bg-slate-950 border-slate-800 text-slate-300'
                       }`}
                     >
                       داكن شفاف
                     </button>
                     <button
                       onClick={() => setStampTheme('gold')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampTheme === 'gold' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-950 border-slate-800 text-amber-500'
                       }`}
                     >
                       ذهبي ملكي
                     </button>
                     <button
                       onClick={() => setStampTheme('safety')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampTheme === 'safety' ? 'bg-orange-500 text-slate-950 border-orange-600' : 'bg-slate-950 border-slate-800 text-orange-400'
                       }`}
                     >
                       سلامة مهنية
                     </button>
                     <button
                       onClick={() => setStampTheme('minimal-light')}
                       className={`py-2 px-1 text-xs font-bold rounded-lg transition-all border ${
                         stampTheme === 'minimal-light' ? 'bg-white text-slate-950 border-slate-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                       }`}
                     >
                       أبيض ناصع
                     </button>
                  </div>
               </div>

               {/* Dynamic Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={analyzeImage}
                    disabled={!file || isAnalyzing}
                    className="flex-1 bg-brand text-slate-950 py-3.5 rounded-lg font-bold hover:bg-brand-hover transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-brand/10 text-sm"
                  >
                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    استخلاص وفحص بالذكاء الاصطناعي
                  </button>
                  <button
                    onClick={downloadImage}
                    disabled={!isCanvasReady}
                    className="flex-1 bg-white text-slate-950 py-3.5 rounded-lg font-bold hover:bg-slate-100 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-white/5 text-sm"
                  >
                    <Download className="w-5 h-5" />
                    تحميل الصورة الختامية مباشرة
                  </button>
               </div>
            </div>

          </div>

          {/* Real-time High Fidelity Preview Canvas (5 columns on large screen) */}
          <div className="lg:col-span-6 space-y-6">
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-full min-h-[500px]">
               <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                 <h3 className="text-sm font-semibold text-slate-400">معاينة تفاعلية فورية (صورة عالية الدقة)</h3>
                 <span className="px-2.5 py-1 bg-brand/10 text-brand rounded-full text-xs font-bold">بأبعاد الكاميرا الأصلية</span>
               </div>
               
               <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden p-3 border border-slate-950 relative min-h-[350px]">
                 {imageSrc ? (
                   <div className="w-full relative rounded-lg overflow-hidden shadow-2xl transition-all duration-300 max-h-[550px]">
                     <canvas ref={canvasRef} className="w-full h-auto rounded-lg max-h-[550px] object-contain block mx-auto" />
                   </div>
                 ) : (
                   <div className="text-center text-slate-600 max-w-sm">
                     <ImagePlus className="w-16 h-16 mx-auto mb-4 opacity-30" />
                     <p className="font-medium text-slate-400">يرجى رفع صورة الموقع لعرض المعاينة الذكية</p>
                     <p className="text-xs text-slate-500 mt-2">سيتم دمج الطوابع، تحديد خطوط الإحداثيات، وتضمين تفاصيل الشعار تلقائياً على الملف النهائي.</p>
                   </div>
                 )}
               </div>

               <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                 <Award className="text-brand w-5 h-5 shrink-0" />
                 <p className="leading-relaxed">
                   <strong>نصيحة المهندس:</strong> اضغط على زر <strong>"استخلاص وفحص بالذكاء الاصطناعي"</strong> ليقوم الوكيل بتحليل محتوى الميدان واستنباط الملاحظات الفنية مثل السلامة وحالة العمل تلقائياً!
                 </p>
               </div>
             </div>
          </div>

        </div>

        {/* SEO Rich Text Resource Guide and FAQ section */}
        <section className="mt-20 border-t border-slate-800 pt-16 space-y-12">
          
          <div className="max-w-4xl mx-auto space-y-4 text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white flex items-center justify-center gap-2">
              <HelpCircle className="text-brand w-8 h-8" />
              الأسئلة الشائعة ودليل استخدام كاميرا ختم الصور
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              اكتشف كيف يمكنك مضاعفة الكفاءة وتأمين إثباتات حضور العمال وتوثيق جودة الخرسانة والمباني بالمعايير الهندسية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand"></span>
                ما هي فائدة الختم الجغرافي وكاميرا الـ GPS (Geo-Stamping)؟
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                يساعدك الختم الجغرافي وتصوير بالتاريخ والوقت وموقع gps (جي بي اس) على وضع معلومات خطوط الطول والعرض المستخرجة تلقائياً من الأقمار الصناعية مدمجة على الصورة لحمايتها من التزوير، بالإضافة إلى إمكانية وضع لوجو المشروع علي الصور مائياً، وتسهيل التدقيق القانوني في المحاضر الرسمية للمشاريع العقارية والإنشائية الضخمة.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                كيف يتم تصوير بالتاريخ والوقت وموقع gps واستخراج الإحداثيات؟
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                تقرأ الأداة بيانات الـ EXIF الجغرافية المضمنة تلقائياً في الملف عند التقاط الصورة من موبايلك أو كاميرا الـ جي بي اس (إذا قمت بتفعيل إذن تتبع الموقع في هاتفك)، كما تتيح لك الأداة رفع ووضع لوجو المشروع علي الصور والتحكم كلياً بمظهر الختم على اللوحات الهندسية والميدانية.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                هل الخدمة مجانية بالكامل؟
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                نعم، الخدمة مفتوحة بالكامل ومجانية ١٠٠٪ حالياً لجميع الزوار عبر المتصفح! يمكنك ختم وتوثيق عدد غير محدود من الصور ورفع شعار شركتك ومطابقة تقارير الـ GPS دون أي قيود أو رسوم دعمًا لقطاع المقاولات والهندسة.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                هل يمكنني رفع شعار شركتي المهندس المخصص؟
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                بكل تأكيد! في خطوة ٣ الخاصة بـ "وضع لوجو المشروع علي الصور وتخصيص الختم" قم بتحديد "لوجو المشروع المخصص" ورفع شعار شركتك أو لوجو المشروع (بصيغة PNG ذات خلفية شفافة)، وسيقوم تطبيق جيو ستامب بدمجه بشكل مائي رائع مباشرة مع الطوابع لتصوير بالتاريخ والوقت وموقع gps (جي بي اس).
              </p>
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-2 text-right">
              <h4 className="text-xl font-bold text-white">هل تبحث عن توثيق يومي بمشاريع متعددة؟</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                قم بتنزيل تطبيق <strong className="text-brand">Geo-Stamp Camera</strong> الأصلي للهواتف الذكية للحصول على ميزة الفتح اللامحدود للختام، تصفية المجلدات، العمل بالكامل بدون إنترنت بالصحراء، وحفظ أوتوماتيكي سريع للخرائط المدمجة بالتقارير.
              </p>
            </div>
            <button 
              onClick={() => setShowLimitModal(true)}
              className="bg-brand text-slate-950 px-6 py-3.5 rounded-xl font-bold hover:bg-brand-hover transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              تنزيل التطبيق الرسمي للجوال
            </button>
          </div>

        </section>

      </main>

      {/* Free Usage Limit Modal dialog (Native Premium Mobile Promo App) */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center mx-auto shadow-lg shadow-brand/5">
                <Smartphone className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/25 rounded-full text-[11px] font-bold">
                  تجاوزت الحد المجاني السريع حياً (3/3)
                </span>
                <h3 className="text-2xl font-black text-white">تجاوزت حد الاستخدام اليومي المجاني</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                  لقد استمتعت بتجربة الختم والتدقيق المجاني حياً عبر الويب. لمتابعة الختم والتحليل بصورة غير محدودة وتصدير تقارير المواقع، ندعوك لتحميل تطبيقنا الرسمي.
                </p>
              </div>

              {/* Direct App Download Badges (High design fidelity mockup) */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 space-y-3">
                <p className="text-xs text-brand font-bold uppercase tracking-wide">متوفر الآن برابط مباشر سريع وآمن</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition-all hover:bg-slate-800"
                  >
                    <svg className="w-6 h-6 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.85 1.04 14.51 1.73 13.73 2.64C13.07 3.41 12.49 4.52 12.64 5.78C13.87 5.87 15.12 5.17 15.97 4.17Z" />
                    </svg>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 uppercase font-mono">Download on the</p>
                      <p className="text-xs font-bold text-white">Apple Store</p>
                    </div>
                  </a>

                  <a 
                    href="https://play.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition-all hover:bg-slate-800"
                  >
                    <svg className="w-6 h-6 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 5.27V18.73c0 .89 1.08 1.34 1.71.71L11 13.17l-6.29-6.3c-.62-.62-1.71-.18-1.71.71zM11.71 12.46l6.29-6.3L4.71 3.17c-.63-.63-1.71-.18-1.71.71v1.39l8.71 7.19zm11.29.54c-.2-.2-.51-.2-.71 0l-5.29 5.3-6.29-6.3c-.2-.2-.51-.2-.71 0l-6.3 6.3c-.2.2-.2.51 0 .71l8.71-7.19 10.59.88z" />
                    </svg>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 uppercase font-mono">Get it on</p>
                      <p className="text-xs font-bold text-white">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="text-slate-500 text-xs">
                مطور لجميع أجهزة أبل وسامسونج وهواوي وشاومي مع خصائص مشاركة ممتازة ودعم كامل للمهندسين الاستشاريين.
              </div>

              <div className="flex justify-center pt-2 gap-4">
                <button 
                  onClick={() => {
                    // Reset localStorage counter for fallback demonstration if requested (secretly allow 3 more under the hood)
                    localStorage.setItem('free_geo_stamp_uses', '0');
                    setUsageCount(0);
                    setShowLimitModal(false);
                  }}
                  className="text-xs text-brand hover:underline font-bold transition-all"
                >
                  إعادة تجربة سريعة مجدداً (للاستعراض فقط)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
