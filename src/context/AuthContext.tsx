import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, logInWithGoogle, logOut } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === 'kassema20@gmail.com';

  const handleLogin = async () => {
    try {
      await logInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        alert('حدث خطأ: النطاق غير مصرح به. يرجى إضافة هذا الرابط إلى "Authorized domains" في إعدادات Firebase.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        alert('حدث خطأ: تم رفض نافذة تسجيل الدخول.\n\nالسبب: التطبيق يعمل داخل إطار (iFrame) داخل استوديو الذكاء الاصطناعي والذي يمنع النوافذ المنبثقة.\n\nالحل: اضغط على زر "Open App" (فتح في نافذة جديدة) الموجود في أعلى يمين شاشتك، وحاول تسجيل الدخول هناك.');
      } else {
        alert(`فشل تسجيل الدخول: ${err.message || String(err)}\n\nجرب فتح التطبيق في تبويب/نافذة جديدة.`);
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login: handleLogin, logout: logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
