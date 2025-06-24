import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductForm from "@/components/admin/product-form";
import SalesForecasting from "@/components/ai/sales-forecasting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp, BarChart3, Brain, Settings } from "lucide-react";
import type { Product, User, Category } from "@/types";

export default function Admin() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!isLoading && isAuthenticated && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-raj-neutral-50">
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Will redirect via useEffect
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => (p.stock || 0) > 0).length,
    lowStock: products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0).length,
    outOfStock: products.filter(p => (p.stock || 0) === 0).length,
  };

  return (
    <div className="min-h-screen bg-raj-neutral-50">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-raj-neutral-900">Admin Dashboard</h1>
            <Brain className="h-8 w-8 text-raj-primary" />
          </div>
          <p className="text-raj-neutral-600 text-lg">Manage your store with AI-powered insights</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm">Products</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium text-sm">In Stock</p>
                  <p className="text-2xl font-bold text-green-900">{stats.inStock}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium text-sm">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.lowStock}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 font-medium text-sm">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-900">{stats.outOfStock}</p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 font-medium text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-indigo-900">₹450K</p>
                </div>
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 font-medium text-sm">AI Features</p>
                  <p className="text-2xl font-bold text-pink-900">5</p>
                </div>
                <Brain className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border border-raj-neutral-200 p-1">
            <TabsTrigger value="products" className="data-[state=active]:raj-primary data-[state=active]:text-white">
              Products
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="data-[state=active]:raj-primary data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              AI Forecasting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-raj-primary to-raj-primary-dark text-white rounded-t-lg">
                <CardTitle className="text-xl">Product Management</CardTitle>
                <Button onClick={handleNewProduct} className="bg-white text-raj-primary hover:bg-raj-neutral-100">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-raj-neutral-200 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-r from-white to-raj-neutral-50">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.imageUrl || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop&crop=center"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-sm"
                        />
                        <div>
                          <h3 className="font-semibold text-raj-neutral-900">{product.name}</h3>
                          <p className="text-raj-primary font-bold text-lg">₹{parseFloat(product.price).toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                ⭐ Featured
                              </Badge>
                            )}
                            {product.stock && product.stock < 10 && (
                              <Badge variant="destructive" className="text-xs">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="hover:raj-primary hover:text-white transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting">
            <SalesForecasting />
          </TabsContent>
        </Tabs>

        {/* Product Form Modal */}
        {isProductFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-raj-neutral-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsProductFormOpen(false)}
                    className="hover:bg-raj-neutral-100"
                  >
                    ✕
                  </Button>
                </div>
                <ProductForm
                  product={editingProduct}
                  onSuccess={() => {
                    setIsProductFormOpen(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
