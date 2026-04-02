import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LABS, BADGES } from '../data/labs.js';

const API = '/api';
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adlc-user') || 'null'); } catch { return null; }
  });
  const [scores, setScores] = useState({});
  const [progress, setProgress] = useState({});
  const [theme, setTheme] = useState(() => localStorage.getItem('adlc-theme') || 'dark');
  const [toast, setToast] = useState({ visible: false, xp: '', msg: '' });

  // Debounce ref for score syncing
  const scoreSyncTimers = useRef({});

  // Apply theme
  useEffect(() => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('adlc-theme', theme);
  }, [theme]);

  // Load from server when user logs in
  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${API}/scores/${user.id}`).then(r => r.json()),
      fetch(`${API}/progress/${user.id}`).then(r => r.json()),
    ]).then(([s, p]) => {
      setScores(s);
      setProgress(p);
    }).catch(console.error);
  }, [user]);

  const login = async (username) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const u = await res.json();
    localStorage.setItem('adlc-user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('adlc-user');
    setUser(null); setScores({}); setProgress({});
  };

  const showToast = useCallback((xp, msg) => {
    setToast({ visible: true, xp, msg });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2600);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // ── Progress (checks, reflections, fill-ins) ──────────────────────────────
  const setProgressKey = useCallback(async (key, value) => {
    setProgress(prev => ({ ...prev, [key]: value }));
    if (user) {
      try {
        await fetch(`${API}/progress/${user.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: String(value) }),
        });
      } catch (e) { console.error('Progress sync failed', e); }
    }
  }, [user]);

  const toggleCheck = useCallback(async (key) => {
    const next = !progress[key];
    setProgressKey(key, next ? '1' : '');
  }, [progress, setProgressKey]);

  const saveReflection = useCallback((key, val) => {
    setProgressKey(key, val);
  }, [setProgressKey]);

  const saveFillIn = useCallback((key, val) => {
    setProgressKey(key, val);
  }, [setProgressKey]);

  // ── Auto-Scoring ──────────────────────────────────────────────────────────
  // Components report their scores via this function.
  // section: 'pre' | 'post' | 'exercises' | 'bonus'
  const updateAutoScore = useCallback((labId, section, earnedPoints) => {
    setScores(prev => {
      const old = prev[labId] || { pre: 0, ex: 0, post: 0, bonus: 0, total: 0 };
      const updated = { ...old, [section]: earnedPoints };
      updated.total = (updated.pre || 0) + (updated.ex || 0) + (updated.post || 0) + (updated.bonus || 0);

      // Only sync if value actually changed
      if (old[section] === earnedPoints) return prev;

      const next = { ...prev, [labId]: updated };

      // Debounced sync to server
      if (user) {
        clearTimeout(scoreSyncTimers.current[`${labId}-${section}`]);
        scoreSyncTimers.current[`${labId}-${section}`] = setTimeout(async () => {
          try {
            await fetch(`${API}/scores/${user.id}/${labId}`, {
              method: 'PUT', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            });
          } catch (e) { console.error('Score sync failed', e); }
        }, 500);
      }

      return next;
    });
  }, [user]);

  const resetScores = useCallback(async () => {
    if (!window.confirm('Reset all scores? This will clear all auto-scored progress too.')) return;
    setScores({});
    if (user) {
      try { await fetch(`${API}/scores/${user.id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    }
  }, [user]);

  const claimBonus = useCallback((labId) => {
    const s = scores[labId] || { pre: 0, ex: 0, post: 0, bonus: 0 };
    if (s.bonus >= 30) { showToast('', 'Bonus already claimed!'); return; }
    updateAutoScore(labId, 'bonus', 30);
    showToast('+30 XP', 'Bonus claimed!');
  }, [scores, updateAutoScore, showToast]);

  // ── Computed stats ────────────────────────────────────────────────────────
  const computeStats = () => {
    let xp = 0, labsDone = 0, bonusCount = 0;
    LABS.forEach(lab => {
      const s = scores[lab.id] || {};
      xp += (s.total || 0);
      if ((s.total || 0) >= Math.floor(lab.base * 0.5)) labsDone++;
      if ((s.bonus || 0) > 0) bonusCount++;
    });
    let badge = null;
    for (let i = BADGES.length - 1; i >= 0; i--) {
      if (xp >= BADGES[i].xp) { badge = BADGES[i]; break; }
    }
    return { xp, labsDone, bonusCount, badge };
  };

  const stats = computeStats();

  return (
    <AppContext.Provider value={{
      user, login, logout,
      scores, updateAutoScore, resetScores, claimBonus,
      progress, toggleCheck, saveReflection, saveFillIn,
      theme, toggleTheme,
      toast, showToast,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
