import { Link, useNavigate } from "react-router-dom";
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin-signin');
  };

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

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-lg text-background mb-6">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-body text-background/70">+27 72 050 5053</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-body text-background/70">info@ruralproperties.co.za</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-body text-background/70">Polokwane, South Africa</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-lg text-background mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="font-body text-background/70 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="font-body text-background/70 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="font-body text-background/70 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Access */}
          <div>
            <h4 className="font-display font-bold text-lg text-background mb-6">System Access</h4>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAdminLogin}
                className="w-full justify-start"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
              <p className="text-xs text-background/60 mt-2">
                For system administrators only
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-body text-background/60 text-sm">
              © 2026 Rural Properties South Africa. All rights reserved.
            </p>
            <p className="font-body text-background/60 text-sm">
              Built by Sitimark
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
