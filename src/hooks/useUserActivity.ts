import { useState, useEffect } from 'react';
import { doc, collection, getDoc, getDocs, addDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  image: string;
  status: string;
  views: number;
  inquiries: number;
  featured?: boolean;
  createdAt: string;
}

interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  userId: string;
}

// Hook for user favorites
export const useUserFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const favoritesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        setFavorites(favoritesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addToFavorites = async (property: Property) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, 'favorites'), {
        ...property,
        userId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    if (!userId) return;

    try {
      const favoriteRef = doc(db, 'favorites', propertyId);
      await deleteDoc(favoriteRef);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites
  };
};

// Hook for user inquiries
export const useUserInquiries = (userId?: string) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setInquiries([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'inquiries'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const inquiriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Inquiry[];
        setInquiries(inquiriesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching inquiries:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const createInquiry = async (propertyId: string, propertyTitle: string, message: string) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, 'inquiries'), {
        propertyId,
        propertyTitle,
        message,
        status: 'pending',
        userId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating inquiry:', error);
    }
  };

  return {
    inquiries,
    loading,
    createInquiry
  };
};

// Hook for user statistics
export const useUserStats = (userId?: string) => {
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalInquiries: 0,
    totalViews: 0,
    memberSince: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setStats({
        totalFavorites: 0,
        totalInquiries: 0,
        totalViews: 0,
        memberSince: ''
      });
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Get favorites count
        const favoritesSnapshot = await getDocs(
          query(collection(db, 'favorites'), where('userId', '==', userId))
        );

        // Get inquiries count
        const inquiriesSnapshot = await getDocs(
          query(collection(db, 'inquiries'), where('userId', '==', userId))
        );

        // Get user profile for member since date
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        setStats({
          totalFavorites: favoritesSnapshot.size,
          totalInquiries: inquiriesSnapshot.size,
          totalViews: 0, // Calculate from favorites if needed
          memberSince: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return {
    stats,
    loading
  };
};
