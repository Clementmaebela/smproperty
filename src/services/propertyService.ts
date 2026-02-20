import { Property, CreateProperty, UpdateProperty } from '@/lib/firebase/schema';
import { PropertiesService as DatabasePropertiesService } from '@/services/databaseService';
import { getAuth } from 'firebase/auth';

export class PropertyService {
  // Get all properties
  static async getAllProperties(): Promise<Property[]> {
    return DatabasePropertiesService.getProperties();
  }

  // Get property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    return DatabasePropertiesService.getProperty(id);
  }

  // Get featured properties
  static async getFeaturedProperties(): Promise<Property[]> {
    return DatabasePropertiesService.getFeaturedProperties();
  }

  // Get properties by type
  static async getPropertiesByType(type: string): Promise<Property[]> {
    return DatabasePropertiesService.getProperties({ propertyType: type });
  }

  // Search properties
  static async searchProperties(query: string): Promise<Property[]> {
    return DatabasePropertiesService.searchProperties(query);
  }

  // Filter properties
  static async filterProperties(filters: {
    type?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<Property[]> {
    // Convert old filter format to new format
    const newFilters = {
      propertyType: filters.type,
      featured: filters.featured,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      province: filters.location
    };
    return DatabasePropertiesService.getProperties(newFilters);
  }

  // Get properties for current user
  static async getUserProperties(): Promise<Property[]> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return [];
    }
    
    // Note: The new database service doesn't have getUserProperties method
    // We'll need to implement this or use a different approach
    return DatabasePropertiesService.getProperties({ agentId: currentUser.uid });
  }

  // Create property with user ownership
  static async createProperty(property: CreateProperty): Promise<Property> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Convert old schema to new database schema
    const newPropertyData = {
      title: property.title,
      description: property.description || '',
      price: parseInt(property.price.replace(/[^0-9]/g, '')),
      priceFormatted: property.price,
      location: {
        address: property.location,
        city: property.location, // Using location as city for now
        province: 'Limpopo', // Default province
        postalCode: '0850',
        coordinates: property.coordinates || { lat: 0, lng: 0 }
      },
      size: {
        landSize: property.size || '1 hectare',
        totalSize: property.size || '1 hectare'
      },
      features: {
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        garages: property.parking || 0
      },
      propertyType: property.type?.toLowerCase() || 'house',
      status: 'active' as const,
      featured: property.featured || false,
      images: property.image ? [property.image] : [],
      agent: {
        id: currentUser.uid,
        name: currentUser.displayName || 'Unknown',
        email: currentUser.email || '',
        phone: '',
        profileImage: currentUser.photoURL || ''
      },
      owner: {
        id: currentUser.uid,
        name: currentUser.displayName || 'Unknown',
        email: currentUser.email || '',
        phone: ''
      },
      tags: [],
      amenities: property.amenities || []
    };
    
    const id = await DatabasePropertiesService.createProperty(newPropertyData);
    return DatabasePropertiesService.getProperty(id);
  }

  // Update property
  static async updateProperty(id: string, updates: UpdateProperty): Promise<Property | null> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    // Convert old schema to new database schema
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.price) {
      updateData.price = parseInt(updates.price.replace(/[^0-9]/g, ''));
      updateData.priceFormatted = updates.price;
    }
    if (updates.location) {
      updateData.location = {
        address: updates.location,
        city: updates.location,
        province: 'Limpopo',
        postalCode: '0850',
        coordinates: updates.coordinates || { lat: 0, lng: 0 }
      };
    }
    if (updates.size) updateData.size = { landSize: updates.size, totalSize: updates.size };
    if (updates.bedrooms !== undefined) updateData.features = { bedrooms: updates.bedrooms };
    if (updates.bathrooms !== undefined) updateData.features = { ...updateData.features, bathrooms: updates.bathrooms };
    if (updates.type) updateData.propertyType = updates.type.toLowerCase();
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.image) updateData.images = [updates.image];
    if (updates.amenities) updateData.amenities = updates.amenities;
    
    await DatabasePropertiesService.updateProperty(id, updateData);
    return DatabasePropertiesService.getProperty(id);
  }

  // Delete property (with ownership verification)
  static async deleteProperty(id: string): Promise<boolean> {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    return DatabasePropertiesService.deleteProperty(id, currentUser.uid);
  }

  // Increment property views
  static async incrementViews(id: string): Promise<void> {
    return DatabasePropertiesService.incrementPropertyViews(id);
  }

  // Increment property inquiries
  static async incrementInquiries(id: string): Promise<void> {
    return DatabasePropertiesService.incrementInquiries(id);
  }

  // Initialize with sample data
  static async initializeWithSampleData(): Promise<void> {
    // This is now handled by the data seeder
    console.log('Sample data initialization handled by data seeder');
  }
}
