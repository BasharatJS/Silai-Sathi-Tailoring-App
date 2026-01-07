"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Phone,
  MapPin,
  Package,
  Palette,
  Ruler,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import { updateOrderStatus as updateOrderStatusService } from "@/services/orderService";
import { useOrderStore } from "@/store/useOrderStore";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-500" },
  {
    value: "ready_for_delivery",
    label: "Ready for Delivery",
    color: "bg-green-500",
  },
  { value: "delivered", label: "Delivered", color: "bg-emerald-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export default function OrderDetailModal({
  order,
  onClose,
  onStatusUpdate,
}: OrderDetailModalProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) {
      setIsEditingStatus(false);
      return;
    }

    try {
      setIsUpdating(true);
      await updateOrderStatusService(order.id, newStatus);
      updateOrderStatus(order.id, newStatus);
      onStatusUpdate();
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentStatusConfig = () => {
    return (
      statusOptions.find((opt) => opt.value === order.status) ||
      statusOptions[0]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-navy to-charcoal text-white p-8 rounded-t-3xl flex items-center justify-between z-10">
          <div>
            <h3 className="text-3xl font-bold mb-2">Order Details</h3>
            <p className="text-white/80 font-mono text-lg">
              {order.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Status */}
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-navy flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Order Status
              </h4>
              {!isEditingStatus && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingStatus(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-gold transition-colors text-sm cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  Update Status
                </motion.button>
              )}
            </div>

            {isEditingStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {statusOptions.map((status) => (
                    <motion.button
                      key={status.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewStatus(status.value)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        newStatus === status.value
                          ? "border-navy bg-navy/10 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${status.color} mb-2`}
                      ></div>
                      <p className="text-sm font-semibold text-charcoal">
                        {status.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-navy text-white rounded-xl hover:bg-gold transition-colors font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Save Status"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsEditingStatus(false);
                      setNewStatus(order.status);
                    }}
                    className="px-6 py-3 bg-gray-200 text-charcoal rounded-xl hover:bg-gray-300 transition-colors font-semibold cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    getCurrentStatusConfig().color
                  }`}
                ></div>
                <span className="text-xl font-bold text-charcoal">
                  {getCurrentStatusConfig().label}
                </span>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-charcoal/60 mb-1">Name</p>
                <p className="font-semibold text-charcoal">
                  {order.customer.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-charcoal/60 mb-1">Phone</p>
                <p className="font-semibold text-charcoal flex items-center gap-2">
                  <Phone className="h-4 w-4 text-charcoal/60" />
                  {order.customer.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100">
            <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </h4>
            <p className="text-charcoal leading-relaxed">
              {order.deliveryAddress.street}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state}
              <br />
              PIN: {order.deliveryAddress.pincode}
            </p>
          </div>

          {/* Service Details */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
            <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Service Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-charcoal">{order.service.name}</span>
                <span className="font-semibold text-gold flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {order.service.price.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Kurta Style */}
              {order.customization?.kurtaStyleName && (
                <div className="pt-4 border-t border-purple-200">
                  <p className="text-sm text-charcoal/60 mb-2">Kurta Style</p>
                  <p className="font-semibold text-charcoal">
                    {order.customization.kurtaStyleName}
                  </p>
                </div>
              )}

              {/* Pyjama Style */}
              {order.customization?.pyjamaStyleName && (
                <div className={order.customization?.kurtaStyleName ? "" : "pt-4 border-t border-purple-200"}>
                  <p className="text-sm text-charcoal/60 mb-2">Pyjama Style</p>
                  <p className="font-semibold text-charcoal">
                    {order.customization.pyjamaStyleName}
                  </p>
                </div>
              )}

              {/* Button Image */}
              {order.customization?.hasButtonImage && (
                <div>
                  <p className="text-sm text-charcoal/60 mb-2">Button</p>
                  {order.customization.buttonImageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={order.customization.buttonImageUrl}
                        alt="Custom button"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gold shadow-md"
                      />
                      <p className="text-xs text-charcoal/60">
                        {order.customization.buttonImageNote}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold text-charcoal">
                      {order.customization.buttonImageNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fabric Details */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100">
            <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Fabric Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${order.fabric.colorGradient}`}
                ></div>
                <div className="flex-1">
                  <p className="font-bold text-charcoal text-lg">
                    {order.fabric.name}
                  </p>
                  <p className="text-sm text-charcoal/60">
                    Color: {order.fabric.color}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-200">
                <div>
                  <p className="text-sm text-charcoal/60 mb-1">Quantity</p>
                  <p className="font-semibold text-charcoal">
                    {order.fabric.quantity} meters
                  </p>
                </div>
                <div>
                  <p className="text-sm text-charcoal/60 mb-1">Subtotal</p>
                  <p className="font-semibold text-gold flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {order.fabric.subtotal.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-6 border border-yellow-100">
            <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Measurements (inches)
            </h4>

            {/* Kurta Measurements */}
            {order.measurements?.kurta && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-charcoal mb-3">Kurta:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(order.measurements.kurta).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-charcoal/60 mb-1 capitalize">
                        {key}
                      </p>
                      <p className="font-semibold text-charcoal text-lg">
                        {String(value) || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pyjama Measurements */}
            {order.measurements?.pyjama && (
              <div>
                <p className="text-sm font-semibold text-charcoal mb-3">Pyjama:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(order.measurements.pyjama).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-charcoal/60 mb-1 capitalize">
                        {key}
                      </p>
                      <p className="font-semibold text-charcoal text-lg">
                        {String(value) || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-gradient-to-br from-gold to-orange rounded-2xl p-6 text-white">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Pricing Summary
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white/90">
                <span>Fabric Cost</span>
                <span className="font-semibold">
                  ₹{order.pricing.fabricCost.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/90">
                <span>Tailoring Service</span>
                <span className="font-semibold">
                  ₹{order.pricing.tailoringCost.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-white/30">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-2xl font-bold">
                    ₹{order.pricing.totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Dates */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Timeline
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-charcoal/60 mb-1">Created On</p>
                <p className="font-semibold text-charcoal">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-charcoal/60 mb-1">Last Updated</p>
                <p className="font-semibold text-charcoal">
                  {new Date(order.updatedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
