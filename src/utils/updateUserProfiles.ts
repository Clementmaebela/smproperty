import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// This script updates existing user profiles to include role field
export const updateUserProfiles = async () => {
  try {
    console.log('Updating existing user profiles...');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    let updatedCount = 0;
    
    // Update each user profile to include role field
    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();
      
      // Only update if role field doesn't exist
      if (!userData.role) {
        await updateDoc(userDoc.ref, {
          role: 'user', // Default existing users to 'user' role
          isActive: true,
          updatedAt: new Date().toISOString()
        });
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} user profiles with role field`);
    console.log('User profiles updated successfully!');
    
  } catch (error) {
    console.error('Error updating user profiles:', error);
    throw error;
  }
};

// Run this function to update existing profiles
if (typeof window !== 'undefined') {
  // Add a button to the page to run this update
  (window as any).updateUserProfiles = updateUserProfiles;
  
  console.log('User profile update script loaded. Run updateUserProfiles() in browser console to update existing profiles.');
}
