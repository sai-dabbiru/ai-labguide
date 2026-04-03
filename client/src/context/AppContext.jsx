import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LABS, BADGES } from '../data/labs.js';
import { db, auth } from '../firebase.js';
import { 
  collection, doc, setDoc, getDoc, updateDoc, deleteDoc, 
  query, where, onSnapshot, serverTimestamp, getDocs 
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { 
      const parsedUser = JSON.parse(localStorage.getItem('adlc-user') || 'null'); 
      if (parsedUser && typeof parsedUser.id !== 'string') {
        localStorage.removeItem('adlc-user');
        return null;
      }
      return parsedUser;
    } catch { return null; }
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

  // Load from Firestore when user logs in
  useEffect(() => {
    if (!user || typeof user.id !== 'string') return;

    // Listen to scores
    const scoresRef = collection(db, 'users', user.id, 'scores');
    const unsubScores = onSnapshot(scoresRef, (snapshot) => {
      const s = {};
      snapshot.forEach(doc => {
        s[doc.id] = doc.data();
      });
      setScores(s);
    });

    // Listen to progress
    const progressRef = collection(db, 'users', user.id, 'progress');
    const unsubProgress = onSnapshot(progressRef, (snapshot) => {
      const p = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        Object.assign(p, data); // Progress is stored in a few docs to keep it thin
      });
      setProgress(p);
    });

    return () => {
      unsubScores();
      unsubProgress();
    };
  }, [user]);

  const login = async (username) => {
    console.info('🚀 Login sequence initiated for:', username);
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms));

    try {
      // 1. Firebase Auth
      console.info('🔐 Step 1: Authenticating anonymously...');
      const { user: authUser } = await signInAnonymously(auth);
      console.info('✅ Auth Success. UID:', authUser.uid);
      
      // 2. Check if user profile exists in Firestore (with timeout)
      const userRef = doc(db, 'users', authUser.uid);
      
      console.info('☁️ Step 2: Syncing cloud profile...');
      let userSnap;
      try {
        // We race the getDoc against a 5s timeout to prevent UI hanging
        userSnap = await Promise.race([
          getDoc(userRef),
          timeout(5000)
        ]);
        console.info('✅ Profile retrieved from cloud.');
      } catch (err) {
        console.warn('⚠️ Cloud sync timed out or failed. Falling back to local-first session.', err.message);
        // We proceed anyway to let the user in
      }
      
      let finishedUser;
      if (!userSnap?.exists?.()) {
        console.info('📝 Step 3: Creating new profile...');
        const now = new Date().toISOString();
        finishedUser = { id: authUser.uid, username, createdAt: now, totalXP: 0 };
        // setDoc will happen in background if offline
        setDoc(userRef, { ...finishedUser, createdAt: serverTimestamp() }, { merge: true })
          .catch(e => console.error('Background setDoc failed:', e));
      } else {
        const data = userSnap.data();
        console.info('📝 Step 3: Mapping existing profile...');
        finishedUser = { 
          ...data, 
          id: authUser.uid,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
        if (data.username !== username) {
          updateDoc(userRef, { username, updatedAt: serverTimestamp() })
            .catch(e => console.error('Background updateDoc failed:', e));
          finishedUser.username = username;
        }
      }
      
      // 4. Finalize State
      console.info('🎉 Step 4: Finalizing session. Redirecting...');
      localStorage.setItem('adlc-user', JSON.stringify(finishedUser));
      setUser(finishedUser);
      return finishedUser;
    } catch (e) {
      console.error('❌ Login sequence failed:', e);
      throw e;
    }
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
        // Group progress by 'key' prefix or just use a single 'general' doc
        const group = key.startsWith('cl-') ? 'checklist' : 'responses';
        const docRef = doc(db, 'users', user.id, 'progress', group);
        await setDoc(docRef, { [key]: value, updatedAt: serverTimestamp() }, { merge: true });
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

      // Debounced sync to Firestore
      if (user) {
        clearTimeout(scoreSyncTimers.current[`${labId}-${section}`]);
        scoreSyncTimers.current[`${labId}-${section}`] = setTimeout(async () => {
          try {
            const docRef = doc(db, 'users', user.id, 'scores', String(labId));
            await setDoc(docRef, { ...updated, updatedAt: serverTimestamp() }, { merge: true });
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
      try {
        const scoresRef = collection(db, 'users', user.id, 'scores');
        const qSnap = await getDocs(scoresRef);
        const deletes = qSnap.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletes);
      } catch (e) { console.error(e); }
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
