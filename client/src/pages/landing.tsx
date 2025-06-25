import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Truck, Shield, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login');
      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-raj-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 raj-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                RG
              </div>
              <div>
                <h1 className="text-2xl font-bold text-raj-neutral-900">Raj Garments</h1>
                <p className="text-xs text-gray-500">Premium Fashion Store</p>
              </div>
            </div>
            <Button 
              onClick={handleLogin}
              className="raj-primary hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Raj Garments
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover premium quality clothing for men, women, and kids. Fashion that speaks your style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleLogin}
              className="raj-secondary hover:bg-yellow-500 text-white font-semibold px-8 py-3"
            >
              Start Shopping
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3"
            >
              View Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-raj-neutral-900">
            Why Choose Raj Garments?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 raj-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  Carefully curated collection of high-quality garments from trusted brands.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 raj-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Free shipping on orders over ₹999. Quick and secure delivery to your doorstep.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 raj-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                <p className="text-gray-600">
                  30-day return policy. Shop with confidence knowing you can return if not satisfied.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-raj-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-raj-neutral-900">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Amazing quality and fast delivery. Raj Garments has become my go-to place for all clothing needs."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">Happy Customer</p>
                      <p className="text-sm text-gray-500">Verified Buyer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-raj-neutral-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 raj-primary rounded-lg flex items-center justify-center text-white font-bold">
                  RG
                </div>
                <h3 className="text-xl font-bold">Raj Garments</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for premium quality clothing. Serving fashion-conscious customers since 1995.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Size Guide</li>
                <li>Shipping Info</li>
                <li>Return Policy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Track Your Order</li>
                <li>Bulk Orders</li>
                <li>Corporate Sales</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-gray-400">
                <p>123 Fashion Street, Commercial Complex</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>+91 98765 43210</p>
                <p>info@rajgarments.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Raj Garments. All rights reserved. | Designed with ❤️ for fashion lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
