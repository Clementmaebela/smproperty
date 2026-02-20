import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapPin, Ruler, Bed, Bath, Car, Calendar, Share2, Heart, ArrowLeft, Phone, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { PropertiesService } from '@/services/databaseService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => PropertiesService.getProperty(id),
    enabled: !!id
  });
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="font-display text-3xl text-foreground mb-4">Loading Property...</h1>
              <p className="font-body text-muted-foreground">
                Please wait while we fetch the property details.
              </p>
            </div>
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
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="font-display text-3xl text-foreground mb-4">Property Not Found</h1>
              <p className="font-body text-muted-foreground mb-8">
                The property you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/properties">
                <Button className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Properties
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle both old and new schema structures
  const location = property?.location;
  const locationText = typeof location === 'string' 
    ? location 
    : location 
    ? `${location.city}, ${location.province}` 
    : 'Location not specified';

  const price = property?.price;
  const priceText = typeof price === 'string' 
    ? price 
    : price 
    ? `R${price.toLocaleString()}` 
    : 'Price not specified';

  const size = property?.size;
  const sizeText = typeof size === 'string' 
    ? size 
    : size 
    ? size.totalSize || size.landSize 
    : 'Size not specified';

  const images = property?.images || [];
  const mainImage = Array.isArray(images) ? images[0] : images;

  return (
    <>
      <Helmet>
        <title>{property?.title || 'Property Details'} - Rural Properties</title>
        <meta 
          name="description" 
          content={property?.description || 'View details for this rural property in South Africa'} 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="container mx-auto px-4 py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-foreground">
                Properties
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">
                {property?.title || 'Property Details'}
              </span>
            </nav>

            {/* Property Images */}
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              {images.length > 1 && (
                <div className="absolute top-4 left-4 z-10 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-3 h-3 rounded-full border-2 transition-all ${
                        activeImage === index ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
              <img
                src={mainImage}
                alt={property?.title || 'Property'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Title and Price */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl text-foreground mb-2">
                    {property?.title || 'Property Title'}
                  </h1>
                  <Badge variant={property?.featured ? "default" : "secondary"} className="ml-3">
                    {property?.featured ? 'Featured' : 'Standard'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {priceText}
                  </div>
                  {property?.priceFormatted && (
                    <div className="text-sm text-muted-foreground">
                      {property.priceFormatted}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{locationText}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Size */}
              <Card>
                <CardHeader>
                  <CardTitle>Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Ruler className="w-4 h-4" />
                    <span>{sizeText}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    {property?.features?.bedrooms && (
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4" />
                        <span>{property.features.bedrooms} Bedrooms</span>
                      </div>
                    )}
                    {property?.features?.bathrooms && (
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4" />
                        <span>{property.features.bathrooms} Bathrooms</span>
                      </div>
                    )}
                    {property?.features?.garages && (
                      <div className="flex items-center space-x-2">
                        <Car className="w-4 h-4" />
                        <span>{property.features.garages} Garages</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Property Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="w-fit">
                    {property?.propertyType || 'Not specified'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Year Built */}
              {property?.yearBuilt && (
                <Card>
                  <CardHeader>
                    <CardTitle>Year Built</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{property.yearBuilt}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property?.description || 'No description available for this property.'}
                </p>
              </CardContent>
            </Card>

            {/* Agent Information */}
            {property?.agent && (
              <Card>
                <CardHeader>
                  <CardTitle>Agent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-muted">
                      <img
                        src={property.agent.profileImage}
                        alt={property.agent.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {property.agent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {property.agent.email}
                      </p>
                      {property.agent.phone && (
                        <p className="text-sm text-muted-foreground">
                          {property.agent.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <Button variant="outline" size="lg" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact Agent
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="flex-1"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current text-primary' : ''}`} />
                {isLiked ? 'Saved' : 'Save to Favorites'}
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PropertyDetails;
