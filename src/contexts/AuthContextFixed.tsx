import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, auth } from '@/lib/firebase/config';
import { UserService } from '@/services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Auth state changed:', firebaseUser?.email || 'No user');
      
      setUser(firebaseUser);
      
      // Create user profile in Firestore when user signs in
      if (firebaseUser && !initialized) {
        try {
          console.log('👤 Checking user profile...');
          const existingProfile = await UserService.getProfile(firebaseUser.uid);
          if (!existingProfile) {
            console.log('📝 Creating new user profile...');
            // Create profile if it doesn't exist
            await UserService.createProfile(firebaseUser);
            console.log('✅ User profile created successfully');
          } else {
            console.log('✅ User profile exists');
          }
        } catch (error) {
          console.error('❌ Error creating user profile:', error);
          // Don't throw error, just log it
        }
      }
      
      setLoading(false);
      setInitialized(true);
    });

    return () => {
      unsubscribe();
    };
  }, [initialized]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Attempting sign in...');
      await signInWithEmail(email, password);
      console.log('✅ Sign in successful');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Failed to sign in';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Account has been disabled';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Try again later';
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Authentication not configured. Please enable Email/Password authentication in Firebase Console.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 Attempting sign up...');
      await signUpWithEmail(email, password);
      console.log('✅ Sign up successful');
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Authentication not configured. Please enable Email/Password authentication in Firebase Console.';
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Attempting Google sign in...');
      await signInWithGoogle();
      console.log('✅ Google sign in successful');
    } catch (error: any) {
      console.error('❌ Google login error:', error);
      let errorMessage = 'Failed to sign in with Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked by browser';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled';
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚪 Attempting sign out...');
      await signOut();
      setUser(null);
      // Clear any stored user data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      console.log('✅ Sign out successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      setError('Failed to sign out');
      // Still clear user state even if logout fails
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
