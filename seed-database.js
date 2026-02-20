// Simple database seeding script
import { DataSeeder } from './src/services/dataSeeder.ts';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    const results = await DataSeeder.seedAll();
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Results:', results);
    
    console.log('\n🎉 Summary:');
    console.log(`- Properties: ${results.properties}`);
    console.log(`- Users: ${results.users}`);
    console.log(`- Agents: ${results.agents}`);
    console.log(`- Inquiries: ${results.inquiries}`);
    console.log(`- Reviews: ${results.reviews}`);
    console.log(`- Saved Searches: ${results.savedSearches}`);
    console.log(`- System Settings: ${results.systemSettings ? '✅' : '❌'}`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️ Errors:');
      results.errors.forEach(error => console.log(`- ${error}`));
    }
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
