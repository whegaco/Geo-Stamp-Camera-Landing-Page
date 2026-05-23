import { Search, Eye, FileText, Database, Map, Trash2, Image as ImageIcon, Home, Settings, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import MockupImage from './MockupImage';

export default function ShowcaseMockup() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="relative mx-auto w-full max-w-[320px] shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-[1/2] rounded-[2.5rem] border-[8px] border-[#1e293b] bg-[#0a0f1c] overflow-hidden flex flex-col font-cairo">
      {/* Dynamic Island Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
         <div className="w-32 h-6 bg-[#1e293b] rounded-b-3xl"></div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col pt-2" dir={isAr ? 'rtl' : 'ltr'}>
         {/* Top Dark Section */}
         <div className="px-4 pt-10 pb-4">
           <div className="flex justify-between items-end mb-4">
             <div>
               <h3 className="text-white font-bold text-2xl leading-tight tracking-tight">{isAr ? 'سجل التوثيق' : 'Logs'}</h3>
               <p className="text-slate-500 text-xs mt-1 font-medium">{isAr ? '2 من 2 صورة' : '2 of 2 photos'}</p>
             </div>
           </div>
           {/* Search Bar */}
           <div className="w-full bg-[#121b2b] border border-slate-700/50 rounded-xl h-11 px-3 flex items-center gap-3 mb-4 shadow-inner">
             <Search className="w-4 h-4 text-slate-500" />
             <span className="text-slate-500 text-xs w-full overflow-hidden text-ellipsis whitespace-nowrap">{isAr ? 'بحث بالمشروع، الملاحظة...' : 'Search project, notes...'}</span>
           </div>

           {/* Background Grid preview */}
           <div className="grid grid-cols-2 gap-3 opacity-60 pointer-events-none">
             <div className="aspect-square rounded-xl relative overflow-hidden shadow-lg border border-slate-700/50">
                <MockupImage title="IMG_SD001.jpg" withPin={true} />
             </div>
             <div className="aspect-square rounded-xl relative overflow-hidden shadow-lg border border-slate-700/50">
                <MockupImage title="IMG_SD002.jpg" withPin={true} />
             </div>
           </div>
         </div>

         {/* Bottom Sheet Modal Experience */}
         <div className="flex-1 bg-[#1a263c] rounded-t-3xl border-t border-[#2a3a5a] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] mt-auto flex flex-col z-10 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 to-transparent pointer-events-none rounded-t-3xl"></div>
            
            <div className="w-12 h-1.5 bg-slate-600/50 rounded-full mx-auto mt-3 mb-1"></div>
            
            {/* Sheet Header */}
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                     <div className="relative">
                       <div className="w-12 h-12 rounded-xl border-2 border-slate-700 overflow-hidden bg-slate-800">
                          <MockupImage title="" withPin={false} />
                       </div>
                       <div className="absolute -bottom-1 -right-1 bg-brand text-slate-900 rounded-full p-0.5 border border-slate-900 shadow-sm">
                         <MapPin className="w-2.5 h-2.5" />
                       </div>
                     </div>
                     <div>
                        <h4 className="text-white font-bold text-sm tracking-tight">{isAr ? 'مشروع ميداني' : 'Field Project'}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-mono tracking-tighter">
                           <MapPin className="w-3 h-3 text-red-400" />
                           38.7968, 23.7800
                        </div>
                     </div>
                </div>
            </div>

            {/* List Actions */}
            <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col hide-scrollbar pb-20 relative z-10">
               {[
                 { i: <Eye className="w-4 h-4"/>, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", t: isAr ? 'عرض الصورة' : 'View Image', d: isAr ? 'فتح معاينة الصورة كاملة' : 'Open full 1:1 preview' },
                 { i: <FileText className="w-4 h-4"/>, color: "text-brand bg-brand/10 border-brand/20", t: isAr ? 'إنشاء تقرير PDF' : 'Create PDF Report', d: isAr ? 'إنشاء تقرير لهذه الصورة' : 'Generate file for this photo' },
                 { i: <Database className="w-4 h-4"/>, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", t: isAr ? 'تصدير CSV' : 'Export CSV', d: isAr ? 'تصدير بيانات الصورة إكسيل' : 'Export data to MS Excel' },
                 { i: <Map className="w-4 h-4"/>, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", t: isAr ? 'تصدير KML' : 'Export KML', d: isAr ? 'للفتح قي Google Earth' : 'Open points in Google Earth' },
                 { i: <Trash2 className="w-4 h-4"/>, color: "text-red-400 bg-red-500/10 border-red-500/20", t: isAr ? 'حذف الصورة' : 'Delete Image', d: isAr ? 'حذف نهائي لا يمكن التراجع' : 'Permanent destructive action' },
               ].map((item, idx) => (
                 <div key={idx} className={`flex ${isAr ? 'flex-row-reverse' : 'flex-row'} items-center py-3 border-b border-slate-700/30 last:border-0 cursor-pointer hover:bg-white/5 transition-colors -mx-2 px-2 rounded-xl`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.color} flex-shrink-0`}>
                       {item.i}
                    </div>
                    <div className={`flex flex-col ${isAr ? 'flex-1 pr-3 text-right' : 'flex-1 pl-3 text-left'} justify-center`}>
                       <span className="text-white font-bold text-[13px] leading-tight mb-0.5">{item.t}</span>
                       <span className="text-slate-400 text-[10px] leading-tight break-words">{item.d}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0c121e] border-t border-[#1e293b] flex items-center justify-around px-2 z-30" dir={isAr ? 'rtl' : 'ltr'}>
         <div className="flex flex-col items-center gap-1 justify-center flex-1 text-slate-500 hover:text-slate-300 h-12 cursor-pointer">
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-bold">{isAr ? 'الإعدادات' : 'Settings'}</span>
         </div>
         <div className="flex flex-col items-center justify-center flex-1 bg-[#1a263c] m-1 rounded-xl h-12 text-brand border-t border-brand/20 shadow-[0_0_15px_rgba(198,255,0,0.05)] cursor-pointer">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[9px] font-bold">{isAr ? 'السجل' : 'Log'}</span>
         </div>
         <div className="flex flex-col items-center gap-1 justify-center flex-1 text-slate-500 hover:text-slate-300 h-12 cursor-pointer">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">{isAr ? 'الرئيسية' : 'Home'}</span>
         </div>
      </div>
    </div>
  );
}
