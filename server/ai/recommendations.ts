import { storage } from "../storage";
import type { Product, User, CartItem } from "@shared/schema";

export class RecommendationEngine {
  // Content-based filtering: recommend products based on similarity
  static async getContentBasedRecommendations(userId: string, limit: number = 4): Promise<Product[]> {
    try {
      // Get user's cart items and viewed products (simulation)
      const cartItems = await storage.getCartItems(userId);
      const userCategories = cartItems.map(item => item.product.categoryId).filter(Boolean);
      
      if (userCategories.length === 0) {
        // If no user history, return featured products
        return await storage.getProducts(undefined, true);
      }

      // Get products from user's preferred categories
      const categoryProducts = await Promise.all(
        userCategories.map(categoryId => storage.getProducts(categoryId))
      );

      // Flatten and remove duplicates
      const allProducts = categoryProducts.flat();
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );

      // Sort by featured status and created date
      return uniqueProducts
        .sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        })
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting content-based recommendations:", error);
      // Fallback to featured products
      return await storage.getProducts(undefined, true);
    }
  }

  // Collaborative filtering simulation: recommend based on similar users
  static async getCollaborativeRecommendations(userId: string, limit: number = 4): Promise<Product[]> {
    try {
      // Get all products and return trending/popular ones
      const allProducts = await storage.getProducts();
      
      // Simulate popularity scoring (in real app, this would be based on purchase/view data)
      const popularProducts = allProducts
        .filter(product => product.featured || (product.stock && product.stock > 0))
        .sort((a, b) => {
          // Prioritize featured products and those with higher stock
          const scoreA = (a.featured ? 10 : 0) + (a.stock || 0);
          const scoreB = (b.featured ? 10 : 0) + (b.stock || 0);
          return scoreB - scoreA;
        })
        .slice(0, limit);

      return popularProducts;
    } catch (error) {
      console.error("Error getting collaborative recommendations:", error);
      return await storage.getProducts(undefined, true);
    }
  }

  // Hybrid approach: combine content and collaborative filtering
  static async getHybridRecommendations(userId: string, limit: number = 8): Promise<Product[]> {
    try {
      const [contentBased, collaborative] = await Promise.all([
        this.getContentBasedRecommendations(userId, limit / 2),
        this.getCollaborativeRecommendations(userId, limit / 2)
      ]);

      // Combine and remove duplicates
      const combined = [...contentBased, ...collaborative];
      const unique = combined.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );

      return unique.slice(0, limit);
    } catch (error) {
      console.error("Error getting hybrid recommendations:", error);
      return await storage.getProducts(undefined, true);
    }
  }

  // Get similar products based on category and price range
  static async getSimilarProducts(productId: number, limit: number = 4): Promise<Product[]> {
    try {
      const product = await storage.getProduct(productId);
      if (!product) return [];

      const allProducts = await storage.getProducts(product.categoryId);
      const price = parseFloat(product.price);
      const priceRange = price * 0.3; // 30% price variance

      return allProducts
        .filter(p => 
          p.id !== productId && 
          Math.abs(parseFloat(p.price) - price) <= priceRange
        )
        .sort((a, b) => {
          // Sort by price similarity
          const diffA = Math.abs(parseFloat(a.price) - price);
          const diffB = Math.abs(parseFloat(b.price) - price);
          return diffA - diffB;
        })
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting similar products:", error);
      return [];
    }
  }
}