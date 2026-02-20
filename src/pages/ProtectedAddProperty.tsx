import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, DollarSign, Square, Bed, Bath, Car, FileText, Upload, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RoleGuard from '@/components/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreateProperty } from '@/hooks/useProperties';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedAddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createProperty = useCreateProperty();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    size: '',
    type: 'House' as 'Farm' | 'Plot' | 'House' | 'Smallholding',
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    status: 'active' as 'active' | 'pending' | 'sold' | 'rented',
    images: [] as File[]
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (formData.bedrooms <= 0) newErrors.bedrooms = 'Bedrooms must be greater than 0';
    if (formData.bathrooms <= 0) newErrors.bathrooms = 'Bathrooms must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createProperty.mutateAsync(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard requirePropertyListing={true}>
      <>
        <Helmet>
          <title>Add Property | Rural Properties South Africa</title>
          <meta name="description" content="List a new property on Rural Properties South Africa" />
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
                <div className="mb-8">
                  <h1 className="font-display text-3xl text-foreground mb-2">
                    Add New Property
                  </h1>
                  <p className="font-body text-muted-foreground">
                    List your property for sale or rent on our platform
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Property Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="e.g., Modern Family Home in Cape Town"
                            className={errors.title ? 'border-red-500' : ''}
                          />
                          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="e.g., Cape Town, Western Cape"
                            className={errors.location ? 'border-red-500' : ''}
                          />
                          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Describe your property in detail..."
                          rows={4}
                          className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                      </div>

                      {/* Property Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (ZAR) *</Label>
                          <Input
                            id="price"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            placeholder="e.g., 2500000"
                            className={errors.price ? 'border-red-500' : ''}
                          />
                          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="size">Size (m²) *</Label>
                          <Input
                            id="size"
                            value={formData.size}
                            onChange={(e) => handleInputChange('size', e.target.value)}
                            placeholder="e.g., 250"
                            className={errors.size ? 'border-red-500' : ''}
                          />
                          {errors.size && <p className="text-sm text-red-500">{errors.size}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms *</Label>
                          <Input
                            id="bedrooms"
                            value={formData.bedrooms}
                            onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                            placeholder="e.g., 3"
                            className={errors.bedrooms ? 'border-red-500' : ''}
                          />
                          {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms *</Label>
                          <Input
                            id="bathrooms"
                            value={formData.bathrooms}
                            onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                            placeholder="e.g., 2"
                            className={errors.bathrooms ? 'border-red-500' : ''}
                          />
                          {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms}</p>}
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="type">Property Type</Label>
                          <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="parking">Parking Spaces</Label>
                          <Input
                            id="parking"
                            value={formData.parking}
                            onChange={(e) => handleInputChange('parking', e.target.value)}
                            placeholder="e.g., 2"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                              <SelectItem value="rented">Rented</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-4">
                        <Label>Property Images</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                              Click to upload property images
                            </p>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Images
                            </Button>
                          </div>
                        </div>

                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Property image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/dashboard')}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="min-w-32"
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating...
                            </div>
                          ) : (
                            <>
                              <Home className="w-4 h-4 mr-2" />
                              Create Property
                            </>
                          )}
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
    </RoleGuard>
  );
};

export default ProtectedAddProperty;
