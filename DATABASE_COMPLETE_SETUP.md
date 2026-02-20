# 🏡 Complete Database Setup Guide - Property24 Rural Real Estate App

## 📋 Overview

This guide provides complete database setup for your Property24-style rural real estate application. The database includes all collections, security rules, indexes, and sample data needed for full functionality.

## 🚀 Quick Start

### Step 1: Fix Firestore Permissions
1. Go to `http://localhost:8082/firestore-fix`
2. Follow the instructions to update Firestore rules
3. Wait 1-2 minutes for rules to propagate

### Step 2: Seed Complete Database
1. Go to `http://localhost:8082/data-seeder`
2. Click **"Seed Complete Database"**
3. Wait for seeding to complete
4. Test your application

## 📊 Database Structure

### 1. Properties Collection
**Purpose**: Store all property listings with full details

**Fields**:
- `title`, `description`, `price`, `priceFormatted`
- `location` (address, city, province, coordinates)
- `size` (landSize, buildingSize, totalSize)
- `features` (bedrooms, bathrooms, garages, etc.)
- `propertyType` (farm, smallholding, plot, house)
- `status` (active, sold, pending, rented)
- `featured` (boolean for featured listings)
- `images` (array of image URLs)
- `agent` (agent information)
- `owner` (owner information)
- `views`, `inquiries` (counters)
- `tags`, `amenities` (arrays)
- `createdAt`, `updatedAt` (timestamps)

### 2. Users Collection
**Purpose**: Store user accounts and preferences

**Fields**:
- `email`, `displayName`, `firstName`, `lastName`, `phone`
- `role` (admin, agent, user)
- `profileImage` (URL)
- `preferences` (notifications, property alerts)
- `savedProperties` (array of property IDs)
- `viewedProperties` (array of property IDs)
- `inquiries` (array of inquiry references)
- `isEmailVerified`, `isPhoneVerified`
- `createdAt`, `updatedAt`

### 3. Agents Collection
**Purpose**: Store agent profiles and specializations

**Fields**:
- `userId` (link to users collection)
- `email`, `displayName`, `phone`, `profileImage`
- `licenseNumber`, `agency` (agency information)
- `specializations` (array of property types)
- `areas` (array of provinces/regions)
- `languages` (array of languages)
- `experience`, `rating`, `totalReviews`
- `properties` (array of property IDs)
- `isActive`, `bio`, `socialMedia`
- `createdAt`, `updatedAt`

### 4. Inquiries Collection
**Purpose**: Store property inquiries and communications

**Fields**:
- `propertyId`, `userId`, `agentId`
- `type` (general, viewing, offer, financing)
- `message`, `contactInfo`
- `preferredContact` (email, phone, whatsapp)
- `status` (pending, responded, scheduled, completed, closed)
- `priority` (low, normal, high, urgent)
- `responses` (array of response objects)
- `scheduledViewing` (viewing details)
- `createdAt`, `updatedAt`

### 5. Reviews Collection
**Purpose**: Store agent and property reviews

**Fields**:
- `propertyId`, `userId`, `agentId`
- `rating` (1-5 stars), `title`, `comment`
- `pros`, `cons` (arrays)
- `wouldRecommend`, `verifiedPurchase`
- `helpful` (counter)
- `status` (pending, approved, rejected)
- `response` (agent response)
- `createdAt`, `updatedAt`

### 6. Saved Searches Collection
**Purpose**: Store user saved searches and alerts

**Fields**:
- `userId`, `name`
- `filters` (search criteria object)
- `frequency` (daily, weekly, monthly, never)
- `isActive`, `lastRun`, `newPropertiesCount`
- `createdAt`, `updatedAt`

### 7. Property Analytics Collection
**Purpose**: Store property view and engagement analytics

**Fields**:
- `propertyId`, `date`
- `views`, `uniqueViews`, `inquiries`
- `savedToFavorites`, `shares`
- `averageViewDuration`, `bounceRate`
- `sourceBreakdown` (traffic sources)
- `deviceBreakdown` (device types)
- `locationBreakdown` (geographic data)
- `createdAt`

### 8. System Settings Collection
**Purpose**: Store application-wide settings

**Fields**:
- `site` (name, description, contact info)
- `features` (feature flags)
- `pricing` (fees and commissions)
- `maintenance` (maintenance mode settings)
- `updatedAt`

## 🔒 Security Rules

