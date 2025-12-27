"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";

const categories = ["All", "Cotton", "Silk", "Linen", "Premium Blend"];

const fabrics = [
  {
    name: "Premium Cotton",
    category: "Cotton",
    price: "₹450/meter",
    gradient: "from-blue-100 to-blue-200",
  },
  {
    name: "Silk Blend",
    category: "Silk",
    price: "₹850/meter",
    gradient: "from-purple-100 to-pink-200",
  },
  {
    name: "Pure Linen",
    category: "Linen",
    price: "₹650/meter",
    gradient: "from-green-100 to-emerald-200",
  },
  {
    name: "Designer Blend",
    category: "Premium Blend",
    price: "₹1200/meter",
    gradient: "from-orange-100 to-yellow-200",
  },
  {
    name: "Soft Cotton",
    category: "Cotton",
    price: "₹400/meter",
    gradient: "from-cyan-100 to-blue-200",
  },
  {
    name: "Royal Silk",
    category: "Silk",
    price: "₹1500/meter",
    gradient: "from-rose-100 to-red-200",
  },
  {
    name: "Natural Linen",
    category: "Linen",
    price: "₹700/meter",
    gradient: "from-lime-100 to-green-200",
  },
  {
    name: "Luxury Blend",
    category: "Premium Blend",
    price: "₹1800/meter",
    gradient: "from-amber-100 to-orange-200",
  },
  {
    name: "Organic Cotton",
    category: "Cotton",
    price: "₹550/meter",
    gradient: "from-teal-100 to-cyan-200",
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFabrics =
    activeCategory === "All"
      ? fabrics
      : fabrics.filter((fabric) => fabric.category === activeCategory);

  return (
    <section
      id="gallery"
      className="py-24 bg-gradient-to-br from-cream to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Premium Fabric{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-orange to-gold">
              Collection
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Choose from our curated selection of high-quality fabrics sourced
            from the finest mills.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-gold to-orange text-white shadow-lg"
                  : "bg-white text-charcoal hover:bg-gray-50 shadow"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Fabric Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFabrics.map((fabric, index) => (
            <motion.div
              key={fabric.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Fabric Pattern Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${fabric.gradient}`}
                >
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id={`pattern-${index}`}
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
                        fill={`url(#pattern-${index})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <Sparkles className="h-8 w-8 mx-auto mb-3" />
                    <p className="text-sm">Click to view details</p>
                  </div>
                </div>

                {/* Info Badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {fabric.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90 text-sm">
                      {fabric.category}
                    </span>
                    <span className="text-gold font-semibold">
                      {fabric.price}
                    </span>
                  </div>
                </div>

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-charcoal/80 mb-6">
            Want to see our complete fabric catalog?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.querySelector("#contact");
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }
            }}
            className="px-8 py-4 bg-navy text-white rounded-full font-semibold text-lg hover:bg-navy/90 transition-all shadow-lg hover:shadow-2xl"
          >
            Request Fabric Samples
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
