import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  BarChart3,
  Shield,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const stats = {
    totalProperties: 12,
    activeProperties: 8,
    pendingProperties: 2,
    soldProperties: 2,
    totalViews: 1247,
    totalInquiries: 89,
    thisMonthViews: 342,
    thisMonthInquiries: 23
  };

  const recentProperties = [
    {
      id: '1',
      title: 'Beautiful Farm with River Access',
      status: 'active',
      views: 145,
      inquiries: 8,
      price: 'R2,450,000',
      listedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Modern Smallholding with Mountain Views',
      status: 'pending',
      views: 89,
      inquiries: 3,
      price: 'R1,850,000',
      listedDate: '2024-01-18'
    },
    {
      id: '3',
      title: 'Luxury Estate with Private Lake',
      status: 'active',
      views: 234,
      inquiries: 12,
      price: 'R3,750,000',
      listedDate: '2024-01-10'
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'properties', label: 'My Properties', icon: Building },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Agent Portal</h3>
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
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
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
              Agent Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your properties and track your performance
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4 mb-8">
            <Button 
              onClick={() => navigate('/properties/add')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Public Site
            </Button>
          </div>

          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProperties}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeProperties} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +{stats.thisMonthViews} this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                    <p className="text-xs text-muted-foreground">
                      +{stats.thisMonthInquiries} this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Performance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">
                      Response rate
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Properties */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                  <CardDescription>
                    Your latest property listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{property.title}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                              {property.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{property.price}</span>
                            <span className="text-sm text-gray-500">
                              {property.views} views
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Properties</CardTitle>
                  <CardDescription>
                    Manage all your property listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Property Management
                    </h3>
                    <p className="text-gray-500 mb-4">
                      View, edit, and manage all your property listings
                    </p>
                    <Button onClick={() => navigate('/properties/add')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Property
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

export default AgentDashboard;
