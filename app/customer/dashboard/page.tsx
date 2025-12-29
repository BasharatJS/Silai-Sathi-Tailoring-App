"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shirt, FileText, Package, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Fabric } from "@/lib/fabricData";
import { getAllFabrics } from "@/services/fabricService";
import FabricDetailModal from "@/components/FabricDetailModal";

const services = [
  {
    icon: Shirt,
    title: "Kurta Tailoring",
    description: "Custom-made kurtas with premium fabrics",
    price: "₹650",
    gradient: "from-gold to-orange",
    image: "/images/kurta-men.jpg",
  },
  {
    icon: FileText,
    title: "Pyjama Tailoring",
    description: "Perfectly fitted comfortable pyjamas",
    price: "₹450",
    gradient: "from-orange to-gold",
    image: "/images/salwaar-man.jpg",
  },
  {
    icon: Package,
    title: "Complete Set",
    description: "Kurta + Pyjama combo with special pricing",
    price: "₹999",
    gradient: "from-navy to-gold",
    image: "/images/kurta-salwar-men.jpg",
  },
];

export default function CustomerDashboard() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
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

  const displayedFabrics = (
    selectedCategory === "All"
      ? fabrics
      : fabrics.filter((f) => f.category === selectedCategory)
  ).slice(0, 8); // Show only first 8 fabrics on dashboard

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
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-white hover:text-gold transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </motion.button>
            </Link>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
              Welcome to Silai Sathi
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tailoring Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-6 w-6 text-gold" />
            <h2 className="text-3xl font-bold text-navy">Tailoring Services</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredService(index)}
                  onHoverEnd={() => setHoveredService(null)}
                  className="relative group"
                >
                  <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Service Image/Header */}
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover object-center"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                        <span className="text-sm font-bold text-navy">{service.price}</span>
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-4 md:p-5 lg:p-6">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-navy mb-2">
                        {service.title}
                      </h3>
                      <p className="text-charcoal/80 mb-6">{service.description}</p>

                      {/* Start Order Button - Always Visible */}
                      <Link href="/customer/order/new">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-navy text-white rounded-lg font-semibold hover:bg-gold hover:shadow-xl transition-all cursor-pointer"
                        >
                          Start Order
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Fabric Collection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-gold" />
              <h2 className="text-3xl font-bold text-navy">Fabric Collection</h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {fabricCategories.map((category) => (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-semibold transition-all cursor-pointer ${
                    selectedCategory === category.name
                      ? "bg-navy text-white shadow-lg"
                      : "bg-white text-navy border-2 border-gray-200 hover:border-gold"
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-80">({category.count})</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Fabric Listings */}
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
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
                      className="w-full py-1.5 md:py-2 text-sm md:text-base bg-gradient-to-r from-navy to-charcoal text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Choose
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href="/customer/fabrics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 md:px-8 py-3 md:py-4 bg-navy text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:bg-gold hover:shadow-2xl transition-all inline-flex items-center gap-2 md:gap-3 cursor-pointer"
              >
                <Sparkles className="h-5 w-5" />
                View More Fabric Collection
                <Sparkles className="h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
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
