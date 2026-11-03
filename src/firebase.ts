import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as fbSignInWithPopup,
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

// @ts-ignore
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// @ts-ignore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// מבקש תמיד לבחור חשבון, שימושי כאשר כמה בני משפחה חולקים מכשיר/דפדפן
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  return fbSignInWithPopup(auth, googleProvider);
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
