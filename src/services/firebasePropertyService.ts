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
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Property, CreateProperty, UpdateProperty } from '@/lib/firebase/schema';

const COLLECTION_NAME = 'properties';

export class FirebasePropertyService {
  private static collectionRef = collection(db, COLLECTION_NAME);

  // Get all properties
  static async getAllProperties(): Promise<Property[]> {
    try {
      const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toISOString() || new Date().toISOString()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }
  }

  // Get property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: docSnap.data().updatedAt?.toISOString() || new Date().toISOString()
        } as Property;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw new Error('Failed to fetch property');
    }
  }

  // Get featured properties
  static async getFeaturedProperties(): Promise<Property[]> {
    try {
      const q = query(
        this.collectionRef, 
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toISOString() || new Date().toISOString()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw new Error('Failed to fetch featured properties');
    }
  }

  // Get properties by type
  static async getPropertiesByType(type: string): Promise<Property[]> {
    try {
      const q = query(
        this.collectionRef, 
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toISOString() || new Date().toISOString()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties by type:', error);
      throw new Error('Failed to fetch properties by type');
    }
  }

  // Search properties
  static async searchProperties(searchQuery: string): Promise<Property[]> {
    try {
      // For now, we'll do a simple client-side search after fetching all properties
      // In a production app, you might want to use Algolia or Firebase Extensions for full-text search
      const allProperties = await this.getAllProperties();
      const query = searchQuery.toLowerCase();
      
      return allProperties.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query)
      );
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new Error('Failed to search properties');
    }
  }

  // Filter properties
  static async filterProperties(filters: {
    type?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<Property[]> {
    try {
      let q = query(this.collectionRef, orderBy('createdAt', 'desc'));
      
      // Add where clauses for filters
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      if (filters.featured !== undefined) {
        q = query(q, where('featured', '==', filters.featured));
      }
      
      if (filters.location) {
        q = query(q, where('location', '>=', filters.location));
        q = query(q, where('location', '<=', filters.location + '\uf8ff'));
      }
      
      const querySnapshot = await getDocs(q);
      let properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toISOString() || new Date().toISOString()
      })) as Property[];
      
      // Client-side price filtering
      if (filters.minPrice || filters.maxPrice) {
        properties = properties.filter(property => {
          const price = parseInt(property.price.replace(/[^0-9]/g, ''));
          if (filters.minPrice && price < filters.minPrice) return false;
          if (filters.maxPrice && price > filters.maxPrice) return false;
          return true;
        });
      }
      
      return properties;
    } catch (error) {
      console.error('Error filtering properties:', error);
      throw new Error('Failed to filter properties');
    }
  }

  // Create property
  static async createProperty(property: CreateProperty): Promise<Property> {
    try {
      const now = Timestamp.now();
      const propertyData = {
        ...property,
        createdAt: now,
        updatedAt: now
      };
      
      console.log('🏠 Creating property:', propertyData);
      const docRef = await addDoc(this.collectionRef, propertyData);
      console.log('✅ Property created with ID:', docRef.id);
      
      // Wait a moment for Firebase to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newProperty = await this.getPropertyById(docRef.id);
      if (!newProperty) {
        throw new Error('Failed to create property');
      }
      
      console.log('✅ Property retrieved successfully:', newProperty);
      return newProperty;
    } catch (error) {
      console.error('❌ Error creating property:', error);
      console.error('Error details:', error.message, error.code);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  // Update property
  static async updateProperty(id: string, updates: UpdateProperty): Promise<Property | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
      
      return await this.getPropertyById(id);
    } catch (error) {
      console.error('Error updating property:', error);
      throw new Error('Failed to update property');
    }
  }

  // Get properties for a specific user
  static async getUserProperties(userId: string): Promise<Property[]> {
    try {
      const q = query(
        this.collectionRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toISOString() || new Date().toISOString()
      })) as Property[];
    } catch (error) {
      console.error('Error fetching user properties:', error);
      throw new Error('Failed to fetch user properties');
    }
  }

  // Delete property with ownership verification
  static async deleteProperty(id: string, userId?: string): Promise<boolean> {
    try {
      const docRef = doc(this.collectionRef, id);
      
      // If userId is provided, verify ownership
      if (userId) {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error('Property not found');
        }
        
        const propertyData = docSnap.data();
        if (propertyData.userId !== userId) {
          throw new Error('Permission denied: You can only delete your own properties');
        }
      }
      
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw new Error('Failed to delete property');
    }
  }

  // Increment property views
  static async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw new Error('Failed to increment views');
    }
  }

  // Increment property inquiries
  static async incrementInquiries(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentInquiries = docSnap.data().inquiries || 0;
        await updateDoc(docRef, {
          inquiries: currentInquiries + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error incrementing inquiries:', error);
      throw new Error('Failed to increment inquiries');
    }
  }

  // Initialize with sample data
  static async initializeWithSampleData(): Promise<void> {
    try {
      // Check if we already have properties
      const existingProperties = await this.getAllProperties();
      console.log(`📊 Current properties in Firebase: ${existingProperties.length}`);
      
      if (existingProperties.length > 0) {
        console.log('✅ Database already contains properties, skipping initialization');
        return;
      }

      // Import static properties data
      const { properties } = await import('@/data/properties');
      console.log(`📝 Importing ${properties.length} properties from static data...`);
      
      let successCount = 0;
      for (const [index, property] of properties.entries()) {
        try {
          console.log(`🏠 Creating property ${index + 1}/${properties.length}:`, property.title);
          
          await this.createProperty({
            title: property.title,
            location: property.location,
            price: property.price,
            size: property.size,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            type: property.type as "Farm" | "Plot" | "House" | "Smallholding",
            image: property.image,
            featured: property.featured || false,
            description: property.description || '',
            yearBuilt: property.yearBuilt,
            parking: property.parking,
            amenities: property.amenities || [],
            coordinates: property.coordinates || { lat: 0, lng: 0 }
          });
          
          successCount++;
          console.log(`✅ Successfully created property ${index + 1}: ${property.title}`);
        } catch (error) {
          console.error(`❌ Failed to create property ${index + 1}: ${property.title}`, error);
        }
      }
      
      console.log(`✅ Firebase initialization complete: ${successCount}/${properties.length} properties imported`);
    } catch (error) {
      console.error('❌ Error initializing sample data:', error);
      throw error;
    }
  }
}
