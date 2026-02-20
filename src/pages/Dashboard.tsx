import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, MessageSquare, TrendingUp, Home, MapPin, DollarSign, Users, LogOut, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RoleGuard from '@/components/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProperties, useDeleteProperty } from '@/hooks/useProperties';
import { useUserProfile } from '@/hooks/useUserProfile';

interface UserProperty {
  id?: string;
  title?: string;
  location?: string;
  price?: string;
  size?: string;
  type?: string;
  image?: string;
  featured?: boolean;
  createdAt?: string;
  status?: 'active' | 'pending' | 'sold' | 'rented';
  views?: number;
  inquiries?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  userId?: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: userProperties = [], isLoading } = useUserProperties();
  const { data: profile } = useUserProfile();
  const deleteProperty = useDeleteProperty();
  const [activeTab, setActiveTab] = useState('properties');

  const handleEditProperty = (propertyId: string) => {
    navigate(`/properties/${propertyId}/edit`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deleteProperty.mutateAsync(propertyId);
      } catch (error) {
        console.error('Failed to delete property:', error);
      }
    }
  };

  const handleToggleStatus = async (propertyId: string, newStatus: UserProperty['status']) => {
    // In a real app, this would update the property status
    console.log('Property status updated:', propertyId, newStatus);
    // This will be implemented with the updateProperty mutation
  };

  const stats = {
    total: userProperties.length,
    active: userProperties.filter(p => p.status === 'active').length,
    pending: userProperties.filter(p => p.status === 'pending').length,
    sold: userProperties.filter(p => p.status === 'sold').length,
    rented: userProperties.filter(p => p.status === 'rented').length,
    totalViews: userProperties.reduce((sum, p) => sum + (p.views || 0), 0),
    totalInquiries: userProperties.reduce((sum, p) => sum + (p.inquiries || 0), 0)
  };

  return (
    <RoleGuard requireDashboard={true}>
      <>
        <Helmet>
          <title>Dashboard | Rural Properties South Africa</title>
          <meta name="description" content="Manage your property listings and account settings" />
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
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl text-foreground mb-2">
                  Dashboard
                </h1>
                <p className="font-body text-muted-foreground">
                  Manage your property listings and account settings
                </p>
                
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Listed properties</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <div className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.active}</div>
                    <p className="text-xs text-muted-foreground">Currently active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <div className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sold</CardTitle>
                    <div className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.sold}</div>
                    <p className="text-xs text-muted-foreground">Successfully sold</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rented</CardTitle>
                    <div className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.rented}</div>
                    <p className="text-xs text-muted-foreground">Currently rented</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.totalViews}</div>
                    <p className="text-xs text-muted-foreground">All time views</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                    <p className="text-xs text-muted-foreground">Received inquiries</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="properties" className="flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    My Properties
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl text-foreground">My Properties</h3>
                      <Button
                        onClick={() => navigate('/properties/add')}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Property
                      </Button>
                    </div>
                    
                    {userProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userProperties.map((property) => (
                          <Card key={property.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">{property.title}</h4>
                                  <p className="text-sm text-muted-foreground">{property.location}</p>
                                </div>
                                <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                                  {property.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="aspect-video w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden">
                                <img
                                  src={property.image}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Price: {property.price}</span>
                                  <span className="text-sm text-muted-foreground">Size: {property.size}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Type: {property.type}</span>
                                  <span className="text-sm text-muted-foreground">Bedrooms: {property.bedrooms}</span>
                                </div>
                                
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {property.description}
                                </p>
                                
                                <div className="flex justify-between items-center pt-4">
                                  <span className="text-xs text-muted-foreground">Views: {property.views}</span>
                                  <span className="text-xs text-muted-foreground">Inquiries: {property.inquiries}</span>
                                </div>
                                
                                <div className="flex space-x-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditProperty(property.id)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleStatus(property.id, 'sold')}
                                  >
                                    <span className="text-xs">Mark Sold</span>
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteProperty(property.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-display text-xl text-foreground mb-2">No Properties Yet</h3>
                        <p className="font-body text-muted-foreground mb-6">
                          You haven't listed any properties yet. Add your first property to get started!
                        </p>
                        <Button onClick={() => navigate('/properties/add')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Property
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl text-foreground mb-2">Analytics Coming Soon</h3>
                    <p className="font-body text-muted-foreground">
                      Detailed analytics and insights about your property listings
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <div className="text-center py-16">
                    <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl text-foreground mb-2">Settings Coming Soon</h3>
                    <p className="font-body text-muted-foreground">
                      Manage your account settings and preferences
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
      </>
    </RoleGuard>
  );
};

export default Dashboard;
