import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertyTypes from "@/components/PropertyTypes";
import FeaturedProperties from "@/components/FeaturedProperties";
import MapSection from "@/components/MapSection";
import Regions from "@/components/Regions";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Rural Properties - Rural & Peri-Urban Properties in South Africa</title>
        <meta 
          name="description" 
          content="Find your perfect rural property in South Africa. Browse farms, plots, houses, and smallholdings across Limpopo, Mpumalanga, KwaZulu-Natal and more." 
        />
        <meta name="keywords" content="rural property South Africa, farms for sale, plots South Africa, smallholdings, peri-urban property" />
        <link rel="canonical" href="https://ruralproperties.co.za" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <PropertyTypes />
          <FeaturedProperties />
          <MapSection />
          <Regions />
          <WhyChooseUs />
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
