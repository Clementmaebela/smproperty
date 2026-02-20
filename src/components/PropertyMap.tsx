import { useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { MapPin, Home, Ruler, RefreshCw, Map } from "lucide-react";
import { motion } from "framer-motion";
import FallbackMap from "./FallbackMap";

// You can replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

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

// Sample properties - in production, this would come from your database
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

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Center of South Africa
const center = {
  lat: -28.4793,
  lng: 24.6727,
};

const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f1eb" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9d8d4" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e0d8cf" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d4e0d4" }],
  },
];

interface PropertyMapProps {
  apiKey?: string;
}

const PropertyMap = ({ apiKey }: PropertyMapProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inputApiKey, setInputApiKey] = useState(apiKey || GOOGLE_MAPS_API_KEY);
  const [useInputKey, setUseInputKey] = useState(false);

  const effectiveApiKey = useInputKey ? inputApiKey : (apiKey || GOOGLE_MAPS_API_KEY);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: effectiveApiKey,
  });

  const [showFallback, setShowFallback] = useState(false);

  const options = useMemo(
    () => ({
      styles: mapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    }),
    []
  );

  const onMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Show API key input if no key is configured
  if (!effectiveApiKey) {
    return (
      <div className="bg-card rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-card-foreground mb-2">
          Google Maps Integration
        </h3>
        <p className="font-body text-muted-foreground mb-6">
          Enter your Google Maps API key to view property locations on the map.
        </p>
        <div className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            placeholder="Enter your Google Maps API key"
            value={inputApiKey}
            onChange={(e) => setInputApiKey(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setUseInputKey(true)}
            disabled={!inputApiKey || inputApiKey.length < 20}
            className="w-full h-12 px-6 rounded-lg bg-primary text-primary-foreground font-body font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Load Map
          </button>
        </div>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">How to get your API key:</h4>
          <ol className="text-left text-sm text-muted-foreground space-y-2">
            <li>1. Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
            <li>2. Create a new project or select existing one</li>
            <li>3. Enable "Maps JavaScript API" and "Geocoding API"</li>
            <li>4. Create credentials (API key)</li>
            <li>5. Copy the API key and paste it above</li>
          </ol>
        </div>
        <p className="font-body text-sm text-muted-foreground mt-4">
          <strong>Note:</strong> The API key should start with "AIza" and be at least 39 characters long.
        </p>
        <p className="font-body text-sm text-muted-foreground">
          Get your API key from{" "}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-card rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-card-foreground mb-2">
          Map Loading Error
        </h3>
        <p className="font-body text-destructive mb-4">
          Failed to load Google Maps. Please check your API key and internet connection.
        </p>
        <div className="max-w-md mx-auto">
          <button
            onClick={() => window.location.reload()}
            className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-body font-semibold hover:bg-primary/90 transition-colors"
          >
            Retry Loading Map
          </button>
        </div>
        <p className="font-body text-sm text-muted-foreground mt-4">
          Make sure your API key is valid and has the following APIs enabled:
        </p>
        <ul className="text-left text-sm text-muted-foreground space-y-1">
          <li>• Maps JavaScript API</li>
          <li>• Geocoding API</li>
          <li>• Places API (optional)</li>
        </ul>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-card rounded-xl p-8 text-center">
        <div className="animate-pulse">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-card">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5.5}
        options={options}
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={property.coordinates}
            onClick={() => onMarkerClick(property)}
          />
        ))}

        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.coordinates}
            onCloseClick={onInfoWindowClose}
          >
            <div className="p-2 max-w-[280px]">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-bold text-base text-gray-900 mb-1">
                {selectedProperty.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                <MapPin className="w-3 h-3" />
                {selectedProperty.location}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-terracotta">
                  {selectedProperty.price}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Ruler className="w-3 h-3" />
                  {selectedProperty.size}
                </div>
              </div>
              <span className="inline-block mt-2 px-2 py-1 bg-sage/20 text-sage text-xs font-medium rounded">
                {selectedProperty.type}
              </span>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-card">
        <h4 className="font-display font-bold text-sm text-foreground mb-2">
          Property Locations
        </h4>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span className="font-body">{properties.length} Properties</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
