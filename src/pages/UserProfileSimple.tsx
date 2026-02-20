import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Home, 
  Eye, 
  MessageSquare,
  Settings,
  LogOut,
  User,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  image: string;
  status: string;
  views: number;
  inquiries: number;
  featured?: boolean;
  createdAt: string;
}

const UserProfileSimple = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock data for demonstration - replace with actual API calls
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userStats, setUserStats] = useState({
    totalFavorites: 0,
    totalInquiries: 0,
    totalViews: 0,
    memberSince: ''
  });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      // Mock favorite properties
      const mockFavorites: Property[] = [
        {
          id: '1',
          title: 'Modern Family Home in Cape Town',
          location: 'Cape Town, Western Cape',
          price: '2,500,000',
          size: '250',
          bedrooms: 3,
          bathrooms: 2,
          type: 'House',
          image: '/api/placeholder/300/200',
          status: 'active',
          views: 145,
          inquiries: 8,
          featured: true,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'Cozy Apartment in Johannesburg',
          location: 'Johannesburg, Gauteng',
          price: '1,200,000',
          size: '120',
          bedrooms: 2,
          bathrooms: 1,
          type: 'Apartment',
          image: '/api/placeholder/300/200',
          status: 'active',
          views: 89,
          inquiries: 3,
          createdAt: '2024-01-20'
        }
      ];

      // Mock inquiries
      const mockInquiries = [
        {
          id: '1',
          propertyTitle: 'Modern Family Home in Cape Town',
          message: 'I am interested in viewing this property. Please let me know when it would be convenient.',
          status: 'pending',
          createdAt: '2024-02-01'
        },
        {
          id: '2',
          propertyTitle: 'Cozy Apartment in Johannesburg',
          message: 'Is this property still available? I would like to schedule a viewing.',
          status: 'responded',
          createdAt: '2024-01-28'
        }
      ];

      setFavorites(mockFavorites);
      setInquiries(mockInquiries);
      
      if (user) {
        setUserStats({
          totalFavorites: mockFavorites.length,
          totalInquiries: mockInquiries.length,
          totalViews: mockFavorites.reduce((sum, prop) => sum + (prop.views || 0), 0),
          memberSince: new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString()
        });
      }
      
      setLoading(false);
    }, 1000);
  }, [user]);

  const filteredFavorites = favorites.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveFavorite = async (propertyId: string) => {
    setFavorites(prev => prev.filter(prop => prop.id !== propertyId));
    console.log('Remove from favorites:', propertyId);
  };

  const handleContactAgent = async (propertyId: string) => {
    console.log('Contact agent for property:', propertyId);
    // Add to inquiries
    const property = favorites.find(p => p.id === propertyId);
    if (property) {
      const newInquiry = {
        id: Date.now().toString(),
        propertyTitle: property.title,
        message: `I am interested in ${property.title}. Please contact me with more information.`,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setInquiries(prev => [newInquiry, ...prev]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center py-8">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your profile and saved properties.
            </p>
            <Link to="/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Rural Properties South Africa</title>
        <meta name="description" content="Manage your property favorites and account settings" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              {/* Profile Header */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-muted rounded-full overflow-hidden">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <User className="w-8 h-8 text-primary" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-foreground">
                            {user?.displayName || 'User'}
                          </h1>
                          <p className="text-muted-foreground">{user?.email}</p>
                          <Badge variant="secondary" className="mt-2">
                            <User className="w-3 h-3 mr-1" />
                            Regular User
                          </Badge>
                        </div>
                      </div>
                      
                      {/* User Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{userStats.totalFavorites}</div>
                          <div className="text-sm text-muted-foreground">Favorites</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{userStats.totalInquiries}</div>
                          <div className="text-sm text-muted-foreground">Inquiries</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{userStats.totalViews}</div>
                          <div className="text-sm text-muted-foreground">Total Views</div>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-sm font-medium text-foreground">{userStats.memberSince}</div>
                          <div className="text-sm text-muted-foreground">Member Since</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="md:w-64">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Link to="/properties">
                            <Button variant="outline" className="w-full justify-start">
                              <Search className="w-4 h-4 mr-2" />
                              Browse Properties
                            </Button>
                          </Link>
                          <Link to="/contact">
                            <Button variant="outline" className="w-full justify-start">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact Agents
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-red-600 hover:text-red-700"
                            onClick={logout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="favorites" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Inquiries
                  </TabsTrigger>
                  <TabsTrigger value="searches" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Recent Searches
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle>My Favorite Properties</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Search favorites..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                          <div className="flex bg-muted rounded-lg p-1">
                            <Button
                              variant={viewMode === 'grid' ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setViewMode('grid')}
                            >
                              <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={viewMode === 'list' ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setViewMode('list')}
                            >
                              <List className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground mt-2">Loading favorites...</p>
                        </div>
                      ) : filteredFavorites.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start browsing and save properties you're interested in!
                          </p>
                          <Link to="/properties">
                            <Button>Browse Properties</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                          {filteredFavorites.map((property) => (
                            <Card key={property.id} className="group hover:shadow-lg transition-shadow">
                              <div className="relative">
                                <img 
                                  src={property.image} 
                                  alt={property.title}
                                  className="w-full h-48 object-cover"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                                  onClick={() => handleRemoveFavorite(property.id)}
                                >
                                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                </Button>
                                {property.featured && (
                                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                                    {property.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-muted-foreground mb-2">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span className="text-sm">{property.location}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="text-xl font-bold text-primary">
                                    R{property.price}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleContactAgent(property.id)}
                                    >
                                      <MessageSquare className="w-4 h-4 mr-1" />
                                      Contact
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Inquiries Tab */}
                <TabsContent value="inquiries" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Property Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground mt-2">Loading inquiries...</p>
                        </div>
                      ) : inquiries.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">No Inquiries Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Contact agents about properties you're interested in!
                          </p>
                          <Link to="/properties">
                            <Button>Browse Properties</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {inquiries.map((inquiry) => (
                            <Card key={inquiry.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{inquiry.propertyTitle}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {inquiry.message}
                                    </p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Badge variant={inquiry.status === 'pending' ? 'default' : 'secondary'}>
                                    {inquiry.status}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Recent Searches Tab */}
                <TabsContent value="searches" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Searches</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Search History</h3>
                        <p className="text-muted-foreground mb-4">
                          Your recent property searches will appear here.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          This feature is coming soon!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Settings</h3>
                        <p className="text-muted-foreground mb-4">
                          Account settings and preferences coming soon!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You can manage your profile information and notification preferences here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default UserProfileSimple;
