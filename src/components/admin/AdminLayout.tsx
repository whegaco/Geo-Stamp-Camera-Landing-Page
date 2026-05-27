import { ReactNode, useState } from 'react';
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center">
          <div className="flex justify-center mb-8">
             <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center">
                 <LayoutDashboard className="text-slate-950 w-8 h-8" />
             </div>
          </div>
          <h1 className="text-2xl font-bold mb-6">تسجيل الدخول للإدارة</h1>
          
          <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 text-sm mb-8 border border-brand/20">
            <h3 className="text-white font-bold mb-2 break-normal text-right">مشكلة النافذة التي تغلق؟</h3>
            <p className="text-right">
              لكي يعمل تسجيل الدخول بنجاح، يجب فتح التطبيق في نافذة/تبويب جديد لمنع الحظر. 
              اضغط على زر <strong className="text-white bg-slate-700 px-2 py-0.5 rounded uppercase font-mono tracking-wider ml-1">Open in new tab</strong> أعلى اليمين ثم سجل دخولك من هناك.
            </p>
          </div>
          
          <button
            onClick={login}
            className="w-full justify-center flex items-center gap-3 bg-white text-black py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            تسجيل الدخول من جوجل
          </button>
        </div>
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
