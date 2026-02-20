import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Simple imports to test basic functionality
import { auth } from '@/lib/firebase/config';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export const DatabaseTest = () => {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string, success: boolean = true) => {
    setResults(prev => [...prev, `${success ? '✅' : '❌'} ${message}`]);
  };

  const runTests = async () => {
    setResults([]);
    
    // Test 1: Basic Firebase import
    try {
      if (auth) {
        addResult('Firebase auth imported successfully');
      } else {
        addResult('Firebase auth is null', false);
      }
    } catch (error) {
      addResult(`Firebase auth import failed: ${error}`, false);
    }

    // Test 2: Basic Firestore import
    try {
      const db = getFirestore();
      if (db) {
        addResult('Firestore imported successfully');
      } else {
        addResult('Firestore is null', false);
      }
    } catch (error) {
      addResult(`Firestore import failed: ${error}`, false);
    }

    // Test 3: Simple Firestore write
    try {
      const db = getFirestore();
      const testRef = collection(db, 'test');
      await addDoc(testRef, { 
        timestamp: new Date().toISOString(),
        test: 'database connection test'
      });
      addResult('Firestore write test successful');
    } catch (error: any) {
      addResult(`Firestore write failed: ${error.message}`, false);
      if (error.code) {
        addResult(`Error code: ${error.code}`, false);
      }
    }

    // Test 4: Current user check
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        addResult(`Current user: ${currentUser.email}`);
      } else {
        addResult('No current user (not signed in)');
      }
    } catch (error) {
      addResult(`User check failed: ${error}`, false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Simple Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Basic Firebase Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Test fundamental Firebase functionality
                </p>
              </div>
              <Button onClick={runTests} className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Run Simple Tests
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Results:</h4>
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded border ${
                      result.includes('✅') 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <code className="text-sm">{result}</code>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Quick Fixes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check Firebase Console for service status</li>
                <li>• Verify project ID: ruralproperty-edae5</li>
                <li>• Ensure Authentication is enabled</li>
                <li>• Update Firestore rules to allow access</li>
                <li>• Clear browser cache and retry</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseTest;
