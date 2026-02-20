import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Cookie, Settings, Eye, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Rural Properties South Africa</title>
        <meta name="description" content="Cookie Policy for Rural Properties South Africa - How we use cookies and tracking technologies." />
        <link rel="canonical" href="https://ruralproperties.co.za/cookies" />
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
                  <Cookie className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-4xl text-foreground mb-4">
                  Cookie Policy
                </h1>
                <p className="font-body text-muted-foreground text-lg">
                  This policy explains how Rural Properties uses cookies and similar technologies.
                </p>
              </div>

              {/* Content */}
              <div className="bg-card rounded-xl shadow-soft p-8 space-y-8">
                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">What Are Cookies?</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    Cookies are small text files that websites place on your computer or mobile device when you visit.
                  </p>
                  <p className="font-body text-muted-foreground">
                    They are widely used to make websites work more efficiently and to provide information to website owners.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">How We Use Cookies</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We use cookies for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Authentication Cookies:</strong> Keep you logged in to your account</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                    <li><strong>Marketing Cookies:</strong> Show relevant property advertisements</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Types of Cookies We Use</h2>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2">Session Cookies</h3>
                      <p className="font-body text-muted-foreground">
                        Temporary cookies that expire when you close your browser. Used for navigation and authentication.
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2">Persistent Cookies</h3>
                      <p className="font-body text-muted-foreground">
                        Remain on your device for a set period or until you delete them. Used for remembering preferences.
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2">Third-Party Cookies</h3>
                      <p className="font-body text-muted-foreground">
                        Placed by external services like Google Analytics for analytics and advertising purposes.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Managing Your Cookies</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    You have several options to manage cookies:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies</li>
                    <li><strong>Cookie Preferences:</strong> Use our cookie consent banner to set preferences</li>
                    <li><strong>Clear Cookies:</strong> Remove existing cookies from your browser at any time</li>
                    <li><strong>Opt-Out:</strong> Some third-party cookies offer opt-out options</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Cookie Consent</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    When you first visit our website, you'll see a cookie consent banner where you can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>Accept all cookies for the best experience</li>
                    <li>Customize your cookie preferences</li>
                    <li>Reject non-essential cookies</li>
                    <li>Change preferences at any time</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Impact of Disabling Cookies</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    If you disable cookies, some features of our website may not function properly:
                  </p>
                  <ul className="list-disc list-inside space-y-2 font-body text-muted-foreground ml-4">
                    <li>You may need to log in more frequently</li>
                    <li>Personalized features may not work</li>
                    <li>Property recommendations may be less relevant</li>
                    <li>Some website functionality may be limited</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Third-Party Services</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We use third-party services that may place their own cookies:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2">Google Analytics</h3>
                      <p className="font-body text-muted-foreground">
                        Helps us understand how visitors interact with our website to improve user experience.
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2">Firebase Authentication</h3>
                      <p className="font-body text-muted-foreground">
                        Manages user authentication and session management securely.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Updates to This Policy</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons.
                  </p>
                  <p className="font-body text-muted-foreground">
                    Any changes will be posted on this page with an updated "Last Modified" date.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-2xl text-foreground mb-4">Contact Us</h2>
                  <p className="font-body text-muted-foreground mb-4">
                    If you have questions about our use of cookies, please contact us:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="font-body text-foreground">
                      <strong>Email:</strong> info@ruralproperties.co.za<br />
                      <strong>Phone:</strong> +27 71 050 5053<br />
                      <strong>Website:</strong> www.ruralproperties.co.za
                    </p>
                  </div>
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

export default CookiePolicy;
