import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBeagKLEmglcnFdTnVS0IG7H47SKlxf_jQ",
  authDomain: "interactive-lab-guide-adlc.firebaseapp.com",
  projectId: "interactive-lab-guide-adlc",
  storageBucket: "interactive-lab-guide-adlc.firebasestorage.app",
  messagingSenderId: "166396263114",
  appId: "1:166396263114:web:2a615236dd1063e0911233"
};

const app = initializeApp(firebaseConfig);
// Enable auto-detect long-polling for maximum connectivity resilience
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
const auth = getAuth(app);

export { db, auth };
export default app;
