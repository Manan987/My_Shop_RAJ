import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "./product-card";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export default function FeaturedProducts() {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  if (error) {
    return (
      <section className="py-16 bg-raj-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load products</h3>
            <p className="text-gray-600 mb-4">There was an error loading the featured products.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-raj-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-raj-neutral-900">Featured Products</h2>
          <Link href="/products">
            <button className="text-raj-primary font-medium hover:underline flex items-center">
              View All Products <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured products yet</h3>
              <p className="text-gray-600 mb-4">Check back soon for our latest featured items!</p>
              <Link href="/products">
                <Button className="raj-primary hover:bg-blue-700 text-white">
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
