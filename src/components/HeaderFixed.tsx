import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, MapPin, Phone, Plus, LayoutDashboard, User, LogIn, LogOut, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/userService";

const HeaderFixed = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'agent' | 'user' | null>(null);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Force navigation to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if logout fails
      navigate('/');
    }
  };

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
          // Default to 'user' if role can't be determined
          setUserRole('user');
        }
      } else {
        setUserRole(null);
      }
    };

    getUserRole();
  }, [user]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/properties", icon: MapPin },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const getAuthLinks = () => {
    if (!user || !userRole) return [];
    const links = [];
    
    // Role-specific links only (no common links to avoid duplication)
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
    } else if (userRole === 'user') {
      links.push(
        { name: "My Profile", href: "/user-profile", icon: User }
      );
    }

    return links;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20 min-h-16">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 lg:w-5 lg:h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg lg:text-xl text-foreground whitespace-nowrap">
                Rural<span className="text-primary">Properties</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap text-sm"
                >
                  {link.name}
                </Link>
              ))}
              {getAuthLinks().map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {user && getAuthLinks().length > 0 ? (
              <>
                {(userRole === 'agent' || userRole === 'admin') && (
                  <Link to="/properties/add">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 px-3">
                      <Plus className="w-3 h-3" />
                      <span className="hidden lg:inline">List Property</span>
                      <Plus className="w-3 h-3 lg:hidden" />
                    </Button>
                  </Link>
                )}
                
                {userRole && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                    {userRole === 'admin' && (
                      <>
                        <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <span className="text-xs font-medium hidden lg:inline">Admin</span>
                      </>
                    )}
                    {userRole === 'agent' && (
                      <>
                        <LayoutDashboard className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="text-xs font-medium hidden lg:inline">Agent</span>
                      </>
                    )}
                    {userRole === 'user' && (
                      <>
                        <User className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        <span className="text-xs font-medium hidden lg:inline">User</span>
                      </>
                    )}
                  </div>
                )}

                {/* User Profile Link */}
                <Link to="/user-profile" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <User className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium truncate max-w-20">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Link>

                {/* Sign Out Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={handleLogout}
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button size="sm" className="flex items-center gap-1 px-3">
                    <LogIn className="w-3 h-3" />
                    <span className="hidden lg:inline">Sign In</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="px-3" asChild>
                  <Link to="/signup">
                    <span className="hidden lg:inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden bg-background border-b border-border max-h-[80vh] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {/* Main Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-3 font-body font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              ))}
              
              {/* Role-specific Navigation Links */}
              {getAuthLinks().map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-3 font-body font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              ))}

              {/* Authentication Section */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        {/* User Profile Link for authenticated users */}
                        <Link 
                          to="/user-profile" 
                          className="flex items-center gap-3 font-body font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-5 h-5 flex-shrink-0" />
                          <span className="whitespace-nowrap">My Profile</span>
                        </Link>
                        
                        {/* Sign Out Button */}
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2 justify-start"
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 flex-shrink-0" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Sign In/Sign Up for unauthenticated users */}
                        <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full flex items-center gap-2 justify-start">
                            <LogIn className="w-4 h-4 flex-shrink-0" />
                            <span>Sign In</span>
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full flex items-center gap-2 justify-start" asChild>
                          <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                            <span>Sign Up</span>
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
    </header>
  );
};

export default HeaderFixed;
