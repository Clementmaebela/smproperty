import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { DataSeeder } from '@/services/dataSeeder';
import { PropertiesService } from '@/services/databaseService';

const DatabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testDatabaseConnection = async () => {
    try {
      // Test basic connection
      const testCollection = collection(db, '_test');
      await getDocs(testCollection);
      addTestResult('Database Connection', true, 'Successfully connected to Firestore');
      return true;
    } catch (error: any) {
      addTestResult('Database Connection', false, `Connection failed: ${error.message}`);
      return false;
    }
  };

  const testCollectionAccess = async () => {
    const collections = ['properties', 'users', 'agents', 'inquiries', 'reviews', 'savedSearches', 'systemSettings'];
    
    for (const collectionName of collections) {
      try {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);
        addTestResult(`Collection: ${collectionName}`, true, `Access granted (${snapshot.docs.length} documents)`);
      } catch (error: any) {
        addTestResult(`Collection: ${collectionName}`, false, `Access denied: ${error.message}`);
      }
    }
  };

  const testWritePermissions = async () => {
    try {
      const testCollection = collection(db, 'properties');
      const testData = {
        title: 'Test Property',
        description: 'This is a test property',
        price: 100000,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(testCollection, testData);
      addTestResult('Write Permission', true, `Successfully created test document: ${docRef.id}`);
      
      // Clean up - delete the test document
      await deleteDoc(doc(db, 'properties', docRef.id));
      addTestResult('Cleanup', true, 'Test document deleted successfully');
    } catch (error: any) {
      addTestResult('Write Permission', false, `Write failed: ${error.message}`);
    }
  };

  const seedDatabase = async () => {
    setIsLoading(true);
    try {
      setStatus('Seeding database...');
      const results = await DataSeeder.seedAll();
      
      addTestResult('Database Seeding', true, `Seeding completed successfully`);
      addTestResult('Properties Created', true, `${results.properties} properties`);
      addTestResult('Users Created', true, `${results.users} users`);
      addTestResult('Agents Created', true, `${results.agents} agents`);
      addTestResult('Inquiries Created', true, `${results.inquiries} inquiries`);
      addTestResult('Reviews Created', true, `${results.reviews} reviews`);
      addTestResult('Saved Searches Created', true, `${results.savedSearches} saved searches`);
      
      if (results.errors.length > 0) {
        addTestResult('Seeding Errors', false, results.errors.join(', '));
      }
      
      setStatus('Database seeding completed!');
    } catch (error: any) {
      addTestResult('Database Seeding', false, `Seeding failed: ${error.message}`);
      setStatus('Seeding failed');
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    setStatus('Running comprehensive tests...');
    
    const connected = await testDatabaseConnection();
    if (connected) {
      await testCollectionAccess();
      await testWritePermissions();
    }
    
    setStatus('Tests completed');
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔍 Database Setup & Testing</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600 mb-2">Status: <span className="font-semibold">{status}</span></p>
              <p className="text-sm text-gray-500">Firebase Project: ruralproperty-edae5</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={runAllTests}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Run Tests
              </button>
              <button
                onClick={seedDatabase}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? '🌱 Seeding...' : '🌱 Seed Database'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet...</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {result.success ? '✅' : '❌'}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{result.test}</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Next Steps:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Ensure all tests pass before proceeding</li>
            <li>Click "Seed Database" to populate with sample data</li>
            <li>Verify collections are created in Firebase Console</li>
            <li>Test application functionality with seeded data</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
