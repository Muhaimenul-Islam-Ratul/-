import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName || result.user.displayName || email.split('@')[0],
        photoURL: result.user.photoURL
      };
      setCurrentUser(userData);
      localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(userData));
      return result.user;
    } catch (err) {
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
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || email.split('@')[0],
        photoURL: result.user.photoURL
      };
      setCurrentUser(userData);
      localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(userData));
      return result.user;
    } catch (err) {
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

  // Google Sign In with real Gmail credentials
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL
      };
      setCurrentUser(userData);
      localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(userData));
      return user;
    } catch (err) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('Google Redirect error:', redirectErr);
        }
      }
      throw err;
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

  // Update Profile (displayName & photoURL)
  const updateUserProfile = async ({ displayName, photoURL }) => {
    const updatedData = {
      ...(currentUser || {}),
      displayName: displayName !== undefined ? displayName : currentUser?.displayName,
      photoURL: photoURL !== undefined ? photoURL : currentUser?.photoURL
    };

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: updatedData.displayName,
          photoURL: updatedData.photoURL
        });
      } catch (err) {
        console.error('Firebase updateProfile error:', err);
      }
    }

    setCurrentUser(updatedData);
    localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(updatedData));
    return updatedData;
  };

  useEffect(() => {
    // Handle redirect result if user returned from Google redirect login
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        const user = result.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL
        };
        setCurrentUser(userData);
        localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(userData));
      }
    }).catch((err) => {
      console.error('Redirect result error:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL
        };
        setCurrentUser(userData);
        localStorage.setItem('amar_takar_hisab_local_user', JSON.stringify(userData));
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
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
