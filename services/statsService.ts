
export interface GlobalStatsData {
  totalCharsAllTime: number;
  totalCharsMonth: number;
  totalCharsWeek: number;
  totalReplacements: number;
  usageCount: number;
  lastUpdated: string;
  weekId: string;
  monthId: string;
}

const API_BASE_URL = '/api/stats'; 
const STORAGE_KEY = 'kivun_global_stats_fallback';
const EVENT_KEY = 'kivun_stats_updated';

// Helper to get local data structure
const getLocalStats = (): GlobalStatsData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const now = new Date();
  return {
    totalCharsAllTime: 0,
    totalCharsMonth: 0,
    totalCharsWeek: 0,
    totalReplacements: 0,
    usageCount: 0,
    lastUpdated: now.toISOString(),
    weekId: '',
    monthId: '',
  };
};

const saveLocalStats = (stats: GlobalStatsData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const statsService = {
  // Fetch stats (Try Cloud -> Fallback to Local)
  getStats: async (): Promise<{ data: GlobalStatsData; isOffline: boolean }> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return { data, isOffline: false };
    } catch (e) {
      // Fallback to local storage if API is unreachable (e.g., local dev without proxy)
      return { data: getLocalStats(), isOffline: true };
    }
  },

  // Update stats (Try Cloud -> Fallback to Local)
  updateStats: async (charsDelta: number, replacementsDelta: number) => {
    let updated = false;

    // 1. Try Cloud Update
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chars: charsDelta, replacements: replacementsDelta })
        });
        if (response.ok) updated = true;
    } catch (e) {
        // Silent fail for cloud
    }

    // 2. If Cloud failed (or just to keep local sync), update Local Storage logic
    // Note: If cloud succeeded, we don't strictly *need* to update local, 
    // but updating local serves as a cache or offline mirror.
    // However, if cloud works, we rely on cloud as source of truth.
    // If cloud FAILED, we MUST update local to show progress.
    if (!updated) {
        const stats = getLocalStats();
        stats.totalCharsAllTime += charsDelta;
        stats.totalCharsMonth += charsDelta; // Naive local logic
        stats.totalCharsWeek += charsDelta; // Naive local logic
        stats.totalReplacements += replacementsDelta;
        stats.usageCount += 1;
        stats.lastUpdated = new Date().toISOString();
        saveLocalStats(stats);
    }
    
    // Notify UI
    window.dispatchEvent(new Event(EVENT_KEY));
  },

  // Reset (Try Cloud -> Fallback to Local)
  resetStats: async (password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (response.ok) {
            window.dispatchEvent(new Event(EVENT_KEY));
            return true;
        }
    } catch (e) {
        // If offline, we allow clearing local storage if they type "local-reset"
        // to avoid having a hardcoded admin password in the client code.
        if (password === 'local-reset') {
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new Event(EVENT_KEY));
            return true;
        }
    }
    return false;
  },

  subscribe: (callback: () => void) => {
    window.addEventListener(EVENT_KEY, callback);
    return () => window.removeEventListener(EVENT_KEY, callback);
  }
};
