import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useProperty, useUpdateProperty, useDeleteProperty } from '@/hooks/useProperties';

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading, error } = useProperty(id!);
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    size: '',
    type: 'Farm' as 'Farm' | 'Plot' | 'House' | 'Smallholding',
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: '',
    parking: 0,
    description: '',
    featured: false,
    amenities: [] as string[],
    coordinates: {
      lat: '',
      lng: ''
    }
  });

  const amenitiesOptions = [
    'Water Supply',
    'Electricity',
    'Road Access',
    'Fencing',
    'Irrigation System',
    'Borehole',
    'Solar Power',
    'Outbuildings',
    'Garden',
    'Swimming Pool',
    'Security System',
    'Internet Access'
  ];

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        location: property.location || '',
        price: property.price || '',
        size: property.size || '',
        type: property.type || 'Farm',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        yearBuilt: property.yearBuilt?.toString() || '',
        parking: property.parking || 0,
        description: property.description || '',
        featured: property.featured || false,
        amenities: property.amenities || [],
        coordinates: {
          lat: property.coordinates?.lat?.toString() || '',
          lng: property.coordinates?.lng?.toString() || ''
        }
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      const updateData = {
        ...formData,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        coordinates: {
          lat: formData.coordinates.lat ? parseFloat(formData.coordinates.lat) : undefined,
          lng: formData.coordinates.lng ? parseFloat(formData.coordinates.lng) : undefined
        }
      };

      await updateProperty.mutateAsync({
        id,
        data: updateData
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deleteProperty.mutateAsync(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete property:', error);
      }
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-8"></div>
              <p className="text-muted-foreground">Loading property...</p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="font-display text-2xl text-foreground mb-4">Property Not Found</h2>
              <p className="font-body text-muted-foreground mb-6">
                The property you're trying to edit could not be found.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
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
        <title>Edit Property | Rural Properties South Africa</title>
        <meta name="description" content="Edit your property listing" />
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
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                  <h1 className="font-display text-3xl text-foreground">
                    Edit Property
                  </h1>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteProperty.isPending}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Property
                </Button>
              </div>

              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Basic Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Property Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Beautiful Farm in Limpopo"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Limpopo, South Africa"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price">Price (R)</Label>
                          <Input
                            id="price"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="2500000"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="size">Size (ha)</Label>
                          <Input
                            id="size"
                            value={formData.size}
                            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                            placeholder="50"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="type">Property Type</Label>
                          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'Farm' | 'Plot' | 'House' | 'Smallholding' }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Farm">Farm</SelectItem>
                              <SelectItem value="Plot">Plot</SelectItem>
                              <SelectItem value="House">House</SelectItem>
                              <SelectItem value="Smallholding">Smallholding</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Property Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                            placeholder="3"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                            placeholder="2"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            value={formData.yearBuilt}
                            onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: e.target.value }))}
                            placeholder="1990"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="parking">Parking Spaces</Label>
                          <Input
                            id="parking"
                            type="number"
                            value={formData.parking}
                            onChange={(e) => setFormData(prev => ({ ...prev, parking: parseInt(e.target.value) || 0 }))}
                            placeholder="2"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Description</h3>
                      <div>
                        <Label htmlFor="description">Property Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your property in detail..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {amenitiesOptions.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity}
                              checked={formData.amenities.includes(amenity)}
                              onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                            />
                            <Label htmlFor={amenity} className="text-sm">
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">GPS Coordinates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            value={formData.coordinates.lat}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              coordinates: { ...prev.coordinates, lat: e.target.value }
                            }))}
                            placeholder="-23.1234"
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            value={formData.coordinates.lng}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              coordinates: { ...prev.coordinates, lng: e.target.value }
                            }))}
                            placeholder="29.1234"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Featured Property */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked as boolean }))}
                      />
                      <Label htmlFor="featured">Feature this property on homepage</Label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateProperty.isPending}
                        className="flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        {updateProperty.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default EditProperty;
