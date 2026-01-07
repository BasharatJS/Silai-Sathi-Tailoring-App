"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Shirt,
  Ruler,
  Palette,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fabric } from "@/lib/fabricData";
import { getAllFabrics, getFabricById } from "@/services/fabricService";
import { createOrder } from "@/services/orderService";
import { OrderFormData } from "@/types/order";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

// Dynamic steps will be set based on service type
const getStepsForService = (serviceId: string) => {
  if (serviceId === "stitching") {
    // Stitching Only: Select Style → Measurements → Review Order → Payment
    return [
      { id: 1, name: "Select Style", icon: Sparkles },
      { id: 2, name: "Measurements", icon: Ruler },
      { id: 3, name: "Review Order", icon: ShoppingCart },
    ];
  } else {
    // Kurta, Pyjama, Complete Set: Choose Fabric → Select Style → Measurements → Review Order → Payment
    return [
      { id: 1, name: "Choose Fabric", icon: Palette },
      { id: 2, name: "Select Style", icon: Sparkles },
      { id: 3, name: "Measurements", icon: Ruler },
      { id: 4, name: "Review Order", icon: ShoppingCart },
    ];
  }
};

const serviceOptions = [
  {
    id: "kurta",
    name: "Kurta Tailoring",
    price: 650,
    gradient: "from-gold to-orange",
  },
  {
    id: "pyjama",
    name: "Pyjama Tailoring",
    price: 450,
    gradient: "from-orange to-gold",
  },
  {
    id: "complete",
    name: "Complete Set",
    price: 999,
    gradient: "from-navy to-gold",
  },
  {
    id: "stitching",
    name: "Stitching Only",
    price: 500,
    gradient: "from-purple to-blue",
  },
];

// Kurta Styles (2 types)
const kurtaStyleOptions = [
  {
    id: "kurta-without-pocket",
    name: "Without Pocket",
    description: "Clean kurta design without pockets",
    icon: "👕",
    gradient: "from-blue-100 to-blue-200",
  },
  {
    id: "kurta-with-pocket",
    name: "With Pocket",
    description: "Kurta with front pocket for convenience",
    icon: "👔",
    gradient: "from-purple-100 to-purple-200",
  },
];

// Pyjama Styles (4 types)
const pyjamaStyleOptions = [
  {
    id: "pyjama-left-zipper",
    name: "Left Pocket with Zipper",
    description: "Pyjama with left side zipper pocket",
    icon: "◀️",
    gradient: "from-green-100 to-green-200",
  },
  {
    id: "pyjama-right-zipper",
    name: "Right Pocket with Zipper",
    description: "Pyjama with right side zipper pocket",
    icon: "▶️",
    gradient: "from-orange-100 to-orange-200",
  },
  {
    id: "pyjama-center-zipper",
    name: "Center Zipper",
    description: "Pyjama with center zipper",
    icon: "🔽",
    gradient: "from-pink-100 to-pink-200",
  },
  {
    id: "pyjama-no-pockets",
    name: "No Pockets",
    description: "Simple pyjama without pockets",
    icon: "⭕",
    gradient: "from-gray-100 to-gray-200",
  },
];

