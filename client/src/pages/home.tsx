import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBanner from "@/components/hero-banner";
import CategorySection from "@/components/category-section";
import FeaturedProducts from "@/components/featured-products";
import SpecialOffers from "@/components/special-offers";
import CartSidebar from "@/components/cart-sidebar";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-raj-neutral-50">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
      <SpecialOffers />
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
