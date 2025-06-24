import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import ProductCard from "@/components/product-card";
import { Sparkles } from "lucide-react";
import type { Product } from "@/types";

interface RecommendationsProps {
  title?: string;
  type?: 'hybrid' | 'similar';
  productId?: number;
  limit?: number;
}

export default function Recommendations({ 
  title = "Recommended for You", 
  type = 'hybrid',
  productId,
  limit = 4 
}: RecommendationsProps) {
  const { isAuthenticated, user } = useAuth();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/recommendations", type, productId, user?.id],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || (!isLoading && products.length === 0)) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-raj-primary" />
        <h2 className="text-2xl font-bold text-raj-neutral-900">{title}</h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, limit).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}