// hooks/useAuth.js
'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Set up Firebase auth listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Get additional user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const fullUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                ...userData
              };
              
              setUser(fullUserData);
              localStorage.setItem('user', JSON.stringify(fullUserData));
            } else {
              // Create user document if it doesn't exist
              const userData = {
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                email: firebaseUser.email,
                country: 'unknown',
                learningGoals: 'Improve English skills',
                subscriptionType: 'free',
                createdAt: new Date(),
                stats: {
                  grammarMistakesFixed: 0,
                  wordsLearned: 0,
                  callsCompleted: 0,
                  totalPracticeTime: 0,
                  currentStreak: 0,
                  conversationsCompleted: 0
                }
              };
              
              await setDoc(doc(db, 'users', firebaseUser.uid), userData);
              
              const fullUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                ...userData
              };
              
              setUser(fullUserData);
              localStorage.setItem('user', JSON.stringify(fullUserData));
            }
          } else {
            // User signed out
            setUser(null);
            localStorage.removeItem('user');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signup = async (email, password, userData) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(firebaseUser, {
        displayName: userData.name
      });

      // Save to Firestore
      const userDocData = {
        name: userData.name,
        email: email,
        country: userData.country,
        learningGoals: userData.learningGoals,
        subscriptionType: 'free',
        createdAt: new Date(),
        stats: {
          grammarMistakesFixed: 0,
          wordsLearned: 0,
          callsCompleted: 0,
          totalPracticeTime: 0,
          currentStreak: 0,
          conversationsCompleted: 0
        }
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

      // Save to local storage
      const fullUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData.name,
        ...userDocData
      };
      
      setUser(fullUserData);
      localStorage.setItem('user', JSON.stringify(fullUserData));

      return firebaseUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      const fullUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        ...userData
      };
      
      setUser(fullUserData);
      localStorage.setItem('user', JSON.stringify(fullUserData));

      return firebaseUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserStats = async (updates) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      
      // Update local storage
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  const value = {
    user,
    signup,
    login,
    logout,
    updateUserStats,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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