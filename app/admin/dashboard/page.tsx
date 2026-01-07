"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  IndianRupee,
  Calendar,
  User,
  Phone,
  BarChart3,
  PieChart,
  Activity,
  Palette,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useOrderStore } from "@/store/useOrderStore";
import { getAllOrders, getOrderStats } from "@/services/orderService";
import { Order, OrderStatus } from "@/types/order";
import {
  getAllProductOrders,
  getProductOrderStats,
  ProductOrder,
  ProductOrderStatus,
} from "@/services/productOrderService";
import { Input } from "@/components/ui/input";
import OrderDetailModal from "@/components/OrderDetailModal";
import AddEditFabricModal from "@/components/AddEditFabricModal";
import AddEditProductModal from "@/components/AddEditProductModal";
import { Fabric, fabrics as staticFabrics } from "@/lib/fabricData";
import { Product, ProductCategory, sampleProducts } from "@/lib/productData";
import {
  getAllFabrics,
  createFabric,
  updateFabric,
  deleteFabric,
} from "@/services/fabricService";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  in_progress: {
    label: "In Progress",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  ready_for_delivery: {
    label: "Ready",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

const productOrderStatusConfig: Record<
  ProductOrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  processing: {
    label: "Processing",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "dashboard";

  const { orders, setOrders, isLoading, setLoading } = useOrderStore();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    readyForDelivery: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fabric state
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [fabricsLoading, setFabricsLoading] = useState(false);
  const [showFabricModal, setShowFabricModal] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [selectedFabricColors, setSelectedFabricColors] = useState<{
    [key: string]: number;
  }>({});

  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMigratingProducts, setIsMigratingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");

  // Product Orders state
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [productOrdersLoading, setProductOrdersLoading] = useState(false);
  const [productOrderSearchQuery, setProductOrderSearchQuery] = useState("");
  const [productOrderStatusFilter, setProductOrderStatusFilter] = useState<ProductOrderStatus | "all">("all");
  const [selectedProductOrder, setSelectedProductOrder] = useState<ProductOrder | null>(null);
  const [productOrderStats, setProductOrderStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    totalPaid: 0,
    totalPending: 0,
  });

  useEffect(() => {
    loadOrders();
    loadStats();
    loadProductOrders();
    loadProductOrderStats();
  }, []);

  useEffect(() => {
    if (activeView === "fabrics") {
      loadFabrics();
    }
    if (activeView === "products") {
      loadProducts();
    }
    if (activeView === "product-orders") {
      loadProductOrders();
      loadProductOrderStats();
    }
  }, [activeView]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const fetchedStats = await getOrderStats();
      setStats(fetchedStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadProductOrders = async () => {
    try {
      setProductOrdersLoading(true);
      const fetchedProductOrders = await getAllProductOrders();
      setProductOrders(fetchedProductOrders);
    } catch (error) {
      console.error("Error loading product orders:", error);
    } finally {
      setProductOrdersLoading(false);
    }
  };

  const loadProductOrderStats = async () => {
    try {
      const fetchedStats = await getProductOrderStats();
      setProductOrderStats(fetchedStats);
    } catch (error) {
      console.error("Error loading product order stats:", error);
    }
  };

  const loadFabrics = async () => {
    try {
      setFabricsLoading(true);
      const fetchedFabrics = await getAllFabrics();
      setFabrics(fetchedFabrics);

      // Initialize selected colors (default to first color for each fabric)
      const initialColors: { [key: string]: number } = {};
      fetchedFabrics.forEach((fabric) => {
        initialColors[fabric.id] = 0; // First color as default
      });
      setSelectedFabricColors(initialColors);
    } catch (error) {
      console.error("Error loading fabrics:", error);
    } finally {
      setFabricsLoading(false);
    }
  };

  const handleSaveFabric = async (fabricData: Omit<Fabric, "id">) => {
    try {
      if (selectedFabric) {
        await updateFabric(selectedFabric.id, fabricData);
      } else {
        await createFabric(fabricData);
      }
      await loadFabrics();
      setShowFabricModal(false);
      setSelectedFabric(null);
    } catch (error) {
      console.error("Error saving fabric:", error);
      throw error;
    }
  };

  const handleDeleteFabric = async (fabricId: string) => {
    if (!confirm("Are you sure you want to delete this fabric?")) {
      return;
    }

    try {
      await deleteFabric(fabricId);
      await loadFabrics();
    } catch (error) {
      console.error("Error deleting fabric:", error);
      alert("Failed to delete fabric. Please try again.");
    }
  };

  const handleMigrateStaticFabrics = async () => {
    if (
      !confirm(
        `This will add ${staticFabrics.length} fabrics from the static data to Firebase. Continue?`
      )
    ) {
      return;
    }

    try {
      setIsMigrating(true);
      let successCount = 0;
      let errorCount = 0;

      for (const fabric of staticFabrics) {
        try {
          // Remove the id field as Firebase will generate its own
          const { id, ...fabricData } = fabric;
          await createFabric(fabricData);
          successCount++;
        } catch (error) {
          console.error(`Error migrating fabric ${fabric.name}:`, error);
          errorCount++;
        }
      }

      alert(
        `Migration complete!\nSuccess: ${successCount}\nErrors: ${errorCount}`
      );
      await loadFabrics();
    } catch (error) {
      console.error("Error during migration:", error);
      alert("Migration failed. Please try again.");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleFabricColorSelect = (fabricId: string, colorIndex: number) => {
    setSelectedFabricColors((prev) => ({
      ...prev,
      [fabricId]: colorIndex,
    }));
  };

  // Product handlers
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, "id">) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      await loadProducts();
      setShowProductModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleMigrateSampleProducts = async () => {
    if (
      !confirm(
        `This will add ${sampleProducts.length} sample products to Firebase. Continue?`
      )
    ) {
      return;
    }

    try {
      setIsMigratingProducts(true);
      let successCount = 0;
      let errorCount = 0;

      for (const product of sampleProducts) {
        try {
          await createProduct(product);
          successCount++;
        } catch (error) {
          console.error(`Error migrating product ${product.name}:`, error);
          errorCount++;
        }
      }

      alert(
        `Migration complete!\nSuccess: ${successCount}\nErrors: ${errorCount}`
      );
      await loadProducts();
    } catch (error) {
      console.error("Error during product migration:", error);
      alert("Product migration failed. Please try again.");
    } finally {
      setIsMigratingProducts(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredProductOrders = productOrders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(productOrderSearchQuery.toLowerCase()) ||
      order.customer.phone.includes(productOrderSearchQuery) ||
      order.orderNumber.toLowerCase().includes(productOrderSearchQuery.toLowerCase());

    const matchesStatus =
      productOrderStatusFilter === "all" || order.status === productOrderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Combine both order types for recent orders display
  type CombinedOrder = (Order & { orderType: 'fabric' }) | (ProductOrder & { orderType: 'product' });

  const combinedRecentOrders: CombinedOrder[] = [
    ...orders.map(order => ({ ...order, orderType: 'fabric' as const })),
    ...productOrders.map(order => ({ ...order, orderType: 'product' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  // Combined stats from fabric and product orders
  const combinedStats = {
    total: stats.total + productOrderStats.total,
    pending: stats.pending + productOrderStats.pending,
    inProgress: stats.inProgress + productOrderStats.processing,
    delivered: stats.delivered + productOrderStats.delivered,
    totalRevenue: stats.totalRevenue + productOrderStats.totalRevenue,
  };

  const statCards = [
    {
      title: "Total Orders",
      value: combinedStats.total,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending",
      value: combinedStats.pending,
      icon: Clock,
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      title: "In Progress",
      value: combinedStats.inProgress,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Delivered",
      value: combinedStats.delivered,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Dashboard View */}
      {activeView === "dashboard" && (
        <div className="space-y-6 md:space-y-8">
          {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal/60 mb-1">{stat.title}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-navy">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-gray-100 rounded-xl md:rounded-2xl shadow-lg p-5 md:p-6 lg:p-8 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-charcoal/70 mb-2 text-sm md:text-base lg:text-lg">Total Revenue</p>
            <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2">
              <IndianRupee className="h-4 w-4 md:h-4 md:w-4 lg:h-8 lg:w-8 text-navy" />
              <p className="text-lg md:text-xl lg:text-4xl font-bold text-navy">
                {combinedStats.totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <p className="text-xs text-charcoal/60 mt-2">
              Fabric: ₹{stats.totalRevenue.toLocaleString("en-IN")} • Products: ₹{productOrderStats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <TrendingUp className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-charcoal/20" />
        </div>
      </motion.div>

      {/* Recent Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-3 md:p-4 lg:p-6 border-b border-gray-100">
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-navy">
            Recent Orders
          </h3>
        </div>

        {isLoading || productOrdersLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-charcoal/60 mt-4">Loading orders...</p>
          </div>
        ) : combinedRecentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-charcoal/20 mx-auto mb-4" />
            <p className="text-charcoal/60">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Order #
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Type
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Customer
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Details
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Amount
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Date
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Status
                  </th>
                  <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {combinedRecentOrders.map((order, index) => {
                  const isFabricOrder = order.orderType === 'fabric';
                  const amount = isFabricOrder
                    ? (order as Order).pricing.totalCost
                    : (order as ProductOrder).pricing.total;

                  // Get status configuration based on order type
                  let statusInfo;
                  if (isFabricOrder) {
                    const fabricOrder = order as Order;
                    statusInfo = statusConfig[fabricOrder.status] || {
                      label: fabricOrder.status,
                      color: 'text-gray-600',
                      bgColor: 'bg-gray-100'
                    };
                  } else {
                    const productOrder = order as ProductOrder;
                    statusInfo = productOrderStatusConfig[productOrder.status] || {
                      label: productOrder.status,
                      color: 'text-gray-600',
                      bgColor: 'bg-gray-100'
                    };
                  }

                  return (
                    <motion.tr
                      key={`${order.orderType}-${order.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <p className="font-mono text-sm font-semibold text-navy">
                          {order.orderNumber}
                        </p>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          isFabricOrder ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {isFabricOrder ? 'Fabric' : 'Product'}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <div>
                          <p className="font-medium text-charcoal">
                            {order.customer.name}
                          </p>
                          <p className="text-sm text-charcoal/60 flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {order.customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        {isFabricOrder ? (
                          <>
                            <p className="text-sm text-charcoal">
                              {(order as Order).service.name}
                            </p>
                            <p className="text-xs text-charcoal/60 mt-1">
                              {(order as Order).fabric.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-charcoal">
                              {(order as ProductOrder).items.length} item{(order as ProductOrder).items.length > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-charcoal/60 mt-1">
                              {(order as ProductOrder).items[0]?.product.name}
                              {(order as ProductOrder).items.length > 1 && ` +${(order as ProductOrder).items.length - 1}`}
                            </p>
                          </>
                        )}
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <p className="font-semibold text-gold flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {amount.toLocaleString("en-IN")}
                        </p>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <p className="text-sm text-charcoal flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-charcoal/60" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (isFabricOrder) {
                              setSelectedOrder(order as Order);
                            } else {
                              setSelectedProductOrder(order as ProductOrder);
                            }
                          }}
                          className="p-2 bg-navy hover:bg-gold rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-5 w-5 text-white" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* View All Orders Buttons */}
        {(orders.length + productOrders.length > 10) && (
          <div className="p-4 md:p-6 border-t border-gray-100 flex gap-3">
            <Link href="/admin/dashboard?view=fabric-orders" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 md:py-4 bg-purple-600 text-white rounded-lg md:rounded-xl font-semibold hover:bg-purple-700 transition-all cursor-pointer text-sm md:text-base"
              >
                Fabric Orders ({orders.length})
              </motion.button>
            </Link>
            <Link href="/admin/dashboard?view=product-orders" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 md:py-4 bg-blue-600 text-white rounded-lg md:rounded-xl font-semibold hover:bg-blue-700 transition-all cursor-pointer text-sm md:text-base"
              >
                Product Orders ({productOrders.length})
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>

        </div>
      )}

      {/* Fabric Stitching Orders View */}
      {activeView === "fabric-orders" && (
        <div className="space-y-6 md:space-y-8">
          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40" />
                <Input
                  type="text"
                  placeholder="Search by order number, customer name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 md:py-5 lg:py-6 text-sm md:text-base rounded-xl border-2 border-gray-200 focus:border-gold"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-charcoal/60" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as OrderStatus | "all")
                  }
                  className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 border-gray-200 focus:border-gold focus:outline-none bg-white text-charcoal font-medium cursor-pointer"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="ready_for_delivery">Ready for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-3 md:p-4 lg:p-6 border-b border-gray-100">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-navy">
                Fabric Stitching Orders ({filteredOrders.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="text-charcoal/60 mt-4">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-16 w-16 text-charcoal/20 mx-auto mb-4" />
                <p className="text-charcoal/60">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Order #
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Customer
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Service
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Amount
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Payment
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Date
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Status
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="font-mono text-sm font-semibold text-navy">
                            {order.orderNumber}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <div>
                            <p className="font-medium text-charcoal">
                              {order.customer.name}
                            </p>
                            <p className="text-sm text-charcoal/60 flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {order.customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="text-sm text-charcoal">
                            {order.service.name}
                          </p>
                          <p className="text-xs text-charcoal/60 mt-1">
                            {order.fabric.name}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="font-semibold text-gold flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {order.pricing.totalCost.toLocaleString("en-IN")}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <div>
                            <p className="text-xs font-semibold text-charcoal uppercase">
                              {(order as any).paymentMethod === 'cod' ? 'Cash on Delivery' :
                               (order as any).paymentMethod === 'upi' ? 'UPI' :
                               'COD'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="text-sm text-charcoal flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-charcoal/60" />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              statusConfig[order.status].bgColor
                            } ${statusConfig[order.status].color}`}
                          >
                            {statusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-navy hover:bg-gold rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="h-5 w-5 text-white" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Product Orders View */}
      {activeView === "product-orders" && (
        <div className="space-y-6 md:space-y-8">
          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40" />
                <Input
                  type="text"
                  placeholder="Search by order number, customer name, or phone..."
                  value={productOrderSearchQuery}
                  onChange={(e) => setProductOrderSearchQuery(e.target.value)}
                  className="pl-12 py-4 md:py-5 lg:py-6 text-sm md:text-base rounded-xl border-2 border-gray-200 focus:border-gold"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-charcoal/60" />
                <select
                  value={productOrderStatusFilter}
                  onChange={(e) =>
                    setProductOrderStatusFilter(e.target.value as ProductOrderStatus | "all")
                  }
                  className="px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 border-gray-200 focus:border-gold focus:outline-none bg-white text-charcoal font-medium cursor-pointer"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Product Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-3 md:p-4 lg:p-6 border-b border-gray-100">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-navy">
                Product Orders ({filteredProductOrders.length})
              </h3>
            </div>

            {productOrdersLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="text-charcoal/60 mt-4">Loading product orders...</p>
              </div>
            ) : filteredProductOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-charcoal/20 mx-auto mb-4" />
                <p className="text-charcoal/60">No product orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Order #
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Customer
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Items
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Amount
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Payment
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Date
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Status
                      </th>
                      <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-charcoal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProductOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="font-mono text-sm font-semibold text-navy">
                            {order.orderNumber}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <div>
                            <p className="font-medium text-charcoal">
                              {order.customer.name}
                            </p>
                            <p className="text-sm text-charcoal/60 flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {order.customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="text-sm text-charcoal">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-charcoal/60 mt-1">
                            {order.items[0]?.product.name}
                            {order.items.length > 1 && ` +${order.items.length - 1} more`}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="font-semibold text-gold flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {order.pricing.total.toLocaleString("en-IN")}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <div>
                            <p className="text-xs font-semibold text-charcoal uppercase">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}
                            </p>
                            <p className={`text-xs mt-1 ${
                              order.paymentStatus === 'paid' ? 'text-green-600' :
                              order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {order.paymentStatus === 'paid' ? 'Paid' :
                               order.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <p className="text-sm text-charcoal flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-charcoal/60" />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              productOrderStatusConfig[order.status].bgColor
                            } ${productOrderStatusConfig[order.status].color}`}
                          >
                            {productOrderStatusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedProductOrder(order)}
                            className="p-2 bg-navy hover:bg-gold rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="h-5 w-5 text-white" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Analytics View */}
      {activeView === "analytics" && (
        <div className="space-y-6 md:space-y-8">
          {/* Analytics Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-navy" />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy">
              Business Analytics
            </h2>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 text-white"
            >
              <Package className="h-6 w-6 md:h-8 md:w-8 mb-2 opacity-80" />
              <p className="text-xs md:text-sm opacity-90 mb-1">Total Orders</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 text-white"
            >
              <IndianRupee className="h-6 w-6 md:h-8 md:w-8 mb-2 opacity-80" />
              <p className="text-xs md:text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold">
                ₹{(stats.totalRevenue / 1000).toFixed(1)}k
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 text-white"
            >
              <Clock className="h-6 w-6 md:h-8 md:w-8 mb-2 opacity-80" />
              <p className="text-xs md:text-sm opacity-90 mb-1">In Progress</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold">{stats.inProgress}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 text-white"
            >
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 mb-2 opacity-80" />
              <p className="text-xs md:text-sm opacity-90 mb-1">Delivered</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold">{stats.delivered}</p>
            </motion.div>
          </div>

          {/* Charts Row 1: Orders Status & Service Distribution */}
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            {/* Orders Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-navy" />
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-navy">
                  Orders by Status
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={[
                      { name: "Pending", value: stats.pending, color: "#EAB308" },
                      { name: "Confirmed", value: stats.confirmed, color: "#3B82F6" },
                      { name: "In Progress", value: stats.inProgress, color: "#A855F7" },
                      { name: "Ready", value: stats.readyForDelivery, color: "#22C55E" },
                      { name: "Delivered", value: stats.delivered, color: "#10B981" },
                      { name: "Cancelled", value: stats.cancelled, color: "#EF4444" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
                  >
                    {[
                      { name: "Pending", value: stats.pending, color: "#EAB308" },
                      { name: "Confirmed", value: stats.confirmed, color: "#3B82F6" },
                      { name: "In Progress", value: stats.inProgress, color: "#A855F7" },
                      { name: "Ready", value: stats.readyForDelivery, color: "#22C55E" },
                      { name: "Delivered", value: stats.delivered, color: "#10B981" },
                      { name: "Cancelled", value: stats.cancelled, color: "#EF4444" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </motion.div>

            {/* Service Distribution Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-navy" />
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-navy">
                  Popular Services
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={(() => {
                    const serviceCounts: { [key: string]: number } = {};
                    orders.forEach((order) => {
                      const serviceName = order.service.name;
                      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
                    });
                    return Object.entries(serviceCounts).map(([name, count]) => ({
                      name,
                      orders: count,
                    }));
                  })()}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Revenue Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-navy" />
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-navy">
                Revenue Trend
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={(() => {
                  const revenueByDate: { [key: string]: number } = {};
                  orders.forEach((order) => {
                    if (order.status !== "cancelled") {
                      const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      });
                      revenueByDate[date] = (revenueByDate[date] || 0) + order.pricing.totalCost;
                    }
                  });
                  return Object.entries(revenueByDate)
                    .map(([date, revenue]) => ({ date, revenue }))
                    .slice(-10);
                })()}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D97706"
                  strokeWidth={3}
                  dot={{ fill: "#D97706", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Statistics Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-3 gap-4 md:gap-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-charcoal/60">Average Order Value</h4>
                <IndianRupee className="h-5 w-5 text-gold" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-navy">
                ₹{stats.total > 0 ? Math.round(stats.totalRevenue / stats.total).toLocaleString("en-IN") : 0}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-charcoal/60">Completion Rate</h4>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-charcoal/60">Pending Orders</h4>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                {stats.pending + stats.confirmed}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Fabric Collection View */}
      {activeView === "fabrics" && (
        <div className="space-y-6 md:space-y-8">
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Palette className="h-6 w-6 md:h-8 md:w-8 text-navy" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy">
                Fabric Collection ({fabrics.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Migration Button - Show when no fabrics exist */}
              {fabrics.length === 0 && !fabricsLoading && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMigrateStaticFabrics}
                  disabled={isMigrating}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-gold text-white rounded-lg md:rounded-xl font-semibold hover:from-orange-600 hover:to-gold transition-all cursor-pointer text-sm md:text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMigrating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 md:h-5 md:w-5" />
                      Import {staticFabrics.length} Fabrics
                    </>
                  )}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedFabric(null);
                  setShowFabricModal(true);
                }}
                className="px-4 md:px-6 py-2 md:py-3 bg-navy text-white rounded-lg md:rounded-xl font-semibold hover:bg-gold transition-all cursor-pointer text-sm md:text-base flex items-center gap-2"
              >
                <Plus className="h-4 w-4 md:h-5 md:w-5" />
                Add New Fabric
              </motion.button>
            </div>
          </div>

          {/* Fabrics Grid */}
          {fabricsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-charcoal/60 mt-4">Loading fabrics...</p>
            </div>
          ) : fabrics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg p-8 border border-gray-100 text-center"
            >
              <Palette className="h-16 w-16 text-charcoal/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">
                No Fabrics Yet
              </h3>
              <p className="text-charcoal/70 mb-6">
                Start building your fabric collection by importing existing fabrics or adding a new one.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleMigrateStaticFabrics}
                  disabled={isMigrating}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-gold text-white rounded-lg font-semibold hover:from-orange-600 hover:to-gold transition-all inline-flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMigrating ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Importing {staticFabrics.length} fabrics...
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5" />
                      Import {staticFabrics.length} Static Fabrics
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFabric(null);
                    setShowFabricModal(true);
                  }}
                  className="px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-gold transition-all inline-flex items-center gap-2 justify-center"
                >
                  <Plus className="h-5 w-5" />
                  Add New Fabric
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {fabrics.map((fabric, index) => (
                <motion.div
                  key={fabric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group"
                >
                  {/* Fabric Preview */}
                  <div
                    className="h-40 relative"
                    style={{
                      backgroundColor:
                        fabric.colors[selectedFabricColors[fabric.id] || 0]
                          ?.colorCode || "#f3f4f6",
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
                    <div className="absolute top-2 right-2 flex gap-2">
                      {!fabric.available && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fabric Info */}
                  <div className="p-4">
                    {/* Color Variants */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {fabric.colors.slice(0, 5).map((color, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleFabricColorSelect(fabric.id, idx)}
                          className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                            selectedFabricColors[fabric.id] === idx
                              ? "border-navy ring-2 ring-navy"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color.colorCode }}
                          title={color.name}
                        />
                      ))}
                      {fabric.colors.length > 5 && (
                        <span className="text-xs text-charcoal/60">
                          +{fabric.colors.length - 5}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-navy mb-1 text-lg">
                      {fabric.name}
                    </h3>
                    <p className="text-sm text-charcoal/60 mb-2">
                      {fabric.category}
                    </p>
                    <p className="text-sm text-charcoal/70 mb-3 line-clamp-2">
                      {fabric.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gold font-bold text-xl">
                        ₹{fabric.pricePerMeter}
                      </span>
                      <span className="text-xs text-charcoal/60">/meter</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedFabric(fabric);
                          setShowFabricModal(true);
                        }}
                        className="flex-1 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-gold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFabric(fabric.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products View */}
      {activeView === "products" && (
        <div className="space-y-6 md:space-y-8">
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-navy" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy">
                Products ({products.length})
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Migration Button */}
              {products.length === 0 && !productsLoading && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMigrateSampleProducts}
                  disabled={isMigratingProducts}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-gold text-white rounded-lg md:rounded-xl font-semibold hover:from-orange-600 hover:to-gold transition-all cursor-pointer text-sm md:text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMigratingProducts ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 md:h-5 md:w-5" />
                      Import {sampleProducts.length} Products
                    </>
                  )}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedProduct(null);
                  setShowProductModal(true);
                }}
                className="px-4 md:px-6 py-2 md:py-3 bg-navy text-white rounded-lg md:rounded-xl font-semibold hover:bg-gold transition-all cursor-pointer text-sm md:text-base flex items-center gap-2"
              >
                <Plus className="h-4 w-4 md:h-5 md:w-5" />
                Add New Product
              </motion.button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {(["All", "Janamaz", "Topi", "Atar", "Leather Shocks"] as const).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-navy text-white"
                      : "bg-white text-charcoal hover:bg-gray-100"
                  }`}
                >
                  {category} (
                  {category === "All"
                    ? products.length
                    : products.filter((p) => p.category === category).length}
                  )
                </button>
              )
            )}
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-charcoal/60 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg p-8 border border-gray-100 text-center"
            >
              <ShoppingBag className="h-16 w-16 text-charcoal/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy mb-2">
                No Products Yet
              </h3>
              <p className="text-charcoal/70 mb-6">
                Start building your product catalog by importing sample products
                or adding a new one.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleMigrateSampleProducts}
                  disabled={isMigratingProducts}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-gold text-white rounded-lg font-semibold hover:from-orange-600 hover:to-gold transition-all inline-flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMigratingProducts ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Importing {sampleProducts.length} products...
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5" />
                      Import {sampleProducts.length} Sample Products
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setShowProductModal(true);
                  }}
                  className="px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-gold transition-all inline-flex items-center gap-2 justify-center"
                >
                  <Plus className="h-5 w-5" />
                  Add New Product
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {products
                .filter(
                  (product) =>
                    selectedCategory === "All" ||
                    product.category === selectedCategory
                )
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group"
                  >
                    {/* Product Image */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {!product.available && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                            Unavailable
                          </span>
                        )}
                        {product.salePrice && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                            Sale
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 bg-navy/80 text-white text-xs font-semibold rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Color Variants */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-3">
                          {product.colors.slice(0, 5).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color.colorCode }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-xs text-charcoal/60">
                              +{product.colors.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="font-bold text-navy mb-1 text-lg">
                        {product.name}
                      </h3>
                      <p className="text-sm text-charcoal/70 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {product.salePrice ? (
                          <>
                            <span className="text-gold font-bold text-xl">
                              ₹{product.salePrice}
                            </span>
                            <span className="text-charcoal/60 text-sm line-through">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-gold font-bold text-xl">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="mb-3">
                        <span className="text-xs text-charcoal/60">
                          Stock: {product.stock} {product.quantityMl && `(${product.quantityMl}ml)`}
                        </span>
                      </div>

                      {/* Sizes (for shoes) */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-charcoal/60 mb-1">Sizes:</p>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-charcoal text-xs rounded"
                              >
                                {size.size} ({size.stock})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductModal(true);
                          }}
                          className="flex-1 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-gold transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={() => {
              loadOrders();
              loadStats();
            }}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Fabric Modal */}
      <AnimatePresence>
        {showFabricModal && (
          <AddEditFabricModal
            fabric={selectedFabric}
            onClose={() => {
              setShowFabricModal(false);
              setSelectedFabric(null);
            }}
            onSave={handleSaveFabric}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <AddEditProductModal
            product={selectedProduct}
            onClose={() => {
              setShowProductModal(false);
              setSelectedProduct(null);
            }}
            onSave={handleSaveProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
