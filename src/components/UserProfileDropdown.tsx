import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Camera,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';

const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'agent' | 'user' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  const getUserInitials = () => {
    const displayName = user.displayName || user.email || '';
    return displayName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <div className="relative z-[55]" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.photoURL || ''} alt={getUserDisplayName()} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium">{getUserDisplayName()}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-[60] transform translate-x-0 max-w-[calc(100vw-2rem)]">
          {/* User Info Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL || ''} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{getUserDisplayName()}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Links - Role-based */}
          <div className="p-2">
            {/* User Profile Link - Common for all authenticated users */}
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
            
            {/* Admin-specific links */}
            {userRole === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
                
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
            
            {/* Agent-specific links */}
            {userRole === 'agent' && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/properties/add"
                  className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>List Property</span>
                </Link>
              </>
            )}
            
            {/* Regular user links - no dashboard access */}
            {userRole === 'user' && (
              <Link
                to="/properties"
                className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Briefcase className="h-4 w-4" />
                <span>Browse Properties</span>
              </Link>
            )}
          </div>

          <Separator />

          {/* Account Actions */}
          <div className="p-2">
            <button
              className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors w-full text-left"
              onClick={() => {
                setIsOpen(false);
                // TODO: Implement settings page
                console.log('Settings clicked');
              }}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>

            <button
              className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors w-full text-left text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
