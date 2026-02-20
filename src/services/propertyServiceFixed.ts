import { Property, CreateProperty, UpdateProperty } from '@/lib/firebase/schema';
import { FirebasePropertyService } from '@/services/firebasePropertyService';
import { getAuth } from 'firebase/auth';

export class PropertyServiceFixed {
  // Get all properties
  static async getAllProperties(): Promise<Property[]> {
    try {
      console.log('🏠 Fetching all properties...');
      const properties = await FirebasePropertyService.getAllProperties();
      console.log(`✅ Successfully fetched ${properties.length} properties`);
      return properties;
    } catch (error) {
      console.error('❌ Error fetching all properties:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Get property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      console.log(`🏠 Fetching property by ID: ${id}`);
      const property = await FirebasePropertyService.getPropertyById(id);
      console.log(`✅ Property ${id} found:`, property ? 'Yes' : 'No');
      return property;
    } catch (error) {
      console.error(`❌ Error fetching property ${id}:`, error);
      return null;
    }
  }

  // Get featured properties
  static async getFeaturedProperties(): Promise<Property[]> {
    try {
      console.log('🏠 Fetching featured properties...');
      const properties = await FirebasePropertyService.getFeaturedProperties();
      console.log(`✅ Successfully fetched ${properties.length} featured properties`);
      return properties;
    } catch (error) {
      console.error('❌ Error fetching featured properties:', error);
      return [];
    }
  }

  // Get properties by type
  static async getPropertiesByType(type: string): Promise<Property[]> {
    try {
      console.log(`🏠 Fetching properties by type: ${type}`);
      const properties = await FirebasePropertyService.getPropertiesByType(type);
      console.log(`✅ Successfully fetched ${properties.length} properties of type ${type}`);
      return properties;
    } catch (error) {
      console.error(`❌ Error fetching properties by type ${type}:`, error);
      return [];
    }
  }

  // Search properties
  static async searchProperties(query: string): Promise<Property[]> {
    try {
      console.log(`🔍 Searching properties with query: ${query}`);
      const properties = await FirebasePropertyService.searchProperties(query);
      console.log(`✅ Found ${properties.length} matching properties`);
      return properties;
    } catch (error) {
      console.error('❌ Error searching properties:', error);
      return [];
    }
  }

  // Filter properties - Enhanced with better error handling
  static async filterProperties(filters: {
    type?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<Property[]> {
    try {
      console.log('🔍 Filtering properties with filters:', filters);
      
      // If no filters, return all properties
      if (!filters.type && !filters.featured && !filters.minPrice && !filters.maxPrice && !filters.location) {
        console.log('📝 No filters provided, fetching all properties');
        return await this.getAllProperties();
      }
      
      const properties = await FirebasePropertyService.filterProperties(filters);
      console.log(`✅ Successfully filtered to ${properties.length} properties`);
      return properties;
    } catch (error) {
      console.error('❌ Error filtering properties:', error);
      // Fallback to all properties if filtering fails
      console.log('🔄 Falling back to all properties');
      return await this.getAllProperties();
    }
  }

  // Get properties for current user
  static async getUserProperties(): Promise<Property[]> {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.log('🔐 No user logged in, returning empty array');
        return [];
      }
      
      console.log(`👤 Fetching properties for user: ${currentUser.uid}`);
      const properties = await FirebasePropertyService.getUserProperties(currentUser.uid);
      console.log(`✅ Successfully fetched ${properties.length} user properties`);
      return properties;
    } catch (error) {
      console.error('❌ Error fetching user properties:', error);
      return [];
    }
  }

  // Create property with user ownership
  static async createProperty(property: CreateProperty): Promise<Property> {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User must be logged in to create a property');
      }
      
      console.log('🏠 Creating new property...');
      
      // Add user ID and timestamps
      const propertyWithUser = {
        ...property,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const newProperty = await FirebasePropertyService.createProperty(propertyWithUser);
      console.log('✅ Property created successfully:', newProperty.id);
      return newProperty;
    } catch (error) {
      console.error('❌ Error creating property:', error);
      throw error;
    }
  }

  // Update property
  static async updateProperty(id: string, updates: UpdateProperty): Promise<Property | null> {
    try {
      console.log(`🏠 Updating property: ${id}`);
      
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User must be logged in to update a property');
      }
      
      // Add updated timestamp
      const updatesWithUser = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const updatedProperty = await FirebasePropertyService.updateProperty(id, updatesWithUser);
      console.log('✅ Property updated successfully');
      return updatedProperty;
    } catch (error) {
      console.error(`❌ Error updating property ${id}:`, error);
      throw error;
    }
  }

  // Delete property
  static async deleteProperty(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting property: ${id}`);
      
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User must be logged in to delete a property');
      }
      
      await FirebasePropertyService.deleteProperty(id);
      console.log('✅ Property deleted successfully');
      return true;
    } catch (error) {
      console.error(`❌ Error deleting property ${id}:`, error);
      throw error;
    }
  }
}
