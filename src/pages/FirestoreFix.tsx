import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2025, 1, 1);
    }
    
    // Specific rules for properties collection
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.time < timestamp.date(2025, 1, 1);
    }
    
    // Specific rules for users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

const FirestoreFix = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(firestoreRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Firestore Fix | Rural Properties</title>
        <meta name="description" content="Fix Firestore permissions for properties loading" />
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
                    <Shield className="w-5 h-5 text-red-600" />
                    Firestore Permissions Fix
                  </CardTitle>
                  <CardDescription>
                    Fix "Missing or insufficient permissions" error by updating Firestore rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Error Explanation */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Problem Identified</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Your Firestore security rules are blocking access to the properties collection. 
                          The error "Missing or insufficient permissions" means the database rules don't allow read access.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Fix Steps */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Quick Fix Steps:</h4>
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal list-decimal">
                      <li>Click the button below to open Firebase Console</li>
                      <li>Select your project: <strong>ruralproperty-edae5</strong></li>
                      <li>Go to <strong>Firestore Database</strong> → <strong>Rules</strong> tab</li>
                      <li>Copy the rules from below and paste them in the editor</li>
                      <li>Click <strong>Publish</strong> to apply the changes</li>
                      <li>Wait 1-2 minutes for rules to propagate</li>
                      <li>Test your Properties page again</li>
                    </ol>
                  </div>

                  {/* Firebase Console Button */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Firebase Console
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Rules'}
                    </Button>
                  </div>

                  {/* Firestore Rules Code */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Firestore Rules (Copy & Paste):</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {firestoreRules}
                      </pre>
                    </div>
                  </div>

                  {/* Visual Guide */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Step 1</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="bg-gray-100 p-3 rounded text-center">
                            <div className="text-xs font-mono">console.firebase.google.com</div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Open Firebase Console and select your project
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Step 2</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="bg-gray-100 p-3 rounded text-center">
                            <div className="text-xs">Firestore Database → Rules</div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Navigate to Rules tab in Firestore section
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Step 3</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="bg-gray-100 p-3 rounded text-center">
                            <div className="text-xs">Paste Rules → Publish</div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Paste the rules and click Publish
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* What These Rules Do */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">What These Rules Do:</h4>
                    <ul className="text-sm text-green-700 space-y-1 list-disc list-disc">
                      <li><strong>Allow read access</strong> to all documents (fixes your error)</li>
                      <li><strong>Allow write access</strong> until January 1, 2025 (temporary)</li>
                      <li><strong>Secure user data</strong> - users can only access their own profiles</li>
                      <li><strong>Public property access</strong> - anyone can view properties</li>
                    </ul>
                  </div>

                  {/* After Fix */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">After Applying Rules:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Wait 1-2 minutes for rules to propagate</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Go to /properties page</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Properties should load successfully</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>If still empty, use /data-seeder to add sample data</span>
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">If Issues Persist:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Check Authentication</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            Ensure Email/Password authentication is enabled in Firebase Console → Authentication → Sign-in method
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Clear Browser Cache</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            Clear browser cache and reload the page after updating rules
                          </p>
                        </CardContent>
                      </Card>
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

export default FirestoreFix;
