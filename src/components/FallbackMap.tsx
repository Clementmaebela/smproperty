import { useState } from "react";
import { MapPin, Home, Ruler, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  size: string;
  type: string;
  image: string;
  coordinates: { lat: number; lng: number };
}

// Sample properties - same as PropertyMap
const properties: Property[] = [
  {
    id: "1",
    title: "Fertile Farm with River Access",
    location: "Tzaneen, Limpopo",
    price: "R2,450,000",
    size: "15 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    coordinates: { lat: -23.8328, lng: 30.1625 },
  },
  {
    id: "2",
    title: "Mountain View Smallholding",
    location: "Sabie, Mpumalanga",
    price: "R1,850,000",
    size: "5 hectares",
    type: "Smallholding",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80",
    coordinates: { lat: -25.0955, lng: 30.7836 },
  },
  {
    id: "3",
    title: "Residential Plot in Growing Area",
    location: "Mthatha, Eastern Cape",
    price: "R380,000",
    size: "2,000 m²",
    type: "Plot",
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400&q=80",
    coordinates: { lat: -31.5889, lng: 28.7844 },
  },
  {
    id: "4",
    title: "Traditional Homestead with Land",
    location: "Nongoma, KwaZulu-Natal",
    price: "R950,000",
    size: "3 hectares",
    type: "House",
    image: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400&q=80",
    coordinates: { lat: -27.8986, lng: 31.6517 },
  },
  {
    id: "5",
    title: "Irrigated Agricultural Land",
    location: "Brits, North West",
    price: "R3,200,000",
    size: "25 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&q=80",
    coordinates: { lat: -25.6322, lng: 27.7808 },
  },
  {
    id: "6",
    title: "Peri-Urban Development Plot",
    location: "Rustenburg, North West",
    price: "R520,000",
    size: "1,500 m²",
    type: "Plot",
    image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=400&q=80",
    coordinates: { lat: -25.6674, lng: 27.2420 },
  },
];

const FallbackMap = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const openInGoogleMaps = (property: Property) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-card rounded-xl p-8">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-card-foreground mb-2">
          Property Locations
        </h3>
        <p className="font-body text-muted-foreground">
          Browse our properties and view their locations on Google Maps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedProperty(property)}
          >
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                {property.type}
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                {property.title}
              </h4>
              
              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                <MapPin className="w-3 h-3" />
                {property.location}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg text-primary">
                  {property.price}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Ruler className="w-3 h-3" />
                  {property.size}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openInGoogleMaps(property);
                }}
                className="w-full h-10 px-4 rounded-lg bg-primary text-primary-foreground font-body font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Google Maps
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProperty && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProperty(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-background rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-xl text-foreground mb-2">
              {selectedProperty.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
              <MapPin className="w-3 h-3" />
              {selectedProperty.location}
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg text-primary">
                {selectedProperty.price}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Ruler className="w-3 h-3" />
                {selectedProperty.size}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openInGoogleMaps(selectedProperty)}
                className="flex-1 h-10 px-4 rounded-lg bg-primary text-primary-foreground font-body font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Maps
              </button>
              <button
                onClick={() => setSelectedProperty(null)}
                className="flex-1 h-10 px-4 rounded-lg bg-muted text-foreground font-body font-semibold hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2">About Our Properties</h4>
        <p className="text-sm text-muted-foreground mb-2">
          We offer a diverse range of properties across South Africa, including:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Agricultural farms and smallholdings</li>
          <li>• Residential plots and development land</li>
          <li>• Traditional homesteads with land</li>
          <li>• Peri-urban development opportunities</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2">
          Click on any property to view its location on Google Maps.
        </p>
      </div>
    </div>
  );
};

export default FallbackMap;
