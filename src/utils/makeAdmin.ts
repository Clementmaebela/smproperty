import { doc, updateDoc, getDocs, collection, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Utility to make a user admin by email
export const makeUserAdmin = async (email: string) => {
  try {
    console.log(`Making user ${email} an admin...`);
    
    // Find user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('User not found with email:', email);
      return { success: false, message: 'User not found' };
    }
    
    // Update the first matching user to admin
    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      role: 'admin',
      isActive: true,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Successfully made ${email} an admin!`);
    return { success: true, message: 'User is now admin' };
    
  } catch (error) {
    console.error('Error making user admin:', error);
    return { success: false, message: 'Failed to update user role' };
  }
};

// Utility to make a user agent by email
export const makeUserAgent = async (email: string) => {
  try {
    console.log(`Making user ${email} an agent...`);
    
    // Find user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('User not found with email:', email);
      return { success: false, message: 'User not found' };
    }
    
    // Update the first matching user to agent
    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      role: 'agent',
      isActive: true,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Successfully made ${email} an agent!`);
    return { success: true, message: 'User is now agent' };
    
  } catch (error) {
    console.error('Error making user agent:', error);
    return { success: false, message: 'Failed to update user role' };
  }
};

// Get current user's role
export const getCurrentUserRole = async (uid: string) => {
  try {
    const userDoc = await doc(db, 'users', uid);
    const userSnap = await getDoc(userDoc);
    
    if (userSnap.exists()) {
      return userSnap.data()?.role || 'user';
    }
    
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};
