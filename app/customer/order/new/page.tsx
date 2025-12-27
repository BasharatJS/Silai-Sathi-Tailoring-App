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
import { fabrics, getFabricById, Fabric } from "@/lib/fabricData";

const steps = [
  { id: 1, name: "Select Service", icon: Shirt },
  { id: 2, name: "Choose Fabric", icon: Palette },
  { id: 3, name: "Select Style", icon: Sparkles },
  { id: 4, name: "Measurements", icon: Ruler },
  { id: 5, name: "Review Order", icon: ShoppingCart },
];

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
];

const styleOptions = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional straight-cut kurta with standard collar",
    image: "👔",
    gradient: "from-blue-100 to-blue-200",
  },
  {
    id: "designer",
    name: "Designer",
    description: "Modern designer kurta with unique patterns and cuts",
    image: "✨",
    gradient: "from-purple-100 to-pink-200",
  },
  {
    id: "pathani",
    name: "Pathani",
    description: "Traditional Pathani style with button detailing",
    image: "🎯",
    gradient: "from-green-100 to-emerald-200",
  },
  {
    id: "bandhgala",
    name: "Bandhgala",
    description: "Elegant Bandhgala style with mandarin collar",
    image: "👑",
    gradient: "from-orange-100 to-yellow-200",
  },
  {
    id: "angrakha",
    name: "Angrakha",
    description: "Royal Angrakha style with overlapping front",
    image: "⭐",
    gradient: "from-red-100 to-pink-200",
  },
  {
    id: "straight-cut",
    name: "Straight Cut",
    description: "Simple and elegant straight-cut design",
    image: "📏",
    gradient: "from-gray-100 to-gray-200",
  },
];

const buttonTypeOptions = [
  {
    id: "no-button",
    name: "No Button",
    description: "Simple pullover style without buttons",
    icon: "⭕",
  },
  {
    id: "front-button",
    name: "Front Button",
    description: "Traditional front button placket",
    icon: "🔘",
  },
  {
    id: "side-button",
    name: "Side Button",
    description: "Side opening with button closure",
    icon: "◀️",
  },
  {
    id: "chinese-collar",
    name: "Chinese Collar",
    description: "Mandarin collar with buttons",
    icon: "🎋",
  },
];

