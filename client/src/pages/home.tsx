import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBanner from "@/components/hero-banner";
import CategorySection from "@/components/category-section";
import FeaturedProducts from "@/components/featured-products";
import SpecialOffers from "@/components/special-offers";
import Recommendations from "@/components/ai/recommendations";
import Chatbot from "@/components/ai/chatbot";
import CartSidebar from "@/components/cart-sidebar";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-raj-neutral-50 to-white">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      <HeroBanner />
      <div className="container mx-auto px-4 py-16 space-y-20">
        <CategorySection />
        <FeaturedProducts />
        <Recommendations title="Recommended for You" type="hybrid" limit={8} />
        <SpecialOffers />
      </div>
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Chatbot />
    </div>
  );
}
