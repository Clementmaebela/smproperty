import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Heart, 
  Settings, 
  LogOut, 
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Eye,
  Bell,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('saved');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const savedProperties = [
    {
      id: '1',
      title: 'Beautiful Farm with River Access',
      location: 'Tzaneen, Limpopo',
      price: 'R2,450,000',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80',
      savedDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      title: 'Modern Smallholding with Mountain Views',
      location: 'Nelspruit, Mpumalanga',
      price: 'R1,850,000',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80',
      savedDate: '2024-01-18',
      status: 'active'
    },
    {
      id: '3',
      title: 'Luxury Estate with Private Lake',
      location: 'Hartbeespoort, North West',
      price: 'R3,750,000',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be7?w=300&q=80',
      savedDate: '2024-01-20',
      status: 'active'
    }
  ];

  const recentSearches = [
    { id: '1', query: 'Farms in Limpopo', date: '2024-01-20', results: 23 },
    { id: '2', query: 'Smallholdings with water', date: '2024-01-18', results: 15 },
    { id: '3', query: 'Luxury estates', date: '2024-01-15', results: 8 }
  ];

  const sidebarItems = [
    { id: 'saved', label: 'Saved Properties', icon: Heart },
    { id: 'searches', label: 'Recent Searches', icon: Search },
    { id: 'alerts', label: 'Property Alerts', icon: Bell },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Property Seeker</h3>
              <p className="text-sm text-gray-500">{userProfile?.displayName}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Property Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your saved properties and search preferences
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4 mb-8">
            <Button 
              onClick={() => navigate('/properties')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Properties
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Search
            </Button>
          </div>

          {activeTab === 'saved' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search saved properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Saved Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          <Heart className="w-3 h-3 mr-1 fill-current" />
                          Saved
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          {property.price}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/properties/${property.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'searches' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Searches</CardTitle>
                  <CardDescription>
                    Your recent property searches and saved search preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSearches.map((search) => (
                      <div key={search.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{search.query}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              {search.results} results
                            </span>
                            <span className="text-sm text-gray-500">
                              {search.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Search className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Property Alerts</CardTitle>
                  <CardDescription>
                    Set up alerts for new properties matching your criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Property Alerts
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Get notified when new properties match your preferences
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
