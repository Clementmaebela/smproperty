import { Link } from "react-router-dom";
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-background">
                Rural<span className="text-primary">Properties</span>
              </span>
            </Link>
            <p className="font-body text-background/70 text-sm mb-6">
              Your trusted partner for rural and peri-urban properties across South Africa. 
              Find your place, build your legacy.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg text-background mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Properties", "Farms", "Plots", "Houses", "Smallholdings"].map((link) => (
                <li key={link}>
                  <Link to="#" className="font-body text-background/70 hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Provinces */}
          <div>
            <h4 className="font-display font-bold text-lg text-background mb-6">Provinces</h4>
            <ul className="space-y-3">
              {["Limpopo", "Mpumalanga", "KwaZulu-Natal", "Eastern Cape", "North West", "Free State"].map((province) => (
                <li key={province}>
                  <Link to="#" className="font-body text-background/70 hover:text-primary transition-colors">
                    {province}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg text-background mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="font-body text-background/70 text-sm">
                  123 Ubuntu Street, Pretoria, Gauteng 0001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+27123456789" className="font-body text-background/70 text-sm hover:text-primary transition-colors">
                  +27 12 345 6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@ruralproperties.co.za" className="font-body text-background/70 text-sm hover:text-primary transition-colors">
                  info@ruralproperties.co.za
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-background/50 text-sm">
            © 2024 RuralProperties. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="font-body text-background/50 text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="font-body text-background/50 text-sm hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
