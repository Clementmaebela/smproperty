import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";

const properties = [
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
];

const FeaturedProperties = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-body font-semibold text-sm rounded-full mb-4">
            Featured Listings
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Discover Your <span className="text-primary">Dream Land</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our handpicked selection of rural and peri-urban properties across South Africa's most beautiful regions.
          </p>
        </motion.div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="gap-2">
            View All Properties
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
