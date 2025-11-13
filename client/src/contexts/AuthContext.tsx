import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, firstName: string, lastName: string) {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase authentication is not configured');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Log user information
    console.log('User created successfully:');
    console.log('UUID:', userCredential.user.uid);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', userCredential.user.email);
    console.log('Display Name:', userCredential.user.displayName);
  }

  async function login(email: string, password: string) {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase authentication is not configured');
    }
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase authentication is not configured');
    }
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Log user information for Google sign-in
    console.log('User signed in with Google:');
    console.log('UUID:', userCredential.user.uid);
    console.log('Display Name:', userCredential.user.displayName);
    console.log('Email:', userCredential.user.email);
  }

  async function logout() {
    if (!auth || !isFirebaseConfigured) {
      throw new Error('Firebase authentication is not configured');
    }
    await signOut(auth);
  }

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Log current user info when auth state changes
      if (user) {
        console.log('Current user info:');
        console.log('UUID:', user.uid);
        console.log('Display Name:', user.displayName);
        console.log('Email:', user.email);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
