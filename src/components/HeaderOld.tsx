import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, MapPin, Phone, Plus, LayoutDashboard, User, LogIn, LogOut, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/userService";
import UserProfileDropdown from "@/components/UserProfileDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'agent' | 'user' | null>(null);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Get user role on component mount
  useEffect(() => {
    const getUserRole = async () => {
      if (user) {
        try {
          const profile = await UserService.getProfile(user.uid);
          if (profile) {
            setUserRole(profile.role);
          }
        } catch (error) {
          console.error('Error getting user role:', error);
        }
      }
    };

    getUserRole();
  }, [user]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/properties", icon: MapPin },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  // Role-based navigation links
  const getAuthLinks = () => {
    if (!user || !userRole) return [];

    const links = [];
    
    // Common links for authenticated users
    links.push({ name: "Profile", href: "/profile", icon: User });

    // Role-specific links
    if (userRole === 'admin') {
      links.push(
        { name: "Admin Panel", href: "/admin", icon: Settings },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
      );
    } else if (userRole === 'agent') {
      links.push(
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Listings", href: "/dashboard", icon: Plus }
      );
    }
    // Regular users don't get dashboard access

    return links;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Rural<span className="text-primary">Properties</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            {getAuthLinks().map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user && getAuthLinks().length > 0 && (
              <>
                {/* Show "List Property" button only for agents/admin */}
                {(userRole === 'agent' || userRole === 'admin') && (
                  <Link to="/properties/add">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      List Property
                    </Button>
                  </Link>
                )}
                
                {/* Show role badge for authenticated users */}
                {userRole && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                    {userRole === 'admin' && (
                      <>
                        <Shield className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium">Admin</span>
                      </>
                    )}
                    {userRole === 'agent' && (
                      <>
                        <LayoutDashboard className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium">Agent</span>
                      </>
                    )}
                    {userRole === 'user' && (
                      <>
                        <User className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium">User</span>
                      </>
                    )}
                  </div>
                )}
                
                <UserProfileDropdown />
              </>
            ) : (
              <>
                <Button size="sm" className="flex items-center gap-2" onClick={() => navigate('/signin')}>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signup">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-3 font-body font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              {user && getAuthLinks().map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-3 font-body font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {!loading && (
                  <>
                    {user && (
                      <>
                        {/* Show "List Property" button only for agents/admin */}
                        {(userRole === 'agent' || userRole === 'admin') && (
                          <Link to="/properties/add" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              List Property
                            </Button>
                          </Link>
                        )}
                        
                        {/* Show role badge for authenticated users */}
                        {userRole && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                            {userRole === 'admin' && (
                              <>
                                <Shield className="w-3 h-3 text-blue-600" />
                                <span className="text-xs font-medium">Admin</span>
                              </>
                            )}
                            {userRole === 'agent' && (
                              <>
                                <LayoutDashboard className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-medium">Agent</span>
                              </>
                            )}
                            {userRole === 'user' && (
                              <>
                                <User className="w-3 h-3 text-gray-600" />
                                <span className="text-xs font-medium">User</span>
                              </>
                            )}
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2"
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full flex items-center gap-2" onClick={() => {
                          navigate('/signin');
                          setIsMenuOpen(false);
                        }}>
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* User Profile Dropdown */}
      <UserProfileDropdown />
    </header>
  );
};

export default Header;
