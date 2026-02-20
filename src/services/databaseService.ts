import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp,
  runTransaction,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Types
export interface Property {
  id?: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  priceFormatted: string;
  size: {
    landSize: string;
    buildingSize?: string;
    totalSize: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    garages?: number;
    parkingSpaces?: number;
    swimmingPool?: boolean;
    garden?: boolean;
    security?: boolean;
    electricity?: boolean;
    water?: boolean;
    internet?: boolean;
    phoneLine?: boolean;
  };
  propertyType: string;
  status: 'active' | 'sold' | 'pending' | 'rented';
  featured: boolean;
  images: string[];
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  views?: number;
  inquiries?: number;
  tags?: string[];
  amenities?: string[];
  zoning?: string;
  waterRights?: boolean;
  electricity?: boolean;
  roadAccess?: string;
  createdAt?: string;
  updatedAt?: string;
  listedDate?: string;
}

export interface User {
  id?: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'agent' | 'user';
  profileImage?: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    propertyAlerts: {
      newProperties: boolean;
      priceChanges: boolean;
      similarProperties: boolean;
    };
    savedSearches?: SavedSearch[];
  };
  savedProperties?: string[];
  viewedProperties?: string[];
  inquiries?: Inquiry[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Agent {
  id?: string;
  userId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  licenseNumber: string;
  agency: {
    name: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
  };
  specializations: string[];
  areas: string[];
  languages: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  properties: string[];
  isActive: boolean;
  bio?: string;
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Inquiry {
  id?: string;
  propertyId: string;
  userId: string;
  agentId: string;
  type: 'general' | 'viewing' | 'offer' | 'financing';
  message: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  preferredContact: 'email' | 'phone' | 'whatsapp';
  status: 'pending' | 'responded' | 'scheduled' | 'completed' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  responses?: InquiryResponse[];
  scheduledViewing?: {
    date: string;
    duration: number;
    status: 'scheduled' | 'completed' | 'cancelled';
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface InquiryResponse {
  message: string;
  responderId: string;
  responderType: 'agent' | 'system' | 'user';
  createdAt: string;
}

export interface Review {
  id?: string;
  propertyId: string;
  userId: string;
  agentId: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  verifiedPurchase: boolean;
  helpful?: number;
  status: 'pending' | 'approved' | 'rejected';
  response?: {
    message: string;
    responderId: string;
    createdAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedSearch {
  id?: string;
  userId: string;
  name: string;
  filters: {
    propertyType?: string[];
    province?: string[];
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    features?: string[];
    keywords?: string[];
  };
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  isActive: boolean;
  lastRun?: string;
  newPropertiesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyAnalytics {
  id?: string;
  propertyId: string;
  date: string;
  views: number;
  uniqueViews: number;
  inquiries: number;
  savedToFavorites: number;
  shares: number;
  averageViewDuration: number;
  bounceRate: number;
  sourceBreakdown: {
    search: number;
    featured: number;
    agent: number;
    direct: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  locationBreakdown: Record<string, number>;
  createdAt?: string;
}

export interface SystemSettings {
  id?: string;
  site: {
    name: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  features: {
    propertyAlerts: boolean;
    savedSearches: boolean;
    virtualTours: boolean;
    mortgageCalculator: boolean;
    propertyValuation: boolean;
    documentSigning: boolean;
  };
  pricing: {
    featuredListingFee: number;
    premiumListingFee: number;
    agentCommission: number;
  };
  maintenance: {
    mode: boolean;
    message: string;
  };
  updatedAt?: string;
}

// Properties Service
export class PropertiesService {
  static async getProperties(filters: any = {}, pagination: any = {}) {
    try {
      const propertiesRef = collection(db, 'properties');
      let q = query(propertiesRef);

      // Apply filters
      if (filters.propertyType) {
        q = query(q, where('propertyType', '==', filters.propertyType));
      }
      if (filters.province) {
        q = query(q, where('location.province', '==', filters.province));
      }
      if (filters.minPrice) {
        q = query(q, where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice) {
        q = query(q, where('price', '<=', filters.maxPrice));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.featured !== undefined) {
        q = query(q, where('featured', '==', filters.featured));
      }

      // Apply ordering
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply pagination
      if (pagination.limit) {
        q = query(q, limit(pagination.limit));
      }
      if (pagination.startAfter) {
        q = query(q, startAfter(pagination.startAfter));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  static async getProperty(id: string) {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Property;
      }
      return null;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  static async createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const propertiesRef = collection(db, 'properties');
      const docRef = await addDoc(propertiesRef, {
        ...property,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        inquiries: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  static async updateProperty(id: string, updates: Partial<Property>) {
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  static async deleteProperty(id: string) {
    try {
      const docRef = doc(db, 'properties', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  static async incrementPropertyViews(id: string) {
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        views: increment(1)
      } as any);
    } catch (error) {
      console.error('Error incrementing property views:', error);
      throw error;
    }
  }

  static async searchProperties(searchTerm: string) {
    try {
      const propertiesRef = collection(db, 'properties');
      const q = query(
        propertiesRef,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];

      // Client-side search for title, description, location
      return properties.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.tags && property.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  static async getFeaturedProperties(limit: number = 6) {
    try {
      console.log('🔍 Fetching featured properties...');
      const propertiesRef = collection(db, 'properties');
      
      // First try the featured query
      try {
        const q = query(
          propertiesRef,
          where('featured', '==', true),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(limit)
        );
        
        const querySnapshot = await getDocs(q);
        const featuredProperties = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        
        console.log(`✅ Found ${featuredProperties.length} featured properties`);
        
        // If no featured properties, return recent properties as fallback
        if (featuredProperties.length === 0) {
          console.log('⚠️ No featured properties found, returning recent properties as fallback');
          return this.getProperties({ limit, status: 'active' });
        }
        
        return featuredProperties;
      } catch (queryError) {
        console.error('❌ Featured query failed, trying fallback:', queryError);
        // Fallback to recent properties
        return this.getProperties({ limit, status: 'active' });
      }
    } catch (error) {
      console.error('❌ Error fetching featured properties:', error);
      // Return empty array as last resort
      return [];
    }
  }

  static async getPropertiesByAgent(agentId: string) {
    try {
      const propertiesRef = collection(db, 'properties');
      const q = query(
        propertiesRef,
        where('agent.id', '==', agentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching agent properties:', error);
      throw error;
    }
  }
}

// Users Service
export class UsersService {
  static async getUser(id: string) {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const usersRef = collection(db, 'users');
      const docRef = await addDoc(usersRef, {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        savedProperties: [],
        viewedProperties: [],
        inquiries: []
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, updates: Partial<User>) {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async saveProperty(userId: string, propertyId: string) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        savedProperties: arrayUnion(propertyId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  }

  static async unsaveProperty(userId: string, propertyId: string) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        savedProperties: arrayRemove(propertyId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error unsaving property:', error);
      throw error;
    }
  }

  static async addToViewedProperties(userId: string, propertyId: string) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        viewedProperties: arrayUnion(propertyId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding to viewed properties:', error);
      throw error;
    }
  }

  static async getSavedProperties(userId: string) {
    try {
      const userDoc = await this.getUser(userId);
      if (!userDoc?.savedProperties) return [];

      const properties = await Promise.all(
        userDoc.savedProperties.map(propertyId => 
          PropertiesService.getProperty(propertyId)
        )
      );

      return properties.filter(property => property !== null) as Property[];
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      throw error;
    }
  }
}

// Agents Service
export class AgentsService {
  static async getAgents(filters: any = {}) {
    try {
      const agentsRef = collection(db, 'agents');
      let q = query(agentsRef);

      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters.areas && filters.areas.length > 0) {
        q = query(q, where('areas', 'array-contains-any', filters.areas));
      }

      q = query(q, orderBy('rating', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agent[];
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  static async getAgent(id: string) {
    try {
      const docRef = doc(db, 'agents', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Agent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }
  }

  static async createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const agentsRef = collection(db, 'agents');
      const docRef = await addDoc(agentsRef, {
        ...agent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        properties: [],
        totalReviews: 0,
        rating: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  static async updateAgent(id: string, updates: Partial<Agent>) {
    try {
      const docRef = doc(db, 'agents', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }

  static async getTopAgents(limit: number = 6) {
    try {
      const agentsRef = collection(db, 'agents');
      const q = query(
        agentsRef,
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agent[];
    } catch (error) {
      console.error('Error fetching top agents:', error);
      throw error;
    }
  }
}

// Inquiries Service
export class InquiriesService {
  static async createInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const inquiriesRef = collection(db, 'inquiries');
      const docRef = await addDoc(inquiriesRef, {
        ...inquiry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        responses: []
      });

      // Increment property inquiries count
      await PropertiesService.updateProperty(inquiry.propertyId, {
        inquiries: increment(1)
      } as any);

      return docRef.id;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
  }

  static async getInquiries(filters: any = {}) {
    try {
      const inquiriesRef = collection(db, 'inquiries');
      let q = query(inquiriesRef);

      if (filters.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }
      if (filters.agentId) {
        q = query(q, where('agentId', '==', filters.agentId));
      }
      if (filters.propertyId) {
        q = query(q, where('propertyId', '==', filters.propertyId));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      throw error;
    }
  }

  static async updateInquiry(id: string, updates: Partial<Inquiry>) {
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating inquiry:', error);
      throw error;
    }
  }

  static async addInquiryResponse(inquiryId: string, response: Omit<InquiryResponse, 'createdAt'>) {
    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      await updateDoc(docRef, {
        responses: arrayUnion({
          ...response,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding inquiry response:', error);
      throw error;
    }
  }
}

// Reviews Service
export class ReviewsService {
  static async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const reviewsRef = collection(db, 'reviews');
      const docRef = await addDoc(reviewsRef, {
        ...review,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        helpful: 0
      });

      // Update agent rating
      await this.updateAgentRating(review.agentId);

      return docRef.id;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async getReviews(filters: any = {}) {
    try {
      const reviewsRef = collection(db, 'reviews');
      let q = query(reviewsRef);

      if (filters.propertyId) {
        q = query(q, where('propertyId', '==', filters.propertyId));
      }
      if (filters.agentId) {
        q = query(q, where('agentId', '==', filters.agentId));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  static async updateAgentRating(agentId: string) {
    try {
      const reviews = await this.getReviews({ agentId, status: 'approved' });
      const agent = await AgentsService.getAgent(agentId);

      if (agent && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await AgentsService.updateAgent(agentId, {
          rating: averageRating,
          totalReviews: reviews.length
        });
      }
    } catch (error) {
      console.error('Error updating agent rating:', error);
      throw error;
    }
  }

  static async markReviewHelpful(reviewId: string) {
    try {
      const docRef = doc(db, 'reviews', reviewId);
      await updateDoc(docRef, {
        helpful: increment(1)
      } as any);
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }
}

// Saved Searches Service
export class SavedSearchesService {
  static async createSavedSearch(search: Omit<SavedSearch, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const searchesRef = collection(db, 'savedSearches');
      const docRef = await addDoc(searchesRef, {
        ...search,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        newPropertiesCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating saved search:', error);
      throw error;
    }
  }

  static async getSavedSearches(userId: string) {
    try {
      const searchesRef = collection(db, 'savedSearches');
      const q = query(
        searchesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedSearch[];
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      throw error;
    }
  }

  static async updateSavedSearch(id: string, updates: Partial<SavedSearch>) {
    try {
      const docRef = doc(db, 'savedSearches', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating saved search:', error);
      throw error;
    }
  }

  static async deleteSavedSearch(id: string) {
    try {
      const docRef = doc(db, 'savedSearches', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting saved search:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  static async recordPropertyView(propertyId: string, source: string = 'direct') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const analyticsId = `analytics_${propertyId}_${today}`;
      const docRef = doc(db, 'propertyAnalytics', analyticsId);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          views: increment(1),
          [`sourceBreakdown.${source}`]: increment(1)
        } as any);
      } else {
        await setDoc(docRef, {
          propertyId,
          date: today,
          views: 1,
          uniqueViews: 1,
          inquiries: 0,
          savedToFavorites: 0,
          shares: 0,
          averageViewDuration: 0,
          bounceRate: 0,
          sourceBreakdown: {
            search: source === 'search' ? 1 : 0,
            featured: source === 'featured' ? 1 : 0,
            agent: source === 'agent' ? 1 : 0,
            direct: source === 'direct' ? 1 : 0
          },
          deviceBreakdown: {
            desktop: 0,
            mobile: 0,
            tablet: 0
          },
          locationBreakdown: {},
          createdAt: serverTimestamp()
        });
      }

      // Increment property views
      await PropertiesService.incrementPropertyViews(propertyId);
    } catch (error) {
      console.error('Error recording property view:', error);
      throw error;
    }
  }

  static async getPropertyAnalytics(propertyId: string, days: number = 30) {
    try {
      const analyticsRef = collection(db, 'propertyAnalytics');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        analyticsRef,
        where('propertyId', '==', propertyId),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PropertyAnalytics[];
    } catch (error) {
      console.error('Error fetching property analytics:', error);
      throw error;
    }
  }
}

// System Settings Service
export class SystemSettingsService {
  static async getSettings() {
    try {
      const docRef = doc(db, 'systemSettings', 'settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SystemSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  static async updateSettings(updates: Partial<SystemSettings>) {
    try {
      const docRef = doc(db, 'systemSettings', 'settings');
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }
}

// Database Initialization
export const initializeDatabase = async () => {
  try {
    const defaultSettings: SystemSettings = {
      site: {
        name: "Rural Properties",
        description: "Your trusted partner for rural real estate in South Africa",
        contactEmail: "info@ruralproperties.co.za",
        contactPhone: "+27 15 123 4567",
        address: "123 Main St, Tzaneen, 0850",
        socialMedia: {
          facebook: "https://facebook.com/ruralproperties",
          twitter: "https://twitter.com/ruralproperties",
          instagram: "https://instagram.com/ruralproperties",
          linkedin: "https://linkedin.com/company/ruralproperties"
        }
      },
      features: {
        propertyAlerts: true,
        savedSearches: true,
        virtualTours: true,
        mortgageCalculator: true,
        propertyValuation: true,
        documentSigning: false
      },
      pricing: {
        featuredListingFee: 500,
        premiumListingFee: 1000,
        agentCommission: 7.5
      },
      maintenance: {
        mode: false,
        message: "We're currently undergoing scheduled maintenance."
      }
    };

    await SystemSettingsService.updateSettings(defaultSettings);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export default {
  PropertiesService,
  UsersService,
  AgentsService,
  InquiriesService,
  ReviewsService,
  SavedSearchesService,
  AnalyticsService,
  SystemSettingsService,
  initializeDatabase
};
