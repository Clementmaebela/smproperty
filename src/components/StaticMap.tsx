import { useState } from "react";
import { MapPin, Home, Ruler } from "lucide-react";
import { motion } from "framer-motion";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  size: string;
  type: string;
  image: string;
}

interface StaticMapProps {
  properties: Property[];
}

const StaticMap = ({ properties }: StaticMapProps) => {
  return (
    <div className="bg-card rounded-xl p-8">
      <div className="text-center mb-6">
        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-card-foreground mb-2">
          Property Locations
        </h3>
        <p className="font-body text-muted-foreground">
          Browse our featured properties by location
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-background rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${property.id}/400/300.jpg`;
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-lg text-card-foreground">
                  {property.title}
                </h4>
                
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-terracotta">
                    {property.price}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Ruler className="w-4 h-4" />
                    <span>{property.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 bg-sage/20 text-sage text-xs font-medium rounded">
                    {property.type}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h4 className="font-display font-semibold text-foreground mb-4">
          🗺️ Map View
        </h4>
        <p className="font-body text-muted-foreground mb-4">
          For an interactive map experience, please configure your Google Maps API key.
        </p>
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Return to property listings
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaticMap;
