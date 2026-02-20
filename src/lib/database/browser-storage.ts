import { Property, CreateProperty, UpdateProperty } from './schema';

class BrowserStorage {
  private readonly STORAGE_KEY = 'rural_properties_db';
  private data: Property[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        // Initialize with empty data
        this.data = [];
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      this.data = [];
    }
  }

  private saveData() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  // Get all properties
  getAllProperties(): Property[] {
    return [...this.data];
  }

  // Get property by ID
  getPropertyById(id: string): Property | undefined {
    return this.data.find(property => property.id === id);
  }

  // Get featured properties
  getFeaturedProperties(): Property[] {
    return this.data.filter(property => property.featured);
  }

  // Get properties by type
  getPropertiesByType(type: string): Property[] {
    return this.data.filter(property => property.type === type);
  }

  // Search properties
  searchProperties(query: string): Property[] {
    const searchPattern = query.toLowerCase();
    return this.data.filter(property => 
      property.title.toLowerCase().includes(searchPattern) ||
      property.location.toLowerCase().includes(searchPattern) ||
      property.description.toLowerCase().includes(searchPattern)
    );
  }

  // Filter properties
  filterProperties(filters: {
    type?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Property[] {
    let filtered = [...this.data];

    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(property => property.featured === filters.featured);
    }

    if (filters.location) {
      const locationPattern = filters.location.toLowerCase();
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(locationPattern)
      );
    }

    // Price filtering
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(property => {
        const price = parseInt(property.price.replace(/[^0-9]/g, ''));
        if (filters.minPrice && price < filters.minPrice) return false;
        if (filters.maxPrice && price > filters.maxPrice) return false;
        return true;
      });
    }

    return filtered;
  }

  // Create property
  createProperty(property: CreateProperty): Property {
    const newProperty: Property = {
      ...property,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amenities: property.amenities || [],
      coordinates: property.coordinates || { lat: 0, lng: 0 }
    };

    this.data.push(newProperty);
    this.saveData();
    return newProperty;
  }

  // Update property
  updateProperty(id: string, updates: UpdateProperty): Property | undefined {
    const index = this.data.findIndex(property => property.id === id);
    if (index === -1) return undefined;

    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData();
    return this.data[index];
  }

  // Delete property
  deleteProperty(id: string): boolean {
    const index = this.data.findIndex(property => property.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    this.saveData();
    return true;
  }

  // Initialize with sample data
  async initializeWithSampleData() {
    if (this.data.length === 0) {
      try {
        // Import the static properties data
        const { properties } = await import('../../data/properties');
        
        const sampleProperties: Property[] = properties.map(property => ({
          ...property,
          id: property.id,
          type: property.type as "Farm" | "Plot" | "House" | "Smallholding",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          amenities: property.amenities || [],
          coordinates: property.coordinates || { lat: 0, lng: 0 }
        }));

        this.data = sampleProperties;
        this.saveData();
        console.log(`Initialized database with ${sampleProperties.length} sample properties`);
      } catch (error) {
        console.error('Error initializing sample data:', error);
      }
    }
  }

  // Clear all data
  clearAllData() {
    this.data = [];
    this.saveData();
  }
}

export const browserStorage = new BrowserStorage();
