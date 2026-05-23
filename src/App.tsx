import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/home'));
const PrivacyPolicy = lazy(() => import('./pages/privacyPolicy'));
const TermsOfService = lazy(() => import('./pages/termsOfService'));
const AboutUs = lazy(() => import('./pages/aboutUs'));
const ContactUs = lazy(() => import('./pages/contactUs'));
const Blog = lazy(() => import('./pages/blog'));
const Article = lazy(() => import('./pages/article'));

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
