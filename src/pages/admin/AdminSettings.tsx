import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Save, Loader2 } from 'lucide-react';

interface SiteConfig {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  heroHeadlineEn: string;
  heroHeadlineAr: string;
  googlePlayUrl: string;
  appStoreUrl: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
}

const defaultConfig: SiteConfig = {
  siteName: 'Geo-Stamp Camera',
  contactEmail: 'support@geo-stamp.app',
  contactPhone: '+1 (555) 000-0000',
  heroHeadlineEn: 'Document Everything with Absolute Precision',
  heroHeadlineAr: 'وثق كل شيء بدقة مطلقة',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.ali.geostamp',
  appStoreUrl: '',
  socialFacebook: '',
  socialTwitter: '',
  socialInstagram: '',
  socialLinkedin: '',
};

export default function AdminSettings() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadConfig() {
      try {
        const docRef = doc(db, 'config', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig({ ...defaultConfig, ...docSnap.data() });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'config/main');
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'config', 'main'), {
        ...config,
        updatedAt: Date.now()
      });
      setMessage('Settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
      handleFirestoreError(err, OperationType.UPDATE, 'config/main');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
        <p className="text-slate-400">Manage global configuration for your application.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl font-medium ${message.includes('success') ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Site Name</label>
              <input name="siteName" value={config.siteName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            {/* Empty column for alignment */}
            <div className="hidden md:block"></div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Contact Email</label>
              <input type="email" name="contactEmail" value={config.contactEmail} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Contact Phone</label>
              <input name="contactPhone" value={config.contactPhone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">Hero Headline (English)</label>
              <input name="heroHeadlineEn" value={config.heroHeadlineEn} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">Hero Headline (Arabic)</label>
              <input name="heroHeadlineAr" value={config.heroHeadlineAr} onChange={handleChange} dir="rtl" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand rtl:text-right" />
            </div>
            <div className="md:col-span-2 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">App Links</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Google Play URL</label>
              <input name="googlePlayUrl" value={config.googlePlayUrl} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">App Store URL</label>
              <input name="appStoreUrl" value={config.appStoreUrl} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>

            <div className="md:col-span-2 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Social Media Links</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Facebook URL</label>
              <input name="socialFacebook" value={config.socialFacebook} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Twitter URL</label>
              <input name="socialTwitter" value={config.socialTwitter} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Instagram URL</label>
              <input name="socialInstagram" value={config.socialInstagram} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">LinkedIn URL</label>
              <input name="socialLinkedin" value={config.socialLinkedin} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading || saving}
              className="flex items-center gap-2 px-8 py-3 bg-brand text-slate-950 font-bold rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
