import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+27 71 050 5053", "+27 82 406 7777"],
      action: "tel:+27710505053",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@ruralproperties.co.za", "sales@ruralproperties.co.za"],
      action: "mailto:info@ruralproperties.co.za",
    },
   
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Rural Properties - Rural Properties South Africa</title>
        <meta name="description" content="Get in touch with Rural Properties for inquiries about rural and peri-urban properties in South Africa. We're here to help you find your dream land." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20">
          {/* Page Header */}
          <section className="bg-accent py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h1 className="font-display text-4xl md:text-5xl text-accent-foreground mb-4">
                  Get in <span className="text-sand">Touch</span>
                </h1>
                <p className="font-body text-accent-foreground/80 text-lg max-w-2xl mx-auto">
                  Have questions about a property or need help finding your perfect land? We're here to assist you.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
                    Send us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-body text-sm text-muted-foreground mb-2 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="font-body text-sm text-muted-foreground mb-2 block">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-body text-sm text-muted-foreground mb-2 block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="+27 82 123 4567"
                        />
                      </div>
                      <div>
                        <label className="font-body text-sm text-muted-foreground mb-2 block">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full h-12 px-4 rounded-lg bg-muted border-0 text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select a subject</option>
                          <option value="property-inquiry">Property Inquiry</option>
                          <option value="selling">I want to sell my property</option>
                          <option value="valuation">Property Valuation</option>
                          <option value="general">General Question</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-2 block">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
                    Contact Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    {contactInfo.map((item) => (
                      <div
                        key={item.title}
                        className="bg-card p-6 rounded-xl shadow-soft"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-card-foreground mb-2">
                          {item.title}
                        </h3>
                        {item.details.map((detail, index) => (
                          <p key={index} className="font-body text-muted-foreground text-sm">
                            {item.action ? (
                              <a href={item.action} className="hover:text-primary transition-colors">
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp CTA */}
                  <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground mb-1">
                          Prefer WhatsApp?
                        </h3>
                        <p className="font-body text-muted-foreground text-sm mb-4">
                          Chat with us directly on WhatsApp for quick responses and property inquiries.
                        </p>
                        <Button variant="secondary" size="sm" asChild>
                          <a
                            href="https://wa.me/27824067777"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat on WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
                  Visit Our Office
                </h2>
                <p className="font-body text-muted-foreground">
                  Polokwane, Limpopo, 0727
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl overflow-hidden shadow-card h-[400px]"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230446.97255285626!2d28.04753669453125!3d-25.74649599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95619cbec65033%3A0xf66a9eded7e3c3ad!2sPretoria%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1703000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
