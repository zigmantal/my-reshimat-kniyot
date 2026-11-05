import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as fbSignInWithPopup,
  signInWithCredential,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Environment variables take highest priority (for GitHub repo deployments).
// Falls back to local firebase-applet-config.json when running in AI Studio.
const localConfigFiles = import.meta.glob<{ default: Record<string, string> }>(
  '../firebase-applet-config.json',
  { eager: true }
);
const localConfig = localConfigFiles['../firebase-applet-config.json']?.default || {};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || '',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || '',
  firestoreDatabaseId:
    import.meta.env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || '(default)',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// מבקש תמיד לבחור חשבון, שימושי כאשר כמה בני משפחה חולקים מכשיר/דפדפן
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * כניסה דרך חלון קופץ (signInWithPopup) של Firebase.
 * עובד היטב ב-Chrome/Edge/Firefox על מחשב, אבל לא אמין בדפדפני iOS
 * (Safari/Chrome/כל דפדפן ב-iOS משתמש במנוע WebKit) בגלל חלוקת
 * אחסון (storage partitioning) בין הדומיין של האפליקציה לדומיין
 * ה-Auth של Firebase (*.firebaseapp.com). לכן זו רק חלופת גיבוי —
 * ראו signInWithGoogleIdToken לכניסה הראשית, שמתאימה גם ל-iOS.
 */
export async function signInWithGoogle() {
  return fbSignInWithPopup(auth, googleProvider);
}

/**
 * כניסה עם ID token שהתקבל מ-Google Identity Services (GSI) בצד הלקוח.
 * זרימה זו לא תלויה בחלון קופץ/redirect חוצה-דומיינים, ולכן אמינה
 * הרבה יותר בדפדפני iOS (ראו src/screens/LoginScreen.tsx).
 */
export async function signInWithGoogleIdToken(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export async function signOut() {
  return fbSignOut(auth);
}

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  onAuthStateChanged,
};
