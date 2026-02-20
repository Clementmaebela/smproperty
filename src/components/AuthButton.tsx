import { useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

const AuthButton = () => {
  const { user, loading, login, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await login(email, password);
      setShowDropdown(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2"
        >
          <UserIcon className="w-4 h-4" />
          <span>{user.email}</span>
        </Button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border z-50">
            <div className="p-2">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">Signed in as {user.email}</p>
              </div>
              <form onSubmit={handleLogin} className="p-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="•••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Sign In
                </button>
              </form>
              <div className="px-3 py-2 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md text-sm font-medium hover:bg-secondary/80"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button onClick={handleLogin} className="flex items-center space-x-2">
      <LogIn className="w-4 h-4" />
      <span>Sign In</span>
    </Button>
  );
};

export default AuthButton;
