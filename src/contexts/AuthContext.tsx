import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, auth } from '@/lib/firebase/config';
import { UserService } from '@/services/userService';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'agent' | 'user';
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              phone: profile.phone,
              profileImage: profile.profileImage
            });
          } else {
            // Create basic profile if it doesn't exist
            const basicProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'user' as const,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              phone: '',
              profileImage: firebaseUser.photoURL || ''
            };
            await UserService.createProfile(basicProfile);
            setUserProfile(basicProfile);
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
      await signInWithEmail(email, password);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: 'user' | 'agent') => {
    try {
      setError(null);
      const result = await signUpWithEmail(email, password);
      
      // Create user profile with role
      const profile = {
        uid: result.user.uid,
        email: result.user.email || email,
        displayName: `${firstName} ${lastName}`,
        role,
        firstName,
        lastName,
        phone: '',
        profileImage: result.user.photoURL || ''
      };
      
      await UserService.createProfile(profile);
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message || 'Google sign in failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut();
      setUserProfile(null);
    } catch (error: any) {
      setError(error.message || 'Logout failed');
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
    isRegularUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
