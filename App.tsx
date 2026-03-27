
import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
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

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('theme', theme);

    const applyTheme = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) { root.classList.add('dark'); } else { root.classList.remove('dark'); }
      } else if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (theme === 'system') applyTheme(); };

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
    if (theme === 'light') return <Sun size={16} />;
    if (theme === 'dark') return <Moon size={16} />;
    return <Monitor size={16} />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 font-sans" dir="rtl">

      {/* Nav */}
      <nav className="border-b-2 border-[#0a0a0a] dark:border-slate-700 sticky top-0 z-50 bg-white dark:bg-[#0a0a0a] transition-colors">
        <div className="max-w-5xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <span className="font-serif font-black text-[22px] tracking-tight text-[#0a0a0a] dark:text-white">
            Kivun <span className="text-amber-600">⇄</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block font-mono text-[9px] font-semibold tracking-[2.5px] uppercase border-[1.5px] border-[#0a0a0a] dark:border-slate-500 px-2.5 py-1 text-[#0a0a0a] dark:text-slate-300">
              Emoji Ready
            </span>
            <button
              onClick={cycleTheme}
              title={theme === 'light' ? 'בהירה' : theme === 'dark' ? 'כהה' : 'מערכת'}
              className="w-8 h-8 border-[1.5px] border-[#0a0a0a] dark:border-slate-500 bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#0a0a0a] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              {getThemeIcon()}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="font-mono text-[11px] font-semibold tracking-[3px] text-amber-600 uppercase mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-[2px] bg-amber-600" />
              Smart BiDi Fixer
            </div>
            <h1 className="font-serif font-black text-6xl md:text-[80px] leading-[0.95] tracking-tight text-[#0a0a0a] dark:text-white transition-colors">
              תיקון<br/>כיווניות
            </h1>
          </div>
          <p className="max-w-[280px] text-[13px] leading-[1.8] text-slate-500 dark:text-slate-400 border-r-2 border-amber-600 pr-4 transition-colors">
            תחנת עבודה לסידור טקסטים המשלבים עברית, אנגלית ואימוג'ים.
            האלגוריתם מתקן פיסוק ומשמר תווים מורכבים — בדיוק מקצועי.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <BidiFixer />

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <div className="py-7 px-6 md:border-l border-slate-200 dark:border-slate-800 transition-colors">
            <div className="text-xl mb-3">✦</div>
            <h3 className="font-serif font-bold text-base text-[#0a0a0a] dark:text-white mb-2 transition-colors">אופטימיזציית AI</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">תיקון מושלם לפלטים של מודלי שפה שסובלים מ״בלגן״ בפיסוק.</p>
          </div>
          <div className="py-7 px-6 md:border-l border-slate-200 dark:border-slate-800 border-t md:border-t-0 transition-colors">
            <div className="text-xl mb-3">😊</div>
            <h3 className="font-serif font-bold text-base text-[#0a0a0a] dark:text-white mb-2 transition-colors">תמיכה באימוג'ים</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">שימוש באיטרטורים מודרניים למניעת שבירת תווים מורכבים.</p>
          </div>
          <div className="py-7 px-6 border-t md:border-t-0 transition-colors">
            <div className="text-xl mb-3">❡</div>
            <h3 className="font-serif font-bold text-base text-[#0a0a0a] dark:text-white mb-2 transition-colors">שמירת עיצוב</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">הדגשות, רשימות ופורמטים נשמרים במדויק במהלך העיבוד.</p>
          </div>
        </div>
      </main>

      <GlobalStats />
    </div>
  );
}

export default App;
