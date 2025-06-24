import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Star, ShoppingBag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-white/20 rounded-full"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Main Heading */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-yellow-300 mr-3" />
            <span className="text-yellow-300 font-semibold text-lg tracking-wide">PREMIUM FASHION</span>
            <Sparkles className="h-8 w-8 text-yellow-300 ml-3" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Raj Garments
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-lg font-medium">Trusted by 10,000+ Customers</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="animate-fade-in-up delay-200">
          <p className="text-xl md:text-3xl mb-12 opacity-95 leading-relaxed max-w-4xl mx-auto">
            Discover premium clothing for <span className="font-semibold text-yellow-300">Men</span>, 
            <span className="font-semibold text-pink-300"> Women</span>, and 
            <span className="font-semibold text-green-300"> Kids</span>
            <br />
            <span className="text-lg md:text-xl mt-2 block">
              Quality fashion that defines your style
            </span>
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-xl">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-xl backdrop-blur-sm"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI Style Guide
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up delay-600">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="font-bold text-lg mb-2">🚚 Free Shipping</h3>
              <p className="text-sm opacity-90">On orders above ₹999</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="font-bold text-lg mb-2">🤖 AI Recommendations</h3>
              <p className="text-sm opacity-90">Personalized style suggestions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="font-bold text-lg mb-2">📞 24/7 Support</h3>
              <p className="text-sm opacity-90">AI chatbot always ready to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
