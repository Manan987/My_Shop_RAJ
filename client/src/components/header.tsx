import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, Mail } from "lucide-react";
import type { CartItem } from "@/types";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActivePage = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm text-gray-600">
            <div className="hidden md:block">Free shipping on orders over ₹999</div>
            <div className="flex space-x-4">
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                +91 98765 43210
              </span>
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                info@rajgarments.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 raj-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              RG
            </div>
            <div>
              <h1 className="text-2xl font-bold text-raj-neutral-900">Raj Garments</h1>
              <p className="text-xs text-gray-500">Premium Fashion Store</p>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </form>

          {/* Header actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist - Desktop */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" onClick={onCartToggle} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 raj-secondary text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-medium">
                  {user?.firstName || user?.email?.split('@')[0]}
                </span>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/api/logout'}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/api/login'}
                className="hidden md:flex"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block border-t py-3">
          <ul className="flex space-x-8 justify-center">
            <li>
              <Link href="/">
                <a className={`font-medium transition-colors ${
                  isActivePage("/") ? "text-raj-primary" : "text-gray-700 hover:text-raj-primary"
                }`}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/products/men">
                <a className={`font-medium transition-colors ${
                  isActivePage("/products/men") ? "text-raj-primary" : "text-gray-700 hover:text-raj-primary"
                }`}>
                  Men
                </a>
              </Link>
            </li>
            <li>
              <Link href="/products/women">
                <a className={`font-medium transition-colors ${
                  isActivePage("/products/women") ? "text-raj-primary" : "text-gray-700 hover:text-raj-primary"
                }`}>
                  Women
                </a>
              </Link>
            </li>
            <li>
              <Link href="/products/kids">
                <a className={`font-medium transition-colors ${
                  isActivePage("/products/kids") ? "text-raj-primary" : "text-gray-700 hover:text-raj-primary"
                }`}>
                  Kids
                </a>
              </Link>
            </li>
            <li>
              <Link href="/products">
                <a className={`font-medium transition-colors ${
                  isActivePage("/products") ? "text-raj-primary" : "text-gray-700 hover:text-raj-primary"
                }`}>
                  All Products
                </a>
              </Link>
            </li>
            {isAuthenticated && user?.isAdmin && (
              <li>
                <Link href="/admin">
                  <a className={`font-medium transition-colors ${
                    isActivePage("/admin") ? "text-raj-primary" : "text-gray-700 hover:text-raj-primary"
                  }`}>
                    Admin
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </form>

            {/* Mobile navigation */}
            <nav className="space-y-2">
              <Link href="/">
                <a className="block py-2 text-gray-700 hover:text-raj-primary">Home</a>
              </Link>
              <Link href="/products/men">
                <a className="block py-2 text-gray-700 hover:text-raj-primary">Men</a>
              </Link>
              <Link href="/products/women">
                <a className="block py-2 text-gray-700 hover:text-raj-primary">Women</a>
              </Link>
              <Link href="/products/kids">
                <a className="block py-2 text-gray-700 hover:text-raj-primary">Kids</a>
              </Link>
              <Link href="/products">
                <a className="block py-2 text-gray-700 hover:text-raj-primary">All Products</a>
              </Link>
              {isAuthenticated && user?.isAdmin && (
                <Link href="/admin">
                  <a className="block py-2 text-gray-700 hover:text-raj-primary">Admin</a>
                </Link>
              )}
            </nav>

            {/* Mobile user menu */}
            <div className="border-t pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="font-medium">
                      {user?.firstName || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full raj-primary hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
