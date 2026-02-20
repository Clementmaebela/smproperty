# Firebase Database Setup - Complete Property24 App

## Database Structure Overview

This document provides the complete database setup for the Property24-style rural real estate application.

## Collections Structure

### 1. Properties Collection
```javascript
// Collection: properties
{
  id: "auto-generated",
  title: "Beautiful Farm with River Access",
  description: "Stunning 15-hectare farm with river frontage, perfect for agriculture or development",
  location: {
    address: "Farm 123, Rietfontein Road",
    city: "Tzaneen",
    province: "Limpopo",
    postalCode: "0850",
    coordinates: {
      lat: -23.6524,
      lng: 30.1654
    }
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
  status: "active", // active, sold, pending, rented
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
  views: 156,
  inquiries: 12,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z",
  listedDate: "2024-01-15T10:30:00Z",
  tags: ["river", "agriculture", "development", "water-rights"],
  amenities: ["river-access", "irrigation", "borehole", "fencing", "workers-quarters"],
  zoning: "agricultural",
  waterRights: true,
  electricity: true,
  roadAccess: "paved"
}
```

### 2. Users Collection
```javascript
// Collection: users
{
  id: "user_001",
  email: "user@example.com",
  displayName: "John Doe",
  firstName: "John",
  lastName: "Doe",
  phone: "+27 83 123 4567",
  role: "user", // admin, agent, user
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    propertyAlerts: {
      newProperties: true,
      priceChanges: true,
      similarProperties: true
    },
    savedSearches: [
      {
        name: "Farms in Limpopo",
        filters: {
          propertyType: "farm",
          province: "Limpopo",
          minPrice: 1000000,
          maxPrice: 5000000
        }
      }
    ]
  },
  savedProperties: ["prop_001", "prop_003"],
  viewedProperties: ["prop_001", "prop_002", "prop_004"],
  inquiries: [
    {
      propertyId: "prop_001",
      message: "I'm interested in this property",
      createdAt: "2024-01-18T09:15:00Z",
      status: "pending" // pending, responded, closed
    }
  ],
  isEmailVerified: true,
  isPhoneVerified: false,
  lastLoginAt: "2024-01-20T16:30:00Z",
  createdAt: "2024-01-10T08:00:00Z",
  updatedAt: "2024-01-20T16:30:00Z"
}
```

### 3. Agents Collection
```javascript
// Collection: agents
{
  id: "agent_001",
  userId: "user_002",
  email: "agent@ruralproperties.co.za",
  displayName: "Jane Smith",
  firstName: "Jane",
  lastName: "Smith",
  phone: "+27 83 987 6543",
  profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
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
  properties: ["prop_001", "prop_003", "prop_005"],
  isActive: true,
  bio: "Experienced rural property specialist with 8 years in agricultural real estate",
  socialMedia: {
    linkedin: "https://linkedin.com/in/janesmith",
    facebook: "https://facebook.com/janesmithrealtor"
  },
  createdAt: "2024-01-05T10:00:00Z",
  updatedAt: "2024-01-20T14:30:00Z"
}
```

### 4. Inquiries Collection
```javascript
// Collection: inquiries
{
  id: "inquiry_001",
  propertyId: "prop_001",
  userId: "user_001",
  agentId: "agent_001",
  type: "general", // general, viewing, offer, financing
  message: "I'm interested in viewing this property. When would be a good time?",
  contactInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+27 83 123 4567"
  },
  preferredContact: "email", // email, phone, whatsapp
  status: "pending", // pending, responded, scheduled, completed, closed
  priority: "normal", // low, normal, high, urgent
  responses: [
    {
      message: "Thank you for your inquiry. I'm available for viewings this weekend.",
      responderId: "agent_001",
      responderType: "agent", // agent, system, user
      createdAt: "2024-01-18T10:30:00Z"
    }
  ],
  scheduledViewing: {
    date: "2024-01-25T14:00:00Z",
    duration: 60, // minutes
    status: "scheduled" // scheduled, completed, cancelled
  },
  createdAt: "2024-01-18T09:15:00Z",
  updatedAt: "2024-01-18T10:30:00Z"
}
```

### 5. Reviews Collection
```javascript
// Collection: reviews
{
  id: "review_001",
  propertyId: "prop_001",
  userId: "user_001",
  agentId: "agent_001",
  rating: 5, // 1-5 stars
  title: "Excellent Service",
  comment: "Jane was very professional and helped us find the perfect farm. Highly recommend!",
  pros: ["Professional", "Knowledgeable", "Responsive"],
  cons: ["None"],
  wouldRecommend: true,
  verifiedPurchase: true,
  helpful: 12,
  status: "approved", // pending, approved, rejected
  response: {
    message: "Thank you for your kind words! It was a pleasure working with you.",
    responderId: "agent_001",
    createdAt: "2024-01-19T11:00:00Z"
  },
  createdAt: "2024-01-18T16:45:00Z",
  updatedAt: "2024-01-19T11:00:00Z"
}
```

### 6. Saved Searches Collection
```javascript
// Collection: savedSearches
{
  id: "search_001",
  userId: "user_001",
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
  frequency: "daily", // daily, weekly, monthly, never
  isActive: true,
  lastRun: "2024-01-20T08:00:00Z",
  newPropertiesCount: 3,
  createdAt: "2024-01-15T12:00:00Z",
  updatedAt: "2024-01-20T08:00:00Z"
}
```

