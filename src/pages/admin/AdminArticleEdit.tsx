import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Save, Loader2, ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';

interface ArticleForm {
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  date: string;
  authorEn: string;
  authorAr: string;
  readTimeEn: string;
  readTimeAr: string;
  image: string;
  keywordsEn: string;
  keywordsAr: string;
}

const defaultForm: ArticleForm = {
  slug: '',
  titleEn: '', titleAr: '',
  excerptEn: '', excerptAr: '',
  contentEn: '', contentAr: '',
  date: new Date().toISOString().split('T')[0],
  authorEn: 'Editorial Team', authorAr: 'فريق التحرير',
  readTimeEn: '5 min read', readTimeAr: '٥ دقائق قراءة',
  image: '',
  keywordsEn: '', keywordsAr: ''
};

export default function AdminArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [form, setForm] = useState<ArticleForm>(defaultForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        try {
          const docRef = doc(db, 'articles', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setForm(docSnap.data() as ArticleForm);
          } else {
            setError('Article not found');
          }
        } catch (err) {
          setError('Failed to fetch article');
          handleFirestoreError(err, OperationType.GET, `articles/${id}`);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        const docRef = doc(db, 'articles', id);
        await updateDoc(docRef, {
          ...form,
          updatedAt: Date.now()
        });
      } else {
        const newDocRef = doc(collection(db, 'articles'));
        await setDoc(newDocRef, {
          ...form,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      navigate('/admin/articles');
    } catch (err) {
      setError('Failed to save article. Make sure all required fields are filled.');
      const op = isEditing ? OperationType.UPDATE : OperationType.CREATE;
      const path = isEditing ? `articles/${id}` : 'articles';
      setSaving(false);
      try {
        handleFirestoreError(err, op, path);
      } catch(e) {
        // Logged internally
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4">
        <Link to="/admin/articles" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            {isEditing ? 'Edit Article' : 'Draft New Article'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Core Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">URL Slug (Required)</label>
              <input required name="slug" value={form.slug} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" placeholder="e.g. how-to-use-geo-stamp" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Cover Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Keywords (English)</label>
              <input name="keywordsEn" value={form.keywordsEn} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Keywords (Arabic)</label>
              <input name="keywordsAr" value={form.keywordsAr} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand rtl:text-right" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Author (English)</label>
              <input name="authorEn" value={form.authorEn} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Author (Arabic)</label>
              <input name="authorAr" value={form.authorAr} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand rtl:text-right" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Content (English)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Title (Required)</label>
              <input required name="titleEn" value={form.titleEn} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand font-medium text-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Excerpt</label>
              <textarea name="excerptEn" value={form.excerptEn} onChange={handleChange} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand resize-y" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Body (Supports Markdown)</label>
                <textarea name="contentEn" value={form.contentEn} onChange={handleChange} className="w-full h-[500px] bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-brand resize-y font-mono text-sm leading-relaxed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </label>
                <div className="w-full h-[500px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-6 font-cairo">
                  <div className="markdown-body">
                    <Markdown>{form.contentEn || '*No content yet...*'}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" dir="rtl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">المحتوى (العربية)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">العنوان (مطلوب)</label>
              <input required name="titleAr" value={form.titleAr} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand font-medium text-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">مقتطف</label>
              <textarea name="excerptAr" value={form.excerptAr} onChange={handleChange} rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand resize-y" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">المحتوى الأساسي (يدعم Markdown)</label>
                <textarea name="contentAr" value={form.contentAr} onChange={handleChange} className="w-full h-[500px] bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-brand resize-y font-mono text-sm leading-relaxed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> معاينة
                </label>
                <div className="w-full h-[500px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-6 font-cairo" dir="rtl">
                  <div className="markdown-body">
                    <Markdown>{form.contentAr || '*لا يوجد محتوى بعد...*'}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-brand text-slate-950 font-bold rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
