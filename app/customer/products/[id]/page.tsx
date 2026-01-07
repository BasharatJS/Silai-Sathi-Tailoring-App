"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart, Zap, Loader2, Check } from "lucide-react";
import { Product } from "@/lib/productData";
import { getProductById } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
          setSelectedSize(productData.sizes?.[0]?.size);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity, selectedSize, selectedColorIndex);

    // Show success message
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Add to cart and navigate to checkout
    addToCart(product, quantity, selectedSize, selectedColorIndex);
    router.push("/customer/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
          <p className="text-charcoal/60">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">Product Not Found</h2>
          <Link href="/customer/dashboard?view=products">
            <button className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-navy hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}% OFF
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Only {product.stock} left!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <p className="text-white text-3xl font-bold">Out of Stock</p>
                  </div>
                )}
              </div>

              {/* Category & Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-4 py-2 bg-navy/10 text-navy rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                {product.available ? (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                    Unavailable
                  </span>
                )}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <h1 className="text-4xl font-bold text-navy mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl font-bold text-gold">
                    ₹{displayPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                        Save ₹{product.price - (product.salePrice || 0)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-navy mb-3">Description</h2>
                <p className="text-charcoal/80 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-navy mb-4">
                    Select Color
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColorIndex(index)}
                        className={`w-14 h-14 rounded-full border-4 transition-all ${
                          selectedColorIndex === index
                            ? "border-navy scale-110 shadow-lg"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.colorCode }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-base text-charcoal/70 mt-3 font-medium">
                    Selected: <span className="text-navy">{product.colors[selectedColorIndex]?.name}</span>
                  </p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-navy mb-4">
                    Select Size
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size.size)}
                        disabled={size.stock === 0}
                        className={`px-6 py-3 rounded-lg border-2 font-bold transition-all ${
                          selectedSize === size.size
                            ? "border-navy bg-navy text-white shadow-lg"
                            : size.stock === 0
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 hover:border-navy hover:bg-navy/5"
                        }`}
                      >
                        {size.size}
                        {size.stock === 0 && (
                          <span className="block text-xs mt-1">Out of stock</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity ML for Atar */}
              {product.quantityMl && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-navy mb-2">
                    Volume
                  </h3>
                  <p className="text-lg text-charcoal/80">{product.quantityMl}ml</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-navy mb-4">
                  Quantity
                </h3>
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-3 rounded-lg border-2 border-gray-300 hover:border-navy hover:bg-navy hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-6 w-6" />
                  </button>
                  <span className="text-3xl font-bold text-navy min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-3 rounded-lg border-2 border-gray-300 hover:border-navy hover:bg-navy hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                  <span className="text-base text-charcoal/60">
                    ({product.stock} available)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || !product.available}
                  className="w-full py-5 bg-gradient-to-r from-navy to-gold text-white rounded-xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Zap className="h-6 w-6" />
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !product.available}
                  className="w-full py-5 bg-white border-2 border-navy text-navy rounded-xl font-bold text-xl hover:bg-navy hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="h-6 w-6" />
                  Add to Cart
                </motion.button>
              </div>

              {/* Stock Warning */}
              {product.stock === 0 && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-600 font-bold text-center">
                    This product is currently out of stock.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
        >
          <Check className="h-6 w-6" />
          <div>
            <p className="font-bold">Added to Cart!</p>
            <p className="text-sm text-white/90">
              {quantity} x {product?.name}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Wrap in Suspense
export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
          <p className="text-charcoal/60">Loading product...</p>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}
