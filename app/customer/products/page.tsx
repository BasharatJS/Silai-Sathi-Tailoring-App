"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, ProductCategory } from "@/lib/productData";
import { getAllProducts } from "@/services/productService";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    loadProducts();

    // Reload products when page becomes visible/focused
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProducts();
      }
    };

    const handleFocus = () => {
      loadProducts();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const fetchedProducts = await getAllProducts();
      // Only show available products
      const availableProducts = fetchedProducts.filter((p) => p.available);
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const productCategories: Array<{ name: ProductCategory | "All"; count: number }> = [
    { name: "All", count: products.length },
    {
      name: "Janamaz",
      count: products.filter((p) => p.category === "Janamaz").length,
    },
    {
      name: "Topi",
      count: products.filter((p) => p.category === "Topi").length,
    },
    {
      name: "Atar",
      count: products.filter((p) => p.category === "Atar").length,
    },
    {
      name: "Leather Shoes",
      count: products.filter((p) => p.category === "Leather Shoes").length,
    },
  ];

  const displayedProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      {/* Header - Fixed */}
      <div className="bg-gradient-to-r from-navy to-charcoal text-white fixed top-0 left-0 right-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/customer/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-white hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="h-10 w-10 text-navy" />
              <h1 className="text-4xl md:text-5xl font-bold text-navy">
                Islamic Products
              </h1>
            </div>
            <p className="text-charcoal/70 text-lg">
              Premium quality products for your daily needs
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {productCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-navy to-gold text-white shadow-lg"
                      : "bg-white text-charcoal hover:bg-gray-100 shadow"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-charcoal/60 mt-4">Loading products...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="h-20 w-20 text-charcoal/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-navy mb-2">
                No Products Found
              </h3>
              <p className="text-charcoal/70">
                No products available in this category yet.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {product.salePrice && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="px-3 py-1 bg-navy/90 text-white text-sm font-semibold rounded-lg">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Color Variants */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-charcoal/60">Colors:</span>
                        {product.colors.slice(0, 5).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: color.colorCode }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs text-charcoal/60">
                            +{product.colors.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    <h3 className="font-bold text-navy mb-2 text-xl">
                      {product.name}
                    </h3>
                    <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {product.salePrice ? (
                        <div className="flex items-center gap-3">
                          <span className="text-gold font-bold text-2xl">
                            ₹{product.salePrice}
                          </span>
                          <span className="text-charcoal/60 text-base line-through">
                            ₹{product.price}
                          </span>
                          <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded">
                            Save ₹{product.price - product.salePrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gold font-bold text-2xl">
                          ₹{product.price}
                        </span>
                      )}
                    </div>

                    {/* Stock Info */}
                    {product.quantityMl && (
                      <div className="mb-4">
                        <span className="text-xs text-charcoal/60 bg-gray-100 px-3 py-1 rounded-full">
                          {product.quantityMl}ml
                        </span>
                      </div>
                    )}

                    {/* Sizes (for shoes) */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-charcoal/60 mb-2">Available Sizes:</p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes
                            .filter((size) => size.stock > 0)
                            .map((size, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-charcoal text-sm rounded-lg font-medium"
                              >
                                {size.size}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Badge */}
                    <div className="flex items-center justify-between">
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 font-semibold">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-semibold">
                          Out of Stock
                        </span>
                      )}
                      <Sparkles className="h-5 w-5 text-gold" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