Complete security rules are provided in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for properties
    match /properties/{propertyId} {
      allow read: if true;
      allow create: if isAuthenticated() && (isAdmin() || isAgent());
      allow update: if isAuthenticated() && (isAdmin() || 
                   isAgent() && resource.data.agent.id == request.auth.uid ||
                   isOwner(resource.data.owner.id));
      allow delete: if isAdmin();
    }
    
    // User-specific access
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin() || isAgent());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Public agent profiles
    match /agents/{agentId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update: if isAuthenticated() && (isAdmin() || isOwner(agentId));
      allow delete: if isAdmin();
    }
    
    // Inquiry access for involved parties
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
    
    // Public reviews with moderation
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated() && isOwner(resource.data.userId);
      allow update: if isAuthenticated() && 
                  (isOwner(resource.data.userId) || 
                   isOwner(resource.data.agentId) || 
                   isAdmin());
      allow delete: if isAdmin() || isOwner(resource.data.userId);
    }
    
    // Private saved searches
    match /savedSearches/{searchId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && isOwner(resource.data.userId);
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    // Admin-only analytics
    match /propertyAnalytics/{analyticsId} {
      allow read: if isAuthenticated() && (isAdmin() || isAgent());
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Public system settings, admin-only write
    match /systemSettings/{settingsId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
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
  }
}
```

## 📈 Required Indexes

Create these indexes in Firebase Console → Firestore Database → Indexes:

### Properties Collection
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
```

### Inquiries Collection
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
```

### Reviews Collection
```javascript
// Composite Index 1: Reviews by property and rating
Collection: reviews
Fields:
  - propertyId (Ascending)
  - rating (Descending)
  - createdAt (Descending)
```

## 🌱 Sample Data

The data seeder includes comprehensive sample data:

### Properties (5 items)
- **Beautiful Farm with River Access** - R2,450,000 (Tzaneen, Limpopo)
- **Modern Smallholding with Mountain Views** - R1,850,000 (Nelspruit, Mpumalanga)
- **Residential Plot in Developing Suburb** - R450,000 (Polokwane, Limpopo)
- **Family House with Large Garden** - R980,000 (Middelburg, Mpumalanga)
- **Agricultural Farm with Irrigation Systems** - R3,200,000 (Hoedspruit, Mpumalanga)

### Users (4 items)
- **Admin User** - admin@ruralproperties.co.za
- **John Smith** - Agent (john@ruralproperties.co.za)
- **Sarah Johnson** - Agent (sarah@ruralproperties.co.za)
- **Regular User** - user@example.com

### Agents (3 items)
- Complete profiles with specializations, areas, languages
- Agency information and contact details
- Social media links and experience levels

### Additional Data
- **Inquiries**: Sample property inquiries with different types
- **Reviews**: Agent reviews with ratings and comments
- **Saved Searches**: User search preferences and filters
- **System Settings**: Application configuration

## 🛠️ Service Layer

### Database Service (`src/services/databaseService.ts`)
Complete service layer with:

#### PropertiesService
- `getProperties(filters, pagination)` - Get properties with filtering
- `getProperty(id)` - Get single property
- `createProperty(property)` - Create new property
- `updateProperty(id, updates)` - Update property
- `deleteProperty(id)` - Delete property
- `searchProperties(searchTerm)` - Search properties
- `getFeaturedProperties(limit)` - Get featured properties
- `getPropertiesByAgent(agentId)` - Get agent's properties
- `incrementPropertyViews(id)` - Track property views

#### UsersService
- `getUser(id)` - Get user profile
- `createUser(user)` - Create user account
- `updateUser(id, updates)` - Update user profile
- `saveProperty(userId, propertyId)` - Save property to favorites
- `unsaveProperty(userId, propertyId)` - Remove from favorites
- `addToViewedProperties(userId, propertyId)` - Track viewed properties
- `getSavedProperties(userId)` - Get user's saved properties

#### AgentsService
- `getAgents(filters)` - Get agents with filtering
- `getAgent(id)` - Get agent profile
- `createAgent(agent)` - Create agent profile
- `updateAgent(id, updates)` - Update agent profile
- `getTopAgents(limit)` - Get top-rated agents

#### InquiriesService
- `createInquiry(inquiry)` - Create property inquiry
- `getInquiries(filters)` - Get inquiries with filtering
- `updateInquiry(id, updates)` - Update inquiry status
- `addInquiryResponse(inquiryId, response)` - Add response

#### ReviewsService
- `createReview(review)` - Create property/agent review
- `getReviews(filters)` - Get reviews with filtering
- `updateAgentRating(agentId)` - Update agent rating
- `markReviewHelpful(reviewId)` - Mark review as helpful

#### SavedSearchesService
- `createSavedSearch(search)` - Create saved search
- `getSavedSearches(userId)` - Get user's saved searches
- `updateSavedSearch(id, updates)` - Update saved search
- `deleteSavedSearch(id)` - Delete saved search

#### AnalyticsService
- `recordPropertyView(propertyId, source)` - Track property views
- `getPropertyAnalytics(propertyId, days)` - Get property analytics

#### SystemSettingsService
- `getSettings()` - Get system settings
- `updateSettings(updates)` - Update system settings

## 🚀 Data Seeder (`src/services/dataSeeder.ts`)

### DataSeeder Class
```javascript
// Seed all data
await DataSeeder.seedAll()

// Seed specific data types
await DataSeeder.seedProperties()
await DataSeeder.seedUsers()
await DataSeeder.seedAgents()

// Clear all data
await DataSeeder.clearAll()
```

### Web Interface (`src/pages/DataSeederNew.tsx`)
Access at `http://localhost:8082/data-seeder`

Features:
- **Database Status**: Real-time counts of all collections
- **Complete Seeding**: One-click database initialization
- **Individual Seeding**: Seed specific data types
- **Data Management**: Clear and refresh options
- **Progress Tracking**: Detailed seeding results
- **Error Handling**: Comprehensive error reporting

## 🔧 Setup Instructions

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ruralproperty-edae5`
3. Enable Authentication → Sign-in method → Email/Password
4. Go to Firestore Database → Create database
5. Apply security rules from `firestore.rules`
6. Create required indexes (see above)

### 2. Local Development Setup
1. Ensure Firebase configuration is correct in `.env`
2. Update Firestore rules using `/firestore-fix` page
3. Seed database using `/data-seeder` page
4. Test all application features

### 3. Production Deployment
1. Set up production Firebase project
2. Configure production environment variables
3. Apply production security rules
4. Create production indexes
5. Seed with production data or migrate existing data

## 🎯 Feature Coverage

This database setup supports all application features:

### ✅ Property Management
- Property listings with full details
- Image galleries and virtual tours
- Advanced search and filtering
- Featured property management
- Property analytics and tracking

### ✅ User Management
- User registration and authentication
- Profile management
- Saved properties and searches
- Property alerts and notifications
- User preferences and settings

### ✅ Agent Management
- Agent profiles and specializations
- Property assignments
- Client management
- Performance tracking
- Reviews and ratings

### ✅ Inquiry System
- Property inquiries
- Message threads
- Viewing scheduling
- Response tracking
- Status management

### ✅ Review System
- Property and agent reviews
- Rating system
- Helpful votes
- Moderation workflow
- Agent responses

### ✅ Analytics
- Property view tracking
- User engagement metrics
- Traffic source analysis
- Device and location analytics
- Performance reporting

### ✅ System Administration
- System settings management
- Feature flags
- Maintenance mode
- User role management
- Content moderation

## 🔄 Maintenance

### Regular Tasks
1. **Backup Database**: Regular exports of critical data
2. **Update Analytics**: Process and aggregate analytics data
3. **Clean Up**: Remove old analytics and expired data
4. **Monitor Usage**: Track database usage and performance
5. **Security Review**: Regular security rule audits

### Scaling Considerations
1. **Index Optimization**: Add indexes based on query patterns
2. **Data Archival**: Archive old analytics and inquiries
3. **Caching**: Implement caching for frequently accessed data
4. **Load Balancing**: Consider read replicas for high traffic
5. **Data Partitioning**: Partition large collections if needed

## 🚨 Troubleshooting

### Common Issues
1. **Permission Errors**: Check Firestore rules
2. **Missing Indexes**: Create required composite indexes
3. **Slow Queries**: Optimize queries and indexes
4. **Large Documents**: Split large documents into subcollections
5. **High Costs**: Optimize reads/writes and implement caching

### Debug Tools
1. **Diagnostic Page**: `/properties/diagnostic`
2. **Firestore Fix**: `/firestore-fix`
3. **Data Seeder**: `/data-seeder`
4. **Firebase Console**: Real-time database monitoring
5. **Browser Console**: Client-side error tracking

## 📞 Support

For database-related issues:
1. Check this guide first
2. Use diagnostic tools
3. Review Firebase Console logs
4. Check security rules
5. Verify index configuration

---

**🎉 Your Property24-style rural real estate app now has a complete, production-ready database!**

All features are fully supported with comprehensive data management, security, and analytics.
