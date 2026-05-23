import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../locales/translations';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, section: keyof typeof translations['ar']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // @ts-ignore
    const title = translations[language].seo.title;
    // @ts-ignore
    const desc = translations[language].seo.desc;

    // Update document properties
    document.title = title;
    
    // Helper to safely update meta tags
    const updateMeta = (selector: string, content: string) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute('content', content);
    };

    updateMeta('meta[name="title"]', title);
    updateMeta('meta[name="description"]', desc);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', desc);
    updateMeta('meta[property="twitter:title"]', title);
    updateMeta('meta[property="twitter:description"]', desc);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string, section: keyof typeof translations['ar']) => {
    // @ts-ignore
    return translations[language][section][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
