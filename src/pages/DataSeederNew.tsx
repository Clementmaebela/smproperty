import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Database, Plus, CheckCircle, AlertTriangle, Home, Trash2, RefreshCw, Upload, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataSeeder from '@/services/dataSeeder';

const DataSeederNew = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [existingCounts, setExistingCounts] = useState({
    properties: 0,
    users: 0,
    agents: 0,
    inquiries: 0,
    reviews: 0,
    savedSearches: 0
  });

  const checkExistingData = async () => {
    try {
      // This would require implementing count functions in the database service
      // For now, we'll use placeholder counts
      setExistingCounts({
        properties: 0,
        users: 0,
        agents: 0,
        inquiries: 0,
        reviews: 0,
        savedSearches: 0
      });
    } catch (error: any) {
      console.error('Error checking existing data:', error);
    }
  };

  const seedAllData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      console.log('🌱 Starting complete database seeding...');
      const result = await DataSeeder.seedAll();
      
      setSeedResult({
        success: true,
        message: `Successfully seeded database with ${result.properties + result.users + result.agents + result.inquiries + result.reviews + result.savedSearches} items`,
        details: result
      });
      
      // Refresh counts
      await checkExistingData();
      
    } catch (error: any) {
      setSeedResult({
        success: false,
        message: `Failed to seed database: ${error.message}`,
        error: error
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const seedPropertiesOnly = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      const count = await DataSeeder.seedProperties();
      
      setSeedResult({
        success: true,
        message: `Successfully seeded ${count} properties`,
        details: { properties: count }
      });
      
      await checkExistingData();
      
    } catch (error: any) {
      setSeedResult({
        success: false,
        message: `Failed to seed properties: ${error.message}`,
        error: error
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const seedUsersOnly = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      const count = await DataSeeder.seedUsers();
      
      setSeedResult({
        success: true,
        message: `Successfully seeded ${count} users`,
        details: { users: count }
      });
      
      await checkExistingData();
      
    } catch (error: any) {
      setSeedResult({
        success: false,
        message: `Failed to seed users: ${error.message}`,
        error: error
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const seedAgentsOnly = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      const count = await DataSeeder.seedAgents();
      
      setSeedResult({
        success: true,
        message: `Successfully seeded ${count} agents`,
        details: { agents: count }
      });
      
      await checkExistingData();
      
    } catch (error: any) {
      setSeedResult({
        success: false,
        message: `Failed to seed agents: ${error.message}`,
        error: error
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear ALL data from the database? This action cannot be undone.')) {
      return;
    }
    
    setIsClearing(true);
    setSeedResult(null);
    
    try {
      const result = await DataSeeder.clearAll();
      
      setSeedResult({
        success: true,
        message: `Successfully cleared ${result.cleared} documents from database`,
        details: result
      });
      
      setExistingCounts({
        properties: 0,
        users: 0,
        agents: 0,
        inquiries: 0,
        reviews: 0,
        savedSearches: 0
      });
      
    } catch (error: any) {
      setSeedResult({
        success: false,
        message: `Failed to clear database: ${error.message}`,
        error: error
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Check existing data on component mount
  useState(() => {
    checkExistingData();
  });

  const totalItems = existingCounts.properties + existingCounts.users + existingCounts.agents + 
                   existingCounts.inquiries + existingCounts.reviews + existingCounts.savedSearches;

  return (
    <>
      <Helmet>
        <title>Database Seeder | Rural Properties</title>
        <meta name="description" content="Seed your database with comprehensive sample data" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Comprehensive Database Seeder
                  </CardTitle>
                  <CardDescription>
                    Seed your Firestore database with complete sample data for all features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Status */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Current Database Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{existingCounts.properties}</div>
                        <div className="text-sm text-muted-foreground">Properties</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{existingCounts.users}</div>
                        <div className="text-sm text-muted-foreground">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{existingCounts.agents}</div>
                        <div className="text-sm text-muted-foreground">Agents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{existingCounts.inquiries}</div>
                        <div className="text-sm text-muted-foreground">Inquiries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-600">{existingCounts.reviews}</div>
                        <div className="text-sm text-muted-foreground">Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">{existingCounts.savedSearches}</div>
                        <div className="text-sm text-muted-foreground">Saved Searches</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm">
                        Total Items: <strong>{totalItems}</strong>
                      </span>
                      {totalItems === 0 && (
                        <Badge variant="destructive">Database Empty</Badge>
                      )}
                      {totalItems > 0 && (
                        <Badge variant="default">Has Data</Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All Data</TabsTrigger>
                      <TabsTrigger value="individual">Individual</TabsTrigger>
                      <TabsTrigger value="manage">Manage</TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          onClick={seedAllData}
                          disabled={isSeeding}
                          className="flex items-center gap-2 h-12"
                        >
                          <Upload className="w-4 h-4" />
                          {isSeeding ? 'Seeding All Data...' : 'Seed Complete Database'}
                        </Button>
                        
                        <Button
                          onClick={clearAllData}
                          disabled={isClearing}
                          variant="destructive"
                          className="flex items-center gap-2 h-12"
                        >
                          <Trash2 className="w-4 h-4" />
                          {isClearing ? 'Clearing...' : 'Clear All Data'}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="individual" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          onClick={seedPropertiesOnly}
                          disabled={isSeeding}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Home className="w-4 h-4" />
                          {isSeeding ? 'Seeding...' : 'Seed Properties'}
                        </Button>
                        
                        <Button
                          onClick={seedUsersOnly}
                          disabled={isSeeding}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {isSeeding ? 'Seeding...' : 'Seed Users'}
                        </Button>
                        
                        <Button
                          onClick={seedAgentsOnly}
                          disabled={isSeeding}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Database className="w-4 h-4" />
                          {isSeeding ? 'Seeding...' : 'Seed Agents'}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="manage" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          onClick={checkExistingData}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refresh Counts
                        </Button>
                        
                        <Button
                          onClick={() => window.open('/properties', '_blank')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Home className="w-4 h-4" />
                          View Properties
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="info" className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Sample Data Includes:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                          <div>
                            <strong>Properties (5):</strong>
                            <ul className="ml-4 list-disc">
                              <li>Farms with river access</li>
                              <li>Modern smallholdings</li>
                              <li>Residential plots</li>
                              <li>Family houses</li>
                              <li>Agricultural farms</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Users (4):</strong>
                            <ul className="ml-4 list-disc">
                              <li>1 Admin user</li>
                              <li>2 Agent users</li>
                              <li>1 Regular user</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Additional Data:</strong>
                            <ul className="ml-4 list-disc">
                              <li>Agent profiles with specializations</li>
                              <li>Sample inquiries and responses</li>
                              <li>Property reviews and ratings</li>
                              <li>Saved searches with filters</li>
                              <li>System settings</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Features Supported:</strong>
                            <ul className="ml-4 list-disc">
                              <li>Property search and filtering</li>
                              <li>Agent profiles and reviews</li>
                              <li>User inquiries and messaging</li>
                              <li>Saved searches and alerts</li>
                              <li>Analytics and tracking</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

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
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-decimal">
                      <li>Use "Seed Complete Database" to add all sample data at once</li>
                      <li>Use individual seeding options to add specific data types</li>
                      <li>Check console logs for detailed progress information</li>
                      <li>Use "Clear All Data" to reset the database completely</li>
                      <li>After seeding, test all features on the main application</li>
                    </ol>
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

export default DataSeederNew;
