import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import { Sparkles, Loader2, Save, FileText, Activity, Globe, Search, Link } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export default function AgentSEO() {
  const [activeTab, setActiveTab] = useState<'writer' | 'crawls' | 'indexing'>('writer');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  interface CrawlLog { bot: string, url: string, timestamp: string }
  const [crawlLogs, setCrawlLogs] = useState<CrawlLog[]>([]);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  const fetchCrawlLogs = async () => {
    try {
      setIsFetchingLogs(true);
      const res = await fetch('/api/admin/crawl-logs');
      if (res.ok) {
        const data = await res.json();
        setCrawlLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'crawls') {
      fetchCrawlLogs();
    }
  }, [activeTab]);

  const pingSearchEngines = async () => {
    try {
      setIsPinging(true);
      const res = await fetch('/api/admin/ping-engines', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.error || 'فشل الاتصال');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setIsPinging(false);
    }
  };

  const generateArticle = async () => {
    if (!topic) return;
    try {
      setIsGenerating(true);
      const response = await fetch('/api/agent/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords })
      });
      
      if (!response.ok) throw new Error('فشل توليد المقال');
      
      const data = await response.json();
      if (data.content) {
        setGeneratedContent(data.content);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالوكيل الذكي.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDatabase = async () => {
    if (!generatedContent) return;
    try {
      setIsSaving(true);
      // Generate a temporary title from the topic or first line
      const titleMatch = generatedContent.match(/# (.*)/);
      const tempTitle = titleMatch ? titleMatch[1] : `مقال عن: ${topic}`;
      const tempSlug = tempTitle.replace(/[^a-zA-Z0-9\u0621-\u064A]+/g, '-').replace(/(^-|-$)+/g, '');

      await addDoc(collection(db, 'articles'), {
        title: tempTitle,
        slug: tempSlug,
        excerpt: 'تم توليد هذا المقال بواسطة الوكيل الذكي (Agent 4)...',
        content: generatedContent,
        imageUrl: 'https://images.unsplash.com/photo-1541888086225-ee8a9390235b?auto=format&fit=crop&q=80',
        publishedAt: serverTimestamp(),
        author: 'AI Agent'
      });
      
      alert('تم حفظ المقال بنجاح في قاعدة البيانات.');
      setTopic('');
      setKeywords('');
      setGeneratedContent('');
    } catch (err) {
      console.error(err);
      alert('فشل حفظ المقال.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Geo-Stamp Admin | AI Article Generator (Agent 4)</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">وكيل السيو (SEO Agent)</h1>
          <p className="text-slate-400">توليد المقالات ومتابعة زحف محركات البحث</p>
        </div>
        <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center border border-brand/20">
           <Sparkles className="text-brand w-8 h-8" />
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800 mb-8 pb-4">
        <button
          onClick={() => setActiveTab('writer')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${
            activeTab === 'writer' ? 'bg-brand text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          توليد المقالات
        </button>
        <button
          onClick={() => setActiveTab('crawls')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${
            activeTab === 'crawls' ? 'bg-brand text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-5 h-5" />
          متابعة الزحف
        </button>
        <button
          onClick={() => setActiveTab('indexing')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${
            activeTab === 'indexing' ? 'bg-brand text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Search className="w-5 h-5" />
          أدوات الفهرسة
        </button>
      </div>

      {activeTab === 'writer' ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">موضوع المقال <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: أهمية التوثيق بالصور في المشاريع الهندسية"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand transition-colors text-white text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">الكلمات المفتاحية (اختياري)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="مثال: التوثيق المرئي, كاميرا المهندس, إدارة المشاريع"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand transition-colors text-white text-right"
              />
            </div>
            
            <button
              onClick={generateArticle}
              disabled={!topic || isGenerating}
              className="w-full bg-brand text-slate-950 py-4 rounded-xl font-bold hover:bg-brand-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              توليد المقال بالذكاء الاصطناعي
            </button>
          </div>

          {/* Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col min-h-[500px]">
            <h3 className="text-lg font-bold text-white mb-4">المقال المولد:</h3>
            {generatedContent ? (
              <>
                <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-y-auto whitespace-pre-wrap text-slate-300 text-sm leading-relaxed text-right mb-4">
                  {generatedContent}
                </div>
                <button
                  onClick={saveToDatabase}
                  disabled={isSaving}
                  className="w-full bg-white text-slate-950 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  حفظ ونشر المقال
                </button>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                <p>قم بكتابة الموضوع واضغط على زر التوليد لرؤية النتيجة هنا</p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'crawls' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand" />
              سجل زحف العناكب (Bot Crawl Logs)
            </h3>
            <button 
              onClick={fetchCrawlLogs} 
              disabled={isFetchingLogs}
              className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors text-white disabled:opacity-50"
            >
              {isFetchingLogs ? 'جاري التحديث...' : 'تحديث القائمة'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-tr-lg">العنكبوت (Bot)</th>
                  <th className="px-4 py-3">الرابط المستهدف</th>
                  <th className="px-4 py-3 rounded-tl-lg">وقت الزيارة</th>
                </tr>
              </thead>
              <tbody>
                {crawlLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-b-lg">
                      {isFetchingLogs ? 'جاري تحميل السجلات...' : 'لا يوجد سجلات زحف حديثة.'}
                    </td>
                  </tr>
                ) : (
                  crawlLogs.map((log, i) => (
                    <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-brand">{log.bot}</td>
                      <td className="px-4 py-3 font-mono text-slate-300" dir="ltr">{log.url}</td>
                      <td className="px-4 py-3 text-slate-400" dir="ltr text-right">
                        {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500 text-center">يتم عرض أحدث 500 زيارة وتاريخ حديث.</p>
        </div>
      ) : activeTab === 'indexing' ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Link className="text-brand w-6 h-6" />
              روابط الأرشفة المباشرة
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              يقوم الخادم تلقائياً بإنشاء هذه الملفات وتحديثها فورياً بناءً على محتوى قاعدة البيانات (مثل المقالات الجديدة). 
              هذه الملفات جاهزة حالياً لتقرأها محركات البحث.
            </p>
            <div className="space-y-4">
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-brand transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText className="text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-white font-medium">خريطة الموقع (sitemap.xml)</span>
                </div>
                <span className="text-xs text-brand font-mono">/sitemap.xml</span>
              </a>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-brand transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText className="text-slate-400 group-hover:text-brand transition-colors" />
                  <span className="text-white font-medium">ملف التوجيه (robots.txt)</span>
                </div>
                <span className="text-xs text-brand font-mono">/robots.txt</span>
              </a>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="text-emerald-500 w-6 h-6" />
              الأرشفة الآمنة والمتوافقة (Safe SEO Indexing)
            </h3>
            
            <div className="p-4 bg-amber-950/30 border border-amber-500/20 rounded-xl text-amber-200 text-xs mb-6 space-y-2 leading-relaxed">
              <strong className="text-amber-400 block text-sm">💡 تنبيه توافقية محركات البحث (محدث لعام 2024-2026):</strong>
              <p>
                قامت شركة <strong>Google</strong> بإيقاف وإلغاء بروتوكول البنج التقليدي لخرائط المواقع 
                <code className="bg-slate-950 px-1 py-0.5 rounded text-red-400 font-mono text-[10px] mx-1">ping?sitemap=</code> 
                من خوادمها رسمياً لمكافحة السبام، وتبعها في ذلك محرك <strong>Bing</strong>.
              </p>
              <p>
                استمرار إرسال طلبات Ping متكررة عبر البرمجيات قد يؤدي إلى تصنيف خادمك كـ "ممرر لطلبات عشوائية" وتعريض الرابط لعقوبات الأرشفة.
              </p>
            </div>

            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              لتسريع الأرشفة بنسبة 100% وبطريقة رسمية آمنة دون أي مخاطر أو عقوبات، يرجى تتبع الخطوات الفعالة التالية:
            </p>

            <ul className="space-y-4 text-xs font-semibold text-slate-300">
              <li className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">1</span>
                <div>
                  <p className="font-bold text-white mb-1">الربط التلقائي بملف التوجيه (نشط ومثالي)</p>
                  <p className="text-slate-500 leading-normal">يحتوي ملف <code className="text-brand font-mono">robots.txt</code> الخاص بك على مسار الخريطة الفعلي. هذا يعني أن العناكب ستعثر عليه تلقائياً فور زيارتها للموقع.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</span>
                <div>
                  <p className="font-bold text-white mb-1">أداة مشرفي المواقع من جوجل (Google Search Console)</p>
                  <p className="text-slate-500 leading-normal">قم بإضافة موقعك وتأكيد ملكيته، ثم اذهب لقسم السايتماب وقدّم الرابط <code className="text-brand font-mono">https://geo-stamp-camera.vercel.app/sitemap.xml</code> يدوياً لمرة واحدة.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">3</span>
                <div>
                  <p className="font-bold text-white mb-1">أدوات مشرفي المواقع من بينج (Bing Webmaster Tools)</p>
                  <p className="text-slate-500 leading-normal">استخدم حسابك لرفع خريطة الموقع، مما يضمن أرشفة صفحاتك في محركات بحث Bing و Yahoo يدوياً وبصورة آمنة تماماً.</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={pingSearchEngines}
                disabled={isPinging}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPinging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                طلب فحص حالة توافقية الخادم وأرشفة السايتماب
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
