"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Shirt,
  FileText,
  Package,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  Moon,
  Loader2,
  MapPin,
  Mail,
  Phone as PhoneIcon,
  Scissors,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Fabric } from "@/lib/fabricData";
import { Product } from "@/lib/productData";
import { getAllFabrics } from "@/services/fabricService";
import { getAllProducts } from "@/services/productService";
import { getAllOrders, getOrdersByCustomerUid } from "@/services/orderService";
import { getProductOrdersByCustomer } from "@/services/productOrderService";
import { Order } from "@/types/order";
import { ProductOrder } from "@/services/productOrderService";
import FabricDetailModal from "@/components/FabricDetailModal";
import PyjamaIcon from "@/components/icons/PyjamaIcon";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

const services = [
  {
    icon: Shirt,
    title: "Kurta Tailoring",
    description: "Custom-made kurtas with premium fabrics",
    price: "₹650",
    gradient: "from-navy to-gold",
    href: "/customer/order/new?service=kurta",
  },
  {
    icon: PyjamaIcon,
    title: "Pyjama Tailoring",
    description: "Perfectly fitted comfortable pyjamas",
    price: "₹450",
    gradient: "from-navy to-gold",
    href: "/customer/order/new?service=pyjama",
  },
  {
    icons: [Shirt, PyjamaIcon],
    title: "Complete Set",
    description: "Kurta + Pyjama combo with special pricing",
    price: "₹999",
    gradient: "from-navy to-gold",
    href: "/customer/order/new?service=complete",
  },
  {
    icon: Scissors,
    title: "Stitching Only",
    description: "Bring your own fabric, we'll stitch it perfectly",
    price: "₹500",
    gradient: "from-navy to-gold",
    href: "/customer/order/new?service=stitching",
  },
  {
    icon: Palette,
    title: "Buy Fabric",
    description: "Shop premium quality fabrics for your garments",
    price: "From ₹100/m",
    gradient: "from-navy to-gold",
    href: "/customer/dashboard?view=fabrics",
  },
  {
    icon: ShoppingBag,
    title: "Buy Products",
    description: "Browse our ready-made collection",
    price: "From ₹100",
    gradient: "from-navy to-gold",
    href: "/customer/dashboard?view=products",
  },
];

