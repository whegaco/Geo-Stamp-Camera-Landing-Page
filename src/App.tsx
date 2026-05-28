import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense, useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import FloatingContactForm from './components/FloatingContactForm';
import FloatingNav from './components/FloatingNav';
import PWAInstaller from './components/PWAInstaller';
import { AuthProvider } from './context/AuthContext';
import { trackEvent } from './lib/firebase';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location]);

  return null;
}

const Home = lazy(() => import('./pages/home'));
const PrivacyPolicy = lazy(() => import('./pages/privacyPolicy'));
const TermsOfService = lazy(() => import('./pages/termsOfService'));
const AboutUs = lazy(() => import('./pages/aboutUs'));
const ContactUs = lazy(() => import('./pages/contactUs'));
const Blog = lazy(() => import('./pages/blog'));
const Article = lazy(() => import('./pages/article'));
const AgentStamper = lazy(() => import('./pages/AgentStamper'));
const ReportGenerator = lazy(() => import('./pages/reportGenerator'));
const MaterialsCalculator = lazy(() => import('./pages/materialsCalculator'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const AdminArticleEdit = lazy(() => import('./pages/admin/AdminArticleEdit'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs'));
const AgentSEO = lazy(() => import('./pages/admin/AgentSEO'));
const ToolsDirectory = lazy(() => import('./pages/toolsDirectory'));

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <PageTracker />
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center p-8"><div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand animate-spin"></div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Article />} />
              <Route path="/agent-stamper" element={<AgentStamper />} />
              <Route path="/tools" element={<ToolsDirectory />} />
              <Route path="/all-tools" element={<ToolsDirectory />} />
              <Route path="/tools/geo-stamper" element={<AgentStamper />} />
              <Route path="/geostamp" element={<AgentStamper />} />
              <Route path="/tools/report-generator" element={<ReportGenerator />} />
              <Route path="/tools/report-builder" element={<ReportGenerator />} />
              <Route path="/tools/materials-calculator" element={<MaterialsCalculator />} />
              <Route path="/tools/calculator" element={<MaterialsCalculator />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/articles/new" element={<AdminArticleEdit />} />
              <Route path="/admin/articles/:id" element={<AdminArticleEdit />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
              <Route path="/admin/agent-seo" element={<AgentSEO />} />
              
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
          <FloatingContactForm />
          <FloatingNav />
          <PWAInstaller />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
