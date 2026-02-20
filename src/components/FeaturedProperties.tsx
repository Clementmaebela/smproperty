import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { useQuery } from '@tanstack/react-query';
import { PropertiesService } from '@/services/databaseService';

const FeaturedProperties = () => {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => PropertiesService.getFeaturedProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl text-accent-foreground mb-4">
            Featured Properties
          </h2>
          <p className="font-body text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium rural properties across South Africa
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-foreground"></div>
            <p className="mt-4 text-accent-foreground">Loading featured properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard 
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.priceFormatted || property.price}
                  size={property.size}
                  bedrooms={property.features?.bedrooms}
                  bathrooms={property.features?.bathrooms}
                  type={property.propertyType}
                  image={property.images?.[0]}
                  featured={property.featured}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-body text-accent-foreground/80">
              No featured properties available at the moment.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <Button variant="outline" size="lg" className="mt-8">
            <ArrowRight className="w-4 h-4 mr-2" />
            View All Properties
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
