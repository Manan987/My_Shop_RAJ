import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertCategorySchema, insertCartItemSchema } from "@shared/schema";
import { RecommendationEngine } from "./ai/recommendations";
import { ChatbotService } from "./ai/chatbot";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/login', (req: Request, res: Response) => {
    // For development, create a mock user session
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@rajgarments.com',
      name: 'Development User',
      isAdmin: true
    };
    
    // Store mock user in session for development
    (req as any).user = mockUser;
    req.session.user = mockUser;
    
    res.json({ 
      message: 'Login successful', 
      user: mockUser,
      redirectUrl: '/' 
    });
  });

  app.get('/api/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Single /api/auth/user route with development-friendly authentication
  app.get('/api/auth/user', (req: Request, res: Response) => {
    // Check if user is in session (development mode)
    if (req.session.user) {
      return res.json(req.session.user);
    }
    
    // For development, return a mock user if no session
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@rajgarments.com',
      name: 'Development User',
      isAdmin: true
    };
    
    // Store in session for consistency
    req.session.user = mockUser;
    res.json(mockUser);
  });

  // Category routes
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Product routes
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const featured = req.query.featured === 'true' ? true : undefined;
      const products = await storage.getProducts(categoryId, featured);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res: Response) => {
    try {
      // Fix: Get userId from session instead of claims for development
      const userId = req.user?.claims?.sub || req.session?.user?.id || 'dev-user-123';
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItem(id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete('/api/cart', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order routes
  app.post('/api/orders', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { shippingAddress } = req.body;
      
      // Get cart items
      const cartItems = await storage.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price) * (item.quantity || 1));
      }, 0);

      // Create order
      const orderData = {
        userId,
        total: total.toString(),
        shippingAddress,
        status: "pending" as const,
      };

      const orderItemsData = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity || 1,
        price: item.product.price,
        size: item.size,
        color: item.color,
      })) as any;

      const order = await storage.createOrder(orderData, orderItemsData);
      
      // Clear cart after successful order
      await storage.clearCart(userId);
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // AI/ML Routes
  app.get('/api/recommendations', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const type = req.query.type || 'hybrid';
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      
      let recommendations;
      
      if (type === 'similar' && productId) {
        recommendations = await RecommendationEngine.getSimilarProducts(productId);
      } else if (type === 'content') {
        recommendations = await RecommendationEngine.getContentBasedRecommendations(userId);
      } else if (type === 'collaborative') {
        recommendations = await RecommendationEngine.getCollaborativeRecommendations(userId);
      } else {
        recommendations = await RecommendationEngine.getHybridRecommendations(userId);
      }
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await ChatbotService.generateResponse(message, userId);
      res.json({ response });
    } catch (error) {
      console.error("Error in chatbot:", error);
      res.status(500).json({ message: "Failed to get response" });
    }
  });

  app.post('/api/chat/outfit-suggestion', async (req: Request, res: Response) => {
    try {
      const { occasion, gender, budget } = req.body;
      
      if (!occasion || !gender) {
        return res.status(400).json({ message: "Occasion and gender are required" });
      }
      
      const suggestion = await ChatbotService.generateOutfitSuggestion(occasion, gender, budget);
      res.json({ suggestion });
    } catch (error) {
      console.error("Error generating outfit suggestion:", error);
      res.status(500).json({ message: "Failed to generate outfit suggestion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
