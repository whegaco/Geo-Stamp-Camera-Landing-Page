import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { FileText, Eye, Activity, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const queries = [
          getCountFromServer(collection(db, 'articles')),
          getCountFromServer(query(collection(db, 'events'), where('eventName', '==', 'page_view')))
        ];
        
        const [articlesSnap, eventsSnap] = await Promise.all(queries);
        setStats({
          articles: articlesSnap.data().count,
          views: eventsSnap.data().count
        });
      } catch (err) {
        // Suppress failure internally or show toast
        console.error("Stats fetching error", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome to the Geo-Stamp Administration Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { title: 'Total Articles', value: stats.articles, icon: FileText, color: 'text-blue-500' },
          { title: 'Total Page Views', value: stats.views, icon: Eye, color: 'text-brand' },
        ].map((stat) => (
          <div key={stat.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 font-medium mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stat.value}</p>
            </div>
            <div className={`p-4 rounded-xl bg-slate-950/50 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-6 py-3 bg-brand text-slate-950 font-bold rounded-xl hover:bg-brand-hover transition-colors text-center justify-center"
          >
            <FileText className="w-5 h-5" />
            Create New Article
          </Link>
          <Link
            to="/admin/agent-seo"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-center justify-center"
          >
            <Sparkles className="w-5 h-5" />
            AI SEO Agent
          </Link>
          <Link
            to="/admin/articles"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors text-center justify-center"
          >
            Manage Articles
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
