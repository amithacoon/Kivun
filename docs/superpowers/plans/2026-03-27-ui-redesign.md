# Kivun UI Redesign — Typography Facelift

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Kivun from generic blue Tailwind app into an editorial B&W + Amber tool with strong typography and the ⇄ signature symbol.

**Architecture:** CSS-only transformation — same React component structure, same state logic, same API. Change Tailwind classes, fonts, and color palette. No new dependencies besides Google Fonts.

**Tech Stack:** React, Tailwind CSS (CDN), Google Fonts (Playfair Display, IBM Plex Mono, Inter)

**Design reference:** `.superpowers/brainstorm/41886-1774630978/content/final-mockup.html`

---

### Task 1: Foundation — Fonts & Tailwind Config

**Files:**
- Modify: `index.html`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Update Google Fonts in index.html**

Replace the Heebo/JetBrains Mono font link with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update inline Tailwind config in index.html**

Replace the `tailwind.config` script block:

```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        amber: {
          600: '#D97706',
          700: '#B45309',
        },
        ink: '#0a0a0a',
      },
    },
  },
}
```

- [ ] **Step 3: Update body styles in index.html**

Replace the `<style>` block — update font-family references:

```css
body { font-family: 'Inter', sans-serif; }
code, pre { font-family: 'IBM Plex Mono', monospace; }
```

Update `<body>` class — remove slate-50 background for white:

```html
<body class="bg-white dark:bg-ink text-ink dark:text-slate-100 antialiased transition-colors duration-300">
```

- [ ] **Step 4: Update tailwind.config.js to match**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        amber: {
          600: '#D97706',
          700: '#B45309',
        },
        ink: '#0a0a0a',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Commit**

```bash
git add index.html tailwind.config.js
git commit -m "feat(ui): update fonts and tailwind config for editorial redesign"
```

---

### Task 2: App.tsx — Nav, Hero, Features

**Files:**
- Modify: `App.tsx`

Key changes:
- Nav: Playfair logo "Kivun ⇄", square badge, 2px bottom border
- Hero: 64-80px Playfair title, amber eyebrow, description with amber right border
- Features: 3-col grid with border dividers instead of cards
- Remove all blue/emerald/purple colors → B&W + amber
- Remove all rounded-xl/2xl → square or minimal rounding

- [ ] **Step 1: Rewrite App.tsx**

Full replacement — the component structure stays the same (BidiFixer + GlobalStats), but all Tailwind classes change:

```tsx
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
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` (or check if already running)
Open: `http://localhost:3000`
Expected: Black/white nav with "Kivun ⇄", large serif title, editorial layout

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat(ui): redesign App.tsx — editorial nav, hero, features"
```

---

### Task 3: BidiFixer.tsx — Editor, Button, Output, Copy

**Files:**
- Modify: `components/BidiFixer.tsx`

Key changes:
- Section labels: mono uppercase `// INPUT — MIXED TEXT`
- Editor borders: 1.5px solid black, no radius
- Output: amber left border accent
- Main button: full black, mono uppercase, ⇄ amber icon
- Copy buttons: black primary, outlined secondary, all square
- Stats dashboard: serif numbers, mono labels
- Fact card: editorial style with amber accent

- [ ] **Step 1: Rewrite BidiFixer.tsx**

Full replacement — same state logic, same handlers, new Tailwind classes:

