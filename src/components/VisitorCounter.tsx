import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VisitorCounter() {
  const { language } = useLanguage();
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch and increment real visitor count using local secure API
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitor-count');
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch visitor count', error);
      }
    };

    fetchVisitorCount();
  }, []);

  if (visitorCount === null) {
    return null; // hide until loaded
  }

  return (
    <div className="flex items-center justify-center gap-2 text-slate-400 mt-6 pt-6 border-t border-slate-800/50">
      <Users className="w-4 h-4 text-brand" />
      <span className="text-sm">
        {language === 'ar' ? 'إجمالي الزيارات:' : 'Total Visits:'}
      </span>
      <span className="text-white font-mono font-bold tracking-wider">
        {visitorCount.toLocaleString('en-US')}
      </span>
    </div>
  );
}

