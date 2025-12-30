import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";

const regions = [
  {
    name: "Limpopo",
    properties: 89,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80",
  },
  {
    name: "Mpumalanga",
    properties: 76,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80",
  },
  {
    name: "KwaZulu-Natal",
    properties: 124,
    image: "https://images.unsplash.com/photo-1484804959297-65e7c19d7c9f?w=600&q=80",
  },
  {
    name: "Eastern Cape",
    properties: 67,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
  },
  {
    name: "North West",
    properties: 54,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    name: "Free State",
    properties: 43,
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80",
  },
];

const Regions = () => {
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
            Explore Regions
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Browse by <span className="text-primary">Province</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Each province offers unique landscapes, climates, and opportunities. Find the perfect region for your needs.
          </p>
        </motion.div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={region.image}
                alt={region.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-body text-sm">{region.properties} Properties</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-primary-foreground">
                      {region.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Regions;