function NewOrderContent() {
  const searchParams = useSearchParams();
  const { user } = useCustomerAuth(); // Get customer UID for order tracking
  const preSelectedFabricId = searchParams.get("fabricId");
  const preSelectedService = searchParams.get("service");
  const preSelectedColorIndex = parseInt(searchParams.get("colorIndex") || "0");

  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [fabricsLoading, setFabricsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preSelectedService || "");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedFabricColorIndex, setSelectedFabricColorIndex] = useState(0);
  const [selectedKurtaStyle, setSelectedKurtaStyle] = useState("");
  const [selectedPyjamaStyle, setSelectedPyjamaStyle] = useState("");
  const [buttonImage, setButtonImage] = useState<string | null>(null);
  const [buttonImageFile, setButtonImageFile] = useState<File | null>(null);
  const [fabricQuantity, setFabricQuantity] = useState(3); // Default 3 meters for kurta
  const [showFabricList, setShowFabricList] = useState(false);

  // Track color selection for each fabric in the list
  const [fabricListColors, setFabricListColors] = useState<{ [key: string]: number }>({});

  // Separate measurements for kurta and pyjama
  const [kurtaMeasurements, setKurtaMeasurements] = useState({
    chest: "",
    waist: "",
    shoulder: "",
    length: "",
    sleeve: "",
  });

  const [pyjamaMeasurements, setPyjamaMeasurements] = useState({
    waist: "",
    length: "",
    thigh: "",
    bottom: "",
  });

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState<{ id: string; orderNumber: string } | null>(null);

  // Get dynamic steps based on selected service
  const steps = selectedService ? getStepsForService(selectedService) : [];

  // Load fabrics from Firebase
  useEffect(() => {
    const loadFabrics = async () => {
      try {
        setFabricsLoading(true);
        const fetchedFabrics = await getAllFabrics();
        const availableFabrics = fetchedFabrics.filter((f) => f.available);
        setFabrics(availableFabrics);

        // Initialize random colors for each fabric
        const initialColors: { [key: string]: number } = {};
        availableFabrics.forEach((fabric) => {
          initialColors[fabric.id] = Math.floor(
            Math.random() * fabric.colors.length
          );
        });
        setFabricListColors(initialColors);
      } catch (error) {
        console.error("Error loading fabrics:", error);
      } finally {
        setFabricsLoading(false);
      }
    };

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

  // Pre-select fabric if coming from fabric selection
  useEffect(() => {
    if (preSelectedFabricId) {
      setSelectedFabric(preSelectedFabricId);
      setSelectedFabricColorIndex(preSelectedColorIndex);
    }
  }, [preSelectedFabricId, preSelectedColorIndex]);

  const selectedFabricData = selectedFabric ? fabrics.find(f => f.id === selectedFabric) : null;
  const selectedServiceData = serviceOptions.find((s) => s.id === selectedService);
  const selectedKurtaStyleData = kurtaStyleOptions.find((s) => s.id === selectedKurtaStyle);
  const selectedPyjamaStyleData = pyjamaStyleOptions.find((s) => s.id === selectedPyjamaStyle);

  // Helper to get current step name
  const getCurrentStepName = () => {
    return steps[currentStep - 1]?.name || "";
  };

  // Helper to check if we should show fabric selection for current service
  const shouldShowFabricSelection = () => {
    return selectedService !== "stitching";
  };

  // Helper to check which measurements to show
  const getMeasurementsToShow = () => {
    if (selectedService === "kurta") return "kurta";
    if (selectedService === "pyjama") return "pyjama";
    if (selectedService === "complete" || selectedService === "stitching") return "both";
    return "kurta";
  };

  // Helper to check which styles to show
  const shouldShowKurtaStyle = () => {
    return selectedService === "kurta" || selectedService === "complete" || selectedService === "stitching";
  };

  const shouldShowPyjamaStyle = () => {
    return selectedService === "pyjama" || selectedService === "complete" || selectedService === "stitching";
  };

  const shouldShowButtonSelection = () => {
    return selectedService === "kurta" || selectedService === "complete" || selectedService === "stitching";
  };

  // Handle button image upload
  const handleButtonImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setButtonImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setButtonImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation helpers
  const validateKurtaMeasurements = (): boolean => {
    return !!(
      kurtaMeasurements.chest &&
      kurtaMeasurements.waist &&
      kurtaMeasurements.shoulder &&
      kurtaMeasurements.length &&
      kurtaMeasurements.sleeve
    );
  };

  const validatePyjamaMeasurements = (): boolean => {
    return !!(
      pyjamaMeasurements.waist &&
      pyjamaMeasurements.length &&
      pyjamaMeasurements.thigh &&
      pyjamaMeasurements.bottom
    );
  };

  const validateMeasurements = (): boolean => {
    const measurementType = getMeasurementsToShow();

    if (measurementType === "kurta") {
      return validateKurtaMeasurements();
    } else if (measurementType === "pyjama") {
      return validatePyjamaMeasurements();
    } else if (measurementType === "both") {
      return validateKurtaMeasurements() && validatePyjamaMeasurements();
    }

    return false;
  };

  const validateAddress = (): boolean => {
    return !!(
      address.name &&
      address.phone &&
      address.street &&
      address.city &&
      address.state &&
      address.pincode
    );
  };

  const isMeasurementsStepValid = (): boolean => {
    return validateMeasurements() && validateAddress();
  };

  // Get the selected fabric gradient based on color index
  const getFabricGradient = () => {
    if (!selectedFabricData) return "";
    const colorIndex = selectedFabricColorIndex;
    return selectedFabricData.colors[colorIndex]?.gradient || selectedFabricData.gradient;
  };

  const handleQuantityChange = (delta: number) => {
    setFabricQuantity(Math.max(1, fabricQuantity + delta));
  };

  // Handle color change in fabric list
  const handleFabricListColorChange = (fabricId: string, colorIndex: number) => {
    setFabricListColors((prev) => ({
      ...prev,
      [fabricId]: colorIndex,
    }));
  };

  // Get fabric gradient for list items
  const getFabricListGradient = (fabric: Fabric) => {
    const colorIndex = fabricListColors[fabric.id] || 0;
    return fabric.colors[colorIndex]?.gradient || fabric.gradient;
  };

  // Handle fabric selection from list
  const handleSelectFabric = (fabric: Fabric) => {
    setSelectedFabric(fabric.id);
    setSelectedFabricColorIndex(fabricListColors[fabric.id] || 0);
    setShowFabricList(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData: OrderFormData = {
        service: selectedService,
        fabric: shouldShowFabricSelection() ? selectedFabric : "", // Only include fabric for non-stitching
        fabricQuantity: shouldShowFabricSelection() ? fabricQuantity : 0,
        selectedFabricColorIndex: shouldShowFabricSelection() ? selectedFabricColorIndex : 0,
        kurtaStyle: selectedKurtaStyle,
        pyjamaStyle: selectedPyjamaStyle,
        buttonImage: buttonImage || "",
        measurements: {
          kurta: kurtaMeasurements,
          pyjama: pyjamaMeasurements,
        },
        address,
        customerUid: user?.uid, // Add customer UID for reliable order tracking
        paymentMethod: paymentMethod, // Add payment method (COD/UPI)
      };

      const result = await createOrder(formData);

      // Show success modal
      setOrderData({
        id: result.orderId,
        orderNumber: result.orderNumber,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again or contact support.");
    }
  };

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
        {/* Progress Steps */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-gradient-to-br from-gold to-orange"
                          : isCurrent
                          ? "bg-gradient-to-br from-navy to-gold"
                          : "bg-gray-200"
                      } transition-all duration-300`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      ) : (
                        <Icon
                          className={`h-6 w-6 md:h-8 md:w-8 ${
                            isCurrent ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </motion.div>
                    <span
                      className={`mt-2 text-xs md:text-sm font-medium text-center ${
                        isCurrent ? "text-gold" : "text-charcoal/70"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 md:mx-4 bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: isCompleted ? "100%" : "0%",
                        }}
                        className="h-full bg-gradient-to-r from-gold to-orange"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          {/* Fabric Selection - Only for Kurta/Pyjama/Complete Set */}
          {getCurrentStepName() === "Choose Fabric" && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                Choose Your Fabric
              </h2>

              {/* Selected Fabric Display */}
              {selectedFabricData && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br ${getFabricGradient()}`}
                        />
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-navy">
                            {selectedFabricData.name}
                          </h3>
                          <p className="text-sm text-charcoal/70">
                            {selectedFabricData.category}
                          </p>
                          <p className="text-base md:text-lg font-bold text-gold mt-1">
                            ₹{selectedFabricData.pricePerMeter}/meter
                          </p>
                        </div>
                      </div>
                      <Check className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Fabric Quantity Selector */}
              {selectedFabricData && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold text-navy mb-1 block">
                          Fabric Quantity
                        </Label>
                        <p className="text-sm text-charcoal/70">
                          Required meters for your garment
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-1)}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-2xl font-bold text-navy w-16 text-center">
                          {fabricQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(1)}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/70">Fabric Subtotal:</span>
                        <span className="text-xl font-bold text-gold">
                          ₹{selectedFabricData.pricePerMeter * fabricQuantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Change Fabric Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFabricList(!showFabricList)}
                className="w-full mb-6 px-6 py-4 bg-navy text-white rounded-xl font-semibold hover:bg-gold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>
                  {selectedFabric ? "Change Fabric" : "Select Fabric"}
                </span>
                {showFabricList ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </motion.button>

              {/* Fabric List */}
              <AnimatePresence>
                {showFabricList && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto p-2">
                      {fabrics.map((fabric, index) => (
                        <motion.div
                          key={fabric.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="group"
                        >
                          <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                            selectedFabric === fabric.id
                              ? "border-gold"
                              : "border-gray-100"
                          }`}>
                            {/* Fabric Preview */}
                            <div
                              className={`h-32 bg-gradient-to-br ${getFabricListGradient(fabric)} relative overflow-hidden cursor-pointer`}
                              onClick={() => handleSelectFabric(fabric)}
                            >
                              {/* Texture */}
                              <div className="absolute inset-0 opacity-30">
                                <svg width="100%" height="100%">
                                  <defs>
                                    <pattern
                                      id={`order-fabric-${index}`}
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
                                    fill={`url(#order-fabric-${index})`}
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
                              {/* Selected Badge */}
                              {selectedFabric === fabric.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center"
                                >
                                  <Check className="h-5 w-5 text-white" />
                                </motion.div>
                              )}
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
                                      handleFabricListColorChange(fabric.id, colorIndex);
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                                      (fabricListColors[fabric.id] || 0) === colorIndex
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
                                {fabric.category}
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
                                onClick={() => handleSelectFabric(fabric)}
                                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                                  selectedFabric === fabric.id
                                    ? "bg-gold text-white"
                                    : "bg-navy text-white hover:bg-navy/90"
                                }`}
                              >
                                {selectedFabric === fabric.id ? "Selected" : "Choose"}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Style Selection */}
          {getCurrentStepName() === "Select Style" && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                Select Your Style
              </h2>
              <p className="text-charcoal/80 mb-8">
                Choose the perfect style that matches your preference
              </p>

              {/* Kurta Style Selection */}
              {shouldShowKurtaStyle() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-navy mb-4">Kurta Style</h3>
                  <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    {kurtaStyleOptions.map((style) => (
                      <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className={`cursor-pointer rounded-2xl overflow-hidden transition-all border-2 ${
                          selectedKurtaStyle === style.id
                            ? "border-gold shadow-2xl"
                            : "border-gray-200 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <div
                          className={`h-32 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}
                        >
                          <span className="text-6xl">{style.icon}</span>
                          {selectedKurtaStyle === style.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-8 h-8 bg-gold rounded-full flex items-center justify-center"
                            >
                              <Check className="h-5 w-5 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div className="p-5 bg-white">
                          <h3 className="text-lg font-bold text-navy mb-2">
                            {style.name}
                          </h3>
                          <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
                            {style.description}
                          </p>
                          <Button
                            onClick={() => setSelectedKurtaStyle(style.id)}
                            className={`w-full ${
                              selectedKurtaStyle === style.id
                                ? "bg-gold hover:bg-primary-dark"
                                : "bg-navy hover:bg-navy/90"
                            }`}
                          >
                            {selectedKurtaStyle === style.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Pyjama Style Selection */}
              {shouldShowPyjamaStyle() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-navy mb-4">Pyjama Style</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {pyjamaStyleOptions.map((style) => (
                      <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className={`cursor-pointer rounded-2xl overflow-hidden transition-all border-2 ${
                          selectedPyjamaStyle === style.id
                            ? "border-gold shadow-2xl"
                            : "border-gray-200 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <div
                          className={`h-32 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}
                        >
                          <span className="text-6xl">{style.icon}</span>
                          {selectedPyjamaStyle === style.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-8 h-8 bg-gold rounded-full flex items-center justify-center"
                            >
                              <Check className="h-5 w-5 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div className="p-5 bg-white">
                          <h3 className="text-lg font-bold text-navy mb-2">
                            {style.name}
                          </h3>
                          <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
                            {style.description}
                          </p>
                          <Button
                            onClick={() => setSelectedPyjamaStyle(style.id)}
                            className={`w-full ${
                              selectedPyjamaStyle === style.id
                                ? "bg-gold hover:bg-primary-dark"
                                : "bg-navy hover:bg-navy/90"
                            }`}
                          >
                            {selectedPyjamaStyle === style.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Button Image Upload - Only for Kurta, Complete Set, and Stitching */}
              {shouldShowButtonSelection() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t pt-8"
                >
                  <h3 className="text-xl font-bold text-navy mb-4">
                    Upload Button Image
                  </h3>
                  <p className="text-charcoal/80 mb-6">
                    Upload a photo of the button you want for your kurta
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gold transition-colors">
                      <input
                        type="file"
                        id="button-image"
                        accept="image/*"
                        onChange={handleButtonImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="button-image"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Plus className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-navy font-semibold mb-1">Click to upload</p>
                        <p className="text-sm text-charcoal/60">PNG, JPG up to 5MB</p>
                      </label>
                    </div>

                    {/* Preview Area */}
                    {buttonImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border-2 border-gold rounded-xl p-6 bg-gold/5"
                      >
                        <p className="text-navy font-semibold mb-3">Selected Button:</p>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <img
                            src={buttonImage}
                            alt="Button preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Measurements & Address */}
          {getCurrentStepName() === "Measurements" && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                Enter Your Measurements & Address
              </h2>

              {/* Measurements Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-navy mb-4">Measurements</h3>

                {/* Kurta Measurements - Show for kurta, complete set, and stitching */}
                {(getMeasurementsToShow() === "kurta" || getMeasurementsToShow() === "both") && (
                  <div className="mb-6">
                    {getMeasurementsToShow() === "both" && (
                      <h4 className="text-lg font-semibold text-charcoal mb-4">Kurta Measurements</h4>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kurta-chest">
                          Chest (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="kurta-chest"
                          type="number"
                          placeholder="42"
                          value={kurtaMeasurements.chest}
                          onChange={(e) =>
                            setKurtaMeasurements({ ...kurtaMeasurements, chest: e.target.value })
                          }
                          required
                          className={`mt-2 ${!kurtaMeasurements.chest ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="kurta-waist">
                          Waist (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="kurta-waist"
                          type="number"
                          placeholder="36"
                          value={kurtaMeasurements.waist}
                          onChange={(e) =>
                            setKurtaMeasurements({ ...kurtaMeasurements, waist: e.target.value })
                          }
                          required
                          className={`mt-2 ${!kurtaMeasurements.waist ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="kurta-shoulder">
                          Shoulder (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="kurta-shoulder"
                          type="number"
                          placeholder="18"
                          value={kurtaMeasurements.shoulder}
                          onChange={(e) =>
                            setKurtaMeasurements({ ...kurtaMeasurements, shoulder: e.target.value })
                          }
                          required
                          className={`mt-2 ${!kurtaMeasurements.shoulder ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="kurta-length">
                          Length (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="kurta-length"
                          type="number"
                          placeholder="38"
                          value={kurtaMeasurements.length}
                          onChange={(e) =>
                            setKurtaMeasurements({ ...kurtaMeasurements, length: e.target.value })
                          }
                          required
                          className={`mt-2 ${!kurtaMeasurements.length ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="kurta-sleeve">
                          Sleeve (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="kurta-sleeve"
                          type="number"
                          placeholder="24"
                          value={kurtaMeasurements.sleeve}
                          onChange={(e) =>
                            setKurtaMeasurements({ ...kurtaMeasurements, sleeve: e.target.value })
                          }
                          required
                          className={`mt-2 ${!kurtaMeasurements.sleeve ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Pyjama Measurements - Show for pyjama, complete set, and stitching */}
                {(getMeasurementsToShow() === "pyjama" || getMeasurementsToShow() === "both") && (
                  <div className="mb-6">
                    {getMeasurementsToShow() === "both" && (
                      <h4 className="text-lg font-semibold text-charcoal mb-4 mt-6">Pyjama Measurements</h4>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pyjama-waist">
                          Waist (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="pyjama-waist"
                          type="number"
                          placeholder="32"
                          value={pyjamaMeasurements.waist}
                          onChange={(e) =>
                            setPyjamaMeasurements({ ...pyjamaMeasurements, waist: e.target.value })
                          }
                          required
                          className={`mt-2 ${!pyjamaMeasurements.waist ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pyjama-length">
                          Length (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="pyjama-length"
                          type="number"
                          placeholder="40"
                          value={pyjamaMeasurements.length}
                          onChange={(e) =>
                            setPyjamaMeasurements({ ...pyjamaMeasurements, length: e.target.value })
                          }
                          required
                          className={`mt-2 ${!pyjamaMeasurements.length ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pyjama-thigh">
                          Thigh (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="pyjama-thigh"
                          type="number"
                          placeholder="24"
                          value={pyjamaMeasurements.thigh}
                          onChange={(e) =>
                            setPyjamaMeasurements({ ...pyjamaMeasurements, thigh: e.target.value })
                          }
                          required
                          className={`mt-2 ${!pyjamaMeasurements.thigh ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pyjama-bottom">
                          Bottom (inches) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="pyjama-bottom"
                          type="number"
                          placeholder="14"
                          value={pyjamaMeasurements.bottom}
                          onChange={(e) =>
                            setPyjamaMeasurements({ ...pyjamaMeasurements, bottom: e.target.value })
                          }
                          required
                          className={`mt-2 ${!pyjamaMeasurements.bottom ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-xl font-bold text-navy mb-4">
                  Delivery Address
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={address.name}
                      onChange={(e) =>
                        setAddress({ ...address, name: e.target.value })
                      }
                      required
                      className={`mt-2 ${!address.name ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      required
                      className={`mt-2 ${!address.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="street">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      placeholder="House no., Building name"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      required
                      className={`mt-2 ${!address.street ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      required
                      className={`mt-2 ${!address.city ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      required
                      className={`mt-2 ${!address.state ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">
                      PIN Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="400001"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      required
                      className={`mt-2 ${!address.pincode ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Order */}
          {getCurrentStepName() === "Review Order" && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                Review Your Order
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Service</h3>
                  <p className="text-charcoal capitalize">
                    {selectedServiceData?.name} - ₹{selectedServiceData?.price}
                  </p>
                </div>
                {/* Only show fabric for non-stitching services */}
                {shouldShowFabricSelection() && selectedFabricData && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-navy mb-2">Fabric</h3>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getFabricGradient()}`}
                      />
                      <div>
                        <p className="text-charcoal font-medium">
                          {selectedFabricData.name}
                        </p>
                        <p className="text-sm text-charcoal/70">
                          ₹{selectedFabricData.pricePerMeter}/meter × {fabricQuantity} meters
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Style Details</h3>
                  <div className="space-y-3">
                    {/* Kurta Style */}
                    {selectedKurtaStyleData && (
                      <div>
                        <p className="text-xs font-semibold text-charcoal/60 mb-1">Kurta Style:</p>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedKurtaStyleData.gradient} flex items-center justify-center text-2xl`}
                          >
                            {selectedKurtaStyleData.icon}
                          </div>
                          <div>
                            <p className="text-charcoal font-medium">
                              {selectedKurtaStyleData.name}
                            </p>
                            <p className="text-sm text-charcoal/70">
                              {selectedKurtaStyleData.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pyjama Style */}
                    {selectedPyjamaStyleData && (
                      <div className={selectedKurtaStyleData ? "pt-3 border-t border-gray-300" : ""}>
                        <p className="text-xs font-semibold text-charcoal/60 mb-1">Pyjama Style:</p>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedPyjamaStyleData.gradient} flex items-center justify-center text-2xl`}
                          >
                            {selectedPyjamaStyleData.icon}
                          </div>
                          <div>
                            <p className="text-charcoal font-medium">
                              {selectedPyjamaStyleData.name}
                            </p>
                            <p className="text-sm text-charcoal/70">
                              {selectedPyjamaStyleData.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Button Image */}
                    {buttonImage && (
                      <div className={(selectedKurtaStyleData || selectedPyjamaStyleData) ? "pt-3 border-t border-gray-300" : ""}>
                        <p className="text-xs font-semibold text-charcoal/60 mb-2">Button Selection:</p>
                        <div className="flex items-center gap-3">
                          <img
                            src={buttonImage}
                            alt="Selected button"
                            className="w-16 h-16 rounded-lg object-cover border-2 border-gold"
                          />
                          <p className="text-sm text-charcoal/70">Custom button uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Measurements</h3>

                  {/* Kurta Measurements */}
                  {(getMeasurementsToShow() === "kurta" || getMeasurementsToShow() === "both") && (
                    <div className="mb-4">
                      {getMeasurementsToShow() === "both" && (
                        <h4 className="font-semibold text-charcoal mb-2">Kurta:</h4>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-charcoal">
                        <p>Chest: {kurtaMeasurements.chest}"</p>
                        <p>Waist: {kurtaMeasurements.waist}"</p>
                        <p>Shoulder: {kurtaMeasurements.shoulder}"</p>
                        <p>Length: {kurtaMeasurements.length}"</p>
                        <p>Sleeve: {kurtaMeasurements.sleeve}"</p>
                      </div>
                    </div>
                  )}

                  {/* Pyjama Measurements */}
                  {(getMeasurementsToShow() === "pyjama" || getMeasurementsToShow() === "both") && (
                    <div>
                      {getMeasurementsToShow() === "both" && (
                        <h4 className="font-semibold text-charcoal mb-2 mt-3">Pyjama:</h4>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-charcoal">
                        <p>Waist: {pyjamaMeasurements.waist}"</p>
                        <p>Length: {pyjamaMeasurements.length}"</p>
                        <p>Thigh: {pyjamaMeasurements.thigh}"</p>
                        <p>Bottom: {pyjamaMeasurements.bottom}"</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Delivery Address</h3>
                  <p className="text-charcoal">
                    {address.name}, {address.phone}
                    <br />
                    {address.street}, {address.city}
                    <br />
                    {address.state} - {address.pincode}
                  </p>
                </div>

                {/* Payment Method Selection */}
                <div className="p-6 bg-white rounded-lg border-2 border-gray-200">
                  <h3 className="font-bold text-navy mb-4 text-lg">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cash on Delivery */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === "cod"
                          ? "border-navy bg-navy/10 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-3xl">💵</div>
                        <p className="font-semibold text-navy">Cash on Delivery</p>
                        <p className="text-xs text-charcoal/60">Pay when you receive</p>
                      </div>
                    </motion.button>

                    {/* UPI Payment */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        paymentMethod === "upi"
                          ? "border-navy bg-navy/10 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-3xl">📱</div>
                        <p className="font-semibold text-navy">UPI Payment</p>
                        <p className="text-xs text-charcoal/60">Pay online instantly</p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="p-6 bg-gradient-to-r from-gold/10 to-orange/10 rounded-lg">
                  <h3 className="font-bold text-navy mb-4 text-xl">Cost Summary</h3>

                  {/* Fabric Cost - Only for non-stitching services */}
                  {shouldShowFabricSelection() && selectedFabricData && (
                    <div className="mb-4 pb-4 border-b border-gold/30">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-navy">Fabric Cost</p>
                          <p className="text-sm text-charcoal/70">{selectedFabricData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-charcoal/80">
                          ₹{selectedFabricData.pricePerMeter}/meter × {fabricQuantity} meters
                        </span>
                        <span className="font-bold text-navy">
                          ₹{selectedFabricData.pricePerMeter * fabricQuantity}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tailoring Cost */}
                  {selectedServiceData && (
                    <div className="mb-4 pb-4 border-b border-gold/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-navy">Tailoring Service</p>
                          <p className="text-sm text-charcoal/70">{selectedServiceData.name}</p>
                        </div>
                        <span className="font-bold text-navy">
                          ₹{selectedServiceData.price}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-navy">
                      Grand Total:
                    </span>
                    <span className="text-3xl font-bold text-gold">
                      ₹
                      {(selectedServiceData?.price || 0) +
                        (shouldShowFabricSelection() ? (selectedFabricData?.pricePerMeter || 0) * fabricQuantity : 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={
                  (getCurrentStepName() === "Choose Fabric" && !selectedFabric) ||
                  (getCurrentStepName() === "Select Style" && (
                    (shouldShowKurtaStyle() && !selectedKurtaStyle) ||
                    (shouldShowPyjamaStyle() && !selectedPyjamaStyle) ||
                    (shouldShowButtonSelection() && !buttonImage)
                  )) ||
                  (getCurrentStepName() === "Measurements" && !isMeasurementsStepValid())
                }
              >
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Place Order</Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && orderData && (
          <OrderSuccessModal
            orderId={orderData.id}
            orderNumber={orderData.orderNumber}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center">
          <div className="text-navy">Loading...</div>
        </div>
      }
    >
      <NewOrderContent />
    </Suspense>
  );
}