function CustomerDashboardContent() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "dashboard";

  // Auth hooks
  const { user, profile, updateProfile } = useCustomerAuth();

  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: profile?.displayName || "",
    email: profile?.email || user?.email || "",
    phoneNumber: profile?.phoneNumber || user?.phoneNumber || "",
    city: profile?.city || "",
    address: profile?.address || "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [fabricsLoading, setFabricsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState<{
    [key: string]: number;
  }>({});

  // Orders state
  const [fabricOrders, setFabricOrders] = useState<Order[]>([]);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Update profile data when profile changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        displayName: profile.displayName || "",
        email: profile.email || user?.email || "",
        phoneNumber: profile.phoneNumber || user?.phoneNumber || "",
        city: profile.city || "",
        address: profile.address || "",
      });
    }
  }, [profile, user]);

  useEffect(() => {
    loadFabrics();
    loadProducts();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadFabrics();
        loadProducts();
      }
    };

    const handleFocus = () => {
      loadFabrics();
      loadProducts();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Load orders when viewing orders page
  useEffect(() => {
    if (activeView === "orders") {
      loadOrders();
    }
  }, [activeView, profile, user]);

  const loadFabrics = async () => {
    try {
      setFabricsLoading(true);
      const fetchedFabrics = await getAllFabrics();
      const availableFabrics = fetchedFabrics.filter((f) => f.available);
      setFabrics(availableFabrics);

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

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const fetchedProducts = await getAllProducts();
      const availableProducts = fetchedProducts.filter((p) => p.available);
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!user?.uid) {
      setOrdersLoading(false);
      return;
    }

    try {
      setOrdersLoading(true);

      // Fetch fabric stitching orders by customer UID (most reliable)
      const customerFabricOrders = await getOrdersByCustomerUid(user.uid);
      setFabricOrders(customerFabricOrders);

      // Fetch product orders by phone number (fallback for product orders)
      const phoneNumber = profile?.phoneNumber || user?.phoneNumber || "";
      if (phoneNumber) {
        const customerProductOrders = await getProductOrdersByCustomer(phoneNumber);
        setProductOrders(customerProductOrders);
      } else {
        setProductOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
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

  // Dashboard Overview View
  const renderDashboardView = () => (
    <div className="space-y-8">
      {/* Quick Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-xl font-bold text-navy mb-6">Our Services</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link key={service.title} href={service.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className={`bg-gradient-to-br ${service.gradient} p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-shadow`}
              >
                {service.icons ? (
                  <div className="flex items-center gap-2 mb-4">
                    {service.icons.map((Icon, idx) => (
                      <Icon key={idx} className="h-12 w-12" />
                    ))}
                  </div>
                ) : (
                  <service.icon className="h-12 w-12 mb-4" />
                )}
                <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                <p className="text-white/90 text-sm mb-3">{service.description}</p>
                <p className="text-2xl font-bold">{service.price}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Featured Fabrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-navy">Featured Fabrics</h3>
          <Link href="/customer/dashboard?view=fabrics">
            <button className="text-gold hover:text-navy transition-colors text-sm font-semibold">
              View All →
            </button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fabrics.slice(0, 8).map((fabric, index) => {
            const colorIndex = selectedColors[fabric.id] || 0;
            const selectedColor = fabric.colors[colorIndex];

            return (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                <div>
                  <div
                    className="h-32 relative"
                    style={{
                      backgroundColor: selectedColor?.colorCode || '#f3f4f6'
                    }}
                  >
                    <div className="absolute inset-0 opacity-30">
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern
                            id={`pattern-featured-${fabric.id}`}
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
                          fill={`url(#pattern-featured-${fabric.id})`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {fabric.colors.slice(0, 5).map((color, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(fabric.id, idx);
                          }}
                          className="w-5 h-5 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.colorCode }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <h4 className="font-bold text-navy mb-1">{fabric.name}</h4>
                    <p className="text-sm text-charcoal/60 mb-2">{fabric.category}</p>
                    <p className="text-gold font-bold mb-3">₹{fabric.pricePerMeter}/m</p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFabric(fabric)}
                    className="w-full py-2 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm cursor-pointer"
                  >
                    Buy Now
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Featured Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-navy">Featured Products</h3>
          <Link href="/customer/dashboard?view=products">
            <button className="text-gold hover:text-navy transition-colors text-sm font-semibold">
              View All →
            </button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
            >
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-navy mb-1 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-charcoal/60 mb-2">{product.category}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {product.salePrice ? (
                      <>
                        <p className="text-gold font-bold">₹{product.salePrice}</p>
                        <p className="text-xs text-charcoal/60 line-through">
                          ₹{product.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-gold font-bold">₹{product.price}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Link href={`/customer/products/${product.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm cursor-pointer"
                  >
                    Buy Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Fabrics View
  const renderFabricsView = () => {
    const displayedFabrics =
      selectedCategory === "All"
        ? fabrics
        : fabrics.filter((f) => f.category === selectedCategory);

    return (
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {fabricCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-navy to-gold text-white shadow-lg"
                  : "bg-white text-charcoal hover:bg-gray-100 shadow"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Fabrics Grid */}
        {fabricsLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-charcoal/60 mt-4">Loading fabrics...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {displayedFabrics.map((fabric, index) => {
              const colorIndex = selectedColors[fabric.id] || 0;
              const selectedColor = fabric.colors[colorIndex];

              return (
                <motion.div
                  key={fabric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden"
                >
                  <div>
                    <div
                      className="h-48 relative"
                      style={{
                        backgroundColor: selectedColor?.colorCode || '#f3f4f6'
                      }}
                    >
                      <div className="absolute inset-0 opacity-30">
                        <svg width="100%" height="100%">
                          <defs>
                            <pattern
                              id={`pattern-${fabric.id}`}
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
                          fill={`url(#pattern-${fabric.id})`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {fabric.colors.slice(0, 5).map((color, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(fabric.id, idx);
                          }}
                          className="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.colorCode }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <h3 className="font-bold text-navy mb-1 text-lg">
                      {fabric.name}
                    </h3>
                    <p className="text-sm text-charcoal/60 mb-3">{fabric.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gold font-bold text-xl">
                        ₹{fabric.pricePerMeter}
                      </span>
                      <span className="text-xs text-charcoal/60">/meter</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFabric(fabric)}
                    className="w-full py-2.5 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
                  >
                    Buy Now
                  </motion.button>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Products View
  const renderProductsView = () => (
    <div className="space-y-6">
      {productsLoading ? (
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-charcoal/60 mt-4">Loading products...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden"
            >
              <div>
                <div className="h-56 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.salePrice && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                        Sale
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-3 py-1 bg-navy/90 text-white text-sm font-semibold rounded-lg">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      {product.colors.slice(0, 5).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: color.colorCode }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  )}
                  <h3 className="font-bold text-navy mb-2 text-xl">{product.name}</h3>
                  <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    {product.salePrice ? (
                      <>
                        <span className="text-gold font-bold text-2xl">
                          ₹{product.salePrice}
                        </span>
                        <span className="text-charcoal/60 text-base line-through">
                          ₹{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-gold font-bold text-2xl">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <Link href={`/customer/products/${product.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
                  >
                    Buy Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // Analytics View
  const renderAnalyticsView = () => {
    const totalOrders = fabricOrders.length + productOrders.length;

    // Calculate in progress orders
    const inProgressOrders = [
      ...fabricOrders.filter(o => o.status === 'in_progress' || o.status === 'confirmed'),
      ...productOrders.filter(o => o.status === 'processing' || o.status === 'confirmed' || o.status === 'shipped')
    ].length;

    // Calculate delivered orders
    const deliveredOrders = [
      ...fabricOrders.filter(o => o.status === 'delivered'),
      ...productOrders.filter(o => o.status === 'delivered')
    ].length;

    // Calculate total spent
    const totalSpent = fabricOrders.reduce((sum, o) => sum + o.pricing.totalCost, 0) +
                       productOrders.reduce((sum, o) => sum + o.pricing.total, 0);

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/60 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-navy">{totalOrders}</p>
              </div>
              <Package className="h-12 w-12 text-navy/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/60 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-orange">{inProgressOrders}</p>
              </div>
              <Clock className="h-12 w-12 text-orange/20" />
            </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-charcoal/60 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-charcoal/60 mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-gold">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-gold/20" />
          </div>
        </motion.div>
      </div>

      {/* Order Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="h-8 w-8 text-purple-600" />
            <h3 className="text-xl font-bold text-navy">Fabric Orders</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-charcoal/70">Total Orders</span>
              <span className="font-bold text-navy">{fabricOrders.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-charcoal/70">Total Spent</span>
              <span className="font-bold text-gold">
                ₹{fabricOrders.reduce((sum, o) => sum + o.pricing.totalCost, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold text-navy">Product Orders</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-charcoal/70">Total Orders</span>
              <span className="font-bold text-navy">{productOrders.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-charcoal/70">Total Spent</span>
              <span className="font-bold text-gold">
                ₹{productOrders.reduce((sum, o) => sum + o.pricing.total, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-navy" />
          <h3 className="text-2xl font-bold text-navy">Your Activity</h3>
        </div>
        <p className="text-charcoal/70 mb-4">
          Track your orders, spending, and tailoring journey all in one place.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gradient-to-br from-navy/5 to-gold/5 rounded-lg border border-navy/10">
            <p className="text-sm text-charcoal/60 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-navy">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-gold/5 to-orange/5 rounded-lg border border-gold/10">
            <p className="text-sm text-charcoal/60 mb-1">Avg. Order Value</p>
            <p className="text-2xl font-bold text-navy">₹{avgOrderValue.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple/5 to-blue/5 rounded-lg border border-purple/10">
            <p className="text-sm text-charcoal/60 mb-1">Member Since</p>
            <p className="text-lg font-bold text-navy">
              {profile?.createdAt
                ? new Date(profile.createdAt.toDate()).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })
                : "Today"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
    );
  };

  // Orders View
  const renderOrdersView = () => {
    const totalOrders = fabricOrders.length + productOrders.length;

    // Combine and sort all orders by date
    const allOrders = [
      ...fabricOrders.map(o => ({ ...o, type: 'fabric' as const })),
      ...productOrders.map(o => ({ ...o, type: 'product' as const }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (ordersLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
            <p className="text-charcoal/60">Loading your orders...</p>
          </div>
        </div>
      );
    }

    if (totalOrders === 0) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <Package className="h-20 w-20 text-charcoal/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy mb-2">No Orders Yet</h3>
            <p className="text-charcoal/70 mb-6">
              Start your tailoring journey by placing your first order!
            </p>
            <Link href="/customer/order/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Place Your First Order
          </motion.button>
        </Link>
      </div>
    </div>
      );
    }

    // Display orders
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-navy">My Orders ({totalOrders})</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                Fabric: {fabricOrders.length}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                Products: {productOrders.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {allOrders.map((order, index) => {
              const isFabricOrder = order.type === 'fabric';
              const statusColors: any = {
                pending: 'bg-yellow-100 text-yellow-700',
                confirmed: 'bg-blue-100 text-blue-700',
                in_progress: 'bg-purple-100 text-purple-700',
                processing: 'bg-purple-100 text-purple-700',
                ready_for_delivery: 'bg-green-100 text-green-700',
                shipped: 'bg-indigo-100 text-indigo-700',
                delivered: 'bg-emerald-100 text-emerald-700',
                cancelled: 'bg-red-100 text-red-700',
              };

              return (
                <motion.div
                  key={`${order.type}-${order.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isFabricOrder ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isFabricOrder ? 'Fabric Order' : 'Product Order'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <p className="font-mono text-sm font-bold text-navy mb-2">
                        {order.orderNumber}
                      </p>

                      {isFabricOrder ? (
                        <div className="text-sm text-charcoal/70">
                          <p className="font-semibold">{(order as any).service.name}</p>
                          <p>{(order as any).fabric.name} - {(order as any).fabric.color}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-charcoal/70">
                          <p className="font-semibold">
                            {(order as any).items.length} item{(order as any).items.length > 1 ? 's' : ''}
                          </p>
                          <p>{(order as any).items[0]?.product.name}
                            {(order as any).items.length > 1 && ` +${(order as any).items.length - 1} more`}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-charcoal/50 mt-2">
                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-2xl font-bold text-gold">
                        ₹{isFabricOrder
                          ? (order as any).pricing.totalCost.toLocaleString('en-IN')
                          : (order as any).pricing.total.toLocaleString('en-IN')
                        }
                      </p>
                      {(order as any).paymentMethod && (
                        <p className="text-xs text-charcoal/60">
                          {(order as any).paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Profile handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setProfileError("");
    setProfileSuccess(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);

    // Validation
    if (!profileData.displayName.trim()) {
      setProfileError("Please enter your name");
      return;
    }

    if (!profileData.phoneNumber || profileData.phoneNumber.length < 10) {
      setProfileError("Please enter a valid phone number");
      return;
    }

    if (!profileData.city.trim()) {
      setProfileError("Please enter your city");
      return;
    }

    if (!profileData.address.trim()) {
      setProfileError("Please enter your address");
      return;
    }

    setProfileLoading(true);

    try {
      await updateProfile({
        displayName: profileData.displayName,
        email: profileData.email || undefined,
        phoneNumber: profileData.phoneNumber,
        city: profileData.city,
        address: profileData.address,
        profileCompleted: true,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Failed to save profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Profile View
  const renderProfileView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-navy to-gold rounded-full flex items-center justify-center">
              <div className="text-4xl font-bold text-white">
                {profileData.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-navy mb-1">
                {profileData.displayName || "Update Your Profile"}
              </h3>
              <p className="text-charcoal/60">Manage your profile and preferences</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    disabled={!!user?.email}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="+91 1234567890"
                    maxLength={13}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    disabled={!!user?.phoneNumber}
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    placeholder="Enter your city"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  placeholder="House no., Street, Landmark"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{profileError}</p>
              </div>
            )}

            {profileSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={profileLoading}
              className="px-8 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>

            <p className="text-xs text-gray-500 mt-4">* Required fields</p>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Render appropriate view based on activeView */}
      {activeView === "dashboard" && renderDashboardView()}
      {activeView === "fabrics" && renderFabricsView()}
      {activeView === "products" && renderProductsView()}
      {activeView === "orders" && renderOrdersView()}
      {activeView === "analytics" && renderAnalyticsView()}
      {activeView === "profile" && renderProfileView()}

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
    </>
  );
}

// Wrap in Suspense to handle useSearchParams
export default function CustomerDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
          <p className="text-charcoal/60">Loading dashboard...</p>
        </div>
      </div>
    }>
      <CustomerDashboardContent />
    </Suspense>
  );
}
