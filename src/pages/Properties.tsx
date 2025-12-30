import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X, Grid, Map } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";

const allProperties = [
  {
    id: "1",
    title: "Fertile Farm with River Access",
    location: "Tzaneen, Limpopo",
    price: "R2,450,000",
    size: "15 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    featured: true,
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
  },
  {
    id: "3",
    title: "Residential Plot in Growing Area",
    location: "Mthatha, Eastern Cape",
    price: "R380,000",
    size: "2,000 m²",
    type: "Plot",
    image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&q=80",
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
  },
  {
    id: "5",
    title: "Irrigated Agricultural Land",
    location: "Brits, North West",
    price: "R3,200,000",
    size: "25 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  },
  {
    id: "6",
    title: "Peri-Urban Development Plot",
    location: "Rustenburg, North West",
    price: "R520,000",
    size: "1,500 m²",
    type: "Plot",
    image: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800&q=80",
  },
  {
    id: "7",
    title: "Coastal Farm with Ocean Views",
    location: "Port Alfred, Eastern Cape",
    price: "R4,500,000",
    size: "30 hectares",
    type: "Farm",
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=800&q=80",
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
  },
];

const propertyTypes = ["All", "Farm", "Plot", "House", "Smallholding"];
const provinces = ["All Provinces", "Limpopo", "Mpumalanga", "KwaZulu-Natal", "Eastern Cape", "North West", "Free State", "Gauteng", "Western Cape", "Northern Cape"];
const priceRanges = ["Any Price", "Under R500K", "R500K - R1M", "R1M - R3M", "R3M - R5M", "Over R5M"];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [selectedPrice, setSelectedPrice] = useState("Any Price");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || property.type === selectedType;
    const matchesProvince = selectedProvince === "All Provinces" || property.location.includes(selectedProvince.split(" ")[0]);
    return matchesSearch && matchesType && matchesProvince;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedProvince("All Provinces");
    setSelectedPrice("Any Price");
  };

  const hasActiveFilters = searchQuery || selectedType !== "All" || selectedProvince !== "All Provinces" || selectedPrice !== "Any Price";

  return (
    <>
      <Helmet>
        <title>Properties for Sale | Rural Properties - Rural Properties South Africa</title>
        <meta name="description" content="Browse farms, plots, houses, and smallholdings for sale across rural and peri-urban South Africa. Find your perfect property today." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          {/* Page Header */}
          <section className="bg-accent py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h1 className="font-display text-4xl md:text-5xl text-accent-foreground mb-4">
                  Find Your Perfect <span className="text-sand">Property</span>
                </h1>
                <p className="font-body text-accent-foreground/80 text-lg max-w-2xl mx-auto">
                  Explore our collection of rural and peri-urban properties across South Africa.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Search and Filters */}
          <section className="py-8 bg-background border-b border-border sticky top-16 lg:top-20 z-40">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="w-full lg:w-96 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by location or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Button>

                  {/* View Toggle */}
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-soft" : ""}`}
                      aria-label="Grid view"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "map" ? "bg-background shadow-soft" : ""}`}
                      aria-label="Map view"
                    >
                      <Map className="w-5 h-5" />
                    </button>
                  </div>

                  <span className="font-body text-muted-foreground text-sm hidden sm:inline">
                    {filteredProperties.length} properties found
                  </span>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-border"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Property Type */}
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-2 block">
                        Property Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg bg-muted border-0 text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Province */}
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-2 block">
                        Province
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg bg-muted border-0 text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {provinces.map((province) => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-2 block">
                        Price Range
                      </label>
                      <select
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="w-full h-11 px-4 rounded-lg bg-muted border-0 text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {priceRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        className="gap-2 w-full"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Property Listings */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4">
              {viewMode === "grid" ? (
                <>
                  {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {filteredProperties.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <PropertyCard {...property} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display font-bold text-xl text-foreground mb-2">
                        No properties found
                      </h3>
                      <p className="font-body text-muted-foreground mb-6">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                      <Button onClick={clearFilters}>Clear All Filters</Button>
                    </div>
                  )}
                </>
              ) : (
                <PropertyMap />
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Properties;
