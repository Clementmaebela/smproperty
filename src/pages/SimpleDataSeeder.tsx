import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Database, Plus, CheckCircle, AlertTriangle, Home, Trash2, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';

const SimpleDataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [existingCount, setExistingCount] = useState<number>(0);

  const simpleProperties = [
    {
      title: "Beautiful Farm with River Access",
      description: "Stunning 15-hectare farm with river frontage, perfect for agriculture or development.",
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
      tags: ["river", "agriculture", "development", "water-rights"],
      amenities: ["river-access", "irrigation", "borehole", "fencing", "workers-quarters"],
      zoning: "agricultural",
      waterRights: true,
      electricity: true,
      roadAccess: "paved"
    },
    {
      title: "Modern Smallholding with Mountain Views",
      description: "Contemporary 8-hectare smallholding with breathtaking mountain views and modern amenities.",
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
      tags: ["mountain", "modern", "organic", "solar"],
      amenities: ["solar-power", "orchard", "vegetable-garden", "borehole", "fencing"],
      zoning: "residential-agricultural",
      waterRights: true,
      electricity: true,
      roadAccess: "gravel"
    },
    {
      title: "Residential Plot in Developing Suburb",
      description: "Prime 1200sqm residential plot in fast-growing suburb with all municipal services available.",
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
      description: "Charming 3-bedroom family house on 850sqm property with beautiful mature garden.",
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
      description: "Well-established 25-hectare agricultural farm with comprehensive irrigation systems and equipment.",
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
      console.log('🌱 Starting simple database seeding...');
      
      const propertiesCollection = collection(db, 'properties');
      let seededCount = 0;
      
      for (const property of simpleProperties) {
        try {
          const docRef = await addDoc(propertiesCollection, {
            ...property,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            views: Math.floor(Math.random() * 200),
            inquiries: Math.floor(Math.random() * 20)
          });
          seededCount++;
          console.log(`✅ Added property: ${property.title} (ID: ${docRef.id})`);
        } catch (error: any) {
          console.error(`❌ Failed to add property: ${property.title}`, error);
        }
      }
      
      const result = {
        success: true,
        message: `Successfully seeded ${seededCount} properties to database`,
        seededCount,
        totalProperties: simpleProperties.length
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
    
    setIsClearing(true);
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
      setIsClearing(false);
    }
  };

  // Check existing data on component mount
  useState(() => {
    checkExistingData();
  });

  return (
    <>
      <Helmet>
        <title>Simple Data Seeder | Rural Properties</title>
        <meta name="description" content="Simple database seeder for properties" />
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
                    Simple Data Seeder
                  </CardTitle>
                  <CardDescription>
                    Simple and reliable database seeder for properties
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
                      disabled={isClearing}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isClearing ? 'Clearing...' : 'Clear All Properties'}
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
                      {simpleProperties.map((property, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-sm mb-1">{property.title}</h5>
                          <p className="text-xs text-muted-foreground mb-2">{property.location.city}, {property.location.province}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-green-600">{property.priceFormatted}</span>
                            <Badge variant="outline" className="text-xs">
                              {property.propertyType}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="w-full"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reload Page
                        </Button>
                        <Button
                          onClick={() => window.open('/properties', '_blank')}
                          variant="outline"
                          className="w-full"
                        >
                          Test Properties
                        </Button>
                        <Button
                          onClick={() => window.open('/firestore-fix', '_blank')}
                          variant="outline"
                          className="w-full"
                        >
                          Fix Permissions
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Troubleshooting</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-green-600" />
                            <span>Check Firestore Rules</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span>Check Console Logs</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Database className="w-4 h-4 text-red-600" />
                            <span>Check Network Connection</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          If seeding fails, check browser console for detailed error messages.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Seed Database</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Test Properties Page</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Verify All Features</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          After seeding, your Property24-style app should work perfectly!
                        </p>
                      </CardContent>
                    </Card>
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

export default SimpleDataSeeder;
