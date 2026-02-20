import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateUserProfiles } from '@/utils/updateUserProfiles';

const MigrationHelper = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfiles = async () => {
    setIsUpdating(true);
    setMessage('Updating user profiles...');
    
    try {
      await updateUserProfiles();
      setMessage('✅ User profiles updated successfully! All existing users now have role field.');
    } catch (error) {
      console.error('Error updating profiles:', error);
      setMessage('❌ Error updating profiles. Check console for details.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Migration Helper | Rural Properties</title>
        <meta name="description" content="Update user profiles with role field" />
      </Helmet>

      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>User Profile Migration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L4.35 16.503c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  User Profile Role Migration
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  This tool updates existing user profiles to include the required <code>role</code> field. 
                  This fixes the "Cannot read properties of undefined (reading 'role')" error.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    Why This is Needed:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2 text-left">
                    <li>• Existing user profiles don't have the <code>role</code> field</li>
                    <li>• New users get role field automatically</li>
                    <li>• This causes errors when checking user permissions</li>
                    <li>• This migration updates all existing profiles</li>
                  </ul>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' : 
                    message.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' : 
                    'bg-gray-50 border-gray-200 text-gray-800'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={handleUpdateProfiles}
                    disabled={isUpdating}
                    className="min-w-48"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Profiles...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M4 4h16M4 4h16" />
                        </svg>
                        Update All User Profiles
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    After updating, refresh the page and the error should be resolved.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Note:</strong> This is a one-time migration tool. You can delete this page after use.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MigrationHelper;
