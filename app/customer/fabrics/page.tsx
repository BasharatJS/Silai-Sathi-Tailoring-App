"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Fabric } from "@/lib/fabricData";
import { getAllFabrics } from "@/services/fabricService";
import FabricDetailModal from "@/components/FabricDetailModal";

export default function FabricsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [fabricsLoading, setFabricsLoading] = useState(true);

  // Initialize with random colors for each fabric
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadFabrics();

    // Reload fabrics when page becomes visible/focused
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadFabrics();
      }
    };

    const handleFocus = () => {
      loadFabrics();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadFabrics = async () => {
    try {
      setFabricsLoading(true);
      const fetchedFabrics = await getAllFabrics();
      // Only show available fabrics
      const availableFabrics = fetchedFabrics.filter((f) => f.available);
      setFabrics(availableFabrics);

      // Initialize random colors for each fabric
      const initialColors: { [key: string]: number } = {};
      availableFabrics.forEach((fabric) => {
        initialColors[fabric.id] = Math.floor(
          Math.random() * fabric.colors.length
        );
      });
      setSelectedColors(initialColors);
    } catch (error) {
      console.error("Error loading fabrics:", error);
    } finally {
      setFabricsLoading(false);
    }
  };

  const fabricCategories = [
    { name: "All", count: fabrics.length },
    {
      name: "Cotton",
      count: fabrics.filter((f) => f.category === "Cotton").length,
    },
    { name: "Silk", count: fabrics.filter((f) => f.category === "Silk").length },
    {
      name: "Linen",
      count: fabrics.filter((f) => f.category === "Linen").length,
    },
    {
      name: "Premium Blend",
      count: fabrics.filter((f) => f.category === "Premium Blend").length,
    },
  ];

  const displayedFabrics =
    selectedCategory === "All"
      ? fabrics
      : fabrics.filter((f) => f.category === selectedCategory);

  const handleColorChange = (fabricId: string, colorIndex: number) => {
    setSelectedColors((prev) => ({
      ...prev,
      [fabricId]: colorIndex,
    }));
  };

  const getFabricGradient = (fabric: Fabric) => {
    const colorIndex = selectedColors[fabric.id] || 0;
    return fabric.colors[colorIndex]?.gradient || fabric.gradient;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white">
      {/* Header - Fixed */}
      <div className="bg-gradient-to-r from-navy to-charcoal text-white fixed top-0 left-0 right-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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
            <h1 className="text-2xl md:text-3xl font-bold">
              Fabric Collection
            </h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-gold" />
            <h2 className="text-4xl font-bold text-navy">Premium Fabric Collection</h2>
            <Sparkles className="h-8 w-8 text-gold" />
          </div>
          <p className="text-charcoal/80 text-lg">
            Explore our wide range of premium fabrics in various colors
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {fabricCategories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCategory === category.name
                    ? "bg-navy text-white shadow-lg"
                    : "bg-white text-navy border-2 border-gray-200 hover:border-gold"
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-80">({category.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Fabric Grid */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          {displayedFabrics.map((fabric, index) => (
            <motion.div
              key={fabric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Fabric Preview */}
                <div
                  className={`h-40 bg-gradient-to-br ${getFabricGradient(fabric)} relative overflow-hidden cursor-pointer`}
                  onClick={() => setSelectedFabric(fabric)}
                >
                  {/* Texture */}
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id={`fabric-pattern-${index}`}
                          x="0"
                          y="0"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="2" cy="2" r="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#fabric-pattern-${index})`}
                      />
                    </svg>
                  </div>
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Fabric Info */}
                <div className="p-4">
                  {/* Color Selection Circles */}
                  <div className="flex items-center gap-2 mb-3">
                    {fabric.colors.map((color, colorIndex) => (
                      <motion.button
                        key={colorIndex}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorChange(fabric.id, colorIndex);
                        }}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          (selectedColors[fabric.id] || 0) === colorIndex
                            ? "border-gold ring-2 ring-gold/30"
                            : "border-gray-300 hover:border-gold/50"
                        }`}
                        style={{ backgroundColor: color.colorCode }}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <h3 className="font-bold text-navy mb-1 group-hover:text-gold transition-colors">
                    {fabric.name}
                  </h3>
                  <p className="text-sm text-charcoal/70 mb-3">
                    {fabric.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gold font-bold text-lg">
                      ₹{fabric.pricePerMeter}
                    </span>
                    <span className="text-xs text-charcoal/60">/meter</span>
                  </div>

                  {/* Choose Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFabric(fabric)}
                    className="w-full py-2 bg-gradient-to-r from-navy to-charcoal text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Choose
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fabric Detail Modal */}
      <AnimatePresence>
        {selectedFabric && (
          <FabricDetailModal
            fabric={selectedFabric}
            selectedColorIndex={selectedColors[selectedFabric.id] || 0}
            onClose={() => setSelectedFabric(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
