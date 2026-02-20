import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Search, 
  Settings, 
  LogOut, 
  Filter,
  MapPin,
  Calendar,
  Bell,
  Plus,
  Home,
  User,
  ChevronRight,
  Star,
  Eye,
  Share2,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const UserProfile = () => {
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
      status: 'active',
      beds: 4,
      baths: 2,
      size: '15 hectares',
      rating: 4.8,
      views: 145
    },
    {
      id: '2',
      title: 'Modern Smallholding with Mountain Views',
      location: 'Nelspruit, Mpumalanga',
      price: 'R1,850,000',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80',
      savedDate: '2024-01-18',
      status: 'active',
      beds: 3,
      baths: 2,
      size: '8 hectares',
      rating: 4.6,
      views: 89
    },
    {
      id: '3',
      title: 'Luxury Estate with Private Lake',
      location: 'Hartbeespoort, North West',
      price: 'R3,750,000',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be7?w=300&q=80',
      savedDate: '2024-01-20',
      status: 'active',
      beds: 5,
      baths: 3,
      size: '20 hectares',
      rating: 4.9,
      views: 234
    }
  ];

  const recentSearches = [
    { id: '1', query: 'Farms in Limpopo', date: '2024-01-20', results: 23 },
    { id: '2', query: 'Smallholdings with water', date: '2024-01-18', results: 15 },
    { id: '3', query: 'Luxury estates', date: '2024-01-15', results: 8 }
  ];

  const userStats = {
    totalSaved: 12,
    totalViews: 1247,
    totalInquiries: 8,
    avgResponseTime: '2.3 hours',
    profileViews: 234
  };

  const sidebarItems = [
    { id: 'saved', label: 'Saved Properties', icon: Heart, count: userStats.totalSaved },
    { id: 'searches', label: 'Search History', icon: Search },
    { id: 'alerts', label: 'Property Alerts', icon: Bell },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-700"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl">RuralProperties</span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/properties')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Properties
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Contact
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/properties')}
              >
                <Search className="w-4 h-4 mr-2" />
                Browse
              </Button>
              
              <div className="relative group">
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.profileImage} alt={userProfile?.displayName} />
                    <AvatarFallback>
                      {userProfile?.displayName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userProfile?.displayName}</p>
                      <p className="text-xs text-gray-500">{userProfile?.email}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile?.profileImage} alt={userProfile?.displayName} />
                <AvatarFallback className="text-lg">
                  {userProfile?.displayName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userProfile?.displayName}</h1>
                <p className="text-gray-600">Property Seeker</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>📍 South Africa</span>
                  <span>📅 Joined January 2024</span>
                  <span>✅ Email Verified</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalSaved}</div>
              <p className="text-xs text-muted-foreground">
                3 added this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.profileViews}</div>
              <p className="text-xs text-muted-foreground">
                +45 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquiries Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalInquiries}</div>
              <p className="text-xs text-muted-foreground">
                2 pending response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                Faster than 85% of users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === item.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.count && (
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
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
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90">
                            <Heart className="w-3 h-3 mr-1 fill-current text-red-500" />
                            Saved
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-white/90">
                            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                            {property.rating}
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
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {property.price}
                            </div>
                            <div className="text-xs text-gray-500">
                              {property.beds} beds • {property.baths} baths • {property.size}
                            </div>
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

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Profile Settings
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Update your personal information and notification preferences
                      </p>
                      <Button>
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
