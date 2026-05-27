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

  const isAdmin = user?.email === 'kassema20@gmail.com' && user?.emailVerified === true;

  const handleLogin = async () => {
    try {
      await logInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      // Give a helpful alert, especially for unauthorized-domain errors
      if (err.code === 'auth/unauthorized-domain') {
        alert('حدث خطأ: النطاق الحالي غير مصرح به. يرجى إضافة هذا الرابط (App URL) إلى قائمة "Authorized domains" في إعدادات Firebase Authentication.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        alert('تم إغلاق نافذة تسجيل الدخول. إذا كنت تستخدم التطبيق داخل إطار (iFrame)، يرجى فتح التطبيق في نافذة جديدة والمحاولة مرة أخرى.');
      } else {
        alert(`فشل تسجيل الدخول: ${err.message || String(err)}\n\nإذا كنت تواجه مشكلة، جرب فتح التطبيق في نافذة جديدة.`);
      }
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
