
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
              <HardDrive size={14} className="text-slate-400" />
              <span className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500">
                // {isOffline ? 'local stats — offline' : 'system stats — live data'}
              </span>
              {!isOffline && (
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-amber-600 tracking-wider">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                  Connected
                </span>
              )}
              {isOffline && (
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 tracking-wider">
                  <WifiOff size={10} /> Offline
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
                  <button
                    onClick={handleConfirmReset}
                    className="p-1.5 bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 border border-slate-300 dark:border-slate-600 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsResetting(true)}
                  className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-400 hover:text-red-500 border-[1.5px] border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-900/50 px-3 py-1.5 transition-colors"
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
                <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">total</span>
              </div>
              <div className="font-serif text-2xl font-black text-amber-600 tabular-nums">
                {stats.totalCharsAllTime.toLocaleString()}
              </div>
              <div className="font-mono text-[9px] text-slate-400 mt-1 tracking-wider">chars</div>
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
              <span className="text-slate-300 dark:text-slate-700">|</span>
              {isOffline
                ? <span className="flex items-center gap-1 text-slate-500"><WifiOff size={10} /> Local Fallback</span>
                : <span className="flex items-center gap-1 text-amber-600"><Wifi size={10} /> Cloud</span>
              }
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-5 px-6 md:px-10 flex justify-between items-center">
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
