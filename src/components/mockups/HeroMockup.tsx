import { Settings, MapPin, Briefcase, Camera, Image as ImageIcon, Calendar, FileText, Home, Crosshair, PenTool } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import GeoStampLogo from '../GeoStampLogo';

export default function HeroMockup() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="relative mx-auto w-full max-w-[320px] aspect-[1/2] rounded-[2.5rem] border-[8px] border-[#1e293b] bg-[#0a0f1c] shadow-2xl overflow-hidden flex flex-col font-cairo">
      {/* Dynamic Island Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
         <div className="w-32 h-6 bg-[#1e293b] rounded-b-3xl"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-24 flex flex-col gap-4 hide-scrollbar" dir={isAr ? 'rtl' : 'ltr'}>
         {/* Header */}
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 flex-shrink-0">
                  <GeoStampLogo className="w-full h-full" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-[14px] leading-tight mb-0.5">Geo-Stamp Camera</h3>
                 <p className="text-slate-400 text-[10px] whitespace-nowrap">{isAr ? 'توثيق ميداني احترافي' : 'Professional Field Docs'}</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="hidden sm:flex items-center gap-1 bg-brand/10 border border-brand/20 text-brand px-2 py-1 rounded-full text-[9px] font-bold">
                  <Crosshair className="w-3 h-3" />
                  {isAr ? 'GPS جاهز' : 'GPS Ready'}
               </div>
               <div className="w-8 h-8 rounded-lg bg-[#121b2b] flex items-center justify-center text-slate-300 flex-shrink-0 border border-slate-800">
                  <Settings className="w-4 h-4" />
               </div>
            </div>
         </div>

         {/* Project Card */}
         <div className="bg-[#121b2b] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#1c2c1c] rounded-xl flex items-center justify-center text-brand flex-shrink-0">
                  <Briefcase className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-slate-400 text-[10px] mb-0.5">{isAr ? 'المشروع الحالي' : 'Current Project'}</p>
                  <h4 className="text-white font-bold text-sm leading-tight">{isAr ? 'مشروع ميداني' : 'Field Project'}</h4>
               </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#0a0f1c] border border-slate-800/50 flex items-center justify-center text-brand cursor-pointer">
               <PenTool className="w-4 h-4" />
            </div>
         </div>

         {/* Camera Button */}
         <div className="w-full bg-brand rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-[0_0_50px_rgba(198,255,0,0.15)] mt-2 hover:bg-brand-hover cursor-pointer transition-colors group">
            <div>
               <h3 className="text-slate-950 font-bold text-lg leading-tight mb-1">{isAr ? 'التقاط صورة موثقة' : 'Capture Photo'}</h3>
               <p className="text-slate-800 text-[11px] font-semibold">{isAr ? 'مع ختم GPS والتاريخ تلقائياً' : 'With GPS & Date stamp'}</p>
            </div>
            <div className="w-12 h-12 bg-slate-950/15 rounded-xl flex items-center justify-center text-slate-950 shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
               <Camera className="w-6 h-6 fill-slate-950/20" />
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-[#121b2b] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-28">
               <div className="absolute top-2 right-2 w-6 h-6 bg-[#0a0f1c] border border-slate-800 rounded flex items-center justify-center text-brand">
                  <ImageIcon className="w-3 h-3" />
               </div>
               <h2 className="text-white font-extrabold text-3xl mt-2 tracking-tighter">2</h2>
               <p className="text-slate-400 text-[11px] mt-1 font-medium">{isAr ? 'الإجمالي' : 'Total Photos'}</p>
            </div>
            <div className="bg-[#121b2b] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-28">
               <div className="absolute top-2 right-2 w-6 h-6 bg-[#0a0f1c] border border-slate-800 rounded flex items-center justify-center text-brand">
                  <Calendar className="w-3 h-3" />
               </div>
               <h2 className="text-white font-extrabold text-3xl mt-2 tracking-tighter">0</h2>
               <p className="text-slate-400 text-[11px] mt-1 font-medium">{isAr ? 'صور اليوم' : 'Today Photos'}</p>
            </div>
         </div>

         {/* Quick Actions */}
         <div className="mt-2">
           <h4 className="text-white font-bold text-sm mb-3 px-1">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h4>
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#121b2b] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#1a263c] transition-colors">
                 <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div className="text-center">
                   <span className="text-white font-bold text-xs block">{isAr ? 'تقرير PDF' : 'PDF Report'}</span>
                   <span className="text-slate-500 text-[9px] mt-0.5 block">{isAr ? 'إنشاء تقرير' : 'Generate'}</span>
                 </div>
              </div>
              <div className="bg-[#121b2b] border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#1a263c] transition-colors">
                 <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                 </div>
                 <div className="text-center">
                   <span className="text-white font-bold text-xs block">{isAr ? 'السجل' : 'Log Gallery'}</span>
                   <span className="text-slate-500 text-[9px] mt-0.5 block">{isAr ? 'عرض الصور' : 'View Photos'}</span>
                 </div>
              </div>
           </div>
         </div>

      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0c121e] border-t border-[#1e293b] flex items-center justify-around px-2 z-10" dir={isAr ? 'rtl' : 'ltr'}>
         <div className="flex flex-col items-center gap-1 justify-center flex-1 text-slate-500 hover:text-slate-300 h-12 cursor-pointer">
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-bold">{isAr ? 'الإعدادات' : 'Settings'}</span>
         </div>
         <div className="flex flex-col items-center gap-1 justify-center flex-1 text-slate-500 hover:text-slate-300 h-12 cursor-pointer">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[9px] font-bold">{isAr ? 'السجل' : 'Log'}</span>
         </div>
         <div className="flex flex-col items-center justify-center flex-1 bg-[#1a263c] m-1 rounded-xl h-12 text-brand border-t border-brand/20 cursor-pointer">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">{isAr ? 'الرئيسية' : 'Home'}</span>
         </div>
      </div>
    </div>
  );
}
