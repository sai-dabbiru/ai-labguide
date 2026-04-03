
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LABS, BADGES } from '../data/labs.js';
import { db, auth } from '../firebase.js';
import {
  collection, doc, setDoc, getDoc, deleteDoc,
  onSnapshot, serverTimestamp, getDocs
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
  const [progress, setProgress] = useState({});
  const [theme, setTheme] = useState(() => localStorage.getItem('adlc-theme') || 'dark');
  const [toast, setToast] = useState({ visible: false, xp: '', msg: '' });
  const [loading, setLoading] = useState(true);

  // Debounce ref for score syncing
  const scoreSyncTimers = useRef({});
  // Ref to access current user.id inside callbacks without stale closures
  const userIdRef = useRef(null);
  useEffect(() => { userIdRef.current = user?.id || null; }, [user]);

  // Apply theme
  useEffect(() => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('adlc-theme', theme);
  }, [theme]);


  // Track Firebase Auth state and restore app session from localStorage
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthReady(true);
      if (firebaseUser) {
        // Firebase session active — restore app session from localStorage if present
        const raw = localStorage.getItem('adlc-user');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.id) {
              setUser(parsed);
              setLoading(false);
              return;
            }
          } catch {}
        }
        // Firebase session active but user logged out of the app — show login
        setUser(null);
        setLoading(false);
      } else {
        // No Firebase session at all
        const raw = localStorage.getItem('adlc-user');
        if (raw) {
          // Re-acquire Firebase auth token so Firestore rules pass
          signInAnonymously(auth).catch(() => { setLoading(false); });
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    });
    return unsub;
  }, []);

  // Load from Firestore when user logs in and auth is ready
  useEffect(() => {
    if (!authReady) return;
    if (!user || typeof user.id !== 'string') {
      setLoading(false);
      return;
    }

    // Restore from localStorage cache immediately so the app is usable right away
    try {
      const cachedScores = localStorage.getItem(`adlc-scores-${user.id}`);
      if (cachedScores) setScores(JSON.parse(cachedScores));
    } catch {}
    try {
      const cachedProgress = localStorage.getItem(`adlc-progress-${user.id}`);
      if (cachedProgress) setProgress(JSON.parse(cachedProgress));
    } catch {}
    setLoading(false);

    // Also keep Firestore listeners running in the background to sync across devices
    const scoresRef = collection(db, 'users', user.id, 'scores');
    const unsubScores = onSnapshot(
      scoresRef,
      (snapshot) => {
        const s = {};
        snapshot.forEach(doc => { s[doc.id] = doc.data(); });
        if (Object.keys(s).length > 0) {
          setScores(s);
          try { localStorage.setItem(`adlc-scores-${user.id}`, JSON.stringify(s)); } catch {}
        }
      },
      (err) => { console.warn('Scores sync unavailable:', err.code); }
    );

    const progressRef = collection(db, 'users', user.id, 'progress');
    const unsubProgress = onSnapshot(
      progressRef,
      (snapshot) => {
        const p = {};
        snapshot.forEach(doc => { Object.assign(p, doc.data()); });
        if (Object.keys(p).length > 0) {
          setProgress(p);
          try { localStorage.setItem(`adlc-progress-${user.id}`, JSON.stringify(p)); } catch {}
        }
      },
      (err) => { console.warn('Progress sync unavailable:', err.code); }
    );

    return () => {
      unsubScores();
      unsubProgress();
    };
  }, [user, authReady]);

  const login = async (username) => {
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms));
    try {
      // Firebase anonymous auth — only needed to satisfy Firestore security rules
      await signInAnonymously(auth);

      // Username IS the stable Firestore document ID — same on every device/session
      const userRef = doc(db, 'users', username);
      let userSnap;
      try {
        userSnap = await Promise.race([getDoc(userRef), timeout(5000)]);
      } catch (err) {
        console.warn('Cloud sync timed out, proceeding local-first:', err.message);
      }

      let finishedUser;
      if (!userSnap?.exists?.()) {
        // Brand new user
        const now = new Date().toISOString();
        finishedUser = { id: username, username, createdAt: now, totalXP: 0 };
        setDoc(userRef, { ...finishedUser, createdAt: serverTimestamp() }, { merge: true })
          .catch(e => console.warn('Background setDoc failed:', e));
      } else {
        // Returning user — restore their profile
        const data = userSnap.data();
        finishedUser = {
          ...data,
          id: username,
          username,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      }

      localStorage.setItem('adlc-user', JSON.stringify(finishedUser));
      setUser(finishedUser);
      return finishedUser;
    } catch (e) {
      console.error('Login failed:', e);
      throw e;
    }
  };

  const logout = () => {
    // Keep scores/progress cache — it's keyed by username so different users never collide,
    // and same user gets instant data restore on next login
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
    setProgress(prev => {
      const next = { ...prev, [key]: value };
      const uid = userIdRef.current;
      if (uid) {
        try { localStorage.setItem(`adlc-progress-${uid}`, JSON.stringify(next)); } catch {}
      }
      return next;
    });
    if (user) {
      try {
        const group = key.startsWith('cl-') ? 'checklist' : 'responses';
        const docRef = doc(db, 'users', user.id, 'progress', group);
        await setDoc(docRef, { [key]: value, username: user.username, updatedAt: serverTimestamp() }, { merge: true });
      } catch (e) { console.warn('Progress Firestore sync failed', e); }
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
  // Reset all scores for the current user
  const resetScores = useCallback(async () => {
    if (!user || !user.id) return;
    // Clear localStorage cache
    try {
      localStorage.removeItem(`adlc-scores-${user.id}`);
      localStorage.removeItem(`adlc-progress-${user.id}`);
    } catch {}
    try {
      const scoresRef = collection(db, 'users', user.id, 'scores');
      const snapshot = await getDocs(scoresRef);
      const batchDeletes = [];
      snapshot.forEach((docSnap) => { batchDeletes.push(deleteDoc(docSnap.ref)); });
      await Promise.all(batchDeletes);
    } catch (e) {
      console.warn('Failed to reset scores in Firestore:', e);
    }
    setScores({});
    setProgress({});
    showToast('', 'All progress reset!');
  }, [user, showToast]);
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

      // Save to localStorage immediately
      const uid = userIdRef.current;
      if (uid) {
        try { localStorage.setItem(`adlc-scores-${uid}`, JSON.stringify(next)); } catch {}
      }

      // Debounced sync to Firestore
      if (user) {
        clearTimeout(scoreSyncTimers.current[`${labId}-${section}`]);
        scoreSyncTimers.current[`${labId}-${section}`] = setTimeout(async () => {
          try {
            const docRef = doc(db, 'users', user.id, 'scores', String(labId));
            await setDoc(docRef, { ...updated, updatedAt: serverTimestamp() }, { merge: true });
          } catch (e) { console.warn('Score Firestore sync failed', e); }
        }, 500);
      }

      return next;
    });
  }, [user]);

  const claimBonus = useCallback((labId) => {
    const s = scores[labId] || { pre: 0, ex: 0, post: 0, bonus: 0 };
    if (s.bonus >= 30) { showToast('', 'Bonus already claimed!'); return; }
    updateAutoScore(labId, 'bonus', 30);
    showToast('+30 XP', 'Bonus claimed!');
  }, [scores, updateAutoScore, showToast]);

  // ── Computed stats ────────────────────────────────────────────────────────
  const computeStats = () => {
    console.log('computeStats: LABS=', LABS, 'BADGES=', BADGES);
    let xp = 0, labsDone = 0, bonusCount = 0;
    if (!LABS) { console.error('LABS is undefined'); return { xp: 0, labsDone: 0, bonusCount: 0, badge: null }; }
    LABS.forEach(lab => {
      const s = scores[lab.id] || {};
      xp += (s.total || 0);
      if ((s.total || 0) >= Math.floor(lab.base * 0.5)) labsDone++;
      if ((s.bonus || 0) > 0) bonusCount++;
    });
    let badge = null;
    if (!BADGES) { console.error('BADGES is undefined'); return { xp, labsDone, bonusCount, badge }; }
    for (let i = BADGES.length - 1; i >= 0; i--) {
      if (xp >= BADGES[i].xp) { badge = BADGES[i]; break; }
    }
    return { xp, labsDone, bonusCount, badge };
  };

  try {
    const stats = computeStats();
    return (
      <AppContext.Provider value={{
        user, login, logout,
        scores, updateAutoScore, resetScores, claimBonus,
        progress, toggleCheck, saveReflection, saveFillIn,
        theme, toggleTheme,
        toast, showToast,
        stats,
        loading,
      }}>
        {children}
      </AppContext.Provider>
    );
  } catch (err) {
    console.error('AppProvider Crash Error:', err);
    return <div>Error loading application: {err.message}</div>;
  }
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
