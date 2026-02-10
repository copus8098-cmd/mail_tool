
import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Sparkles, Copy, Check, Loader2, RotateCcw, Languages, MessageSquare, Coins, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { Language, Tone, Category, EmailResponse, User } from './types';
import { generateEmail } from './services/geminiService';
import { getStoredUser, saveUser, logUsage, addVisit } from './services/storageService';
import LanguageSelect from './components/LanguageSelect';
import ToneSelect from './components/ToneSelect';
import CategorySelect from './components/CategorySelect';
import Login from './components/Login';
import Pricing from './components/Pricing';
import Admin from './components/Admin';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [category, setCategory] = useState<Category>(Category.GENERAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    addVisit();
  }, []);

  const handleGenerate = async () => {
    if (!user) return;
    if (user.points < 30) {
      setShowPricing(true);
      setError("Insufficient points! Each email costs 30 points.");
      return;
    }
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const email = await generateEmail({ description, language, tone, category });
      setResult(email);
      
      // Deduct points
      const updatedUser = { ...user, points: user.points - 30 };
      setUser(updatedUser);
      saveUser(updatedUser);
      
      // Log for stats
      logUsage(user.email, language, tone, category);
    } catch (err) {
      setError('Failed to generate email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (points: number) => {
    if (!user) return;
    const updatedUser = { ...user, points: user.points + points };
    setUser(updatedUser);
    saveUser(updatedUser);
    setShowPricing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('promail_user');
    setUser(null);
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `Subject: ${result.subject}\n\n${result.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDescription('');
    setResult(null);
    setError(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const isRtl = language === Language.ARABIC;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans">
      {showPricing && <Pricing onClose={() => setShowPricing(false)} onPurchase={handlePurchase} />}
      {showAdmin && <Admin onClose={() => setShowAdmin(false)} />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              ProMail AI
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm shadow-indigo-50">
              <Coins className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700">{user.points}</span>
              <button 
                onClick={() => setShowPricing(true)}
                className="ml-1 p-1 hover:bg-white rounded-full transition-colors text-indigo-600"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <button
                  onClick={() => setShowAdmin(true)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
              )}
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">{user.email}</span>
                <button onClick={handleLogout} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1">
                  Logout <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
              <MessageSquare className="w-5 h-5" />
              <h2>Email Configuration</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <LanguageSelect value={language} onChange={setLanguage} />
              <ToneSelect value={tone} onChange={setTone} />
              <CategorySelect value={category} onChange={setCategory} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Message Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Ask my boss for a 30% raise based on my performance..."
                className="w-full h-40 rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 transition-all text-sm outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                className="w-full group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Generate (30 pts)
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100">
             <div className="flex items-center gap-2 mb-3">
               <Coins className="w-5 h-5" />
               <span className="font-bold text-sm uppercase tracking-widest">Rewards System</span>
             </div>
             <p className="text-indigo-50 text-sm leading-relaxed mb-4">
               Get 100 free points every single day. Points expire at midnight, so use them or lose them!
             </p>
             <button 
               onClick={() => setShowPricing(true)}
               className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 rounded-xl text-xs transition-colors"
             >
               Need more points?
             </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
                    title="Start Over"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      copied ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className={`p-10 space-y-8 flex-grow overflow-auto custom-scrollbar ${isRtl ? 'rtl text-right' : ''}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Subject Line</span>
                  <p className="text-xl font-bold text-slate-900 leading-tight">
                    {result.subject}
                  </p>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                  {result.body}
                </div>
              </div>
              <div className="p-5 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">
                Generated with AI Excellence &bull; 30 points deducted
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 space-y-6 border-dashed border-2">
              <div className="relative">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                  {loading ? <Loader2 className="w-12 h-12 animate-spin text-indigo-400" /> : <Mail className="w-12 h-12" />}
                </div>
                {!loading && <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-indigo-100 animate-pulse" />}
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to write?</h3>
                <p className="text-slate-500 leading-relaxed">Your professional email will materialize here once you hit the generate button. We use advanced Gemini models to ensure perfection.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in zoom-in-95">
              <div className="w-8 h-8 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold">!</div>
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 pt-12 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-slate-500">
          <div className="md:col-span-1">
             <div className="flex items-center gap-2 mb-4">
                <div className="bg-slate-900 p-1.5 rounded-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">ProMail AI</span>
             </div>
             <p className="leading-relaxed">The next generation of professional correspondence powered by state-of-the-art artificial intelligence.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Capabilities</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-indigo-500" /> Multi-lingual generation</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-indigo-500" /> Context-aware tone</li>
              <li className="flex items-center gap-2"><Check className="w-3 h-3 text-indigo-500" /> Professional formatting</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Points System</h4>
            <ul className="space-y-2">
              <li>100 points daily free</li>
              <li>30 points per generation</li>
              <li>Buy points via PayPal/Crypto</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Support</h4>
            <p>Need help with your account or points? Contact our professional support team at support@promail.ai</p>
          </div>
        </div>
        <div className="mt-16 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em] pb-8">
          &copy; {new Date().getFullYear()} ProMail AI Systems &bull; Built for Professionals
        </div>
      </footer>
    </div>
  );
};

export default App;
