import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import { FirebaseInitializer } from "@/components/FirebaseInitializer";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PropertiesFixed from "./pages/PropertiesFixed";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DatabaseTest from "./pages/DatabaseTest";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminTools from "./pages/AdminTools";
import AgentSignUp from "./pages/AgentSignUp";
import AdminSignIn from "./pages/AdminSignIn";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { 
  children: React.ReactNode; 
  requiredRole?: 'admin' | 'agent' | 'user' 
}) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    switch (userProfile.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'agent':
        return <Navigate to="/agent" replace />;
      case 'user':
        return <Navigate to="/user" replace />;
      default:
        return <Navigate to="/signin" replace />;
    }
  }

  return <>{children}</>;
};

// Public Route Component (redirects authenticated users to appropriate dashboard)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (userProfile) {
    // Redirect to appropriate dashboard based on user role
    switch (userProfile.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'agent':
        return <Navigate to="/agent" replace />;
      case 'user':
        return <Navigate to="/user" replace />;
      default:
        return <Navigate to="/user" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/properties" element={<PropertiesFixed />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/agent-signup" element={<PublicRoute><AgentSignUp /></PublicRoute>} />
      <Route path="/admin-signin" element={<PublicRoute><AdminSignIn /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Agent Routes */}
      <Route 
        path="/agent" 
        element={
          <ProtectedRoute requiredRole="agent">
            <AgentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent/properties" 
        element={
          <ProtectedRoute requiredRole="agent">
            <AgentDashboard />
          </ProtectedRoute>
        } 
      />

      {/* User Routes */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserProfile />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tools" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminTools />
          </ProtectedRoute>
        } 
      />

      {/* Shared Protected Routes */}
      <Route 
        path="/properties/add" 
        element={
          <ProtectedRoute requiredRole="agent">
            <AddProperty />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/properties/:id/edit" 
        element={
          <ProtectedRoute requiredRole="agent">
            <EditProperty />
          </ProtectedRoute>
        } 
      />

      {/* Legacy Routes - Redirect to new role-based routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Navigate to="/user" replace />
          </ProtectedRoute>
        } 
      />

      {/* Development Routes */}
      <Route path="/db-test" element={<DatabaseTest />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FirebaseInitializer>
          <AuthProvider>
            <Toaster />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </FirebaseInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
