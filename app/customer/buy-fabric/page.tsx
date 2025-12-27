"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import { getFabricById } from "@/lib/fabricData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function BuyFabricContent() {
  const searchParams = useSearchParams();
  const fabricId = searchParams.get("id");
  const colorIndex = parseInt(searchParams.get("colorIndex") || "0");
  const fabric = fabricId ? getFabricById(fabricId) : null;

  const [quantity, setQuantity] = useState(2);

  // Get the selected color gradient
  const selectedColor = fabric?.colors[colorIndex] || fabric?.colors[0];
  const fabricGradient = selectedColor?.gradient || fabric?.gradient;
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const totalPrice = fabric ? fabric.pricePerMeter * quantity : 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ fabric: fabric?.id, quantity, address, totalPrice });
    alert("Order placed successfully! (Firebase integration coming soon)");
  };

  if (!fabric) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">Fabric not found</h2>
          <Link href="/customer/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-24"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-navy mb-2">Buy Fabric</h1>
          <p className="text-charcoal/80">Purchase premium fabric for your needs</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Fabric Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-24">
              {/* Fabric Preview */}
              <div
                className={`h-64 bg-gradient-to-br ${fabricGradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-30">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern
                        id="fabric-texture"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#fabric-texture)" />
                  </svg>
                </div>
              </div>

              {/* Fabric Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-navy mb-2">
                      {fabric.name}
                    </h2>
                    <p className="text-sm text-charcoal/70 mb-1">{fabric.category}</p>
                    <p className="text-charcoal/80">{fabric.description}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-charcoal/70">Price per meter:</span>
                    <span className="text-2xl font-bold text-gold">
                      ₹{fabric.pricePerMeter}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-4">
                    <Label className="mb-2 block">Quantity (meters)</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-bold text-navy w-16 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gradient-to-r from-gold/10 to-orange/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-navy">
                        Total Amount:
                      </span>
                      <span className="text-3xl font-bold text-gold">
                        ₹{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-navy mb-6">
                Delivery Address
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={address.name}
                      onChange={(e) =>
                        setAddress({ ...address, name: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="House no., Building name"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    required
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="400001"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                    required
                    className="mt-2"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Place Order - ₹{totalPrice}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function BuyFabricPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center"><div className="text-navy">Loading...</div></div>}>
      <BuyFabricContent />
    </Suspense>
  );
}
