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
import { auth } from '@/lib/firebase';
import { createSquareUser, getSquareCustomer } from '@/lib/squareUser';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ squareError?: string }>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ squareError?: string }>;
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

  async function signup(email: string, password: string, firstName: string, lastName: string): Promise<{ squareError?: string }> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    const fullName = `${firstName} ${lastName}`;
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    // Log user information
    console.log('User created successfully:');
    console.log('UUID:', userCredential.user.uid);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', userCredential.user.email);
    console.log('Display Name:', userCredential.user.displayName);

    // Try to create Square customer (critical for checkout)
    // Backend handles both Square creation and database storage
    try {
      const squareCustomerId = await createSquareUser(
        userCredential.user.uid,
        fullName,
        email
      );
      
      console.log('Square customer created and saved:', squareCustomerId);
      return {};
    } catch (error: any) {
      console.error('Error creating Square customer during signup:', error);
      return { squareError: 'Payment system setup incomplete. You can still use the app, but may need to retry before checkout.' };
    }
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Call loginUser function to retrieve and log user ID
    const loginUserUrl = import.meta.env.VITE_FIREBASE_LOGIN_USER_URL || 'https://us-central1-pizza-shop-3afe9.cloudfunctions.net/loginUser';
    try {
      const loginResponse = await fetch(loginUserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid
        }),
      });
      
      const loginData = await loginResponse.json();
      console.log('🔐 Login User Response:', loginData);
    } catch (error) {
      console.error('Error calling loginUser function:', error);
    }
    
    // Try to reconcile Square customer if missing (recovery mechanism)
    try {
      const existingCustomer = await getSquareCustomer(userCredential.user.uid);
      
      if (!existingCustomer && userCredential.user.email) {
        console.log('Square customer missing, attempting to create during login...');
        
        const userName = userCredential.user.displayName || 
                        (userCredential.user.email ? userCredential.user.email.split('@')[0] : 'Customer');
        
        await createSquareUser(
          userCredential.user.uid,
          userName,
          userCredential.user.email
        );
        
        console.log('Square customer created during login recovery');
      } else if (!existingCustomer && !userCredential.user.email) {
        console.warn('Cannot create Square customer: no email available for user', userCredential.user.uid);
      }
    } catch (error) {
      console.error('Error reconciling Square customer during login:', error);
    }
  }

  async function loginWithGoogle(): Promise<{ squareError?: string }> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Call loginUser function to retrieve and log user ID
    const loginUserUrl = import.meta.env.VITE_FIREBASE_LOGIN_USER_URL || 'https://us-central1-pizza-shop-3afe9.cloudfunctions.net/loginUser';
    try {
      const loginResponse = await fetch(loginUserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid
        }),
      });
      
      const loginData = await loginResponse.json();
      console.log('🔐 Login User Response (Google):', loginData);
    } catch (error) {
      console.error('Error calling loginUser function:', error);
    }
    
    // Log user information for Google sign-in
    console.log('User signed in with Google:');
    console.log('UUID:', userCredential.user.uid);
    console.log('Display Name:', userCredential.user.displayName);
    console.log('Email:', userCredential.user.email);

    // Check if Square customer already exists
    let existingCustomer;
    try {
      existingCustomer = await getSquareCustomer(userCredential.user.uid);
    } catch (error) {
      console.error('Error fetching existing Square customer:', error);
    }
    
    if (!existingCustomer) {
      // Try to create Square customer for new Google sign-up
      // Backend handles both Square creation and database storage
      try {
        const squareCustomerId = await createSquareUser(
          userCredential.user.uid,
          userCredential.user.displayName || 'User',
          userCredential.user.email || ''
        );
        
        console.log('Square customer created and saved for Google user:', squareCustomerId);
        return {};
      } catch (error: any) {
        console.error('Error creating Square customer for Google user:', error);
        return { squareError: 'Payment system setup incomplete. You can still use the app, but may need to sign in again before checkout.' };
      }
    } else {
      console.log('Existing Square customer found:', existingCustomer.squareCustomerId);
      return {};
    }
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
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
