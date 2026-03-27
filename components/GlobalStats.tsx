
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
    // Initial Load
    fetchStats();

    // Subscribe to updates (triggered by other components)
    const unsubscribe = statsService.subscribe(() => {
      fetchStats();
    });

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
    <div className="w-full mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isOffline ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                    <HardDrive size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-700 dark:text-slate-200">
                        {isOffline ? 'סטטיסטיקה מקומית (Offline)' : 'סטטיסטיקת מערכת (Azure Cloud)'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">Live_Data_Stream</p>
                </div>
            </div>
            
            {/* Reset Controls */}
            <div className="h-9 flex items-center">
                {isResetting ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right fade-in duration-300">
                        <input 
                            type="password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder={isOffline ? "הקלד: local-reset" : "סיסמת שרת..."}
                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-32 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirmReset()}
                        />
                        <button 
                            onClick={handleConfirmReset}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                            title="אשר איפוס"
                        >
                            <Check size={16} />
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors shadow-sm"
                            title="ביטול"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsResetting(true)}
                        className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-red-200 dark:hover:border-red-900/50 shadow-sm"
                        title="איפוס נתונים (מוגן בסיסמה)"
                    >
                        <ShieldCheck size={14} />
                        <span>Reset DB</span>
                    </button>
                )}
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* All Time Chars */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <div className="flex justify-between items-start mb-2">
                    <Database size={16} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">סה״כ תווים</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                    {stats.totalCharsAllTime.toLocaleString()}
                </div>
            </div>

            {/* Monthly Chars */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <div className="flex justify-between items-start mb-2">
                    <CalendarDays size={16} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">החודש</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                    {stats.totalCharsMonth.toLocaleString()}
                </div>
            </div>

            {/* Weekly Chars */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
                <div className="flex justify-between items-start mb-2">
                    <CalendarRange size={16} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">השבוע</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                    {stats.totalCharsWeek.toLocaleString()}
                </div>
            </div>

            {/* Replacements */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="flex justify-between items-start mb-2">
                    <RotateCcw size={16} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">החלפות</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                    {stats.totalReplacements.toLocaleString()}
                </div>
            </div>

            {/* Usage Count */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex justify-between items-start mb-2">
                    <Activity size={16} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">שימושים</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                    {stats.usageCount.toLocaleString()}
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center space-y-3">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-2">
                Last Updated: <span className="font-mono">{new Date(stats.lastUpdated).toLocaleString('he-IL')}</span> 
                <span className="text-slate-300">|</span>
                Status: 
                {isOffline ? (
                    <span className="text-slate-500 font-bold flex items-center gap-1"><WifiOff size={10} /> Local Fallback</span>
                ) : (
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><Wifi size={10} /> Connected to Cloud</span>
                )}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                תוכנה זו נוצרה ע״י <span className="font-bold text-slate-700 dark:text-slate-200">Amit Hacoon</span>
            </p>
        </div>

      </div>
    </div>
  );
};
