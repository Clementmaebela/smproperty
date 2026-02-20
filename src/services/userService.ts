import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, getDocs, where, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { FirebaseStorage } from '@/lib/firebase/storage';
import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  role: 'admin' | 'agent' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  preferences: {
    emailNotifications: boolean;
    propertyAlerts: boolean;
    newsletter: boolean;
  };
}

export class UserService {
  private static readonly COLLECTION_NAME = 'users';

  static async createProfile(firebaseUser: FirebaseUser): Promise<UserProfile> {
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
      firstName: firebaseUser.displayName?.split(' ')[0] || '',
      lastName: firebaseUser.displayName?.split(' ')[1] || '',
      photoURL: firebaseUser.photoURL || '',
      phoneNumber: firebaseUser.phoneNumber || '',
      bio: '',
      location: '',
      website: '',
      company: '',
      jobTitle: '',
      role: 'user', // Default role for new users
      isActive: true, // Default active status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: firebaseUser.emailVerified || false,
      preferences: {
        emailNotifications: true,
        propertyAlerts: true,
        newsletter: false
      }
    };

    const userRef = doc(db, this.COLLECTION_NAME, firebaseUser.uid);
    await setDoc(userRef, userProfile);
    
    return userProfile;
  }

  static async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async uploadProfilePhoto(uid: string, file: File): Promise<string> {
    try {
      const fileName = `profile-photos/${uid}/${Date.now()}-${file.name}`;
      const photoURL = await FirebaseStorage.uploadImage(file, fileName);
      
      // Update user profile with new photo URL
      await this.updateProfile(uid, { photoURL });
      
      return photoURL;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }

  static async deleteProfilePhoto(uid: string): Promise<void> {
    try {
      const profile = await this.getProfile(uid);
      if (profile?.photoURL) {
        // Extract file path from URL
        const filePath = this.extractFilePathFromURL(profile.photoURL);
        if (filePath) {
          await FirebaseStorage.deleteImage(filePath);
        }
        
        // Remove photo URL from profile
        await this.updateProfile(uid, { photoURL: '' });
      }
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      throw error;
    }
  }

  static async updatePreferences(uid: string, preferences: Partial<UserProfile['preferences']>): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentProfile = userDoc.data() as UserProfile;
        await updateDoc(userRef, {
          preferences: {
            ...currentProfile.preferences,
            ...preferences
          },
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  private static extractFilePathFromURL(url: string): string | null {
    try {
      // Firebase Storage URLs have the format:
      // https://firebasestorage.googleapis.com/v0/b/bucket/o/path?alt=media&token=...
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/o/')[1];
      return path ? decodeURIComponent(path) : null;
    } catch (error) {
      console.error('Error extracting file path from URL:', error);
      return null;
    }
  }

  static async getUserProperties(uid: string): Promise<string[]> {
    try {
      // This would typically query properties where userId matches
      // For now, return empty array as we don't have user-specific properties yet
      return [];
    } catch (error) {
      console.error('Error getting user properties:', error);
      throw error;
    }
  }

  static async updateUserRole(uid: string, role: 'admin' | 'agent' | 'user'): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(userRef, {
        role,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  static async deactivateUser(uid: string): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, uid);
      await updateDoc(userRef, {
        isActive: false,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersRef = collection(db, this.COLLECTION_NAME);
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  static async getUsersByRole(role: 'admin' | 'agent' | 'user'): Promise<UserProfile[]> {
    try {
      const usersRef = collection(db, this.COLLECTION_NAME);
      const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }

  static async canAccessDashboard(uid: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(uid);
      if (!profile || !profile.isActive) {
        return false;
      }
      
      // Only admin and agent roles can access dashboard
      return profile.role === 'admin' || profile.role === 'agent';
    } catch (error) {
      console.error('Error checking dashboard access:', error);
      return false;
    }
  }

  static async canListProperties(uid: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(uid);
      if (!profile || !profile.isActive) {
        return false;
      }
      
      // Only admin and agent roles can list properties
      return profile.role === 'admin' || profile.role === 'agent';
    } catch (error) {
      console.error('Error checking property listing access:', error);
      return false;
    }
  }
}
