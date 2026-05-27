import { useState } from 'react';
import { MessageCircle, X, CheckCircle, Send, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingContactForm() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const isAr = language === 'ar';

  const t = {
    buttonTitle: isAr ? 'تواصل معنا' : 'Contact Us',
    formTitle: isAr ? 'اترك لنا رسالة' : 'Leave us a message',
    emailPlaceholder: isAr ? 'البريد الإلكتروني' : 'Email Address',
    messagePlaceholder: isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?',
    send: isAr ? 'إرسال' : 'Send',
    sending: isAr ? 'جاري الإرسال...' : 'Sending...',
    successTitle: isAr ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!',
    successDesc: isAr ? 'سنتواصل معك في أقرب وقت.' : 'We will get back to you shortly.',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;
    
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        // Reset form after closing animation
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
          setEmail('');
        }, 300);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originY: 1, originX: isAr ? 0 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-[90vw] sm:w-[360px] mb-4 overflow-hidden flex flex-col ${isAr ? 'self-start' : 'self-end'}`}
          >
            <div className="flex justify-between items-center bg-slate-800 px-5 py-4 border-b border-slate-700">
              <span className="font-bold text-white tracking-wide">{t.formTitle}</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
                aria-label="Close form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-brand mb-4 mx-auto" />
                    <h3 className="text-xl font-bold text-white mb-2">{t.successTitle}</h3>
                    <p className="text-slate-300">{t.successDesc}</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="flex flex-col gap-4"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all text-sm"
                      disabled={status === 'submitting'}
                    />
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.messagePlaceholder}
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none text-sm"
                      disabled={status === 'submitting'}
                    />
                    <button
                      type="submit"
                      disabled={status === 'submitting' || !message.trim() || !email.trim()}
                      className="w-full mt-2 bg-brand text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t.sending}</span>
                        </>
                      ) : (
                        <>
                          <span>{t.send}</span>
                          <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t.buttonTitle}
        className="bg-brand text-slate-950 p-4 rounded-full shadow-[0_4px_20px_rgba(198,255,0,0.3)] hover:shadow-[0_6px_25px_rgba(198,255,0,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
