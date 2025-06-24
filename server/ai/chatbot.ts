import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

export class ChatbotService {
  static async generateResponse(userMessage: string, userId?: string): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getFallbackResponse(userMessage);
      }

      // Get context about the user and store
      const context = await this.getContextualInfo(userId);
      
      const systemPrompt = `You are a helpful customer service assistant for Raj Garments, a premium fashion store. 
      
Store Information:
- We sell men's, women's, and kids' clothing
- Free shipping on orders over ₹999
- 30-day return policy
- Located in Mumbai, Maharashtra
- Phone: +91 98765 43210
- Email: info@rajgarments.com

${context}

Guidelines:
- Be friendly, helpful, and professional
- Suggest products when relevant
- Help with size guides, shipping, returns, and general questions
- Keep responses concise and actionable
- Use Indian rupees (₹) for pricing
- If asked about specific products, suggest browsing categories

Respond to the user's message in a helpful and conversational way.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0].message.content || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error("Chatbot error:", error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private static async getContextualInfo(userId?: string): Promise<string> {
    if (!userId) return "";

    try {
      const [user, cartItems] = await Promise.all([
        storage.getUser(userId),
        storage.getCartItems(userId)
      ]);

      let context = "";
      if (user) {
        context += `Customer: ${user.firstName || "Valued customer"}\n`;
      }
      
      if (cartItems.length > 0) {
        const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * (item.quantity || 1)), 0);
        context += `Current cart: ${cartItems.length} items, Total: ₹${total.toFixed(2)}\n`;
      }

      return context;
    } catch (error) {
      return "";
    }
  }

  private static getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our products are competitively priced with great quality. You can browse our collection to see current prices. We also offer free shipping on orders over ₹999!";
    }
    
    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      return "We offer various sizes for all our products. You can find size information on each product page. If you need help with sizing, please check our size guide or contact us at +91 98765 43210.";
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We offer free shipping on orders over ₹999. Standard delivery takes 3-5 business days. You can track your order once it's shipped.";
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
      return "We have a 30-day return policy. Items can be returned in original condition with tags attached. Contact us for return instructions.";
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return "I'd be happy to help you find the perfect outfit! Browse our Men's, Women's, or Kids' collections. Our featured products section also showcases our best items.";
    }

    return "Hello! I'm here to help you with any questions about Raj Garments. You can ask me about products, sizing, shipping, returns, or anything else. How can I assist you today?";
  }

  static async generateOutfitSuggestion(occasion: string, gender: string, budget?: number): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getFallbackOutfitSuggestion(occasion, gender);
      }

      const prompt = `Suggest a complete outfit from Raj Garments for a ${gender} for ${occasion}. 
      ${budget ? `Budget: ₹${budget}` : ""}
      
      Consider Indian fashion preferences and our product categories:
      - Shirts, Trousers, Suits for men
      - Dresses, Sarees, Tops for women  
      - Casual wear for kids
      
      Provide a brief, practical outfit suggestion.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.8,
      });

      return response.choices[0].message.content || this.getFallbackOutfitSuggestion(occasion, gender);
    } catch (error) {
      console.error("Outfit suggestion error:", error);
      return this.getFallbackOutfitSuggestion(occasion, gender);
    }
  }

  private static getFallbackOutfitSuggestion(occasion: string, gender: string): string {
    const suggestions = {
      'formal': {
        'men': 'For formal occasions, try our premium shirts with dress trousers and a blazer.',
        'women': 'Consider our elegant dresses or formal tops with trousers for a professional look.',
        'kids': 'Our formal kids collection includes smart shirts and trousers for special occasions.'
      },
      'casual': {
        'men': 'Our casual shirts with comfortable trousers or jeans work great for everyday wear.',
        'women': 'Try our casual tops with jeans or comfortable dresses from our collection.',
        'kids': 'Our kids casual wear includes comfortable t-shirts and shorts for daily activities.'
      },
      'party': {
        'men': 'For parties, check out our stylish shirts with designer trousers.',
        'women': 'Our party dresses and ethnic wear are perfect for celebrations.',
        'kids': 'Our kids party wear includes colorful outfits perfect for special events.'
      }
    };

    const category = occasion.toLowerCase().includes('formal') ? 'formal' :
                    occasion.toLowerCase().includes('party') ? 'party' : 'casual';
    
    return suggestions[category]?.[gender.toLowerCase()] || 
           `Browse our ${gender.toLowerCase()}'s collection for great ${occasion} outfit options!`;
  }
}