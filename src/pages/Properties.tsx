import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X, Grid, Map, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { Link } from "react-router-dom";

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

  // Build filters object
  const filters = {
    type: selectedType !== "All" ? selectedType : undefined,
    location: selectedProvince !== "All Provinces" ? selectedProvince : undefined,
    minPrice: selectedPrice === "Under R500K" ? 0 : 
              selectedPrice === "R500K - R1M" ? 500000 :
              selectedPrice === "R1M - R3M" ? 1000000 :
              selectedPrice === "R3M - R5M" ? 3000000 :
              selectedPrice === "Over R5M" ? 5000000 : undefined,
    maxPrice: selectedPrice === "Under R500K" ? 500000 :
              selectedPrice === "R500K - R1M" ? 1000000 :
              selectedPrice === "R1M - R3M" ? 3000000 :
              selectedPrice === "R3M - R5M" ? 5000000 : undefined,
  };

  const { data: allProperties = [], isLoading, error } = useProperties(filters);

  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
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
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    
                    <Link to="/properties/add">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-soft" : ""}`}
                      aria-label="Grid view"
                    >
                      <Grid className="w-5 h-5" />
                    </Button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "map" ? "bg-background shadow-soft" : ""}`}
                      aria-label="Map view"
                    >
                      <Map className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <span className="font-body text-muted-foreground text-sm hidden sm:inline">
                  {filteredProperties.length} properties found
                </span>
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
                          <PropertyCard 
                            id={property.id!}
                            title={property.title}
                            location={property.location}
                            price={property.price}
                            size={property.size}
                            bedrooms={property.bedrooms}
                            bathrooms={property.bathrooms}
                            type={property.type}
                            image={property.image}
                            featured={property.featured}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      {isLoading ? (
                        <>
                          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-display font-bold text-xl text-foreground mb-2">
                            Loading properties...
                          </h3>
                          <p className="font-body text-muted-foreground mb-6">
                            Please wait while we fetch the latest listings.
                          </p>
                        </>
                      ) : error ? (
                        <>
                          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-display font-bold text-xl text-foreground mb-2">
                            Error loading properties
                          </h3>
                          <p className="font-body text-muted-foreground mb-6">
                            There was an error loading the properties. Please try again.
                          </p>
                          <Button onClick={() => window.location.reload()}>Retry</Button>
                        </>
                      ) : (
                        <>
                          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-display font-bold text-xl text-foreground mb-2">
                            No properties found
                          </h3>
                          <p className="font-body text-muted-foreground mb-6">
                            Try adjusting your search or filters to find what you're looking for.
                          </p>
                          <Button onClick={clearFilters}>Clear All Filters</Button>
                        </>
                      )}
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
