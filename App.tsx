
import { useState, useEffect } from 'react';
import { Sparkles, FileText, SmilePlus, ArrowRightLeft, Sun, Moon, Monitor } from 'lucide-react';
import { BidiFixer } from './components/BidiFixer';
import { GlobalStats } from './components/GlobalStats';

type Theme = 'light' | 'dark' | 'system';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  // Apply theme class and listen for system changes
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('theme', theme);

    const applyTheme = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } else if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const getThemeTitle = () => {
    if (theme === 'light') return 'תאורה: בהירה';
    if (theme === 'dark') return 'תאורה: כהה';
    return 'תאורה: אוטומטי (לפי המערכת)';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30" dir="rtl">
      
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-500">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <ArrowRightLeft size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-500">Kivun</span>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={cycleTheme}
                title={getThemeTitle()}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors duration-300 flex items-center gap-2 justify-center"
              >
                {getThemeIcon()}
                <span className="text-xs font-medium hidden sm:inline-block">
                  {theme === 'light' ? 'תצוגה בהירה' : theme === 'dark' ? 'תצוגה כהה' : 'תצוגת מערכת'}
                </span>
              </button>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50 uppercase">
                <SmilePlus size={12} />
                Emoji Support Ready
              </div>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-3 mb-10 pt-8">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white transition-colors duration-500 tracking-tight">תיקון כיווניות חכם</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-500">
                      תחנת עבודה מקצועית לסידור טקסטים המשלבים עברית, אנגלית ואימוג'ים 🚀.
                      האלגוריתם מתקן את הפיסוק ומשמר את כל סוגי התווים המורכבים.
                  </p>
              </div>

              <BidiFixer />

              <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 grid md:grid-cols-3 gap-6 text-center transition-colors duration-500">
                  <div className="p-4 group">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                          <Sparkles size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-500">אופטימיזציית AI</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500 leading-relaxed">תיקון מושלם לפלטים של מודלי שפה שסובלים מ"בלגן" בפיסוק.</p>
                  </div>
                  <div className="p-4 group">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                          <SmilePlus size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-500">תמיכה באימוג'ים</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500 leading-relaxed">שימוש באיטרטורים מודרניים למניעת שבירת תווים מורכבים ואימוג'ים.</p>
                  </div>
                  <div className="p-4 group">
                      <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                          <FileText size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-500">שמירת עיצוב</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500 leading-relaxed">הדגשות, רשימות ופורמטים נשמרים במדויק במהלך העיבוד.</p>
                  </div>
              </div>
          </div>
      </main>
      
      {/* Global Stats Section */}
      <GlobalStats />
    </div>
  );
}

export default App;