```tsx
import React, { useState, useRef } from 'react';
import {
  Check, Eraser, Eye, EyeOff, ClipboardCopy, Wand2, BarChart3,
  Zap, ArrowRightLeft, Hash, HelpCircle, Globe2, Cpu, Monitor
} from 'lucide-react';
import { statsService } from '../services/statsService';
import {
    LANGUAGE_FACTS,
    getWordFriendlyHtml,
    getHebrewOfficeHtml,
    processContent,
    FixStats
} from '../utils/bidiProcessor';

export const BidiFixer: React.FC = () => {
  const [outputText, setOutputText] = useState<string>('');
  const [outputRichHtml, setOutputRichHtml] = useState<string>('');
  const [stats, setStats] = useState<FixStats | null>(null);
  const [activeFact, setActiveFact] = useState<typeof LANGUAGE_FACTS[0] | null>(null);
  const [copied, setCopied] = useState<'rich' | 'rich-heb' | 'plain' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRawInput, setShowRawInput] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'formatted'>('formatted');

  const inputRef = useRef<HTMLDivElement>(null);
  const outputFormattedRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);

  const handleInput = () => {
      if (inputRef.current) setCharCount(inputRef.current.innerText.length);
  };

  const handleFix = () => {
    const currentHtml = inputRef.current?.innerHTML || '';
    const plainText = inputRef.current?.innerText || '';
    if (plainText.length > 10000) {
        alert('הטקסט ארוך מדי. אנא הגבל את הקלט ל-10,000 תווים.');
        return;
    }
    setIsProcessing(true);
    const randomFact = LANGUAGE_FACTS[Math.floor(Math.random() * LANGUAGE_FACTS.length)];
    setTimeout(() => {
        const result = processContent(currentHtml);
        statsService.updateStats(result.stats.totalChars, result.stats.replaced + result.stats.anchored).catch(console.error);
        setOutputText(result.text);
        setOutputRichHtml(result.html);
        setStats(result.stats);
        setActiveFact(randomFact);
        setViewMode('formatted');
        setIsProcessing(false);
    }, 400);
  };

  const handleCopyRich = async () => {
    try {
        const richContent = outputFormattedRef.current?.innerHTML || outputRichHtml;
        const wordHtml = getWordFriendlyHtml(richContent);
        await navigator.clipboard.write([new ClipboardItem({
            'text/html': new Blob([wordHtml], { type: 'text/html' }),
            'text/plain': new Blob([outputText], { type: 'text/plain' }),
        })]);
        setCopied('rich');
        setTimeout(() => setCopied(null), 2000);
    } catch { handleCopyPlain(); }
  };

  const handleCopyRichHebrew = async () => {
    try {
        const richContent = outputFormattedRef.current?.innerHTML || outputRichHtml;
        const wordHtml = getHebrewOfficeHtml(richContent);
        await navigator.clipboard.write([new ClipboardItem({
            'text/html': new Blob([wordHtml], { type: 'text/html' }),
            'text/plain': new Blob([outputText], { type: 'text/plain' }),
        })]);
        setCopied('rich-heb');
        setTimeout(() => setCopied(null), 2000);
    } catch { alert("העתקה נכשלה"); }
  };

  const handleCopyPlain = () => {
    navigator.clipboard.writeText(outputText);
    setCopied('plain');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-0 max-w-4xl mx-auto pb-20 overflow-x-hidden">

      {/* INPUT LABEL */}
      <div className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
        <span>// input — mixed text</span>
        <div className="flex gap-4">
          <button onClick={() => setShowRawInput(!showRawInput)} className="text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1.5">
            {showRawInput ? <EyeOff size={12} /> : <Eye size={12} />} {showRawInput ? 'NORMAL' : 'RAW'}
          </button>
          <button onClick={() => {if(inputRef.current) inputRef.current.innerHTML = ''; setOutputText(''); setOutputRichHtml(''); setStats(null); setActiveFact(null); setCharCount(0);}} className="text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors">
            <Eraser size={12} /> CLEAR
          </button>
        </div>
      </div>

      {/* INPUT EDITOR */}
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        className="editor-content border-[1.5px] border-[#0a0a0a] dark:border-slate-600 min-h-[160px] p-5 text-base leading-[1.75] text-[#0a0a0a] dark:text-slate-200 focus:outline-none max-h-[400px] overflow-y-auto bg-white dark:bg-[#0a0a0a] transition-colors"
        dir={showRawInput ? "ltr" : "rtl"}
        style={{ textAlign: showRawInput ? 'left' : 'right', minHeight: '160px' }}
        spellCheck={false}
      />

      {/* CHAR COUNT */}
      <div className="flex justify-end py-1.5">
        <span className={`font-mono text-[10px] tracking-wider ${charCount > 10000 ? 'text-red-500 font-bold' : 'text-slate-300 dark:text-slate-600'}`}>
          {charCount.toLocaleString()} / 10,000
        </span>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-center py-5">
        <button
          onClick={handleFix}
          disabled={isProcessing}
          className="bg-[#0a0a0a] dark:bg-white hover:bg-[#1a1a1a] dark:hover:bg-slate-100 text-white dark:text-[#0a0a0a] px-12 py-4 font-mono text-xs font-semibold tracking-[3px] uppercase flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="animate-spin text-base">⌛</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-600 text-lg">⇄</span>
          )}
          Fix Hebrew Direction
        </button>
      </div>

      {/* OUTPUT LABEL */}
      <div className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
        <span>// output — processed</span>
        <div className="flex">
          <button
            onClick={() => setViewMode('formatted')}
            className={`font-mono text-[10px] font-semibold tracking-[2px] px-3 py-1 border border-slate-200 dark:border-slate-700 transition-colors ${viewMode === 'formatted' ? 'bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] border-[#0a0a0a] dark:border-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            FORMATTED
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`font-mono text-[10px] font-semibold tracking-[2px] px-3 py-1 border border-slate-200 dark:border-slate-700 border-r-0 transition-colors ${viewMode === 'raw' ? 'bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] border-[#0a0a0a] dark:border-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            UNICODE RAW
          </button>
        </div>
      </div>

      {/* OUTPUT AREA */}
      <div className="border-[1.5px] border-[#0a0a0a] dark:border-slate-600 border-r-4 border-r-amber-600 min-h-[160px] relative bg-white dark:bg-[#0a0a0a] transition-colors">
        {viewMode === 'raw' ? (
          <div className="p-5 font-mono text-sm text-slate-500 dark:text-slate-400 min-h-[160px] max-h-[400px] whitespace-pre-wrap overflow-auto select-all bg-slate-50/50 dark:bg-[#111] transition-colors" dir="ltr">
            {outputText}
          </div>
        ) : (
          <div
            ref={outputFormattedRef}
            contentEditable
            className="p-6 text-[#0a0a0a] dark:text-slate-100 text-lg leading-[1.75] min-h-[160px] max-h-[400px] overflow-y-auto focus:outline-none transition-colors"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: outputRichHtml }}
          />
        )}
        {!outputRichHtml && !outputText && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700 pointer-events-none">
            <span className="italic font-mono text-xs tracking-wider">הטקסט המיוצב יופיע כאן</span>
          </div>
        )}
      </div>

      {/* COPY BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <div className="flex-[2] flex flex-col gap-2">
          <button
            onClick={handleCopyRich}
            disabled={!outputRichHtml && !outputText}
            className={`w-full flex items-center justify-center gap-3 py-4 font-mono text-[10px] font-semibold tracking-[2px] uppercase transition-all active:scale-[0.98] disabled:opacity-30 ${copied === 'rich' ? 'bg-amber-600 text-white' : 'bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:bg-[#1a1a1a] dark:hover:bg-slate-100'}`}
          >
            {copied === 'rich' ? <Check size={16} /> : <span className="text-amber-600 dark:text-amber-600 text-base">⇄</span>}
            {copied === 'rich' ? 'Copied!' : 'Copy to Word'}
          </button>
          <button
            onClick={handleCopyRichHebrew}
            disabled={!outputRichHtml && !outputText}
            className={`w-full flex items-center justify-center gap-2 py-2 font-mono text-[10px] font-semibold tracking-[1.5px] border-[1.5px] border-slate-200 dark:border-slate-700 hover:border-amber-600 dark:hover:border-amber-600 text-slate-400 hover:text-amber-600 transition-all active:scale-[0.98] disabled:opacity-30 bg-white dark:bg-[#0a0a0a]`}
          >
            {copied === 'rich-heb' ? <Check size={12} className="text-amber-600" /> : <Monitor size={12} />}
            {copied === 'rich-heb' ? 'Copied!' : 'Hebrew Office (Bold Fix)'}
          </button>
        </div>
        <button
          onClick={handleCopyPlain}
          disabled={!outputText}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-mono text-[10px] font-semibold tracking-[2px] uppercase border-[1.5px] transition-all active:scale-[0.98] disabled:opacity-30 ${copied === 'plain' ? 'border-amber-600 text-amber-600 bg-amber-50 dark:bg-amber-900/10' : 'border-[#0a0a0a] dark:border-slate-600 text-[#0a0a0a] dark:text-slate-300 bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-slate-900'}`}
        >
          {copied === 'plain' ? <Check size={16} /> : <ClipboardCopy size={16} />}
          Plain Text
        </button>
      </div>

      {/* STATS DASHBOARD */}
      <div className={`transition-all duration-500 overflow-hidden ${stats ? 'max-h-[1200px] opacity-100 mt-10' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="space-y-0">

          {/* Analysis Header */}
          <div className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500 py-3 border-t-2 border-[#0a0a0a] dark:border-slate-600 flex justify-between items-center transition-colors">
            <span className="flex items-center gap-2"><BarChart3 size={12} /> // processing report</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-r border-slate-200 dark:border-slate-800">
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <Hash size={18} className="text-slate-300 dark:text-slate-600 mb-2" />
              <span className="block font-serif text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight transition-colors">{stats?.totalChars || 0}</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">chars processed</span>
            </div>
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <ArrowRightLeft size={18} className="text-amber-600 mb-2" />
              <span className="block font-serif text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight transition-colors">{stats?.replaced || 0}</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">replacements</span>
            </div>
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <Zap size={18} className="text-amber-600 mb-2" />
              <span className="block font-serif text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight transition-colors">{stats?.anchored || 0}</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">anchors</span>
            </div>
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <span className="block font-serif text-3xl font-black text-amber-600 tracking-tight">{(stats?.interventionRate || 0).toFixed(1)}%</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400 mt-5 block">readability</span>
            </div>
          </div>

          {/* Fact Card */}
          {activeFact && (
            <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-5 items-center md:items-start relative overflow-hidden mt-4 transition-colors">
              <div className="bg-[#0a0a0a] dark:bg-white p-3 text-white dark:text-[#0a0a0a] shrink-0">
                <HelpCircle size={24} />
              </div>
              <div className="space-y-2 text-center md:text-right">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h4 className="font-serif font-bold text-[#0a0a0a] dark:text-white transition-colors">הידעת?</h4>
                  <span className="text-amber-600 font-mono text-[9px] font-semibold tracking-[2px] uppercase border border-amber-600/30 px-2 py-0.5">
                    {activeFact.title}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl transition-colors">
                  {activeFact.content}
                </p>
              </div>
              <div className="absolute -left-4 -bottom-4 opacity-[0.03] rotate-12 pointer-events-none">
                <Globe2 size={100} />
              </div>
            </div>
          )}

          <div className="flex justify-center items-center gap-2 opacity-20 py-8">
            <div className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
            <Cpu size={14} className="text-slate-400 dark:text-slate-600" />
            <div className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify in browser**

Expected: Square editorial editor, black action button with ⇄, amber-bordered output, mono labels

- [ ] **Step 3: Commit**

```bash
git add components/BidiFixer.tsx
git commit -m "feat(ui): redesign BidiFixer — editorial editor, buttons, stats"
```

---

### Task 4: GlobalStats.tsx — Stats Grid & Footer

**Files:**
- Modify: `components/GlobalStats.tsx`

Key changes:
- Header with mono label + amber "Connected" dot
- 5-column stats: serif numbers, mono labels, amber first stat
- Footer: black bar, white logo, amber credit
- Remove all rounded/shadow/colored backgrounds

- [ ] **Step 1: Rewrite GlobalStats.tsx**

```tsx
import React, { useEffect, useState } from 'react';
import {
  Activity, CalendarDays, CalendarRange, Database,
  RotateCcw, ShieldCheck, HardDrive, Check, X, Loader2, Wifi, WifiOff
} from 'lucide-react';
import { statsService, GlobalStatsData } from '../services/statsService';

export const GlobalStats: React.FC = () => {
  const [stats, setStats] = useState<GlobalStatsData | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const { data, isOffline } = await statsService.getStats();
    setStats(data);
    setIsOffline(isOffline);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    const unsubscribe = statsService.subscribe(() => { fetchStats(); });
    return unsubscribe;
  }, []);

  const handleConfirmReset = async () => {
    if (!passwordInput.trim()) return;
    setLoading(true);
    const success = await statsService.resetStats(passwordInput);
    if (success) {
      await fetchStats();
      alert(isOffline ? "הנתונים המקומיים אופסו." : "הנתונים אופסו בהצלחה בשרת.");
      setIsResetting(false);
      setPasswordInput('');
    } else {
      alert("סיסמה שגויה או שגיאת שרת.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsResetting(false);
    setPasswordInput('');
  };

  if (loading && !stats) {
    return (
      <div className="w-full mt-20 py-12 flex justify-center text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full">
      {/* Stats Section */}
      <div className="border-t-2 border-[#0a0a0a] dark:border-slate-600 transition-colors">
        <div className="max-w-4xl mx-auto px-6 md:px-10">

          {/* Header */}
          <div className="flex justify-between items-center py-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <HardDrive size={16} className="text-slate-400" />
              <span className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500">
                // {isOffline ? 'local stats — offline' : 'system stats — live data'}
              </span>
              {!isOffline && (
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-amber-600 tracking-wider">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                  Connected
                </span>
              )}
            </div>

            <div className="h-9 flex items-center">
              {isResetting ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={isOffline ? "local-reset" : "Password..."}
                    className="font-mono text-xs px-3 py-1.5 border-[1.5px] border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0a0a0a] text-[#0a0a0a] dark:text-slate-200 w-28 focus:outline-none focus:border-amber-600 transition-colors"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmReset()}
                  />
                  <button onClick={handleConfirmReset} className="p-1.5 bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <Check size={14} />
                  </button>
                  <button onClick={handleCancel} className="p-1.5 border border-slate-300 dark:border-slate-600 text-slate-500 hover:text-slate-700 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsResetting(true)}
                  className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-400 hover:text-red-500 border-[1.5px] border-slate-200 dark:border-slate-700 hover:border-red-300 px-3 py-1.5 transition-colors"
                >
                  <ShieldCheck size={12} />
                  Reset DB
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 border-r border-slate-200 dark:border-slate-800">
            <div className="p-5 border-l border-b md:border-b-0 border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Database size={14} className="text-slate-300 dark:text-slate-600" />
                <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">total chars</span>
              </div>
              <div className="font-serif text-2xl font-black text-amber-600 tabular-nums">
                {stats.totalCharsAllTime.toLocaleString()}
              </div>
            </div>
            <div className="p-5 border-l border-b md:border-b-0 border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <CalendarDays size={14} className="text-slate-300 dark:text-slate-600" />
                <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">month</span>
              </div>
              <div className="font-serif text-2xl font-black text-[#0a0a0a] dark:text-white tabular-nums transition-colors">
                {stats.totalCharsMonth.toLocaleString()}
              </div>
            </div>
            <div className="p-5 border-l border-b md:border-b-0 border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <CalendarRange size={14} className="text-slate-300 dark:text-slate-600" />
                <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">week</span>
              </div>
              <div className="font-serif text-2xl font-black text-[#0a0a0a] dark:text-white tabular-nums transition-colors">
                {stats.totalCharsWeek.toLocaleString()}
              </div>
            </div>
            <div className="p-5 border-l border-b md:border-b-0 border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <RotateCcw size={14} className="text-slate-300 dark:text-slate-600" />
                <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">replacements</span>
              </div>
              <div className="font-serif text-2xl font-black text-[#0a0a0a] dark:text-white tabular-nums transition-colors">
                {stats.totalReplacements.toLocaleString()}
              </div>
            </div>
            <div className="p-5 border-l border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Activity size={14} className="text-slate-300 dark:text-slate-600" />
                <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">uses</span>
              </div>
              <div className="font-serif text-2xl font-black text-[#0a0a0a] dark:text-white tabular-nums transition-colors">
                {stats.usageCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="py-4 border-t border-slate-200 dark:border-slate-800 flex justify-center transition-colors">
            <p className="font-mono text-[10px] text-slate-400 flex items-center gap-2 tracking-wider">
              Updated: <span>{new Date(stats.lastUpdated).toLocaleString('he-IL')}</span>
              <span className="text-slate-300">|</span>
              {isOffline ? (
                <span className="flex items-center gap-1 text-slate-500"><WifiOff size={10} /> Offline</span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600"><Wifi size={10} /> Cloud</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t-2 border-[#0a0a0a] py-5 px-6 md:px-10 flex justify-between items-center">
        <span className="font-serif font-black text-base text-white">
          Kivun <span className="text-amber-600">⇄</span>
        </span>
        <span className="font-mono text-[10px] tracking-[2px] text-slate-500">
          Created by <span className="text-amber-600">Amit Hacoon</span>
        </span>
      </footer>
    </div>
  );
};
```

- [ ] **Step 2: Verify in browser**

Expected: Editorial stats grid with serif numbers, amber first stat, black footer with "Kivun ⇄" and amber credit

- [ ] **Step 3: Test dark mode toggle**

Click theme toggle. Expected:
- Light: white bg, black text, black borders
- Dark: `#0a0a0a` bg, white text, slate borders
- Amber stays `#D97706` in both modes

- [ ] **Step 4: Commit**

```bash
git add components/GlobalStats.tsx
git commit -m "feat(ui): redesign GlobalStats — editorial stats grid, black footer"
```

---

### Task 5: Final Polish & Verification

- [ ] **Step 1: Test full flow**

1. Open `http://localhost:3000`
2. Paste mixed Hebrew/English text with emojis into input
3. Click "Fix Hebrew Direction"
4. Verify output renders correctly with amber border
5. Test all 3 copy buttons
6. Verify stats dashboard appears
7. Verify global stats at bottom

- [ ] **Step 2: Test responsive (mobile)**

Resize to 375px width. Verify:
- Nav: logo + theme button visible
- Hero: title stacks vertically
- Editor: full width
- Copy buttons: stack vertically
- Stats: 2-column grid

- [ ] **Step 3: Add .superpowers to .gitignore**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Kivun UI redesign — editorial typography facelift"
```
