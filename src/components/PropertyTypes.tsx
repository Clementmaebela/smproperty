import { motion } from "framer-motion";
import { Tractor, MapPinned, Home, Trees } from "lucide-react";

const types = [
  {
    icon: Tractor,
    name: "Farms",
    count: 124,
    description: "Agricultural land for cultivation and livestock",
  },
  {
    icon: MapPinned,
    name: "Plots",
    count: 256,
    description: "Vacant land ready for development",
  },
  {
    icon: Home,
    name: "Houses",
    count: 89,
    description: "Rural homes with character and space",
  },
  {
    icon: Trees,
    name: "Smallholdings",
    count: 67,
    description: "Perfect blend of land and living",
  },
];

const PropertyTypes = () => {
  return (
    <section className="py-20 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary font-body font-semibold text-sm rounded-full mb-4">
            Property Categories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Find by <span className="text-secondary">Property Type</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're looking for farmland, a vacant plot, or a cozy rural home, we have options for every need.
          </p>
        </motion.div>

        {/* Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card p-8 rounded-xl shadow-soft hover:shadow-card transition-all duration-500 cursor-pointer text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <type.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display font-bold text-xl text-card-foreground mb-2">
                {type.name}
              </h3>
              <p className="font-body text-muted-foreground text-sm mb-4">
                {type.description}
              </p>
              <span className="inline-block px-3 py-1 bg-muted text-muted-foreground font-body font-semibold text-sm rounded-full">
                {type.count} Properties
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
