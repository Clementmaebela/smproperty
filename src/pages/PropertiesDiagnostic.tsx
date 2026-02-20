import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AlertTriangle, Database, CheckCircle, RefreshCw, Bug, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PropertiesDiagnostic = () => {
  const [activeTab, setActiveTab] = useState('connection');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Test 1: Basic Firebase Connection
  const testFirebaseConnection = async () => {
    setIsRunning(true);
    try {
      console.log('🔥 Testing Firebase connection...');
      const testCollection = collection(db, 'test');
      const testDoc = await getDocs(testCollection);
      const result = {
        test: 'Firebase Connection',
        status: 'success',
        message: `Connected successfully. Found ${testDoc.docs.length} documents in 'test' collection.`,
        details: testDoc.docs.map(doc => ({ id: doc.id, data: doc.data() }))
      };
      setTestResults(prev => [...prev, result]);
      console.log('✅ Firebase connection test passed:', result);
    } catch (error: any) {
      const result = {
        test: 'Firebase Connection',
        status: 'failed',
        message: error.message || 'Unknown error',
        details: error
      };
      setTestResults(prev => [...prev, result]);
      console.error('❌ Firebase connection test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Test 2: Properties Collection Access
  const testPropertiesCollection = async () => {
    setIsRunning(true);
    try {
      console.log('🏠 Testing properties collection access...');
      const propertiesCollection = collection(db, 'properties');
      const querySnapshot = await getDocs(propertiesCollection);
      const result = {
        test: 'Properties Collection Access',
        status: 'success',
        message: `Successfully accessed properties collection. Found ${querySnapshot.docs.length} properties.`,
        details: querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
      };
      setTestResults(prev => [...prev, result]);
      console.log('✅ Properties collection test passed:', result);
    } catch (error: any) {
      const result = {
        test: 'Properties Collection Access',
        status: 'failed',
        message: error.message || 'Unknown error',
        details: error
      };
      setTestResults(prev => [...prev, result]);
      console.error('❌ Properties collection test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Test 3: Properties Query with Filters
  const testPropertiesQuery = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Testing properties query with filters...');
      const propertiesCollection = collection(db, 'properties');
      const q = query(propertiesCollection, orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const result = {
        test: 'Properties Query',
        status: 'success',
        message: `Successfully queried properties with filters. Found ${querySnapshot.docs.length} properties.`,
        details: querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
      };
      setTestResults(prev => [...prev, result]);
      console.log('✅ Properties query test passed:', result);
    } catch (error: any) {
      const result = {
        test: 'Properties Query',
        status: 'failed',
        message: error.message || 'Unknown error',
        details: error
      };
      setTestResults(prev => [...prev, result]);
      console.error('❌ Properties query test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Test 4: User Authentication
  const testUserAuthentication = async () => {
    setIsRunning(true);
    try {
      console.log('🔐 Testing user authentication...');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      const result = {
        test: 'User Authentication',
        status: currentUser ? 'success' : 'warning',
        message: currentUser 
          ? `User authenticated: ${currentUser.email}` 
          : 'No user currently authenticated',
        details: {
          uid: currentUser?.uid,
          email: currentUser?.email,
          isAnonymous: currentUser?.isAnonymous
        }
      };
      setTestResults(prev => [...prev, result]);
      console.log('✅ User authentication test result:', result);
    } catch (error: any) {
      const result = {
        test: 'User Authentication',
        status: 'failed',
        message: error.message || 'Unknown error',
        details: error
      };
      setTestResults(prev => [...prev, result]);
      console.error('❌ User authentication test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Test 5: Firebase Configuration
  const testFirebaseConfig = async () => {
    setIsRunning(true);
    try {
      console.log('⚙️ Testing Firebase configuration...');
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };
      
      const missingKeys = [];
      if (!config.apiKey) missingKeys.push('VITE_FIREBASE_API_KEY');
      if (!config.authDomain) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
      if (!config.projectId) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
      if (!config.appId) missingKeys.push('VITE_FIREBASE_APP_ID');
      
      const result = {
        test: 'Firebase Configuration',
        status: missingKeys.length === 0 ? 'success' : 'warning',
        message: missingKeys.length === 0 
          ? 'All Firebase configuration variables are set' 
          : `Missing Firebase configuration: ${missingKeys.join(', ')}`,
        details: config
      };
      setTestResults(prev => [...prev, result]);
      console.log('⚙️ Firebase configuration test result:', result);
    } catch (error: any) {
      const result = {
        test: 'Firebase Configuration',
        status: 'failed',
        message: error.message || 'Unknown error',
        details: error
      };
      setTestResults(prev => [...prev, result]);
      console.error('❌ Firebase configuration test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Test 6: Firestore Rules
  const testFirestoreRules = async () => {
    setIsRunning(true);
    try {
      console.log('📋 Testing Firestore rules...');
      
      // Test reading from properties collection
      const propertiesCollection = collection(db, 'properties');
      const readTest = await getDocs(propertiesCollection);
      
      // Test writing to test collection
      const testCollection = collection(db, 'test');
      const writeTest = await addDoc(testCollection, {
        test: true,
        timestamp: new Date().toISOString()
      });
      
      const result = {
        test: 'Firestore Rules',
        status: 'success',
        message: `Firestore rules test passed. Read ${readTest.docs.length} properties, wrote test document.`,
        details: {
          readCount: readTest.docs.length,
          writeSuccess: true,
          testDocId: writeTest.id
        }
      };
      setTestResults(prev => [...prev, result]);
      console.log('✅ Firestore rules test passed:', result);
    } catch (error: any) {
      const result = {
        test: 'Firestore Rules',
        status: 'failed',
        message: error.message || 'Unknown error',
        details: error
      };
      setTestResults(prev => [...prev, result]);
      console.error('❌ Firestore rules test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    await testFirebaseConnection();
    await testFirebaseConfig();
    await testUserAuthentication();
    await testPropertiesCollection();
    await testPropertiesQuery();
    await testFirestoreRules();
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <Bug className="w-5 h-5 text-red-600" />;
      default: return <Database className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Properties Diagnostic | Rural Properties</title>
        <meta name="description" content="Diagnose and fix properties loading issues" />
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
                    Properties Diagnostic Tool
                  </CardTitle>
                  <CardDescription>
                    Comprehensive diagnostic tool to identify and fix properties loading issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={runAllTests}
                      disabled={isRunning}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isRunning ? 'Running Tests...' : 'Run All Tests'}
                    </Button>
                    <Button
                      onClick={clearResults}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear Results
                    </Button>
                  </div>

                  {/* Test Results */}
                  {testResults.length > 0 && (
                    <div className="space-y-4">
                      {testResults.map((result, index) => (
                        <Card key={index} className="border-l-4 border-l-transparent">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {getStatusIcon(result.status)}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold">{result.test}</h4>
                                <Badge 
                                  variant={result.status === 'success' ? 'default' : result.status === 'warning' ? 'secondary' : 'destructive'}
                                >
                                  {result.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.message}
                            </p>
                            {result.details && (
                              <details className="mt-2">
                                <summary className="text-sm text-muted-foreground cursor-pointer">
                                  <strong>Details:</strong>
                                </summary>
                                <pre className="text-xs text-muted-foreground bg-muted p-2 rounded mt-2 overflow-x-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Test Instructions */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Test Instructions:</h4>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-decimal">
                      <li>Click "Run All Tests" to run comprehensive diagnostics</li>
                      <li>Check console logs for detailed information</li>
                      <li>Review test results for specific issues</li>
                      <li>Use results to identify the root cause</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

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
                      onClick={() => window.open('/signin', '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      Test Sign In
                    </Button>
                    <Button
                      onClick={() => window.open('/admin-tools', '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      Admin Tools
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Common Issues</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-green-600" />
                        <span>Enable Email/Password Auth</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span>Check Firebase Rules</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bug className="w-4 h-4 text-red-600" />
                        <span>Check Network Connection</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These are the most common issues. Use the diagnostic tool above for detailed analysis.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Firebase Console</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Database className="w-4 h-4 text-blue-600" />
                        <span>Check Firestore Database</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span>Check Security Rules</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Open Firebase Console → Firestore Database → Rules tab to check security rules.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PropertiesDiagnostic;
