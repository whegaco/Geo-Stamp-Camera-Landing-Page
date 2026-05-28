import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  Camera, 
  FileText, 
  Calculator, 
  Compass, 
  BookOpen, 
  PhoneCall, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Info
} from 'lucide-react';

export default function FloatingNav() {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: 'home',
      path: '/',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
      badgeAr: null,
      badgeEn: null,
    },
    {
      id: 'tools-directory',
      path: '/tools',
      labelAr: 'بوابة الأدوات',
      labelEn: 'All Tools',
      icon: Compass,
      badgeAr: 'الكل',
      badgeEn: 'All',
    },
    {
      id: 'blog',
      path: '/blog',
      labelAr: 'المدونة والمقالات',
      labelEn: 'Contractors Blog',
      icon: BookOpen,
      badgeAr: 'جديد',
      badgeEn: 'New',
    },
    {
      id: 'about',
      path: '/about',
      labelAr: 'من نحن',
      labelEn: 'Our Team',
      icon: Info,
      badgeAr: null,
      badgeEn: null,
    }
  ];

  const sideOffsetClass = language === 'ar' ? 'right-6' : 'left-6';

  return (
    <>
      {/* 1. DESKTOP FLOATING SIDEBAR */}
      <div 
        className={`hidden lg:flex fixed ${sideOffsetClass} top-1/2 -translate-y-1/2 z-50 flex-col items-center`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <motion.div 
          className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-3.5 relative hover:border-brand/30 transition-colors"
          layout
        >
          {/* Logo / Header handle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 hover:border-brand text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer self-center"
            title={language === 'ar' ? 'توسيع القائمة الجانبية' : 'Toggle Navigation Display'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {language === 'ar' ? (
                isExpanded ? <ChevronRight className="w-5 h-5 text-brand" /> : <ChevronLeft className="w-5 h-5" />
              ) : (
                isExpanded ? <ChevronLeft className="w-5 h-5 text-brand" /> : <ChevronRight className="w-5 h-5" />
              )}
            </motion.div>
          </button>

          <div className="h-px bg-slate-800/60 my-1 w-full" />

          {/* Navigation link group */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const label = language === 'ar' ? item.labelAr : item.labelEn;
              const badge = language === 'ar' ? item.badgeAr : item.badgeEn;

              return (
                <div
                  key={item.id}
                  className="relative group flex items-center"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <Link
                    to={item.path}
                    id={`desktop-nav-${item.id}`}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-2xl border transition-all duration-300 select-none cursor-pointer group min-h-[44px] ${
                      active 
                        ? 'bg-brand/10 border-brand text-brand shadow-[0_0_15px_rgba(198,255,0,0.15)]' 
                        : 'bg-slate-950/40 border-slate-900 text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-slate-800'
                    } ${isExpanded ? 'w-48 justify-start' : 'w-11 justify-center'}`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-xs font-bold truncate tracking-wide whitespace-nowrap block"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active State Micro Dot inside item */}
                    {active && !isExpanded && (
                      <motion.span 
                        layoutId="activeDot"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-brand rounded-l-full"
                      />
                    )}

                    {badge && isExpanded && (
                      <span className="absolute top-1 right-2 px-1 rounded bg-brand/10 border border-brand/20 text-brand text-[8px] font-black uppercase">
                        {badge}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip on closed mode hovered */}
                  {!isExpanded && hoveredIdx === idx && (
                    <motion.div
                      initial={{ opacity: 0, x: language === 'ar' ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`absolute ${language === 'ar' ? 'right-14' : 'left-14'} z-50 bg-slate-950 border border-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-2xl whitespace-nowrap pointer-events-none`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
                        {badge && (
                          <span className="text-[9px] bg-brand/10 border border-brand/20 text-brand px-1 py-0.5 rounded font-black">
                            {badge}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="h-px bg-slate-800/60 my-1 w-full" />

          {/* Quick Contact Link as standalone CTA in sidebars */}
          <Link
            to="/contact"
            id="desktop-nav-cta-contact"
            className={`flex items-center gap-3.5 p-3 rounded-2xl border bg-gradient-to-r from-brand/20 to-brand/5 border-brand/30 hover:border-brand text-brand hover:text-white transition-all cursor-pointer min-h-[44px] ${isExpanded ? 'w-48 justify-start' : 'w-11 justify-center'}`}
            title={language === 'ar' ? 'اتصل بنا ودعم سريع' : 'Contact Support'}
          >
            <PhoneCall className="w-5 h-5 flex-shrink-0 animate-bounce" />
            
            {isExpanded && (
              <span className="text-xs font-black uppercase tracking-wider block">
                {language === 'ar' ? 'اتصل بنا فوراً' : 'Live Support'}
              </span>
            )}
          </Link>
        </motion.div>
      </div>


      {/* 2. MOBILE BOTTOM NAVIGATION SYSTEM */}
      {/* Absolute high contrast premium design, padded for Safe Area to guarantee comfort */}
      <div 
        className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-around items-center h-16 px-2 relative">
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const label = language === 'ar' ? item.labelAr : item.labelEn;
            const displayLabel = item.id === 'blog' 
              ? (language === 'ar' ? 'المدونة' : 'Blog') 
              : item.id === 'tools-directory'
                ? (language === 'ar' ? 'الأدوات' : 'Tools')
                : label;

            return (
              <Link
                key={item.id}
                to={item.path}
                id={`mobile-nav-${item.id}`}
                className="flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer select-none active:scale-95 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Visual Glow container for Active items */}
                <span className={`p-2 rounded-xl transition-all duration-300 relative ${active ? 'bg-brand/10 text-brand' : 'text-slate-400 hover:text-white'}`}>
                  <Icon className={`w-5.5 h-5.5 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                  
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(198,255,0,0.8)]" />
                  )}
                </span>
                
                <span className={`text-[9px] font-black tracking-wide mt-1 transition-colors ${active ? 'text-brand' : 'text-slate-500'}`}>
                  {displayLabel}
                </span>
              </Link>
            );
          })}

          {/* More Action: Dropdown / Quick Links trigger for contact or language */}
          <button
            onClick={toggleLanguage}
            className="flex-1 flex flex-col items-center justify-center h-full text-slate-400 active:text-white cursor-pointer select-none border-l border-slate-900 min-h-[44px] min-w-[44px]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Toggle language"
            title={language === 'ar' ? 'تغيير اللغة' : 'Change Language'}
          >
            <span className="text-xs font-black uppercase text-brand bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 max-h-7 leading-none">
              {language === 'ar' ? 'EN' : 'AR'}
            </span>
            <span className="text-[9px] font-bold text-slate-500 tracking-wide mt-1">
              {language === 'ar' ? 'اللغة' : 'Language'}
            </span>
          </button>

        </div>
      </div>
      
      {/* Extra spacing for mobiles so the floating fixed menu at bottom doesn't cover footer layout */}
      <div className="lg:hidden h-24 w-full bg-transparent pointer-events-none" />
    </>
  );
}
