import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Calendar, Camera, Edit, Save, Briefcase, Eye, EyeOff, Upload, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUpdateProfile, useUploadProfilePhoto, useDeleteProfilePhoto, useUserStats } from '@/hooks/useUserProfile';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: stats } = useUserStats();
  const updateProfile = useUpdateProfile();
  const uploadPhoto = useUploadProfilePhoto();
  const deletePhoto = useDeleteProfilePhoto();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    jobTitle: '',
    preferences: {
      emailNotifications: true,
      propertyAlerts: true,
      newsletter: false
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phoneNumber || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        company: profile.company || '',
        jobTitle: profile.jobTitle || '',
        preferences: profile.preferences || {
          emailNotifications: true,
          propertyAlerts: true,
          newsletter: false
        }
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phoneNumber || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        company: profile.company || '',
        jobTitle: profile.jobTitle || '',
        preferences: profile.preferences || {
          emailNotifications: true,
          propertyAlerts: true,
          newsletter: false
        }
      });
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadPhoto.mutateAsync(file);
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deletePhoto.mutateAsync();
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  const handlePreferenceChange = (key: keyof typeof formData.preferences, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-8"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-8"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | Rural Properties South Africa</title>
        <meta name="description" content="Manage your profile and account settings" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl text-foreground mb-2">
                  Profile Settings
                </h1>
                <p className="font-body text-muted-foreground">
                  Manage your personal information and account preferences
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">Profile Information</h3>
                          <p className="text-sm text-muted-foreground">Manage your public profile</p>
                        </div>
                        {!isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-6">
                          {/* Profile Photo */}
                          <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={profile?.photoURL || ''} alt={profile?.displayName} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                                  {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-white shadow-md"
                              >
                                <Camera className="w-4 h-4" />
                              </Button>
                            </div>
                            {profile?.photoURL && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDeletePhoto}
                                className="text-destructive"
                              >
                                Remove Photo
                              </Button>
                            )}
                          </div>

                          {/* Basic Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="John"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Doe"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john.doe@example.com"
                              disabled
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+27 12 345 6789"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Cape Town, South Africa"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              type="url"
                              value={formData.website}
                              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://example.com"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                              placeholder="Acme Properties"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input
                              id="jobTitle"
                              type="text"
                              value={formData.jobTitle}
                              onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                              placeholder="Property Consultant"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={formData.bio}
                              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Tell us about yourself..."
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-4 pt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={updateProfile.isPending}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          {/* Profile Photo */}
                          <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                              <AvatarImage src={profile?.photoURL || ''} alt={profile?.displayName} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                                {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                              <h4 className="font-semibold text-foreground">{profile?.displayName}</h4>
                              <p className="text-sm text-muted-foreground">{profile?.email}</p>
                              {profile?.isEmailVerified && (
                                <Badge variant="secondary" className="mt-1">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          {/* Contact Information */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Phone</span>
                              <span className="font-semibold text-foreground">{profile?.phoneNumber || 'Not provided'}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Location</span>
                              <span className="font-semibold text-foreground">{profile?.location || 'Not provided'}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Website</span>
                              <span className="font-semibold text-foreground">
                                {profile?.website ? (
                                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {profile.website}
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground">Not provided</span>
                                )}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Company</span>
                              <span className="font-semibold text-foreground">{profile?.company || 'Not provided'}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Job Title</span>
                              <span className="font-semibold text-foreground">{profile?.jobTitle || 'Not provided'}</span>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          {/* Bio */}
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Bio</div>
                            <div className="text-sm text-muted-foreground line-clamp-3">
                              {profile?.bio || 'No bio provided'}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Stats and Settings */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Stats Card */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-foreground flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Your Stats
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{stats?.totalProperties || 0}</div>
                          <div className="text-sm text-muted-foreground">Total Properties</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{stats?.activeProperties || 0}</div>
                          <div className="text-sm text-muted-foreground">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats?.totalViews || 0}</div>
                          <div className="text-sm text-muted-foreground">Total Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats?.totalInquiries || 0}</div>
                          <div className="text-sm text-muted-foreground">Inquiries</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preferences Card */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-foreground">Notification Preferences</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive property updates via email</div>
                        </div>
                        <Switch
                          checked={formData.preferences.emailNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Property Alerts</div>
                          <div className="text-sm text-muted-foreground">Get notified about new inquiries</div>
                        </div>
                        <Switch
                          checked={formData.preferences.propertyAlerts}
                          onCheckedChange={(checked) => handlePreferenceChange('propertyAlerts', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Newsletter</div>
                          <div className="text-sm text-muted-foreground">Receive marketing emails</div>
                        </div>
                        <Switch
                          checked={formData.preferences.newsletter}
                          onCheckedChange={(checked) => handlePreferenceChange('newsletter', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-foreground">Quick Actions</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/properties/add')}
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Add New Property
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/contact')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Profile;
