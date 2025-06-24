import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function CategorySection() {
  const categories = [
    {
      name: "Men's Collection",
      slug: "men",
      description: "Shirts, Trousers, Suits & More",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600"
    },
    {
      name: "Women's Collection", 
      slug: "women",
      description: "Dresses, Sarees, Tops & More",
      imageUrl: "https://images.unsplash.com/photo-1594623930572-300a3011d9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600"
    },
    {
      name: "Kids Collection",
      slug: "kids", 
      description: "Shirts, Dresses, Casual Wear",
      imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-raj-neutral-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products/${category.slug}`}>
              <div className="group cursor-pointer">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-80 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 product-image"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-raj-neutral-900">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                  <button className="mt-3 text-raj-primary font-medium hover:underline flex items-center justify-center mx-auto">
                    Shop {category.name.split("'s")[0]} <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
