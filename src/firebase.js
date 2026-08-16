import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Export Auth instance
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 3. Initialize Firestore with dynamic cache configuration (uses IndexedDB, falls back to memory on error)
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    cache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  console.warn("IndexedDB persistent cache failed to initialize, falling back to memory cache:", e);
  firestoreDb = initializeFirestore(app, {
    cache: memoryLocalCache(),
  });
}

export const db = firestoreDb;

