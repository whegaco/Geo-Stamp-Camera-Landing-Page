import { ReactNode } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Settings, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, login, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard Portal</h1>
        <button
          onClick={login}
          className="bg-brand text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-brand-hover transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        <div className="max-w-md text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-8">
            You do not have administrative privileges to access this area.
          </p>
          <button
            onClick={logout}
            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Error Logs', href: '/admin/logs', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-brand tracking-wider">Geo-Stamp Admin</h2>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-brand text-slate-950' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.displayName || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
