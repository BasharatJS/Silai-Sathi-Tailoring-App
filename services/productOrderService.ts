import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/productData";

export type PaymentMethod = "cod" | "upi";
export type ProductOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ProductOrderItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColorIndex?: number;
  priceAtPurchase: number; // Store price at time of purchase
  subtotal: number;
}

export interface ProductOrderCustomer {
  name: string;
  email?: string;
  phone: string;
  userId?: string; // Firebase Auth UID
}

export interface ProductOrderAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ProductOrder {
  id?: string;
  orderNumber: string;
  timestamp: Date;
  customer: ProductOrderCustomer;
  deliveryAddress: ProductOrderAddress;
  items: ProductOrderItem[];
  pricing: {
    subtotal: number;
    deliveryCharge: number;
    total: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed";
  status: ProductOrderStatus;
  createdAt: Date;
  updatedAt: Date;
  orderType: "product"; // To differentiate from fabric orders
}

// Generate order number (format: PROD-YYYYMMDD-XXXX)
const generateProductOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PROD-${year}${month}${day}-${random}`;
};

// Create a new product order
export const createProductOrder = async (
  customer: ProductOrderCustomer,
  deliveryAddress: ProductOrderAddress,
  items: ProductOrderItem[],
  paymentMethod: PaymentMethod
): Promise<{ orderId: string; orderNumber: string }> => {
  try {
    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    // Calculate pricing
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    const orderNumber = generateProductOrderNumber();

    // Clean customer data to remove undefined values
    const cleanCustomer: any = {
      name: customer.name,
      phone: customer.phone,
    };

    if (customer.email) {
      cleanCustomer.email = customer.email;
    }

    if (customer.userId) {
      cleanCustomer.userId = customer.userId;
    }

    const orderData = {
      orderNumber,
      timestamp: Timestamp.now(),
      orderType: "product",
      customer: cleanCustomer,
      deliveryAddress,
      items: items.map((item) => {
        const orderItem: any = {
          product: {
            id: item.product.id,
            name: item.product.name,
            category: item.product.category,
            image: item.product.image,
            description: item.product.description,
          },
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          subtotal: item.subtotal,
        };

        // Only include optional fields if they have values
        if (item.selectedSize !== undefined && item.selectedSize !== null) {
          orderItem.selectedSize = item.selectedSize;
        }

        if (item.selectedColorIndex !== undefined && item.selectedColorIndex !== null) {
          orderItem.selectedColorIndex = item.selectedColorIndex;

          // Add color name if available
          if (item.product.colors?.[item.selectedColorIndex]) {
            orderItem.selectedColor = item.product.colors[item.selectedColorIndex].name;
          }
        }

        return orderItem;
      }),
      pricing: {
        subtotal,
        deliveryCharge,
        total,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      status: "pending" as ProductOrderStatus,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "productOrders"), orderData);
    return {
      orderId: docRef.id,
      orderNumber,
    };
  } catch (error) {
    console.error("Error creating product order:", error);
    throw error;
  }
};

// Get all product orders
export const getAllProductOrders = async (): Promise<ProductOrder[]> => {
  try {
    const q = query(
      collection(db, "productOrders"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const orders: ProductOrder[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ProductOrder);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching product orders:", error);
    throw error;
  }
};

// Get product orders by customer phone
export const getProductOrdersByCustomer = async (
  phone: string
): Promise<ProductOrder[]> => {
  try {
    const q = query(
      collection(db, "productOrders"),
      where("customer.phone", "==", phone),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const orders: ProductOrder[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ProductOrder);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching customer product orders:", error);
    throw error;
  }
};

// Get product orders by status
export const getProductOrdersByStatus = async (
  status: ProductOrderStatus
): Promise<ProductOrder[]> => {
  try {
    const q = query(
      collection(db, "productOrders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const orders: ProductOrder[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ProductOrder);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching product orders by status:", error);
    throw error;
  }
};

// Get single product order by ID
export const getProductOrderById = async (
  orderId: string
): Promise<ProductOrder | null> => {
  try {
    const docRef = doc(db, "productOrders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ProductOrder;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product order:", error);
    throw error;
  }
};

// Update product order status
export const updateProductOrderStatus = async (
  orderId: string,
  status: ProductOrderStatus
): Promise<void> => {
  try {
    const orderRef = doc(db, "productOrders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product order status:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed"
): Promise<void> => {
  try {
    const orderRef = doc(db, "productOrders", orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Get product order statistics
export const getProductOrderStats = async () => {
  try {
    const allOrders = await getAllProductOrders();

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      confirmed: allOrders.filter((o) => o.status === "confirmed").length,
      processing: allOrders.filter((o) => o.status === "processing").length,
      shipped: allOrders.filter((o) => o.status === "shipped").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      totalRevenue: allOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.pricing.total, 0),
      totalPaid: allOrders.filter((o) => o.paymentStatus === "paid").length,
      totalPending: allOrders.filter((o) => o.paymentStatus === "pending").length,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching product order stats:", error);
    throw error;
  }
};
