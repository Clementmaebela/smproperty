import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X, Grid, Map, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from '@tanstack/react-query';
import { PropertiesService } from '@/services/databaseService';
import { Link } from "react-router-dom";

const propertyTypes = ["All", "Farm", "Plot", "House", "Smallholding"];
const provinces = ["All Provinces", "Limpopo", "Mpumalanga", "KwaZulu-Natal", "Eastern Cape", "North West", "Free State", "Gauteng", "Western Cape", "Northern Cape"];
const priceRanges = ["Any Price", "Under R500K", "R500K - R1M", "R1M - R3M", "R3M - R5M", "Over R5M"];

const PropertiesFixed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedProvince, setSelectedProvince] = useState("All Provinces");
  const [selectedPrice, setSelectedPrice] = useState("Any Price");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Build filters object
  const filters = {
    type: selectedType !== "All" ? selectedType : undefined,
    location: selectedProvince !== "All Provinces" ? selectedProvince : undefined,
    minPrice: selectedPrice === "Under R500K" ? 0 : 
              selectedPrice === "R500K - R1M" ? 500000 :
              selectedPrice === "R1M - R3M" ? 1000000 :
              selectedPrice === "R3M - R5M" ? 3000000 :
              selectedPrice === "Over R5M" ? 5000000 : undefined,
    maxPrice: selectedPrice === "Under R500K" ? 499999 :
              selectedPrice === "R500K - R1M" ? 999999 :
              selectedPrice === "R1M - R3M" ? 2999999 :
              selectedPrice === "R3M - R5M" ? 4999999 :
              selectedPrice === "Over R5M" ? undefined : undefined
  };

  const { data: allProperties = [], isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => PropertiesService.getProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof property.location === 'string' 
        ? property.location.toLowerCase().includes(searchQuery.toLowerCase())
        : `${property.location.city}, ${property.location.province}`.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
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
        
        <main className="pt-16 lg:pt-20">
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
                  Find Your Perfect Rural Property
                </h1>
                <p className="font-body text-lg text-accent-foreground/80 max-w-2xl mx-auto">
                  Discover beautiful farms, plots, houses, and smallholdings across South Africa's rural and peri-urban areas
                </p>
              </motion.div>
            </div>
          </section>

          {/* Search and Filters */}
          <section className="bg-background border-b py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search properties by title or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </Button>

                {/* View Mode Toggle */}
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="flex items-center gap-2"
                  >
                    <Grid className="w-4 h-4" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="flex items-center gap-2"
                  >
                    <Map className="w-4 h-4" />
                    Map
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchQuery && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Search: {searchQuery}
                    </span>
                  )}
                  {selectedType !== "All" && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Type: {selectedType}
                    </span>
                  )}
                  {selectedProvince !== "All Provinces" && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Location: {selectedProvince}
                    </span>
                  )}
                  {selectedPrice !== "Any Price" && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Price: {selectedPrice}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Filters Panel */}
          {showFilters && (
            <section className="bg-background border-b py-6">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Property Type Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Property Type</h3>
                    <div className="space-y-2">
                      {propertyTypes.map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={selectedType === type}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="text-primary"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Location</h3>
                    <div className="space-y-2">
                      {provinces.map((province) => (
                        <label key={province} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location"
                            value={province}
                            checked={selectedProvince === province}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="text-primary"
                          />
                          <span className="text-sm">{province}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            value={range}
                            checked={selectedPrice === range}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="text-primary"
                          />
                          <span className="text-sm">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Results Section */}
          <section className="container mx-auto px-4 py-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load properties. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms to find the perfect property.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Properties Grid */}
            {!isLoading && !error && filteredProperties.length > 0 && (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">
                    {filteredProperties.length} Properties Found
                  </h2>
                  {hasActiveFilters && (
                    <p className="text-muted-foreground">
                      Showing filtered results
                    </p>
                  )}
                </div>

                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        title={property.title}
                        location={property.location}
                        price={property.priceFormatted || property.price}
                        size={property.size}
                        bedrooms={property.features?.bedrooms}
                        bathrooms={property.features?.bathrooms}
                        type={property.propertyType}
                        image={property.images?.[0] || property.image}
                        featured={property.featured}
                      />
                    ))}
                  </div>
                )}

                {/* Map View */}
                {viewMode === "map" && (
                  <div className="h-[600px] rounded-lg border">
                    <PropertyMap />
                  </div>
                )}
              </>
            )}
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PropertiesFixed;
