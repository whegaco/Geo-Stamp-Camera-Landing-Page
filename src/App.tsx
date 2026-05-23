import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Blog = lazy(() => import('./pages/Blog'));
const Article = lazy(() => import('./pages/Article'));

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center p-8"><div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}
