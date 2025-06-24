import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import VoiceSearch from "@/components/ai/voice-search";
import CartSidebar from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid3X3, List, Sparkles, TrendingUp } from "lucide-react";
import type { Product, Category } from "@/types";

export default function Products() {
  const [, params] = useRoute("/products/:category");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(params?.category || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory !== "all" ? selectedCategory : undefined],
  });

  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    if (params?.category) {
      setSelectedCategory(params.category);
    }
  }, [params?.category]);

  const displayProducts = searchQuery.length > 2 ? searchResults : products;

  const sortedProducts = displayProducts?.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const getCategoryName = (slug: string) => {
    if (slug === "all") return "All Products";
    const category = categories?.find(c => c.slug === slug);
    return category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const handleVoiceSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-raj-neutral-50 to-white">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-raj-neutral-900">{getCategoryName(selectedCategory)}</h1>
            <Sparkles className="h-8 w-8 text-raj-primary" />
          </div>
          <p className="text-raj-neutral-600 text-lg">Discover our premium collection with AI-powered recommendations</p>
          
          {/* Enhanced Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-raj-neutral-200">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Voice Search Integration */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-raj-neutral-700 mb-2">
                  Search Products (Voice & Text)
                </label>
                <VoiceSearch 
                  onSearch={handleVoiceSearch}
                  placeholder="Search products or use voice..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-semibold text-raj-neutral-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-raj-neutral-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Featured First
                        </div>
                      </SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-raj-neutral-700 font-medium">
                  <span className="text-raj-primary font-bold text-lg">{sortedProducts?.length || 0}</span> products found
                </p>
                {searchQuery && (
                  <span className="bg-raj-primary/10 text-raj-primary px-3 py-1 rounded-full text-sm font-medium">
                    "{searchQuery}"
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-raj-neutral-600 mr-2">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "raj-primary text-white" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "raj-primary text-white" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
                <div className="w-full h-72 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
                <div className="p-6">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded mb-3"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded mb-3 w-2/3"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-raj-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-raj-neutral-700 mb-2">No products found</h3>
              <p className="text-raj-neutral-500 mb-6">Try adjusting your search criteria or browse all categories.</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="raj-primary hover:raj-primary-dark text-white"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 lg:grid-cols-2"
          }`}>
            {sortedProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
