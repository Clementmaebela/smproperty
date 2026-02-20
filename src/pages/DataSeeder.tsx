import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Database, Plus, CheckCircle, AlertTriangle, Home, Trash2, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const sampleProperties = [
  {
    title: "Beautiful Farm with River Access",
    location: "Tzaneen, Limpopo",
    price: "R2,450,000",
    size: "15 hectares",
    bedrooms: 4,
    bathrooms: 2,
    type: "Farm",
    status: "active",
    description: "Stunning farm with river access, perfect for agriculture or development.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    featured: true,
    inquiries: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Modern Smallholding with Views",
    location: "Nelspruit, Mpumalanga",
    price: "R1,850,000",
    size: "8 hectares",
    bedrooms: 3,
    bathrooms: 2,
    type: "Smallholding",
    status: "active",
    description: "Modern smallholding with beautiful mountain views and excellent soil quality.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
    featured: true,
    inquiries: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Residential Plot in Suburb",
    location: "Polokwane, Limpopo",
    price: "R450,000",
    size: "1200 sqm",
    bedrooms: 0,
    bathrooms: 0,
    type: "Plot",
    status: "active",
    description: "Perfect residential plot in developing suburb with all utilities available.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
    featured: false,
    inquiries: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Family House with Garden",
    location: "Middelburg, Mpumalanga",
    price: "R980,000",
    size: "850 sqm",
    bedrooms: 3,
    bathrooms: 2,
    type: "House",
    status: "active",
    description: "Lovely family house with large garden, perfect for rural living.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be7?w=400&q=80",
    featured: true,
    inquiries: 23,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Agricultural Farm with Irrigation",
    location: "Hoedspruit, Mpumalanga",
    price: "R3,200,000",
    size: "25 hectares",
    bedrooms: 5,
    bathrooms: 3,
    type: "Farm",
    status: "active",
    description: "Well-established agricultural farm with irrigation systems and equipment.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    featured: false,
    inquiries: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [existingCount, setExistingCount] = useState<number>(0);

  const checkExistingData = async () => {
    try {
      const propertiesCollection = collection(db, 'properties');
      const querySnapshot = await getDocs(propertiesCollection);
      setExistingCount(querySnapshot.docs.length);
      return querySnapshot.docs.length;
    } catch (error: any) {
      console.error('Error checking existing data:', error);
      return 0;
    }
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      console.log('🌱 Starting database seeding...');
      
      const propertiesCollection = collection(db, 'properties');
      let seededCount = 0;
      
      for (const property of sampleProperties) {
        try {
          const docRef = await addDoc(propertiesCollection, property);
          console.log(`✅ Added property: ${property.title} (ID: ${docRef.id})`);
          seededCount++;
        } catch (error: any) {
          console.error(`❌ Failed to add property: ${property.title}`, error);
        }
      }
      
      const result = {
        success: true,
        message: `Successfully seeded ${seededCount} properties to database`,
        seededCount,
        totalProperties: sampleProperties.length
      };
      
      setSeedResult(result);
      console.log('🎉 Database seeding completed:', result);
      
      // Refresh the count
      await checkExistingData();
      
    } catch (error: any) {
      const result = {
        success: false,
        message: `Failed to seed database: ${error.message}`,
        error: error
      };
      setSeedResult(result);
      console.error('❌ Database seeding failed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const clearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all properties? This action cannot be undone.')) {
      return;
    }
    
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      console.log('🗑️ Clearing database...');
      
      const propertiesCollection = collection(db, 'properties');
      const querySnapshot = await getDocs(propertiesCollection);
      
      let deletedCount = 0;
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
        deletedCount++;
      }
      
      const result = {
        success: true,
        message: `Successfully deleted ${deletedCount} properties from database`,
        deletedCount
      };
      
      setSeedResult(result);
      console.log('🗑️ Database cleared:', result);
      setExistingCount(0);
      
    } catch (error: any) {
      const result = {
        success: false,
        message: `Failed to clear database: ${error.message}`,
        error: error
      };
      setSeedResult(result);
      console.error('❌ Database clearing failed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  // Check existing data on component mount
  useState(() => {
    checkExistingData();
  });

  return (
    <>
      <Helmet>
        <title>Data Seeder | Rural Properties</title>
        <meta name="description" content="Seed your database with sample properties" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Database Seeder Tool
                  </CardTitle>
                  <CardDescription>
                    Seed your Firestore database with sample properties for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Status */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Current Database Status</h4>
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        {existingCount} properties currently in database
                      </span>
                      {existingCount === 0 && (
                        <Badge variant="destructive">Empty</Badge>
                      )}
                      {existingCount > 0 && (
                        <Badge variant="default">Has Data</Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={seedDatabase}
                      disabled={isSeeding}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {isSeeding ? 'Seeding...' : 'Seed Sample Properties'}
                    </Button>
                    
                    <Button
                      onClick={clearDatabase}
                      disabled={isSeeding}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Database className="w-4 h-4" />
                      {isSeeding ? 'Clearing...' : 'Clear All Properties'}
                    </Button>
                  </div>

                  {/* Result */}
                  {seedResult && (
                    <div className={`p-4 rounded-lg ${
                      seedResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        {seedResult.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h4 className={`font-semibold ${
                            seedResult.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {seedResult.success ? 'Success' : 'Error'}
                          </h4>
                          <p className={`text-sm ${
                            seedResult.success ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {seedResult.message}
                          </p>
                          {seedResult.details && (
                            <details className="mt-2">
                              <summary className="text-sm cursor-pointer">
                                <strong>Details:</strong>
                              </summary>
                              <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto">
                                {JSON.stringify(seedResult.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-800">Instructions:</h4>
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-decimal">
                      <li>Click "Seed Sample Properties" to add sample data to your database</li>
                      <li>Wait for the process to complete (check console for progress)</li>
                      <li>Once seeded, go to the Properties page to test</li>
                      <li>Use "Clear All Properties" to reset the database if needed</li>
                    </ol>
                  </div>

                  {/* Sample Data Preview */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Sample Properties to be Seeded:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sampleProperties.map((property, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-sm mb-1">{property.title}</h5>
                          <p className="text-xs text-muted-foreground mb-2">{property.location}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-green-600">{property.price}</span>
                            <Badge variant="outline" className="text-xs">
                              {property.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default DataSeeder;
