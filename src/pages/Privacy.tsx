import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Shield, Lock, Cookie, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Rural Properties South Africa</title>
        <meta name="description" content="Privacy policy for Rural Properties South Africa - How we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://ruralproperties.co.za/privacy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-4xl text-foreground mb-4">
                  Privacy Policy
                </h1>
                <p className="font-body text-muted-foreground text-lg">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
              </div>

              {/* Content */}
              <div className="bg-card rounded-xl shadow-soft p-8 space-y-8">
                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Information We Collect</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We collect information you provide directly to us, such as when you create an account, contact us, or use our services.
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>Name and contact information</li>
                    <li>Property preferences and search history</li>
                    <li>Account authentication details</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">How We Use Your Information</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We use the information we collect to provide, maintain, and improve our services.
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>To provide property search and listing services</li>
                    <li>To communicate with you about properties</li>
                    <li>To personalize your experience</li>
                    <li>To improve our website and services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Data Protection</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized access.
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>Secure authentication systems</li>
                    <li>Encrypted data transmission</li>
                    <li>Regular security updates</li>
                    <li>Limited employee access</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Contact Us</h2>
                  <p className="font-body text-muted-foreground">
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="font-body text-foreground">
                      <strong>Email:</strong> info@ruralproperties.co.za<br />
                      <strong>Phone:</strong> +27 71 050 5053
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Policy Updates</h2>
                  <p className="font-body text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                  </p>
                  <p className="font-body text-muted-foreground mt-2">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
