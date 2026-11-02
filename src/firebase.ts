import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * הגדרות Firebase.
 * כאשר תסנכרנו את הפרויקט ל-AI Studio / Firebase Studio, החליפו את הערכים
 * למטה בערכים האמיתיים של פרויקט ה-Firebase שלכם (מסך Project settings ב-Firebase Console),
 * או הגדירו אותם כמשתני סביבה (ראו .env.example).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
// מבקש תמיד לבחור חשבון, שימושי כאשר כמה בני משפחה חולקים מכשיר/דפדפן
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOut() {
  return firebaseSignOut(auth);
}
