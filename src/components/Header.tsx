import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, MapPin, Phone, Plus, User, LogIn, LogOut, Settings, Shield, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/properties", icon: MapPin },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const renderAuthButtons = () => {
    if (loading) {
      return <div className="w-20 h-9 bg-gray-200 rounded animate-pulse" />;
    }

    if (userProfile) {
      // User is logged in - show appropriate navigation
      return (
        <div className="flex items-center space-x-3">
          {userProfile.role === 'user' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          )}
          
          {userProfile.role === 'agent' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/agent')}
            >
              <Building className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          )}
          
          {userProfile.role === 'admin' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      );
    }

    // User is not logged in - show sign in and agent sign up
    return (
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/signin')}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
        
        <Button 
          size="sm"
          onClick={() => navigate('/agent-signup')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Building className="w-4 h-4 mr-2" />
          List Property
        </Button>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">RuralProperties</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center">
            {renderAuthButtons()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Nav Links */}
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200 pt-4">
                  {renderAuthButtons()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
