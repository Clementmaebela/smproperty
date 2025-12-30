import { motion } from "framer-motion";
import { Shield, Users, Handshake, MapPin } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Deep knowledge of rural and peri-urban South African property markets, from the Eastern Cape to Limpopo.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified for authenticity, ensuring secure and transparent transactions.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "We understand the unique needs of rural communities and help connect buyers with the right properties.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    description: "From search to purchase, our team guides you through every step of the property journey.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 lg:py-28 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground font-body font-semibold text-sm rounded-full mb-6">
              Why Rural Properties
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-accent-foreground mb-6 leading-tight">
              Your Trusted Partner in <span className="text-sand">Rural Property</span>
            </h2>
            <p className="font-body text-accent-foreground/80 text-lg mb-8">
              Rural Properties means "My Place" in isiZulu. We believe everyone deserves their own piece of South Africa's 
              beautiful landscape. Our mission is to make rural and peri-urban property accessible, transparent, and secure.
            </p>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <p className="font-display text-4xl text-primary-foreground font-bold">10+</p>
                <p className="font-body text-accent-foreground/70 text-sm">Years Experience</p>
              </div>
              <div>
                <p className="font-display text-4xl text-primary-foreground font-bold">500+</p>
                <p className="font-body text-accent-foreground/70 text-sm">Properties Sold</p>
              </div>
              <div>
                <p className="font-display text-4xl text-primary-foreground font-bold">98%</p>
                <p className="font-body text-accent-foreground/70 text-sm">Satisfaction</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-accent-foreground/5 backdrop-blur-sm p-6 rounded-xl border border-accent-foreground/10"
              >
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg text-accent-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-accent-foreground/70 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
