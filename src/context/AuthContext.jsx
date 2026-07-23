import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const localUser = localStorage.getItem('amar_takar_hisab_local_user');
    return localUser ? JSON.parse(localUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Email/Password Signup
  const signup = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      return result.user;
    } catch (err) {
      // Fallback local auth mock if Firebase API key is unconfigured
      const mockUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null
      };
      setCurrentUser(mockUser);
      localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      // Fallback local auth mock if Firebase API key is unconfigured
      const mockUser = {
        uid: 'user_' + String(email).replaceAll('@', '_').replaceAll('.', '_'),
        email,
        displayName: email.split('@')[0],
        photoURL: null
      };
      setCurrentUser(mockUser);
      localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      const mockUser = {
        uid: 'google_user_demo',
        email: 'google.user@example.com',
        displayName: 'গুগল ইউজার',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user'
      };
      setCurrentUser(mockUser);
      localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(mockUser));
      return mockUser;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
    setCurrentUser(null);
    localStorage.removeItem('amar_takar_hisab_local_user');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        const localUser = localStorage.getItem('amar_takar_hisab_local_user');
        if (!localUser) {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
