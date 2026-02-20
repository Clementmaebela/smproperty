import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, auth } from '@/lib/firebase/config';
import { UserService } from '@/services/userService';
import useRateLimit from '@/hooks/useRateLimit';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'agent' | 'user';
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, role: 'user' | 'agent') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  isAdmin: boolean;
  isAgent: boolean;
  isRegularUser: boolean;
  isLocked: boolean;
  remainingAttempts: number;
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
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkRateLimit, recordAttempt, isLocked, remainingAttempts } = useRateLimit();

  const isAdmin = userProfile?.role === 'admin';
  const isAgent = userProfile?.role === 'agent';
  const isRegularUser = userProfile?.role === 'user';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await UserService.getProfile(firebaseUser.uid);
          if (profile) {
            setUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || profile.displayName || '',
              role: profile.role || 'user',
              firstName: profile.firstName,
              lastName: profile.lastName,
              phoneNumber: profile.phoneNumber,
              photoURL: profile.photoURL
            });
          } else {
            // Create basic profile if it doesn't exist
            await UserService.createProfile(firebaseUser);
            
            // Set user profile with our interface
            const userProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'user' as const,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              photoURL: firebaseUser.photoURL || ''
            };
            setUserProfile(userProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError('Failed to load user profile');
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Check rate limiting
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        setError(rateLimit.error || 'Too many login attempts. Please try again later.');
        throw new Error(rateLimit.error || 'Too many login attempts. Please try again later.');
      }
      
      // Input validation
      if (!email || !password) {
        setError('Email and password are required');
        throw new Error('Email and password are required');
      }
      
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Please enter a valid email address');
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        throw new Error('Password must be at least 6 characters');
      }
      
      recordAttempt(true);
      await signInWithEmail(email, password);
    } catch (error: any) {
      recordAttempt(false);
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: 'user' | 'agent') => {
    try {
      setError(null);
      
      // Check rate limiting
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        setError(rateLimit.error || 'Too many sign up attempts. Please try again later.');
        throw new Error(rateLimit.error || 'Too many sign up attempts. Please try again later.');
      }
      
      // Input validation
      if (!email || !password || !firstName || !lastName) {
        setError('All fields are required');
        throw new Error('All fields are required');
      }
      
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Please enter a valid email address');
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        throw new Error('Password must be at least 6 characters');
      }
      
      if (firstName.length < 2 || lastName.length < 2) {
        setError('First and last name must be at least 2 characters');
        throw new Error('First and last name must be at least 2 characters');
      }
      
      recordAttempt(true);
      const result = await signUpWithEmail(email, password);
      
      // Create user profile with role using Firebase User
      await UserService.createProfile(result);
      
      // Set user profile with our interface
      const userProfile: UserProfile = {
        uid: result.uid,
        email: result.email || email,
        displayName: `${firstName} ${lastName}`,
        role,
        firstName,
        lastName,
        phoneNumber: '',
        photoURL: result.photoURL || ''
      };
    } catch (error: any) {
      recordAttempt(false);
      setError(error.message || 'Sign up failed');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      // Check rate limiting
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        setError(rateLimit.error || 'Too many login attempts. Please try again later.');
        throw new Error(rateLimit.error || 'Too many login attempts. Please try again later.');
      }
      
      recordAttempt(true);
      await signInWithGoogle();
    } catch (error: any) {
      recordAttempt(false);
      setError(error.message || 'Google sign in failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      recordAttempt(true);
      await signOut();
      setUserProfile(null);
    } catch (error: any) {
      recordAttempt(false);
      setError(error.message || 'Logout failed');
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    error,
    clearError,
    isAdmin,
    isAgent,
    isRegularUser,
    isLocked,
    remainingAttempts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
