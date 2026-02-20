import { db } from '@/lib/firebase/config';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDocs,
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';
import { 
  Property, 
  User, 
  Agent, 
  Inquiry, 
  Review, 
  SavedSearch,
  PropertyAnalytics,
  SystemSettings 
} from './databaseService';

// Sample Properties Data
const sampleProperties: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Beautiful Farm with River Access",
    description: "Stunning 15-hectare farm with pristine river frontage. This property features fertile soil, excellent water rights, and a main house with 4 bedrooms. Perfect for agriculture, livestock, or development. The river provides year-round water supply and the property includes established irrigation systems.",
    location: {
      address: "Farm 123, Rietfontein Road",
      city: "Tzaneen",
      province: "Limpopo",
      postalCode: "0850",
      coordinates: { lat: -23.6524, lng: 30.1654 }
    },
    price: 2450000,
    priceFormatted: "R2,450,000",
    size: {
      landSize: "15 hectares",
      buildingSize: "450 sqm",
      totalSize: "15 hectares"
    },
    features: {
      bedrooms: 4,
      bathrooms: 2,
      garages: 2,
      parkingSpaces: 4,
      swimmingPool: true,
      garden: true,
      security: true,
      electricity: true,
      water: true,
      internet: false,
      phoneLine: true
    },
    propertyType: "farm",
    status: "active",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be7?w=800&q=80"
    ],
    agent: {
      id: "agent_001",
      name: "John Smith",
      email: "john@ruralproperties.co.za",
      phone: "+27 83 123 4567",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"
    },
    owner: {
      id: "owner_001",
      name: "Property Owner",
      email: "owner@example.com",
      phone: "+27 82 987 6543"
    },
    tags: ["river", "agriculture", "development", "water-rights"],
    amenities: ["river-access", "irrigation", "borehole", "fencing", "workers-quarters"],
    zoning: "agricultural",
    waterRights: true,
    electricity: true,
    roadAccess: "paved"
  },
  {
    title: "Modern Smallholding with Mountain Views",
    description: "Contemporary 8-hectare smallholding with breathtaking mountain views. This property features a modern 3-bedroom house, solar power system, and excellent soil quality. Ideal for organic farming, horse breeding, or luxury country living. Includes established orchards and vegetable gardens.",
    location: {
      address: "Smallholding 45, Mountain View Road",
      city: "Nelspruit",
      province: "Mpumalanga",
      postalCode: "1201",
      coordinates: { lat: -25.4733, lng: 30.9857 }
    },
    price: 1850000,
    priceFormatted: "R1,850,000",
    size: {
      landSize: "8 hectares",
      buildingSize: "320 sqm",
      totalSize: "8 hectares"
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      garages: 2,
      parkingSpaces: 3,
      swimmingPool: false,
      garden: true,
      security: true,
      electricity: true,
      water: true,
      internet: true,
      phoneLine: true
    },
    propertyType: "smallholding",
    status: "active",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1571063109413-5d5d5b8b2b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
    ],
    agent: {
      id: "agent_002",
      name: "Sarah Johnson",
      email: "sarah@ruralproperties.co.za",
      phone: "+27 83 234 5678",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80"
    },
    owner: {
      id: "owner_002",
      name: "Smallholding Owner",
      email: "owner2@example.com",
      phone: "+27 82 876 5432"
    },
    tags: ["mountain", "modern", "organic", "solar"],
    amenities: ["solar-power", "orchard", "vegetable-garden", "borehole", "fencing"],
    zoning: "residential-agricultural",
    waterRights: true,
    electricity: true,
    roadAccess: "gravel"
  },
  {
    title: "Residential Plot in Developing Suburb",
    description: "Prime 1200sqm residential plot in fast-growing suburb with all municipal services available. This level plot is perfect for building your dream home. The area has excellent schools, shopping centers, and medical facilities nearby. Great investment opportunity.",
    location: {
      address: "Plot 789, Thornhill Estate",
      city: "Polokwane",
      province: "Limpopo",
      postalCode: "0699",
      coordinates: { lat: -23.9045, lng: 29.4689 }
    },
    price: 450000,
    priceFormatted: "R450,000",
    size: {
      landSize: "1200 sqm",
      totalSize: "1200 sqm"
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      parkingSpaces: 0,
      swimmingPool: false,
      garden: false,
      security: false,
      electricity: false,
      water: false,
      internet: false,
      phoneLine: false
    },
    propertyType: "plot",
    status: "active",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
    ],
    agent: {
      id: "agent_003",
      name: "Mike Wilson",
      email: "mike@ruralproperties.co.za",
      phone: "+27 83 345 6789",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    },
    tags: ["residential", "investment", "development", "suburb"],
    amenities: ["municipal-services", "fenced", "level-plot"],
    zoning: "residential",
    waterRights: false,
    electricity: false,
    roadAccess: "paved"
  },
  {
    title: "Family House with Large Garden",
    description: "Charming 3-bedroom family house on 850sqm property with beautiful mature garden. This well-maintained home features modern kitchen, spacious living areas, and outdoor entertainment area. Located in quiet family-friendly neighborhood with good schools nearby.",
    location: {
      address: "45 Oak Street, Middelburg",
      city: "Middelburg",
      province: "Mpumalanga",
      postalCode: "1050",
      coordinates: { lat: -25.7709, lng: 29.4717 }
    },
    price: 980000,
    priceFormatted: "R980,000",
    size: {
      landSize: "850 sqm",
      buildingSize: "280 sqm",
      totalSize: "850 sqm"
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      garages: 2,
      parkingSpaces: 2,
      swimmingPool: false,
      garden: true,
      security: true,
      electricity: true,
      water: true,
      internet: true,
      phoneLine: true
    },
    propertyType: "house",
    status: "active",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be7?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
    ],
    agent: {
      id: "agent_001",
      name: "John Smith",
      email: "john@ruralproperties.co.za",
      phone: "+27 83 123 4567",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"
    },
    tags: ["family", "garden", "suburban", "schools"],
    amenities: ["mature-garden", "outdoor-entertainment", "modern-kitchen"],
    zoning: "residential",
    waterRights: false,
    electricity: true,
    roadAccess: "paved"
  },
  {
    title: "Agricultural Farm with Irrigation Systems",
    description: "Well-established 25-hectare agricultural farm with comprehensive irrigation systems and equipment. This productive farm includes fertile soil, reliable water sources, and various outbuildings. Currently used for vegetable production with excellent returns. Includes tractors and farming equipment.",
    location: {
      address: "Farm 567, Irrigation Way",
      city: "Hoedspruit",
      province: "Mpumalanga",
      postalCode: "1380",
      coordinates: { lat: -24.3547, lng: 30.9514 }
    },
    price: 3200000,
    priceFormatted: "R3,200,000",
    size: {
      landSize: "25 hectares",
      buildingSize: "600 sqm",
      totalSize: "25 hectares"
    },
    features: {
      bedrooms: 5,
      bathrooms: 3,
      garages: 3,
      parkingSpaces: 6,
      swimmingPool: true,
      garden: true,
      security: true,
      electricity: true,
      water: true,
      internet: false,
      phoneLine: true
    },
    propertyType: "farm",
    status: "active",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      "https://images.unsplash.com/photo-1571063109413-5d5d5b8b2b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80"
    ],
    agent: {
      id: "agent_002",
      name: "Sarah Johnson",
      email: "sarah@ruralproperties.co.za",
      phone: "+27 83 234 5678",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80"
    },
    tags: ["agriculture", "irrigation", "equipment", "productive"],
    amenities: ["irrigation-system", "farming-equipment", "outbuildings", "borehole"],
    zoning: "agricultural",
    waterRights: true,
    electricity: true,
    roadAccess: "paved"
  }
];

