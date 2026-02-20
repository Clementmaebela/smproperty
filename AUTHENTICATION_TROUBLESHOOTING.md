# 🔧 Authentication Troubleshooting Guide

## 🚨 **Issue: Failed to Create User Account**

If you're unable to create user accounts through the web app, follow this comprehensive troubleshooting guide.

---

## 🔍 **Common Issues & Solutions**

### **1. Email/Password Authentication Not Enabled**

**Problem**: Firebase error "Email/password accounts are not enabled"

**Solution**: Enable Email/Password authentication in Firebase Console

#### **Steps to Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ruralproperty-edae5`
3. Go to **Authentication** (left sidebar)
4. Click **Sign-in method**
5. Enable **Email/Password** authentication
6. Save changes

### **2. Firebase Configuration Issues**

**Problem**: Network errors or invalid configuration

**Solution**: Verify your Firebase config is correct

#### **Check Your Config:**
Your `src/lib/firebase/config.ts` should have:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyB5h_SRPkWNZUaffDcsOZJ6V_WOKStF6K8",
  authDomain: "ruralproperty-edae5.firebaseapp.com",
  projectId: "ruralproperty-edae5",
  storageBucket: "ruralproperty-edae5.firebasestorage.app",
  messagingSenderId: "762367837812",
  appId: "1:762367837812:web:2d1f60ab9000fcc1f7b321",
  measurementId: "G-HT5H7K5HCW"
};
```

### **3. Firestore Rules Blocking Authentication**

**Problem**: Permission denied errors

**Solution**: Update Firestore rules to allow user creation

#### **Current Issue**: Your Firestore rules might be too restrictive

#### **Fix Firestore Rules:**
1. Go to Firebase Console → Firestore Database
2. Click **Rules** tab
3. Replace rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all properties
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow users to create and manage their profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to create properties
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🛠️ **Step-by-Step Fix Process**

### **Step 1: Enable Authentication in Firebase Console**

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select project: `ruralproperty-edae5`

2. **Enable Email/Password Auth**
   - Click **Authentication** (left sidebar)
   - Click **Sign-in method**
   - Toggle **Email/Password** to **Enabled**
   - Click **Save**

3. **Enable Google Auth (Optional)**
   - Click **Google** under Sign-in method
   - Click **Enable**
   - Add your authorized domain
   - Click **Save**

### **Step 2: Update Firestore Rules**

1. **Go to Firestore Database**
   - In Firebase Console, click **Firestore Database**
   - Click **Rules** tab

2. **Update Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can manage their own profiles
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Anyone can read properties, but only authenticated users can write
       match /properties/{propertyId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Publish Rules**
   - Click **Publish**
   - Wait for rules to take effect (usually within 1 minute)

### **Step 3: Test Authentication**

1. **Clear Browser Cache**
   - Open browser dev tools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

2. **Try Creating Account**
   - Go to your app: http://localhost:8082
   - Click **Sign In** → **Sign Up**
   - Enter email and password (6+ characters)
   - Click **Create Account**

3. **Check Console Logs**
   - Open browser dev tools
   - Check **Console** tab for errors
   - Look for Firebase authentication errors

---

## 🔧 **Debugging Tools**

### **Browser Console Check**

Look for these specific errors:

```javascript
// Common Firebase errors
"auth/email-already-in-use" → Email already registered
"auth/invalid-email" → Invalid email format
"auth/weak-password" → Password too short (min 6 chars)
"auth/operation-not-allowed" → Email/password auth not enabled
"auth/too-many-requests" → Too many failed attempts
```

### **Network Tab Check**

1. Open browser dev tools
2. Go to **Network** tab
3. Try creating an account
4. Look for failed requests to Firebase
5. Check response codes and error messages

### **Firebase Console Check**

1. **Authentication Tab**
   - Check if Email/Password is enabled
   - Verify Google Auth status
   - Check user count

2. **Firestore Database**
   - Check if `users` collection exists
   - Verify rules are published
   - Look for recent user documents

---

## 🚀 **Testing Your Fix**

### **Test Case 1: Email/Password Sign Up**
1. Go to `/signup`
2. Enter valid email (test@example.com)
3. Enter password (6+ characters)
4. Click **Create Account**
5. **Expected**: Success and redirect to dashboard

### **Test Case 2: Google Sign In**
1. Go to `/signin` or `/signup`
2. Click **Continue with Google**
3. Authorize Google account
4. **Expected**: Success and redirect to dashboard

### **Test Case 3: Profile Creation**
1. After successful signup
2. Navigate to `/profile`
3. **Expected**: Profile auto-created with user data

### **Test Case 4: Property Creation**
1. After login, go to `/properties/add`
2. Fill out property form
3. Click **Create Property**
4. **Expected**: Property created with userId

---

## 🆘 **Common Error Messages & Solutions**

### **"auth/operation-not-allowed"**
- **Cause**: Email/password authentication not enabled
- **Fix**: Enable in Firebase Console → Authentication → Sign-in method

### **"auth/weak-password"**
- **Cause**: Password less than 6 characters
- **Fix**: Use password with 6+ characters

### **"auth/email-already-in-use"**
- **Cause**: Email already registered
- **Fix**: Use different email or sign in to existing account

### **"permission-denied"**
- **Cause**: Firestore rules too restrictive
- **Fix**: Update Firestore rules as shown above

### **"network-error"**
- **Cause**: Firebase config incorrect or network issues
- **Fix**: Verify config and check internet connection

---

## 📞 **Additional Support**

### **If Issues Persist:**

1. **Check Firebase Console Status**
   - Verify all services are enabled
   - Check for any service outages

2. **Clear Browser Data**
   - Clear cache, cookies, and local storage
   - Try different browser

3. **Verify Domain Configuration**
   - For Google Auth, ensure domain is authorized
   - Check CORS settings if needed

4. **Check Environment Variables**
   - Ensure Firebase config is not overridden
   - Verify no conflicting authentication setup

---

## 🎯 **Quick Fix Checklist**

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Firestore rules allow user creation
- [ ] Firebase config is correct in `src/lib/firebase/config.ts`
- [ ] Browser cache cleared
- [ ] Console errors checked and resolved
- [ ] Test account creation successful

---

**🎉 If you follow this guide, your user account creation should work perfectly!**

The most common issue is that **Email/Password authentication is not enabled** in Firebase Console. Once you enable it and update the Firestore rules, user account creation should work seamlessly.

If you're still having issues, please:
1. Check the browser console for specific error messages
2. Verify your Firebase project settings
3. Ensure all Firebase services are enabled
4. Test with different browsers if needed

Good luck! 🚀
