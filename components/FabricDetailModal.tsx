"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Scissors, X } from "lucide-react";
import { Fabric } from "@/lib/fabricData";
import { useRouter } from "next/navigation";

type FabricDetailModalProps = {
  fabric: Fabric;
  onClose: () => void;
  selectedColorIndex?: number;
};

export default function FabricDetailModal({
  fabric,
  onClose,
  selectedColorIndex = 0,
}: FabricDetailModalProps) {
  const router = useRouter();

  // Get the selected color gradient
  const selectedColor = fabric.colors[selectedColorIndex] || fabric.colors[0];
  const fabricGradient = selectedColor.gradient;

  const handleBuyFabric = () => {
    router.push(`/customer/buy-fabric?id=${fabric.id}&colorIndex=${selectedColorIndex}`);
    onClose();
  };

  const handleStitchWithFabric = (service: string) => {
    router.push(`/customer/order/new?fabricId=${fabric.id}&service=${service}&colorIndex=${selectedColorIndex}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative"
      >
        {/* Fabric Image/Preview */}
        <div
          className={`h-64 bg-gradient-to-br ${fabricGradient} relative overflow-hidden`}
        >
          {/* Texture Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="fabric-pattern"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fabric-pattern)" />
            </svg>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-2xl font-bold text-navy">
              ₹{fabric.pricePerMeter}
              <span className="text-sm text-charcoal/70">/meter</span>
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gold/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-white">
              {fabric.category}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <X className="h-5 w-5 text-navy" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-navy mb-3">{fabric.name}</h2>
          <p className="text-charcoal/80 mb-8">{fabric.description}</p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Buy Fabric Only */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyFabric}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-gold to-orange text-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xl font-bold">Buy Fabric Only</span>
              </div>
              <p className="text-white/90 text-sm">Purchase fabric without tailoring</p>
            </motion.button>

            {/* Tailoring Options */}
            <div>
              <p className="text-center text-sm text-charcoal/70 mb-3 font-semibold">
                OR GET IT TAILORED
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {/* Stitch Kurta + Fabric */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStitchWithFabric("kurta")}
                  className="group relative overflow-hidden bg-gradient-to-br from-navy to-charcoal text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Scissors className="h-5 w-5" />
                    <span className="text-sm font-bold">Kurta + Fabric</span>
                    <span className="text-xs text-white/80">₹650</span>
                  </div>
                </motion.button>

                {/* Stitch Pyjama + Fabric */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStitchWithFabric("pyjama")}
                  className="group relative overflow-hidden bg-gradient-to-br from-orange to-gold text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Scissors className="h-5 w-5" />
                    <span className="text-sm font-bold">Pyjama + Fabric</span>
                    <span className="text-xs text-white/80">₹450</span>
                  </div>
                </motion.button>

                {/* Complete Set + Fabric */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStitchWithFabric("complete")}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Scissors className="h-5 w-5" />
                    <span className="text-sm font-bold">Complete Set</span>
                    <span className="text-xs text-white/80">₹999</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-charcoal/70">Availability:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {fabric.available ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div>
                <span className="text-charcoal/70">Material:</span>
                <span className="ml-2 font-semibold text-navy">
                  {fabric.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