// Sample Users Data
const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    email: "admin@ruralproperties.co.za",
    displayName: "Admin User",
    firstName: "Admin",
    lastName: "User",
    phone: "+27 83 111 1111",
    role: "admin",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      propertyAlerts: {
        newProperties: true,
        priceChanges: true,
        similarProperties: true
      }
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    email: "john@ruralproperties.co.za",
    displayName: "John Smith",
    firstName: "John",
    lastName: "Smith",
    phone: "+27 83 123 4567",
    role: "agent",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      propertyAlerts: {
        newProperties: true,
        priceChanges: false,
        similarProperties: true
      }
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    email: "sarah@ruralproperties.co.za",
    displayName: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "+27 83 234 5678",
    role: "agent",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      propertyAlerts: {
        newProperties: true,
        priceChanges: true,
        similarProperties: true
      }
    },
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    email: "user@example.com",
    displayName: "Regular User",
    firstName: "Regular",
    lastName: "User",
    phone: "+27 83 999 9999",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      propertyAlerts: {
        newProperties: true,
        priceChanges: true,
        similarProperties: false
      }
    },
    isEmailVerified: true,
    isPhoneVerified: false
  }
];

// Sample Agents Data
const sampleAgents: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    userId: "user_002",
    email: "john@ruralproperties.co.za",
    displayName: "John Smith",
    firstName: "John",
    lastName: "Smith",
    phone: "+27 83 123 4567",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    licenseNumber: "EA123456",
    agency: {
      name: "Rural Properties Agency",
      logo: "https://example.com/logo.png",
      address: "123 Main St, Tzaneen",
      phone: "+27 15 123 4567",
      email: "info@ruralproperties.co.za"
    },
    specializations: ["farms", "smallholdings", "agricultural"],
    areas: ["Limpopo", "Mpumalanga"],
    languages: ["English", "Afrikaans", "Sepedi"],
    experience: 8,
    rating: 4.8,
    totalReviews: 45,
    properties: ["prop_001", "prop_004"],
    isActive: true,
    bio: "Experienced rural property specialist with 8 years in agricultural real estate. Passionate about helping clients find their perfect rural property.",
    socialMedia: {
      linkedin: "https://linkedin.com/in/johnsmith",
      facebook: "https://facebook.com/johnsmithrealtor"
    }
  },
  {
    userId: "user_003",
    email: "sarah@ruralproperties.co.za",
    displayName: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "+27 83 234 5678",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
    licenseNumber: "EA789012",
    agency: {
      name: "Rural Properties Agency",
      logo: "https://example.com/logo.png",
      address: "123 Main St, Tzaneen",
      phone: "+27 15 123 4567",
      email: "info@ruralproperties.co.za"
    },
    specializations: ["smallholdings", "residential", "luxury"],
    areas: ["Mpumalanga", "Gauteng"],
    languages: ["English", "Afrikaans", "Zulu"],
    experience: 6,
    rating: 4.9,
    totalReviews: 32,
    properties: ["prop_002", "prop_005"],
    isActive: true,
    bio: "Specializing in smallholdings and luxury rural properties. Dedicated to providing exceptional service to my clients.",
    socialMedia: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      facebook: "https://facebook.com/sarahjohnsonrealtor"
    }
  },
  {
    userId: "user_004",
    email: "mike@ruralproperties.co.za",
    displayName: "Mike Wilson",
    firstName: "Mike",
    lastName: "Wilson",
    phone: "+27 83 345 6789",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    licenseNumber: "EA345678",
    agency: {
      name: "Rural Properties Agency",
      logo: "https://example.com/logo.png",
      address: "123 Main St, Tzaneen",
      phone: "+27 15 123 4567",
      email: "info@ruralproperties.co.za"
    },
    specializations: ["plots", "development", "investment"],
    areas: ["Limpopo", "North West"],
    languages: ["English", "Afrikaans", "Tswana"],
    experience: 5,
    rating: 4.6,
    totalReviews: 28,
    properties: ["prop_003"],
    isActive: true,
    bio: "Expert in residential plots and development opportunities. Helping investors find profitable opportunities.",
    socialMedia: {
      linkedin: "https://linkedin.com/in/mikewilson",
      facebook: "https://facebook.com/mikewilsonrealtor"
    }
  }
];

