import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithRedirect, 
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, provider } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isRedirecting, setIsRedirecting] = useState(false);

  // Google Sign In redirect handler
  const loginWithGoogle = async () => {
    try {
      setIsRedirecting(true);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google redirect:', error);
      setIsRedirecting(false);
      throw error;
    }
  };

  // Sign Out handler
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    // If Firebase isn't configured, turn off loading state to allow Guest/Demo mode
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
      console.warn("Firebase credentials missing from .env. Running in Offline/Demo Mode.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Resolve redirect result
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user && isMounted) {
          setCurrentUser(result.user);
        }
      } catch (error) {
        console.error("Error resolving redirect result: ", error);
      } finally {
        if (isMounted) {
          // Verify actual auth state change
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (isMounted) {
              setCurrentUser(user);
              setLoading(false);
            }
          });
          return unsubscribe;
        }
      }
    };

    checkRedirect();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, isRedirecting, loginWithGoogle, logout }}>
      {loading || isRedirecting ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)'
        }}>
          Loading Tracker...
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
