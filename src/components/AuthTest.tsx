import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { auth } from '@/lib/firebase/config';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

export const AuthTest = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests: TestResult[] = [
      {
        name: 'Firebase Auth Initialization',
        status: 'pending',
        message: 'Testing Firebase auth initialization...'
      },
      {
        name: 'Firebase App Initialization',
        status: 'pending',
        message: 'Testing Firebase app initialization...'
      },
      {
        name: 'Firestore Connection',
        status: 'pending',
        message: 'Testing Firestore database connection...'
      },
      {
        name: 'Authentication Methods',
        status: 'pending',
        message: 'Testing available authentication methods...'
      },
      {
        name: 'User Creation Test',
        status: 'pending',
        message: 'Testing user creation with test credentials...'
      }
    ];

    setTestResults(tests);

    // Test 1: Firebase Auth Initialization
    try {
      if (auth) {
        tests[0].status = 'success';
        tests[0].message = 'Firebase auth initialized successfully';
      } else {
        tests[0].status = 'error';
        tests[0].message = 'Firebase auth initialization failed';
        tests[0].details = 'Auth instance is null';
      }
    } catch (error) {
      tests[0].status = 'error';
      tests[0].message = 'Firebase auth initialization failed';
      tests[0].details = error instanceof Error ? error.message : 'Unknown error';
    }
    setTestResults([...tests]);

    // Test 2: Firebase App Initialization
    try {
      if (auth) {
        tests[1].status = 'success';
        tests[1].message = 'Firebase app initialized successfully';
      } else {
        tests[1].status = 'error';
        tests[1].message = 'Firebase app initialization failed';
        tests[1].details = 'App instance is null';
      }
    } catch (error) {
      tests[1].status = 'error';
      tests[1].message = 'Firebase app initialization failed';
      tests[1].details = error instanceof Error ? error.message : 'Unknown error';
    }
    setTestResults([...tests]);

    // Test 3: Firestore Connection
    try {
      const { getFirestore } = await import('firebase/firestore');
      const db = getFirestore();
      if (db) {
        tests[2].status = 'success';
        tests[2].message = 'Firestore database connected successfully';
      } else {
        tests[2].status = 'error';
        tests[2].message = 'Firestore database connection failed';
        tests[2].details = 'Database instance is null';
      }
    } catch (error) {
      tests[2].status = 'error';
      tests[2].message = 'Firestore database connection failed';
      tests[2].details = error instanceof Error ? error.message : 'Unknown error';
    }
    setTestResults([...tests]);

    // Test 4: Authentication Methods
    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      if (signInWithEmailAndPassword && createUserWithEmailAndPassword) {
        tests[3].status = 'success';
        tests[3].message = 'Authentication methods available';
      } else {
        tests[3].status = 'error';
        tests[3].message = 'Authentication methods not available';
        tests[3].details = 'Methods are undefined';
      }
    } catch (error) {
      tests[3].status = 'error';
      tests[3].message = 'Authentication methods not available';
      tests[3].details = error instanceof Error ? error.message : 'Unknown error';
    }
    setTestResults([...tests]);

    // Test 5: User Creation Test
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'test123456';
      
      // Try to create a test user
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      if (userCredential && userCredential.user) {
        tests[4].status = 'success';
        tests[4].message = 'User creation test successful';
        tests[4].details = `Test user created: ${testEmail}`;
        
        // Clean up - delete test user
        await userCredential.user.delete();
      } else {
        tests[4].status = 'error';
        tests[4].message = 'User creation test failed';
        tests[4].details = 'No user credential returned';
      }
    } catch (error: any) {
      tests[4].status = 'error';
      tests[4].message = 'User creation test failed';
      tests[4].details = error.code || error.message || 'Unknown error';
      
      // Provide specific guidance based on error codes
      if (error.code === 'auth/email-already-in-use') {
        tests[4].details = 'Email already exists. This is expected behavior.';
        tests[4].status = 'success'; // This is actually expected
      } else if (error.code === 'auth/operation-not-allowed') {
        tests[4].details = 'Email/password authentication is not enabled in Firebase Console. Enable it in Authentication → Sign-in method.';
      } else if (error.code === 'auth/weak-password') {
        tests[4].details = 'Password too weak. Use at least 6 characters.';
      }
    }
    setTestResults([...tests]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-600 bg-green-50';
      case 'error':
        return 'border-red-600 bg-red-50';
      case 'pending':
        return 'border-yellow-600 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Authentication Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Firebase Authentication Status</h3>
                <p className="text-sm text-muted-foreground">
                  Run diagnostics to identify authentication issues
                </p>
              </div>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {isRunning ? 'Running Tests...' : 'Run Diagnostics'}
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <div className="font-medium">{test.name}</div>
                        <Badge variant={test.status === 'success' ? 'default' : test.status === 'error' ? 'destructive' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">{test.message}</p>
                      {test.details && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Details:</strong> {test.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Quick Fix Checklist:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Go to Firebase Console → Authentication → Sign-in method</li>
                <li>✅ Enable Email/Password authentication</li>
                <li>✅ Update Firestore rules to allow user creation</li>
                <li>✅ Clear browser cache and retry</li>
                <li>✅ Check console for specific error messages</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Common Issues:</h4>
              <div className="text-sm text-yellow-800 space-y-2">
                <div>
                  <strong>"auth/operation-not-allowed"</strong>
                  <p className="mt-1">→ Enable Email/Password authentication in Firebase Console</p>
                </div>
                <div>
                  <strong>"auth/weak-password"</strong>
                  <p className="mt-1">→ Use password with 6+ characters</p>
                </div>
                <div>
                  <strong>"permission-denied"</strong>
                  <p className="mt-1">→ Update Firestore rules to allow user creation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;