// Sample Inquiries Data
const sampleInquiries: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    propertyId: "prop_001",
    userId: "user_004",
    agentId: "agent_001",
    type: "viewing",
    message: "I'm interested in viewing this beautiful farm. When would be a good time to visit? I'm available this weekend.",
    contactInfo: {
      name: "Regular User",
      email: "user@example.com",
      phone: "+27 83 999 9999"
    },
    preferredContact: "email",
    status: "pending",
    priority: "normal"
  },
  {
    propertyId: "prop_002",
    userId: "user_004",
    agentId: "agent_002",
    type: "general",
    message: "Could you provide more information about the solar power system on this smallholding?",
    contactInfo: {
      name: "Regular User",
      email: "user@example.com",
      phone: "+27 83 999 9999"
    },
    preferredContact: "email",
    status: "responded",
    priority: "low"
  }
];

// Sample Reviews Data
const sampleReviews: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    propertyId: "prop_001",
    userId: "user_004",
    agentId: "agent_001",
    rating: 5,
    title: "Excellent Service and Professionalism",
    comment: "John was absolutely fantastic throughout the entire process. His knowledge of rural properties and agricultural land is unmatched. He helped us find the perfect farm and guided us through every step. Highly recommend!",
    pros: ["Professional", "Knowledgeable", "Responsive", "Good negotiator"],
    cons: ["None"],
    wouldRecommend: true,
    verifiedPurchase: true,
    status: "approved"
  },
  {
    propertyId: "prop_002",
    userId: "user_004",
    agentId: "agent_002",
    rating: 4,
    title: "Great Experience Overall",
    comment: "Sarah was very helpful and patient. She understood exactly what we were looking for and found several suitable options. The process was smooth and she answered all our questions promptly.",
    pros: ["Patient", "Good listener", "Responsive"],
    cons: ["Could have provided more area information"],
    wouldRecommend: true,
    verifiedPurchase: true,
    status: "approved"
  }
];