function NewOrderContent() {
  const searchParams = useSearchParams();
  const preSelectedFabricId = searchParams.get("fabricId");
  const preSelectedService = searchParams.get("service");
  const preSelectedColorIndex = parseInt(searchParams.get("colorIndex") || "0");

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedFabricColorIndex, setSelectedFabricColorIndex] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedButtonType, setSelectedButtonType] = useState("");
  const [fabricQuantity, setFabricQuantity] = useState(3); // Default 3 meters for kurta
  const [showFabricList, setShowFabricList] = useState(false);

  // Track color selection for each fabric in the list
  const [fabricListColors, setFabricListColors] = useState<{ [key: string]: number }>(() => {
    const initialColors: { [key: string]: number } = {};
    fabrics.forEach((fabric) => {
      initialColors[fabric.id] = Math.floor(Math.random() * fabric.colors.length);
    });
    return initialColors;
  });
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    shoulder: "",
    length: "",
    sleeve: "",
  });
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pre-select fabric and service if coming from fabric selection
  useEffect(() => {
    if (preSelectedFabricId) {
      setSelectedFabric(preSelectedFabricId);
      setSelectedFabricColorIndex(preSelectedColorIndex);
    }
    if (preSelectedService) {
      setSelectedService(preSelectedService);
    }
    // If both fabric and service are pre-selected, skip to fabric step
    if (preSelectedFabricId && preSelectedService) {
      setCurrentStep(2);
    }
  }, [preSelectedFabricId, preSelectedService, preSelectedColorIndex]);

  const selectedFabricData = selectedFabric ? getFabricById(selectedFabric) : null;
  const selectedServiceData = serviceOptions.find((s) => s.id === selectedService);
  const selectedStyleData = styleOptions.find((s) => s.id === selectedStyle);
  const selectedButtonTypeData = buttonTypeOptions.find((b) => b.id === selectedButtonType);

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

  const handleSubmit = () => {
    console.log({
      service: selectedService,
      fabric: selectedFabric,
      fabricQuantity: fabricQuantity,
      style: selectedStyle,
      buttonType: selectedButtonType,
      measurements,
      address,
      totalAmount:
        (selectedServiceData?.price || 0) +
        (selectedFabricData?.pricePerMeter || 0) * fabricQuantity,
    });
    alert("Order placed successfully! (Firebase integration coming soon)");
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
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                Select Your Service
              </h2>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {serviceOptions.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      selectedService === service.id
                        ? `bg-gradient-to-br ${service.gradient} text-white shadow-xl`
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-2xl font-bold">₹{service.price}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Fabric Selection */}
          {currentStep === 2 && (
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
              {selectedFabric && (
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
                className="w-full mb-6 px-6 py-4 bg-navy text-white rounded-xl font-semibold hover:bg-navy/90 transition-all flex items-center justify-between"
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

          {/* Step 3: Style Selection */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                Select Your Style
              </h2>
              <p className="text-charcoal/80 mb-8">
                Choose the perfect style that matches your preference
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {styleOptions.map((style) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className={`cursor-pointer rounded-2xl overflow-hidden transition-all border-2 ${
                      selectedStyle === style.id
                        ? "border-gold shadow-2xl"
                        : "border-gray-200 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {/* Style Icon/Image */}
                    <div
                      className={`h-32 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}
                    >
                      <span className="text-6xl">{style.image}</span>
                      {selectedStyle === style.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-8 h-8 bg-gold rounded-full flex items-center justify-center"
                        >
                          <Check className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </div>

                    {/* Style Info */}
                    <div className="p-5 bg-white">
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {style.name}
                      </h3>
                      <p className="text-sm text-charcoal/70 leading-relaxed mb-4">
                        {style.description}
                      </p>

                      {/* Select Button */}
                      <Button
                        onClick={() => setSelectedStyle(style.id)}
                        className={`w-full ${
                          selectedStyle === style.id
                            ? "bg-gold hover:bg-primary-dark"
                            : "bg-navy hover:bg-navy/90"
                        }`}
                      >
                        {selectedStyle === style.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Button Type Selection */}
              {selectedStyle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t pt-8"
                >
                  <h3 className="text-xl font-bold text-navy mb-4">
                    Select Button Type
                  </h3>
                  <p className="text-charcoal/80 mb-6">
                    Choose your preferred button style
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {buttonTypeOptions.map((buttonType) => (
                      <motion.div
                        key={buttonType.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedButtonType(buttonType.id)}
                        className={`p-5 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedButtonType === buttonType.id
                            ? "border-gold bg-gold/10 shadow-lg"
                            : "border-gray-200 hover:border-gold/50 bg-white"
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-4xl mb-3 block">{buttonType.icon}</span>
                          <h4 className="font-bold text-navy mb-2 text-sm">
                            {buttonType.name}
                          </h4>
                          <p className="text-xs text-charcoal/70 leading-relaxed">
                            {buttonType.description}
                          </p>
                          {selectedButtonType === buttonType.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-3 flex items-center justify-center"
                            >
                              <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 4: Measurements & Address */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                Enter Your Measurements & Address
              </h2>

              {/* Measurements Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-navy mb-4">Measurements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chest">Chest (inches)</Label>
                    <Input
                      id="chest"
                      type="number"
                      placeholder="42"
                      value={measurements.chest}
                      onChange={(e) =>
                        setMeasurements({ ...measurements, chest: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="waist">Waist (inches)</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="36"
                      value={measurements.waist}
                      onChange={(e) =>
                        setMeasurements({ ...measurements, waist: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shoulder">Shoulder (inches)</Label>
                    <Input
                      id="shoulder"
                      type="number"
                      placeholder="18"
                      value={measurements.shoulder}
                      onChange={(e) =>
                        setMeasurements({
                          ...measurements,
                          shoulder: e.target.value,
                        })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="length">Length (inches)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="38"
                      value={measurements.length}
                      onChange={(e) =>
                        setMeasurements({ ...measurements, length: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleeve">Sleeve (inches)</Label>
                    <Input
                      id="sleeve"
                      type="number"
                      placeholder="24"
                      value={measurements.sleeve}
                      onChange={(e) =>
                        setMeasurements({ ...measurements, sleeve: e.target.value })
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-xl font-bold text-navy mb-4">
                  Delivery Address
                </h3>
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
                  <div className="md:col-span-2">
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
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review Order */}
          {currentStep === 5 && (
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
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Fabric</h3>
                  <div className="flex items-center gap-3">
                    {selectedFabricData && (
                      <>
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getFabricGradient()}`}
                        />
                        <div>
                          <p className="text-charcoal font-medium">
                            {selectedFabricData.name}
                          </p>
                          <p className="text-sm text-charcoal/70">
                            ₹{selectedFabricData.pricePerMeter}/meter
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Style & Button Type</h3>
                  <div className="space-y-3">
                    {selectedStyleData && (
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedStyleData.gradient} flex items-center justify-center text-2xl`}
                        >
                          {selectedStyleData.image}
                        </div>
                        <div>
                          <p className="text-charcoal font-medium">
                            {selectedStyleData.name}
                          </p>
                          <p className="text-sm text-charcoal/70">
                            {selectedStyleData.description}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedButtonTypeData && (
                      <div className="flex items-center gap-3 pl-4 border-l-2 border-gold">
                        <span className="text-2xl">{selectedButtonTypeData.icon}</span>
                        <div>
                          <p className="text-charcoal font-medium text-sm">
                            {selectedButtonTypeData.name}
                          </p>
                          <p className="text-xs text-charcoal/70">
                            {selectedButtonTypeData.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-navy mb-2">Measurements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-charcoal">
                    <p>Chest: {measurements.chest}"</p>
                    <p>Waist: {measurements.waist}"</p>
                    <p>Shoulder: {measurements.shoulder}"</p>
                    <p>Length: {measurements.length}"</p>
                    <p>Sleeve: {measurements.sleeve}"</p>
                  </div>
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
                {/* Cost Breakdown */}
                <div className="p-6 bg-gradient-to-r from-gold/10 to-orange/10 rounded-lg">
                  <h3 className="font-bold text-navy mb-4 text-xl">Cost Summary</h3>

                  {/* Fabric Cost */}
                  {selectedFabricData && (
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
                        (selectedFabricData?.pricePerMeter || 0) * fabricQuantity}
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
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && !selectedFabric) ||
                  (currentStep === 3 && (!selectedStyle || !selectedButtonType))
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
