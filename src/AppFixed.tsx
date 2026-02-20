import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import { FirebaseInitializer } from "@/components/FirebaseInitializer";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserProfileSimple from "./pages/UserProfileSimple";
import SignIn from "./pages/SignIn";
import SignInFixed from "./pages/SignInFixed";
import SignInTest from "./pages/SignInTest";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthTest from "./components/AuthTest";
import DatabaseTest from "./components/DatabaseTest";
import AdminDashboard from "./pages/AdminDashboard";
import MigrationHelper from "./pages/MigrationHelper";
import AdminTools from "./pages/AdminTools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const AppFixed = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FirebaseInitializer>
          <AuthProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Authentication Routes */}
                <Route path="/signin" element={<SignInFixed />} />
                <Route path="/signin-test" element={<SignInTest />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                <Route path="/profile" element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } />
                <Route path="/user-profile" element={
                  <RequireAuth>
                    <UserProfileSimple />
                  </RequireAuth>
                } />
                
                {/* Property Management Routes - Require Agent/Admin */}
                <Route path="/properties/add" element={
                  <RequireAuth>
                    <RequireRole roles={['agent', 'admin']}>
                      <AddProperty />
                    </RequireRole>
                  </RequireAuth>
                } />
                <Route path="/properties/:id/edit" element={
                  <RequireAuth>
                    <RequireRole roles={['agent', 'admin']}>
                      <EditProperty />
                    </RequireRole>
                  </RequireAuth>
                } />
                
                {/* Admin Routes - Require Admin Role */}
                <Route path="/admin" element={
                  <RequireAuth>
                    <RequireRole roles={['admin']}>
                      <AdminDashboard />
                    </RequireRole>
                  </RequireAuth>
                } />
                <Route path="/admin-tools" element={
                  <RequireAuth>
                    <RequireRole roles={['admin']}>
                      <AdminTools />
                    </RequireRole>
                  </RequireAuth>
                } />
                <Route path="/migrate" element={
                  <RequireAuth>
                    <RequireRole roles={['admin']}>
                      <MigrationHelper />
                    </RequireRole>
                  </RequireAuth>
                } />
                
                {/* Development/Test Routes */}
                <Route path="/auth-test" element={<AuthTest />} />
                <Route path="/db-test" element={<DatabaseTest />} />
                
                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </FirebaseInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

// Authentication Guard Component
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  // For now, we'll use a simple check
  // In a real app, you'd check user authentication state
  return <>{children}</>;
};

// Role Guard Component
const RequireRole = ({ 
  children, 
  roles 
}: { 
  children: React.ReactNode; 
  roles: string[] 
}) => {
  // For now, we'll allow access
  // In a real app, you'd check user role
  return <>{children}</>;
};

export default AppFixed;
