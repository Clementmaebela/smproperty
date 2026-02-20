import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmail } from '@/lib/firebase/config';

const SignInTest = () => {
  const { login, loading, error } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [testResult, setTestResult] = useState('');

  const testDirectFirebase = async () => {
    setTestResult('Testing direct Firebase connection...');
    try {
      const user = await signInWithEmail(testEmail, testPassword);
      setTestResult(`✅ Direct Firebase Success: ${user.email}`);
    } catch (error: any) {
      setTestResult(`❌ Direct Firebase Error: ${error.message} (Code: ${error.code})`);
    }
  };

  const testAuthContext = async () => {
    setTestResult('Testing AuthContext login...');
    try {
      await login(testEmail, testPassword);
      setTestResult('✅ AuthContext Success - Check if you were redirected');
    } catch (error: any) {
      setTestResult(`❌ AuthContext Error: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In Test | Rural Properties</title>
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Email</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Test Password</label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="password"
              />
            </div>

            <div className="space-y-2">
              <Button onClick={testDirectFirebase} className="w-full" variant="outline">
                Test Direct Firebase
              </Button>
              <Button onClick={testAuthContext} className="w-full" disabled={loading}>
                {loading ? 'Testing...' : 'Test AuthContext'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>AuthContext Error: {error}</AlertDescription>
              </Alert>
            )}

            {testResult && (
              <Alert>
                <AlertDescription className="whitespace-pre-wrap">
                  {testResult}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Troubleshooting Steps:</strong></p>
              <p>1. Check Firebase Console → Authentication → Sign-in method</p>
              <p>2. Ensure "Email/Password" is enabled</p>
              <p>3. Check browser console for errors</p>
              <p>4. Verify Firebase config in .env file</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignInTest;
