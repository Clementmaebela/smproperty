import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FileText, Scale, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Rural Properties South Africa</title>
        <meta name="description" content="Terms of Service for Rural Properties South Africa - Rules and guidelines for using our property platform." />
        <link rel="canonical" href="https://ruralproperties.co.za/terms" />
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
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-4xl text-foreground mb-4">
                  Terms of Service
                </h1>
                <p className="font-body text-muted-foreground text-lg">
                  By using Rural Properties, you agree to these terms and conditions.
                </p>
              </div>

              {/* Content */}
              <div className="bg-card rounded-xl shadow-soft p-8 space-y-8">
                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Acceptance of Terms</h2>
                  <p className="font-body text-muted-foreground">
                    By accessing and using Rural Properties, you accept and agree to be bound by these Terms of Service.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Use of the Service</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    You may use our services for lawful purposes only. You agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>Use the service for any illegal or unauthorized purpose</li>
                    <li>Post false, misleading, or inaccurate information</li>
                    <li>Upload viruses or malicious code</li>
                    <li>Spam, harass, or harm other users</li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Property Listings</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    Users who list properties must ensure:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>All information is accurate and truthful</li>
                    <li>You have legal right to list the property</li>
                    <li>Property complies with South African laws</li>
                    <li>Images and descriptions are not misleading</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">User Accounts</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    Regarding your account and security:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>You are responsible for maintaining account security</li>
                    <li>You must provide accurate registration information</li>
                    <li>One account per person or entity</li>
                    <li>Notify us immediately of unauthorized use</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Intellectual Property</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    The service and its original content, features, and functionality are owned by Rural Properties and are protected by international copyright laws.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Limitation of Liability</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    Rural Properties is not responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>Accuracy of property information provided by users</li>
                    <li>Property transactions between users</li>
                    <li>Any damages arising from service use</li>
                    <li>Third-party website links or content</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Termination</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>Breach of these Terms of Service</li>
                    <li>Violation of applicable laws</li>
                    <li>Fraudulent or illegal activity</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Changes to Terms</h2>
                  <p className="font-body text-muted-foreground">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Contact Information</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="font-body text-foreground">
                      <strong>Email:</strong> info@ruralproperties.co.za<br />
                      <strong>Phone:</strong> +27 71 050 5053<br />
                      <strong>Address:</strong> Polokwane, Limpopo, 0727
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Governing Law</h2>
                  <p className="font-body text-muted-foreground">
                    These Terms of Service shall be governed by and construed in accordance with the laws of South Africa.
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

export default TermsOfService;
