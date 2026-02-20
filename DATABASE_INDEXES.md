# Required Composite Indexes for Rural Properties Database

## Properties Collection Indexes

### Index 1: Properties by status and featured
```
Collection ID: properties
Fields:
  - status (Ascending)
  - featured (Descending) 
  - createdAt (Descending)
Query Scope: Collection
```

### Index 2: Properties by location and price
```
Collection ID: properties
Fields:
  - location.city (Ascending)
  - price (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

### Index 3: Properties by type and status
```
Collection ID: properties
Fields:
  - propertyType (Ascending)
  - status (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

### Index 4: Properties by agent and status
```
Collection ID: properties
Fields:
  - agent.id (Ascending)
  - status (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

### Index 5: Properties by price range
```
Collection ID: properties
Fields:
  - price (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

## Inquiries Collection Indexes

### Index 1: Inquiries by user and status
```
Collection ID: inquiries
Fields:
  - userId (Ascending)
  - status (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

### Index 2: Inquiries by agent and status
```
Collection ID: inquiries
Fields:
  - agentId (Ascending)
  - status (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

## Reviews Collection Indexes

### Index 1: Reviews by property and rating
```
Collection ID: reviews
Fields:
  - propertyId (Ascending)
  - rating (Descending)
  - createdAt (Descending)
Query Scope: Collection
```

### Index 2: Reviews by agent and status
```
Collection ID: reviews
Fields:
  - agentId (Ascending)
  - status (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

## Saved Searches Collection Indexes

### Index 1: Saved searches by user
```
Collection ID: savedSearches
Fields:
  - userId (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

## Property Analytics Collection Indexes

### Index 1: Analytics by property and date
```
Collection ID: propertyAnalytics
Fields:
  - propertyId (Ascending)
  - date (Ascending)
Query Scope: Collection
```

## Users Collection Indexes

### Index 1: Users by role
```
Collection ID: users
Fields:
  - role (Ascending)
  - createdAt (Descending)
Query Scope: Collection
```

## Agents Collection Indexes

### Index 1: Agents by areas and rating
```
Collection ID: agents
Fields:
  - areas (Array contains)
  - rating (Descending)
Query Scope: Collection
```

### Index 2: Agents by specializations
```
Collection ID: agents
Fields:
  - specializations (Array contains)
  - isActive (Ascending)
  - rating (Descending)
Query Scope: Collection
```

## How to Create These Indexes

### Method 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ruralproperty-edae5`
3. Navigate to Firestore Database → Indexes
4. Click "Add Index"
5. Create each index using the specifications above

### Method 2: Firebase CLI
Create an `firestore.indexes.json` file with the index definitions and run:
```bash
firebase deploy --only firestore:indexes
```

### Method 3: Automatic Creation
Run the application and perform queries. Firestore will suggest missing indexes automatically.

## Index Creation Time
- **Small indexes**: 1-2 minutes
- **Large collections**: 5-10 minutes
- **Complex composite indexes**: 10-15 minutes

## Monitoring Index Creation
1. In Firebase Console → Firestore Database → Indexes
2. Check the "Status" column:
   - ⏳ Building: Index is being created
   - ✅ Ready: Index is active
   - ❌ Error: Index creation failed

## Testing Indexes
After indexes are created, test them using:
- Database Test Page: `http://localhost:8081/db-test`
- Application search and filtering features
- Agent listings and property searches
