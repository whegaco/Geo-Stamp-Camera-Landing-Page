import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import { AlertCircle, Clock, Database, RefreshCw, ServerCrash } from 'lucide-react';
import { motion } from 'motion/react';

interface ErrorLog {
  id: string;
  error: string;
  timestamp: number;
  operationType: string;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'error_logs'), orderBy('timestamp', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ErrorLog));
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch error logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Error Logs</h1>
          <p className="text-slate-400">Recent Firestore errors captured by handleFirestoreError</p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Errors Found</h3>
            <p className="text-slate-400">Your Firestore database is running smoothly without errors.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="p-4 text-sm font-medium text-slate-400">Time</th>
                  <th className="p-4 text-sm font-medium text-slate-400">Operation</th>
                  <th className="p-4 text-sm font-medium text-slate-400">Path</th>
                  <th className="p-4 text-sm font-medium text-slate-400">Error Message</th>
                  <th className="p-4 text-sm font-medium text-slate-400 text-right">User</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={log.id} 
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="p-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm">
                          {new Date(log.timestamp).toLocaleString(undefined, { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {log.operationType || 'unknown'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-xs">
                      {log.path || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        <ServerCrash className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                        <span className="text-sm text-red-200 break-all line-clamp-2 group-hover:line-clamp-none transition-all">
                          {log.error}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm text-slate-400">
                      {log.authInfo?.email || 'Anonymous'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
