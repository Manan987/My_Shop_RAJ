import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function SpecialOffers() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-raj-secondary to-orange-500 rounded-2xl text-white overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 p-12">
              <h2 className="text-4xl font-bold mb-4">Special Offer!</h2>
              <p className="text-xl mb-6 opacity-90">
                Get up to 50% off on selected items. Limited time offer!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-white text-raj-secondary px-8 py-3 font-semibold hover:bg-gray-100"
                  onClick={() => window.location.href = '/products'}
                >
                  Shop Sale Items
                </Button>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Ends in: <span className="font-semibold">2 days 15 hours</span></span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
                alt="Special Offer Fashion Items"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
