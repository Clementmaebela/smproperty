export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  type: string;
  image: string;
  featured?: boolean;
  description?: string;
  yearBuilt?: number;
  parking?: number;
  amenities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Fertile Farm with River Access",
    location: "Tzaneen, Limpopo",
    price: "R2,450,000",
    size: "15 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    featured: true,
    description: "This stunning 15-hectare farm features fertile soil perfect for agriculture, with beautiful river access providing water security. The property includes existing irrigation infrastructure and several outbuildings suitable for farming operations.",
    yearBuilt: 1998,
    parking: 4,
    amenities: ["River Access", "Irrigation System", "Farm Buildings", "Fenced", "Electricity", "Water Supply"],
    coordinates: { lat: -23.8333, lng: 30.1667 }
  },
  {
    id: "2",
    title: "Mountain View Smallholding",
    location: "Sabie, Mpumalanga",
    price: "R1,850,000",
    size: "5 hectares",
    bedrooms: 3,
    bathrooms: 2,
    type: "Smallholding",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
    featured: true,
    description: "Beautiful smallholding with breathtaking mountain views. Perfect for those seeking a peaceful rural lifestyle with space for gardening, small-scale farming, or simply enjoying nature. The main house offers comfortable living spaces.",
    yearBuilt: 2005,
    parking: 2,
    amenities: ["Mountain Views", "Garden Space", "Main House", "Borehole", "Solar Power", "Staff Quarters"],
    coordinates: { lat: -25.0951, lng: 30.7755 }
  },
  {
    id: "3",
    title: "Residential Plot in Growing Area",
    location: "Mthatha, Eastern Cape",
    price: "R380,000",
    size: "2,000 m²",
    type: "Plot",
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&q=80",
    description: "Prime residential plot in a rapidly developing area. Ideal for building your dream home in a location with excellent growth potential. Services are readily available and the neighborhood is well-established.",
    yearBuilt: null,
    parking: 0,
    amenities: ["Level Ground", "Services Available", "Fenced", "Good Access Roads", "Near Schools"],
    coordinates: { lat: -31.9413, lng: 28.7832 }
  },
  {
    id: "4",
    title: "Traditional Homestead with Land",
    location: "Nongoma, KwaZulu-Natal",
    price: "R950,000",
    size: "3 hectares",
    bedrooms: 4,
    bathrooms: 2,
    type: "House",
    image: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80",
    description: "Traditional family homestead set on 3 hectares of land. This property combines cultural significance with practical living space, featuring a main house with multiple bedrooms and ample land for subsistence farming or livestock.",
    yearBuilt: 1985,
    parking: 3,
    amenities: ["Traditional Design", "Multiple Buildings", "Cattle Enclosure", "Fruit Trees", "Community Water", "Cultural Significance"],
    coordinates: { lat: -28.7386, lng: 31.8390 }
  },
  {
    id: "5",
    title: "Irrigated Agricultural Land",
    location: "Brits, North West",
    price: "R3,200,000",
    size: "25 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
    description: "Premium agricultural land with comprehensive irrigation infrastructure. This 25-hectare property is ideal for commercial farming operations, with water rights and established irrigation systems covering the entire property.",
    yearBuilt: 2001,
    parking: 6,
    amenities: ["Full Irrigation", "Water Rights", "Packhouse", "Cold Storage", "Equipment Storage", "Access Roads"],
    coordinates: { lat: -25.6333, lng: 27.7833 }
  },
  {
    id: "6",
    title: "Peri-Urban Development Plot",
    location: "Rustenburg, North West",
    price: "R520,000",
    size: "1,500 m²",
    type: "Plot",
    image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800&q=80",
    description: "Strategically located development plot in a growing peri-urban area. Perfect for residential or commercial development with excellent access to urban amenities while maintaining a semi-rural atmosphere.",
    yearBuilt: null,
    parking: 0,
    amenities: ["Development Potential", "Urban Access", "Zoned Residential", "Utilities Nearby", "Good Location"],
    coordinates: { lat: -25.6672, lng: 27.2424 }
  },
  {
    id: "7",
    title: "Coastal Farm with Ocean Views",
    location: "Port Alfred, Eastern Cape",
    price: "R4,500,000",
    size: "30 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=800&q=80",
    featured: true,
    description: "Exceptional coastal farm offering both agricultural potential and stunning ocean views. This 30-hectare property combines productive farmland with premium coastal location, ideal for diversified farming or lifestyle development.",
    yearBuilt: 1995,
    parking: 4,
    amenities: ["Ocean Views", "Coastal Access", "Mixed Terrain", "Main House", "Outbuildings", "Tourism Potential"],
    coordinates: { lat: -33.5906, lng: 26.8910 }
  },
  {
    id: "8",
    title: "Modern Rural Family Home",
    location: "White River, Mpumalanga",
    price: "R2,100,000",
    size: "8,000 m²",
    bedrooms: 5,
    bathrooms: 3,
    type: "House",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    description: "Modern family home situated on a spacious 8,000 m² stand. This property offers contemporary living spaces with a rural atmosphere, featuring a well-maintained garden and entertainment areas perfect for family living.",
    yearBuilt: 2018,
    parking: 3,
    amenities: ["Modern Design", "Swimming Pool", "Entertainment Area", "Garden", "Staff Accommodation", "Security"],
    coordinates: { lat: -25.3319, lng: 30.9459 }
  },
  {
    id: "9",
    title: "Bushveld Game Farm",
    location: "Hoedspruit, Limpopo",
    price: "R8,900,000",
    size: "150 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    featured: true,
    description: "Prestigious bushveld game farm spanning 150 hectares of pristine wilderness. This property offers exceptional wildlife viewing opportunities with diverse ecosystems and infrastructure suitable for eco-tourism or private conservation.",
    yearBuilt: 2008,
    parking: 8,
    amenities: ["Game Fenced", "Wildlife", "Water Holes", "Main Lodge", "Staff Housing", "Tourism Infrastructure"],
    coordinates: { lat: -24.3533, lng: 30.9456 }
  }
];

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(property => property.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(property => property.featured);
};

export const getPropertiesByType = (type: string): Property[] => {
  return properties.filter(property => property.type === type);
};

export const getPropertiesByLocation = (location: string): Property[] => {
  return properties.filter(property => 
    property.location.toLowerCase().includes(location.toLowerCase())
  );
};
