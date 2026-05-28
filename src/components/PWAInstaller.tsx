import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Download, WifiOff, Wifi, X, CheckCircle, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Show states
  const [showInstallToast, setShowInstallToast] = useState<boolean>(false);
  const [showNetworkToast, setShowNetworkToast] = useState<boolean>(false);
  const [networkMessage, setNetworkMessage] = useState<{type: 'online' | 'offline', textAr: string, textEn: string} | null>(null);

  useEffect(() => {
    // 1. REGISTER THE SERVICE WORKER SCRIPT
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered successfully on scope:', reg.scope);
            
            // Handle updates on active service worker
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('[PWA] New content is available; please refresh.');
                    } else {
                      console.log('[PWA] Content is cached for offline use.');
                    }
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.error('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 2. LISTEN FOR BEFORE-INSTALL-PROMPT
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Delay showing install toast slightly for better first-impression timing
      const timer = setTimeout(() => {
        // Only show if user hasn't explicitly dismissed it in this session
        const isDismissed = sessionStorage.getItem('pwa_install_dismissed') === 'true';
        if (!isDismissed) {
          setShowInstallToast(true);
        }
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 3. LISTEN FOR INSTALLED SUCCESS
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully!');
      setIsInstalled(true);
      setIsInstallable(false);
      setShowInstallToast(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. LISTEN FOR NETWORK STATUS
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkMessage({
        type: 'online',
        textAr: 'تم استعادة الاتصال بالشبكة! الخدمة متصلة الآن ⚡',
        textEn: 'Connection restored! Live database is connected ⚡'
      });
      setShowNetworkToast(true);
      setTimeout(() => setShowNetworkToast(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkMessage({
        type: 'offline',
        textAr: 'أنت تعمل الآن في وضع الأوفلاين 📴',
        textEn: 'You are now running in Offline Mode 📴'
      });
      setShowNetworkToast(true);
      setTimeout(() => setShowNetworkToast(false), 6000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check if opened in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerInstallation = async () => {
    if (!deferredPrompt) return;
    
    // Show the installation prompt
    await deferredPrompt.prompt();
    
    // Wait for the user option
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to installation prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    
    // Reset our deferred prompt
    setDeferredPrompt(null);
    setShowInstallToast(false);
  };

  const dismissInstallToast = () => {
    setShowInstallToast(false);
    sessionStorage.setItem('pwa_install_dismissed', 'true');
  };

  return (
    <>
      <AnimatePresence>
        {/* NETWORK HEALING TOAST (At the top of the interface) */}
        {showNetworkToast && networkMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[9999]"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border ${
              networkMessage.type === 'online'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100 backdrop-blur-xl'
                : 'bg-amber-950/90 border-amber-500/30 text-amber-100 backdrop-blur-xl'
            }`}>
              <div className={`p-2 rounded-xl flex-shrink-0 ${
                networkMessage.type === 'online' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
              }`}>
                {networkMessage.type === 'online' ? (
                  <Wifi className="w-5 h-5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <p className="text-xs font-bold leading-relaxed flex-1">
                {language === 'ar' ? networkMessage.textAr : networkMessage.textEn}
              </p>
              <button 
                onClick={() => setShowNetworkToast(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Close message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* COMPREHENSIVE PWA EXTRA BENEFITS PROMPT (Padded bottom on mobile so it doesn't collide with Bottom menu!) */}
        {showInstallToast && isInstallable && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 lg:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-[999]"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-brand/20 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              {/* Radial light glow */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-all duration-500" />
              
              <button 
                onClick={dismissInstallToast}
                className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-all cursor-pointer z-10"
                aria-label="Dismiss installation prompt"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Download className="w-6 h-6 text-brand" />
                </div>
                
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-[9px] font-black text-brand tracking-wider uppercase mb-1.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    {language === 'ar' ? 'تثبيت تطبيق الويب' : 'PWA App Asset'}
                  </span>
                  
                  <h3 className="text-sm font-extrabold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'تثبيت نسختك من Geo-Stamp' : 'Install Geo-Stamp App'}
                  </h3>
                  
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-4">
                    {language === 'ar' 
                      ? 'للوصول الفوري السريع من الشاشة الرئيسية والتقاط وتوثيق الصور أسرع ودعم وضع الأوفلاين بالكامل.' 
                      : 'Add to home screen for faster photos, zero-load speeds, and complete offline tools support in remote sites.'}
                  </p>

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={triggerInstallation}
                      className="flex-1 bg-brand text-slate-950 hover:bg-brand-hover text-xs font-black py-2.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(198,255,0,0.25)] flex items-center justify-center gap-2 hover:translate-y-[-1px] transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[2.5px]" />
                      <span>{language === 'ar' ? 'تثبيت بنقرة واحدة' : 'Install Mobile App'}</span>
                    </button>
                    
                    <button
                      onClick={dismissInstallToast}
                      className="bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer"
                    >
                      {language === 'ar' ? 'ليس الآن' : 'Later'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