// Sample Saved Searches Data
const sampleSavedSearches: Omit<SavedSearch, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    userId: "user_004",
    name: "Farms in Limpopo under R3M",
    filters: {
      propertyType: ["farm"],
      province: ["Limpopo"],
      minPrice: 500000,
      maxPrice: 3000000,
      minBedrooms: 3,
      features: ["water", "electricity"],
      keywords: ["river", "irrigation"]
    },
    frequency: "daily",
    isActive: true
  },
  {
    userId: "user_004",
    name: "Smallholdings in Mpumalanga",
    filters: {
      propertyType: ["smallholding"],
      province: ["Mpumalanga"],
      minPrice: 1000000,
      maxPrice: 2500000,
      minBedrooms: 2
    },
    frequency: "weekly",
    isActive: true
  }
];

// Sample System Settings
const systemSettings: SystemSettings = {
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

// Data Seeding Class
export class DataSeeder {
  static async seedAll() {
    try {
      console.log('🌱 Starting complete database seeding...');
      
      const results = {
        properties: 0,
        users: 0,
        agents: 0,
        inquiries: 0,
        reviews: 0,
        savedSearches: 0,
        systemSettings: false,
        errors: [] as string[]
      };

      // Seed Properties
      try {
        for (const property of sampleProperties) {
          const docRef = await addDoc(collection(db, 'properties'), {
            ...property,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            views: Math.floor(Math.random() * 200),
            inquiries: Math.floor(Math.random() * 20)
          });
          results.properties++;
          console.log(`✅ Added property: ${property.title} (ID: ${docRef.id})`);
        }
      } catch (error: any) {
        results.errors.push(`Properties: ${error.message}`);
      }

      // Seed Users
      try {
        for (const user of sampleUsers) {
          const docRef = await addDoc(collection(db, 'users'), {
            ...user,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            savedProperties: [],
            viewedProperties: [],
            inquiries: []
          });
          results.users++;
          console.log(`✅ Added user: ${user.displayName} (ID: ${docRef.id})`);
        }
      } catch (error: any) {
        results.errors.push(`Users: ${error.message}`);
      }

      // Seed Agents
      try {
        for (const agent of sampleAgents) {
          const docRef = await addDoc(collection(db, 'agents'), {
            ...agent,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          results.agents++;
          console.log(`✅ Added agent: ${agent.displayName} (ID: ${docRef.id})`);
        }
      } catch (error: any) {
        results.errors.push(`Agents: ${error.message}`);
      }

      // Seed Inquiries
      try {
        for (const inquiry of sampleInquiries) {
          const docRef = await addDoc(collection(db, 'inquiries'), {
            ...inquiry,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            responses: []
          });
          results.inquiries++;
          console.log(`✅ Added inquiry for property: ${inquiry.propertyId} (ID: ${docRef.id})`);
        }
      } catch (error: any) {
        results.errors.push(`Inquiries: ${error.message}`);
      }

      // Seed Reviews
      try {
        for (const review of sampleReviews) {
          const docRef = await addDoc(collection(db, 'reviews'), {
            ...review,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            helpful: 0
          });
          results.reviews++;
          console.log(`✅ Added review for agent: ${review.agentId} (ID: ${docRef.id})`);
        }
      } catch (error: any) {
        results.errors.push(`Reviews: ${error.message}`);
      }

      // Seed Saved Searches
      try {
        for (const search of sampleSavedSearches) {
          const docRef = await addDoc(collection(db, 'savedSearches'), {
            ...search,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            newPropertiesCount: 0
          });
          results.savedSearches++;
          console.log(`✅ Added saved search: ${search.name} (ID: ${docRef.id})`);
        }
      } catch (error: any) {
        results.errors.push(`Saved Searches: ${error.message}`);
      }

      // Seed System Settings
      try {
        await setDoc(doc(db, 'systemSettings', 'settings'), {
          ...systemSettings,
          updatedAt: serverTimestamp()
        });
        results.systemSettings = true;
        console.log('✅ Added system settings');
      } catch (error: any) {
        results.errors.push(`System Settings: ${error.message}`);
      }

      console.log('🎉 Database seeding completed!', results);
      return results;
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  static async clearAll() {
    try {
      console.log('🗑️ Clearing all collections...');
      
      const collections = ['properties', 'users', 'agents', 'inquiries', 'reviews', 'savedSearches'];
      const results = { cleared: 0, errors: [] as string[] };

      for (const collectionName of collections) {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          const batch = writeBatch(db);
          
          querySnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          
          await batch.commit();
          results.cleared += querySnapshot.docs.length;
          console.log(`🗑️ Cleared ${querySnapshot.docs.length} documents from ${collectionName}`);
        } catch (error: any) {
          results.errors.push(`${collectionName}: ${error.message}`);
        }
      }

      console.log('🗑️ Database clearing completed!', results);
      return results;
    } catch (error) {
      console.error('❌ Database clearing failed:', error);
      throw error;
    }
  }

  static async seedProperties() {
    try {
      console.log('🏠 Seeding properties...');
      let count = 0;
      
      for (const property of sampleProperties) {
        const docRef = await addDoc(collection(db, 'properties'), {
          ...property,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          views: Math.floor(Math.random() * 200),
          inquiries: Math.floor(Math.random() * 20)
        });
        count++;
        console.log(`✅ Added property: ${property.title} (ID: ${docRef.id})`);
      }
      
      console.log(`🎉 Seeded ${count} properties successfully!`);
      return count;
    } catch (error) {
      console.error('❌ Property seeding failed:', error);
      throw error;
    }
  }

  static async seedUsers() {
    try {
      console.log('👥 Seeding users...');
      let count = 0;
      
      for (const user of sampleUsers) {
        const docRef = await addDoc(collection(db, 'users'), {
          ...user,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          savedProperties: [],
          viewedProperties: [],
          inquiries: []
        });
        count++;
        console.log(`✅ Added user: ${user.displayName} (ID: ${docRef.id})`);
      }
      
      console.log(`🎉 Seeded ${count} users successfully!`);
      return count;
    } catch (error) {
      console.error('❌ User seeding failed:', error);
      throw error;
    }
  }

  static async seedAgents() {
    try {
      console.log('🤵 Seeding agents...');
      let count = 0;
      
      for (const agent of sampleAgents) {
        const docRef = await addDoc(collection(db, 'agents'), {
          ...agent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        count++;
        console.log(`✅ Added agent: ${agent.displayName} (ID: ${docRef.id})`);
      }
      
      console.log(`🎉 Seeded ${count} agents successfully!`);
      return count;
    } catch (error) {
      console.error('❌ Agent seeding failed:', error);
      throw error;
    }
  }
}

export default DataSeeder;
