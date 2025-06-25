import { db } from "./db";
import { categories, products } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create categories
    const [menCategory] = await db.insert(categories).values({
      name: "Men's Clothing",
      slug: "mens",
      description: "Premium men's fashion collection"
    }).returning();

    const [womenCategory] = await db.insert(categories).values({
      name: "Women's Clothing",
      slug: "womens",
      description: "Elegant women's fashion collection"
    }).returning();

    const [accessoriesCategory] = await db.insert(categories).values({
      name: "Accessories",
      slug: "accessories",
      description: "Fashion accessories and more"
    }).returning();

    // Create sample products with slug values
    const sampleProducts = [
      {
        name: "Premium Cotton Shirt",
        slug: "premium-cotton-shirt",
        description: "High-quality cotton shirt perfect for formal and casual occasions",
        price: 49.99,
        categoryId: menCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 50
      },
      {
        name: "Elegant Evening Dress",
        slug: "elegant-evening-dress",
        description: "Beautiful evening dress for special occasions",
        price: 129.99,
        categoryId: womenCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 25
      },
      {
        name: "Classic Denim Jeans",
        slug: "classic-denim-jeans",
        description: "Comfortable and stylish denim jeans",
        price: 79.99,
        categoryId: menCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 40
      },
      {
        name: "Leather Handbag",
        slug: "leather-handbag",
        description: "Premium leather handbag with elegant design",
        price: 199.99,
        categoryId: accessoriesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 15
      },
      {
        name: "Casual T-Shirt",
        slug: "casual-t-shirt",
        description: "Comfortable cotton t-shirt for everyday wear",
        price: 24.99,
        categoryId: menCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 100
      },
      {
        name: "Summer Floral Dress",
        slug: "summer-floral-dress",
        description: "Light and breezy floral dress perfect for summer",
        price: 89.99,
        categoryId: womenCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 30
      },
      {
        name: "Business Blazer",
        slug: "business-blazer",
        description: "Professional blazer for business occasions",
        price: 159.99,
        categoryId: menCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 20
      },
      {
        name: "Designer Sunglasses",
        slug: "designer-sunglasses",
        description: "Stylish sunglasses with UV protection",
        price: 89.99,
        categoryId: accessoriesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        stock: 35
      }
    ];

    await db.insert(products).values(sampleProducts);
    
    console.log("Database seeded successfully!");
    console.log(`Created ${sampleProducts.length} products in 3 categories`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// If this file is run directly, execute the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}