import { MapPin, Ruler, Bed, Bath, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string | { city: string; province: string; address: string };
  price: number | string;
  size: string | { landSize: string; totalSize: string };
  bedrooms?: number;
  bathrooms?: number;
  type: string;
  image: string;
  featured?: boolean;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  size,
  bedrooms,
  bathrooms,
  type,
  image,
  featured = false,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  // Handle different data structures
  const locationText = typeof location === 'string' ? location : `${location.city}, ${location.province}`;
  const priceText = typeof price === 'string' ? price : `R${price.toLocaleString()}`;
  const sizeText = typeof size === 'string' ? size : size.totalSize || size.landSize;
  const imageUrl = Array.isArray(image) ? image[0] : image;

  return (
    <Link to={`/properties/${id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer"
      >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {featured && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
            {type}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-4 py-2 bg-background/95 backdrop-blur-sm text-foreground font-display font-bold text-lg rounded-lg shadow-soft">
            {priceText}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-body text-sm">{locationText}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ruler className="w-4 h-4" />
            <span className="font-body text-sm">{sizeText}</span>
          </div>
          {bedrooms && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bed className="w-4 h-4" />
              <span className="font-body text-sm">{bedrooms} Beds</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bath className="w-4 h-4" />
              <span className="font-body text-sm">{bathrooms} Baths</span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
    </Link>
  );
};

export default PropertyCard;
