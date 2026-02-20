# Firebase Setup Guide

## 🚀 Quick Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project: `rural-roots-realty`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

### 3. Get Your Firebase Config

1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", click the web icon (`</>`)
3. Copy the `firebaseConfig` object
4. Replace the placeholder config in `src/lib/firebase/config.ts`

### 4. Update Firebase Config

Replace the placeholder in `src/lib/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "rural-roots-realty.firebaseapp.com",
  projectId: "rural-roots-realty",
  storageBucket: "rural-roots-realty.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};
```

With your actual config from Firebase.

### 5. Run the Application

```bash
npm run dev
```

The app will automatically:
- Connect to Firebase
- Initialize with sample property data
- Start using Firebase for all property operations

## 📊 Firebase Features Enabled

### Firestore Database
- **Collection**: `properties`
- **Documents**: Individual property listings
- **Real-time updates**: Properties update instantly across devices

### Data Structure
Each property document contains:
- `id`: Unique identifier
- `title`: Property title
- `location`: Property location
- `price`: Property price
- `size`: Property size
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `type`: Property type (Farm, Plot, House, Smallholding)
- `image`: Property image URL
- `featured`: Featured property flag
- `description`: Property description
- `amenities`: Array of amenities
- `coordinates`: GPS coordinates
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🔧 Firebase Rules (Security)

For development, Firebase uses test mode rules. For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Future Enhancements

### Authentication (Optional)
- User accounts for saving favorites
- Agent authentication for managing listings
- Social login integration

### Storage (Optional)
- Image uploads for property photos
- File management for documents
- CDN for optimized image delivery

### Hosting (Optional)
- Deploy your app to Firebase Hosting
- Automatic SSL certificates
- Global CDN distribution

## 🆘 Troubleshooting

### "Permission denied" errors
- Check Firestore rules in Firebase Console
- Ensure you're not in production mode with restrictive rules

### "Network error" 
- Verify your Firebase config is correct
- Check your internet connection
- Ensure Firestore is enabled in your project

### Data not appearing
- Open Firebase Console to verify data
- Check browser console for errors
- Ensure FirebaseInitializer is running

## 📞 Support

If you need help:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Firestore Documentation](https://firebase.google.com/docs/firestore)
3. Check browser console for specific error messages
