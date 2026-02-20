import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Check, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { makeUserAdmin, makeUserAgent } from '@/utils/makeAdmin';

const AdminTools = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleMakeAdmin = async () => {
    if (!email.trim()) {
      setMessage('Please enter an email address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const result = await makeUserAdmin(email.trim());
      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
      setEmail('');
    } catch (error) {
      setMessage('Failed to update user role');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAgent = async () => {
    if (!email.trim()) {
      setMessage('Please enter an email address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const result = await makeUserAgent(email.trim());
      setMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
      setEmail('');
    } catch (error) {
      setMessage('Failed to update user role');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Tools | Rural Properties</title>
        <meta name="description" content="Administrative tools for user management" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              {/* Warning Banner */}
              <Card className="mb-8 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">Administrative Access</h3>
                      <p className="text-yellow-800 text-sm">
                        This tool allows you to change user roles. Only use this for legitimate administrative purposes. 
                        Changes will take effect after the user refreshes their session or signs back in.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Tool */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    User Role Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      User Email Address
                    </label>
                    <div className="flex gap-4">
                      <Input
                        type="email"
                        placeholder="Enter user email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleMakeAdmin}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Make Admin
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleMakeAgent}
                      disabled={loading}
                      variant="outline"
                      className="flex-1"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Make Agent
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      messageType === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        {messageType === 'success' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <p className="font-medium">{message}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Role Information */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Role Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <Shield className="w-6 h-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-900">Admin</h4>
                        <p className="text-sm text-red-700">
                          Full system access, user management, all properties
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <User className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">Agent</h4>
                        <p className="text-sm text-green-700">
                          Property listing, dashboard access, own properties
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-6 h-6 text-gray-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">User</h4>
                        <p className="text-sm text-gray-700">
                          Property browsing, favorites, inquiries only
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">How to Use:</h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Enter the email address of the user you want to promote</li>
                      <li>Click "Make Admin" to give full system access</li>
                      <li>Click "Make Agent" to give property listing access</li>
                      <li>User must sign out and sign back in to see changes</li>
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

export default AdminTools;
