import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Plus, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateProperty } from "@/hooks/useProperties";
import { CreateProperty } from "@/lib/firebase/schema";

const AddProperty = () => {
  const navigate = useNavigate();
  const createPropertyMutation = useCreateProperty();
  
  const [formData, setFormData] = useState<CreateProperty>({
    title: '',
    location: '',
    price: '',
    size: '',
    type: 'House',
    image: '',
    featured: false,
    description: '',
    yearBuilt: undefined,
    parking: undefined,
    amenities: [],
    coordinates: { lat: 0, lng: 0 }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createPropertyMutation.mutateAsync(formData);
      navigate('/properties');
    } catch (error) {
      console.error('Failed to create property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateProperty, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Add Property | Rural Properties South Africa</title>
        <meta name="description" content="List your rural property for sale on our platform" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="flex items-center mb-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/properties')}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
                
                <h1 className="font-display text-3xl text-foreground mb-2">
                  Add New Property
                </h1>
                <p className="font-body text-muted-foreground">
                  List your rural property for sale and reach potential buyers across South Africa
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h2 className="font-display text-xl text-foreground mb-4">Basic Information</h2>
                      
                      <div>
                        <Label htmlFor="title">Property Title *</Label>
                        <Input
                          id="title"
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="e.g., Modern Family Farm with Stunning Views"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., Stellenbosch, Western Cape"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="text"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="e.g., R 2,850,000"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="size">Size *</Label>
                        <Input
                          id="size"
                          type="text"
                          value={formData.size}
                          onChange={(e) => handleInputChange('size', e.target.value)}
                          placeholder="e.g., 120 hectares or 450 m²"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="type">Property Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Farm">Farm</SelectItem>
                            <SelectItem value="Plot">Plot</SelectItem>
                            <SelectItem value="Smallholding">Smallholding</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="image">Image URL *</Label>
                        <Input
                          id="image"
                          type="url"
                          value={formData.image}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          placeholder="https://example.com/property-image.jpg"
                          required
                        />
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                      <h2 className="font-display text-xl text-foreground mb-4">Property Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            value={formData.bedrooms || ''}
                            onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || undefined)}
                            placeholder="Number of bedrooms"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            value={formData.bathrooms || ''}
                            onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || undefined)}
                            placeholder="Number of bathrooms"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="yearBuilt">Year Built</Label>
                          <Input
                            id="yearBuilt"
                            type="number"
                            value={formData.yearBuilt || ''}
                            onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || undefined)}
                            placeholder="e.g., 2018"
                          />
                        </div>

                        <div>
                          <Label htmlFor="parking">Parking Spaces</Label>
                          <Input
                            id="parking"
                            type="number"
                            value={formData.parking || ''}
                            onChange={(e) => handleInputChange('parking', parseInt(e.target.value) || undefined)}
                            placeholder="Number of parking spaces"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your property in detail..."
                        rows={6}
                        required
                      />
                    </div>

                    {/* Featured */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                      <Label htmlFor="featured" className="text-sm font-normal">
                        Feature this property on homepage
                      </Label>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <h2 className="font-display text-xl text-foreground mb-4">Additional Features</h2>
                    
                    {/* Coordinates */}
                    <div className="space-y-4">
                      <h3 className="font-body font-semibold text-foreground mb-2">Location Coordinates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lat">Latitude</Label>
                          <Input
                            id="lat"
                            type="number"
                            step="0.000001"
                            value={formData.coordinates?.lat || ''}
                            onChange={(e) => handleInputChange('coordinates', {
                              ...formData.coordinates,
                              lat: parseFloat(e.target.value)
                            })}
                            placeholder="-33.9348"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lng">Longitude</Label>
                          <Input
                            id="lng"
                            type="number"
                            step="0.000001"
                            value={formData.coordinates?.lng || ''}
                            onChange={(e) => handleInputChange('coordinates', {
                              ...formData.coordinates,
                              lng: parseFloat(e.target.value)
                            })}
                            placeholder="18.8673"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="font-body font-semibold text-foreground mb-2">Amenities</h3>
                      <div className="space-y-2">
                        {[
                          'Mountain Views', 'Fenced Land', 'Water Rights', 'Main House', 
                          'Barns', 'Storage', 'Solar Panels', 'Ocean Access', 
                          'Beach Access', 'Cottage', 'Gardens', 'Coastal Location',
                          'River Access', 'Irrigation', 'Electricity', 'Road Access'
                        ].map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity}
                              checked={formData.amenities?.includes(amenity) || false}
                              onCheckedChange={(checked) => {
                                const currentAmenities = formData.amenities || [];
                                if (checked) {
                                  handleInputChange('amenities', [...currentAmenities, amenity]);
                                } else {
                                  handleInputChange('amenities', currentAmenities.filter(a => a !== amenity));
                                }
                              }}
                            />
                            <Label htmlFor={amenity} className="text-sm font-normal">
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 mr-2 border-2 border-current"></div>
                        Creating Property...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AddProperty;
