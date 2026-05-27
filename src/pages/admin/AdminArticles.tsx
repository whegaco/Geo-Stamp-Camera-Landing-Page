import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleItem {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  createdAt: number;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ArticleItem[];
        setArticles(docs);
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'articles')
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch (err) {
        alert("Failed to delete article");
        handleFirestoreError(err, OperationType.DELETE, `articles/${id}`);
      }
    }
  };

  const filteredArticles = articles.filter(a => 
    a.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Articles Management</h1>
          <p className="text-slate-400">Create, edit, and manage your blog content.</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand text-slate-950 font-bold rounded-xl hover:bg-brand-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Article
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Created Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Loading articles...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 flex-col items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p>No articles found.</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium truncate max-w-xs">{article.titleEn}</div>
                      <div className="text-slate-500 text-xs truncate max-w-xs">{article.titleAr}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm font-mono">{article.slug}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(article.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/articles/${article.id}`}
                          className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
