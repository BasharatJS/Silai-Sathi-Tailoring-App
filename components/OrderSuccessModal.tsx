"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderSuccessModalProps {
  orderId: string;
  orderNumber: string;
  onClose: () => void;
}

export default function OrderSuccessModal({
  orderId,
  orderNumber,
  onClose,
}: OrderSuccessModalProps) {
  const router = useRouter();

  const handleOk = () => {
    onClose();
    router.push("/customer/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-white rounded-xl lg:rounded-2xl shadow-2xl max-w-xs md:max-w-sm lg:max-w-md w-full p-3 md:p-3.5 lg:p-8 text-center max-h-[90vh] md:max-h-[75vh] lg:max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-2 md:mb-2 lg:mb-4"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="h-6 w-6 md:h-7 md:w-7 lg:h-10 lg:w-10 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-base md:text-lg lg:text-2xl font-bold text-navy mb-1 md:mb-1.5 lg:mb-2">
            🎉 Order Placed Successfully!
          </h2>
          <p className="text-xs md:text-xs lg:text-sm text-charcoal/70 mb-2 md:mb-2.5 lg:mb-4">
            Your tailoring order has been confirmed and is being processed.
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg lg:rounded-xl p-2 md:p-2.5 lg:p-4 mb-2 md:mb-2.5 lg:mb-4"
        >
          <div className="flex items-center justify-center gap-1 md:gap-1.5 mb-1 md:mb-1.5 lg:mb-2">
            <Package className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-navy" />
            <p className="text-[10px] md:text-xs lg:text-xs text-charcoal/60 font-medium">Order Number</p>
          </div>
          <p className="text-sm md:text-base lg:text-xl font-bold text-navy font-mono">{orderNumber}</p>
          <p className="text-[9px] md:text-[10px] lg:text-xs text-charcoal/50 mt-0.5 lg:mt-1">
            Order ID: {orderId.substring(0, 12)}...
          </p>
        </motion.div>

        {/* Info Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gold/10 border border-gold/30 rounded-md lg:rounded-lg p-1.5 md:p-2 lg:p-3 mb-2 md:mb-2.5 lg:mb-4"
        >
          <p className="text-[9px] md:text-[10px] lg:text-xs text-charcoal/80">
            📞 We'll contact you soon with updates on your order status.
          </p>
        </motion.div>

        {/* OK Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOk}
          className="w-full py-2 md:py-2 lg:py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg lg:rounded-xl font-bold text-xs md:text-xs lg:text-base hover:shadow-xl transition-all flex items-center justify-center gap-1 md:gap-1.5 cursor-pointer"
        >
          OK, Go to Dashboard
          <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
