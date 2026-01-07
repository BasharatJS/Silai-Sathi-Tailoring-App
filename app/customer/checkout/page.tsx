"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Wallet,
  CheckCircle,
  Loader2,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import {
  createProductOrder,
  ProductOrderItem,
  ProductOrderCustomer,
  ProductOrderAddress,
  PaymentMethod,
} from "@/services/productOrderService";
import { createFabricOnlyOrder } from "@/services/orderService";
import { FabricOnlyOrderData } from "@/types/order";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user, profile, isAuthenticated } = useCustomerAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: profile?.displayName || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phoneNumber || user?.phoneNumber || "",
    address: profile?.address || "",
    city: "",
    state: "",
    pincode: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/customer/dashboard");
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !showSuccessModal) {
      router.push("/customer/dashboard?view=products");
    }
  }, [cart, router, showSuccessModal]);

  const handleQuantityChange = (
    itemId: string,
    type: "product" | "fabric",
    newQuantity: number,
    selectedSize?: string,
    selectedColorIndex?: number
  ) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, type, selectedSize, selectedColorIndex);
    } else {
      updateQuantity(itemId, type, newQuantity, selectedSize, selectedColorIndex);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate customer details
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.state || !customerDetails.pincode) {
      alert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Separate products and fabrics
      const products = cart.filter((item) => item.type === "product");
      const fabrics = cart.filter((item) => item.type === "fabric");

      let mainOrderNumber = "";

      // Create product orders if any
      if (products.length > 0) {
        const orderItems: ProductOrderItem[] = products.map((item) => ({
          product: item.product!,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColorIndex: item.selectedColorIndex,
          priceAtPurchase: item.product!.salePrice || item.product!.price,
          subtotal: (item.product!.salePrice || item.product!.price) * item.quantity,
        }));

        const orderCustomer: ProductOrderCustomer = {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          userId: user?.uid,
        };

        const deliveryAddress: ProductOrderAddress = {
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          pincode: customerDetails.pincode,
        };

        const { orderNumber } = await createProductOrder(
          orderCustomer,
          deliveryAddress,
          orderItems,
          paymentMethod
        );

        mainOrderNumber = orderNumber;
      }

      // Create fabric orders if any
      for (const item of fabrics) {
        const fabricOrderData: FabricOnlyOrderData = {
          fabric: item.fabric!.id,
          fabricQuantity: item.quantity,
          selectedFabricColorIndex: item.selectedColorIndex || 0,
          address: {
            name: customerDetails.name,
            phone: customerDetails.phone,
            street: customerDetails.address,
            city: customerDetails.city,
            state: customerDetails.state,
            pincode: customerDetails.pincode,
          },
          customerUid: user?.uid,
          paymentMethod: paymentMethod, // Add payment method
        };

        const { orderNumber } = await createFabricOnlyOrder(fabricOrderData);
        if (!mainOrderNumber) mainOrderNumber = orderNumber;
      }

      setOrderId(mainOrderNumber);

      // Clear cart and show success
      clearCart();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;

  if (showSuccessModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-navy mb-4">Order Successful!</h2>
          <p className="text-charcoal/70 mb-6">
            Your order has been placed successfully.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-charcoal/60 mb-2">Order ID</p>
            <p className="text-2xl font-bold text-gold">{orderId}</p>
          </div>

          <div className="space-y-3">
            <Link href="/customer/dashboard?view=orders">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                View Orders
              </motion.button>
            </Link>
            <Link href="/customer/dashboard?view=products">
              <button className="w-full py-3 bg-white border-2 border-gray-200 text-navy rounded-lg font-semibold hover:bg-gray-50 transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-navy mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Cart Items & Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Cart Items ({cart.length})
              </h2>

              <div className="space-y-4">
                {cart.map((item, index) => {
                  const isProduct = item.type === "product";
                  const isFabric = item.type === "fabric";

                  if (isProduct && item.product) {
                    const product = item.product; // Type narrowing for TypeScript
                    const displayPrice = product.salePrice || product.price;
                    return (
                      <div
                        key={`product-${product.id}-${item.selectedSize}-${index}`}
                        className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-navy mb-1">{product.name}</h3>
                          <p className="text-sm text-charcoal/60 mb-2">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedColorIndex !== undefined &&
                              product.colors?.[item.selectedColorIndex] &&
                              ` • Color: ${product.colors[item.selectedColorIndex].name}`}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    "product",
                                    item.quantity - 1,
                                    item.selectedSize,
                                    item.selectedColorIndex
                                  )
                                }
                                className="p-1 rounded-lg border border-gray-300 hover:border-navy hover:bg-navy hover:text-white transition-all"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-bold text-navy w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    "product",
                                    item.quantity + 1,
                                    item.selectedSize,
                                    item.selectedColorIndex
                                  )
                                }
                                className="p-1 rounded-lg border border-gray-300 hover:border-navy hover:bg-navy hover:text-white transition-all"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-gold text-lg">
                                ₹{(displayPrice * item.quantity).toLocaleString("en-IN")}
                              </span>
                              <button
                                onClick={() => removeFromCart(product.id, "product", item.selectedSize, item.selectedColorIndex)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (isFabric && item.fabric) {
                    const fabric = item.fabric; // Type narrowing for TypeScript
                    const selectedColor = fabric.colors[item.selectedColorIndex || 0];
                    return (
                      <div
                        key={`fabric-${fabric.id}-${item.selectedColorIndex}-${index}`}
                        className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`w-24 h-24 bg-gradient-to-br ${selectedColor.gradient} rounded-lg`}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-navy mb-1">{fabric.name}</h3>
                          <p className="text-sm text-charcoal/60 mb-2">
                            Color: {selectedColor.name} • {fabric.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    fabric.id,
                                    "fabric",
                                    item.quantity - 1,
                                    undefined,
                                    item.selectedColorIndex
                                  )
                                }
                                className="p-1 rounded-lg border border-gray-300 hover:border-navy hover:bg-navy hover:text-white transition-all"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-bold text-navy w-8 text-center">
                                {item.quantity}m
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    fabric.id,
                                    "fabric",
                                    item.quantity + 1,
                                    undefined,
                                    item.selectedColorIndex
                                  )
                                }
                                className="p-1 rounded-lg border border-gray-300 hover:border-navy hover:bg-navy hover:text-white transition-all"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-gold text-lg">
                                ₹{(fabric.pricePerMeter * item.quantity).toLocaleString("en-IN")}
                              </span>
                              <button
                                onClick={() => removeFromCart(fabric.id, "fabric", undefined, item.selectedColorIndex)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <User className="h-6 w-6" />
                Delivery Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter your phone"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Address *
                  </label>
                  <textarea
                    value={customerDetails.address}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={customerDetails.city}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={customerDetails.state}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, state: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={customerDetails.pincode}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, pincode: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-navy mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                {deliveryCharge === 0 && (
                  <p className="text-xs text-green-600">
                    🎉 You saved ₹50 on delivery!
                  </p>
                )}
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-navy">
                  <span>Total</span>
                  <span className="text-gold">₹{total}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-navy mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      paymentMethod === "cod"
                        ? "border-navy bg-navy/5"
                        : "border-gray-200 hover:border-navy/50"
                    }`}
                  >
                    <Wallet
                      className={`h-6 w-6 ${
                        paymentMethod === "cod" ? "text-navy" : "text-charcoal/60"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-bold ${
                          paymentMethod === "cod" ? "text-navy" : "text-charcoal"
                        }`}
                      >
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-charcoal/60">Pay when you receive</p>
                    </div>
                    {paymentMethod === "cod" && (
                      <CheckCircle className="h-5 w-5 text-navy" />
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`w-full p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      paymentMethod === "upi"
                        ? "border-navy bg-navy/5"
                        : "border-gray-200 hover:border-navy/50"
                    }`}
                  >
                    <CreditCard
                      className={`h-6 w-6 ${
                        paymentMethod === "upi" ? "text-navy" : "text-charcoal/60"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-bold ${
                          paymentMethod === "upi" ? "text-navy" : "text-charcoal"
                        }`}
                      >
                        UPI Payment
                      </p>
                      <p className="text-xs text-charcoal/60">Pay via UPI</p>
                    </div>
                    {paymentMethod === "upi" && (
                      <CheckCircle className="h-5 w-5 text-navy" />
                    )}
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-navy to-gold text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Place Order
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
