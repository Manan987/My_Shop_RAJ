import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <section className="relative hero-gradient text-white">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold mb-4">New Collection 2024</h2>
          <p className="text-xl mb-8 opacity-90">
            Discover the latest trends in fashion with our premium collection of clothing for men, women, and kids.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="raj-secondary hover:bg-yellow-500 text-white px-8 py-3 font-semibold"
              onClick={() => window.location.href = '/products'}
            >
              Shop Now
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 font-semibold"
              onClick={() => window.location.href = '/products'}
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
