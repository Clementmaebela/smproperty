// Database Connection Test Script
console.log('🔍 Testing Database Connection...');

// Test 1: Check if PropertiesService is accessible
try {
  const { PropertiesService } = await import('@/services/databaseService');
  console.log('✅ PropertiesService imported successfully');
  
  const properties = await PropertiesService.getProperties();
  console.log(`📊 Properties loaded: ${properties.length} items`);
  
  if (properties.length > 0) {
    console.log('✅ Database connection SUCCESS - Properties are loading');
    console.log('📋 First property:', properties[0]);
    console.log('📋 Property title:', properties[0].title);
    console.log('📋 Property price:', properties[0].price);
    console.log('📋 Property location:', properties[0].location);
  } else {
    console.log('❌ Database connection FAILED - No properties found');
  }
} catch (error) {
  console.error('❌ Database connection ERROR:', error);
}

// Test 2: Check if database has seeded data
try {
  const { db } = await import('@/lib/firebase/config');
  const { collection, getDocs } = await import('firebase/firestore');
  
  const propertiesCollection = collection(db, 'properties');
  const snapshot = await getDocs(propertiesCollection);
  
  console.log(`📊 Database contains ${snapshot.docs.length} properties`);
  
  snapshot.docs.forEach((doc, index) => {
    const data = doc.data();
    console.log(`📋 Property ${index + 1}:`, {
      title: data.title,
      price: data.price,
      location: data.location,
      hasPriceFormatted: !!data.priceFormatted,
      hasNestedLocation: typeof data.location === 'object'
    });
  });
  
  console.log('✅ Database structure verification complete');
} catch (error) {
  console.error('❌ Database structure verification ERROR:', error);
}

console.log('🎯 Database connection test complete!');