### 7. Property Analytics Collection
```javascript
// Collection: propertyAnalytics
{
  id: "analytics_prop_001",
  propertyId: "prop_001",
  date: "2024-01-20",
  views: 45,
  uniqueViews: 38,
  inquiries: 3,
  savedToFavorites: 8,
  shares: 2,
  averageViewDuration: 125, // seconds
  bounceRate: 0.25,
  sourceBreakdown: {
    search: 20,
    featured: 15,
    agent: 8,
    direct: 2
  },
  deviceBreakdown: {
    desktop: 25,
    mobile: 18,
    tablet: 2
  },
  locationBreakdown: {
    "Johannesburg": 12,
    "Pretoria": 8,
    "Cape Town": 6,
    "Durban": 4,
    "Other": 15
  },
  createdAt: "2024-01-20T23:59:59Z"
}
```

### 8. System Settings Collection
```javascript
// Collection: systemSettings
{
  id: "settings",
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
    agentCommission: 7.5 // percentage
  },
  maintenance: {
    mode: false, // true for maintenance mode
    message: "We're currently undergoing scheduled maintenance."
  },
  updatedAt: "2024-01-20T10:00:00Z"
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isAgent() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'agent';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Properties collection rules
    match /properties/{propertyId} {
      allow read: if true; // Public read access
      allow create: if isAuthenticated() && (isAdmin() || isAgent());
      allow update: if isAuthenticated() && (isAdmin() || 
                   isAgent() && resource.data.agent.id == request.auth.uid ||
                   isOwner(resource.data.owner.id));
      allow delete: if isAdmin();
    }
    
    // Users collection rules
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin() || isAgent());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Agents collection rules
    match /agents/{agentId} {
      allow read: if true; // Public read access for agent profiles
      allow create: if isAdmin();
      allow update: if isAuthenticated() && (isAdmin() || isOwner(agentId));
      allow delete: if isAdmin();
    }
    
    // Inquiries collection rules
    match /inquiries/{inquiryId} {
      allow read: if isAuthenticated() && 
                  (isOwner(resource.data.userId) || 
                   isOwner(resource.data.agentId) || 
                   isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                  (isOwner(resource.data.userId) || 
                   isOwner(resource.data.agentId) || 
                   isAdmin());
      allow delete: if isAdmin();
    }
    
    // Reviews collection rules
    match /reviews/{reviewId} {
      allow read: if true; // Public read access
      allow create: if isAuthenticated() && isOwner(resource.data.userId);
      allow update: if isAuthenticated() && 
                  (isOwner(resource.data.userId) || 
                   isOwner(resource.data.agentId) || 
                   isAdmin());
      allow delete: if isAdmin() || isOwner(resource.data.userId);
    }
    
    // Saved searches collection rules
    match /savedSearches/{searchId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && isOwner(resource.data.userId);
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    // Property analytics collection rules
    match /propertyAnalytics/{analyticsId} {
      allow read: if isAuthenticated() && (isAdmin() || isAgent());
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // System settings collection rules
    match /systemSettings/{settingsId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## Firestore Indexes

Create these indexes in Firebase Console → Firestore Database → Indexes:

### Properties Collection Indexes
```javascript
// Composite Index 1: Properties by status and featured
Collection: properties
Fields:
  - status (Ascending)
  - featured (Descending)
  - createdAt (Descending)

// Composite Index 2: Properties by location and price
Collection: properties
Fields:
  - location.city (Ascending)
  - price (Ascending)
  - createdAt (Descending)

// Composite Index 3: Properties by type and status
Collection: properties
Fields:
  - propertyType (Ascending)
  - status (Ascending)
  - createdAt (Descending)

// Composite Index 4: Properties by agent and status
Collection: properties
Fields:
  - agent.id (Ascending)
  - status (Ascending)
  - createdAt (Descending)

// Single Field Index: Properties by price range
Collection: properties
Field: price
Order: Ascending
Array: false
```

### Inquiries Collection Indexes
```javascript
// Composite Index 1: Inquiries by user and status
Collection: inquiries
Fields:
  - userId (Ascending)
  - status (Ascending)
  - createdAt (Descending)

// Composite Index 2: Inquiries by agent and status
Collection: inquiries
Fields:
  - agentId (Ascending)
  - status (Ascending)
  - createdAt (Descending)

// Composite Index 3: Inquiries by property and status
Collection: inquiries
Fields:
  - propertyId (Ascending)
  - status (Ascending)
  - createdAt (Descending)
```

### Reviews Collection Indexes
```javascript
// Composite Index 1: Reviews by property and rating
Collection: reviews
Fields:
  - propertyId (Ascending)
  - rating (Descending)
  - createdAt (Descending)

// Composite Index 2: Reviews by agent and rating
Collection: reviews
Fields:
  - agentId (Ascending)
  - rating (Descending)
  - createdAt (Descending)
```

### Property Analytics Collection Indexes
```javascript
// Composite Index 1: Analytics by property and date
Collection: propertyAnalytics
Fields:
  - propertyId (Ascending)
  - date (Descending)

// Composite Index 2: Analytics by date
Collection: propertyAnalytics
Fields:
  - date (Descending)
  - views (Descending)
```

## Database Initialization Script

Use this script to initialize your database with sample data:

```javascript
// Import this in your Firebase Functions or run once in your app
import { db } from './firebase/config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const initializeDatabase = async () => {
  try {
    // Initialize system settings
    await setDoc(doc(db, 'systemSettings', 'settings'), {
      site: {
        name: "Rural Properties",
        description: "Your trusted partner for rural real estate in South Africa",
        contactEmail: "info@ruralproperties.co.za",
        contactPhone: "+27 15 123 4567",
        address: "123 Main St, Tzaneen, 0850"
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
      },
      updatedAt: new Date().toISOString()
    });

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

export default initializeDatabase;
```

This complete database structure supports all features of your Property24-style rural real estate application.
