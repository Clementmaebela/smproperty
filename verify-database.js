// Database verification script
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase/config.js';

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...');
  
  const collections = [
    'properties',
    'users', 
    'agents',
    'inquiries',
    'reviews',
    'savedSearches',
    'propertyAnalytics',
    'systemSettings'
  ];
  
  const results = {};
  
  for (const collectionName of collections) {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      results[collectionName] = {
        success: true,
        count: snapshot.docs.length,
        accessible: true
      };
      console.log(`✅ ${collectionName}: ${snapshot.docs.length} documents`);
    } catch (error) {
      results[collectionName] = {
        success: false,
        error: error.message,
        accessible: false
      };
      console.log(`❌ ${collectionName}: ${error.message}`);
    }
  }
  
  // Test specific document access
  console.log('\n📋 Testing document access...');
  
  // Test system settings
  try {
    const settingsDoc = await getDoc(doc(db, 'systemSettings', 'settings'));
    if (settingsDoc.exists()) {
      console.log('✅ System settings accessible');
      results.systemSettingsTest = { success: true };
    } else {
      console.log('⚠️ System settings document not found');
      results.systemSettingsTest = { success: false, error: 'Document not found' };
    }
  } catch (error) {
    console.log(`❌ System settings error: ${error.message}`);
    results.systemSettingsTest = { success: false, error: error.message };
  }
  
  // Summary
  console.log('\n🎯 Verification Summary:');
  const successCount = Object.values(results).filter(r => r.success !== false).length;
  const totalCount = collections.length + 1; // +1 for system settings test
  
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 Database setup verification PASSED!');
  } else {
    console.log('\n⚠️ Database setup verification FAILED - some issues detected');
  }
  
  return results;
}

verifyDatabase().catch(console.error);
