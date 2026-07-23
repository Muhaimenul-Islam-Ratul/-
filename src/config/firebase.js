import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Config with user's official Firebase Console credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCGcZYT3GsOvqTD-tFvJxQfjj2ZE9R_sO4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "amar-takar-hisab.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "amar-takar-hisab",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "amar-takar-hisab.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1025024327191",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1025024327191:web:8b0724957eada9905a2652"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
