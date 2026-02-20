import { React, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'agent' | 'user';
  requireDashboard?: boolean;
  requirePropertyListing?: boolean;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requireDashboard = false,
  requirePropertyListing = false,
  fallback
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        let access = true;

        // Check specific role requirement
        if (requiredRole) {
          const profile = await UserService.getProfile(user.uid);
          if (!profile || profile.role !== requiredRole) {
            access = false;
          }
        }

        // Check dashboard access
        if (requireDashboard) {
          const canAccess = await UserService.canAccessDashboard(user.uid);
          if (!canAccess) {
            access = false;
          }
        }

        // Check property listing access
        if (requirePropertyListing) {
          const canList = await UserService.canListProperties(user.uid);
          if (!canList) {
            access = false;
          }
        }

        setHasAccess(access);
      } catch (error) {
        console.error('Error checking role access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, requiredRole, requireDashboard, requirePropertyListing]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback for unauthorized access
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 4c-.77-1.333-2.694-1.333-3.464 0L4.35 16.503c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. This area is restricted to authorized users only.
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Available Roles:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div><strong>Admin:</strong> Full system access, user management, all properties</div>
                  <div><strong>Agent:</strong> Dashboard access, property listing, analytics</div>
                  <div><strong>User:</strong> Property browsing, contact agents, save favorites</div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Need Access?</h3>
                <p className="text-sm text-yellow-800">
                  Contact an administrator to request access or upgrade your account role.
                </p>
              </div>
            </div>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Home Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
