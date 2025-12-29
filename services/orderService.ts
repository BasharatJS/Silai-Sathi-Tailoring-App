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
import { Order, OrderStatus, OrderFormData, FabricOnlyOrderData } from "@/types/order";
import { getFabricById } from "@/lib/fabricData";

// Generate order number (format: ORD-YYYYMMDD-XXXX)
const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}${month}${day}-${random}`;
};

// Service options mapping
const serviceOptionsMap: { [key: string]: { name: string; price: number } } = {
  kurta: { name: "Kurta Tailoring", price: 650 },
  pyjama: { name: "Pyjama Tailoring", price: 450 },
  complete: { name: "Complete Set", price: 999 },
};

// Style options mapping
const styleOptionsMap: { [key: string]: string } = {
  classic: "Classic",
  designer: "Designer",
  pathani: "Pathani",
  bandhgala: "Bandhgala",
  angrakha: "Angrakha",
  "straight-cut": "Straight Cut",
};

// Button type options mapping
const buttonTypeOptionsMap: { [key: string]: string } = {
  "no-button": "No Button",
  "front-button": "Front Button",
  "side-button": "Side Button",
  "chinese-collar": "Chinese Collar",
};

// Create a new order
export const createOrder = async (
  formData: OrderFormData
): Promise<{ orderId: string; orderNumber: string }> => {
  try {
    const fabric = getFabricById(formData.fabric);
    const service = serviceOptionsMap[formData.service];

    if (!fabric || !service) {
      throw new Error("Invalid fabric or service selection");
    }

    const selectedColor = fabric.colors[formData.selectedFabricColorIndex];
    const fabricCost = fabric.pricePerMeter * formData.fabricQuantity;
    const tailoringCost = service.price;
    const totalCost = fabricCost + tailoringCost;

    const orderNumber = generateOrderNumber();

    const orderData = {
      orderNumber,
      timestamp: Timestamp.now(),
      customer: {
        name: formData.address.name,
        phone: formData.address.phone,
      },
      deliveryAddress: formData.address,
      service: {
        id: formData.service,
        name: service.name,
        price: service.price,
      },
      fabric: {
        id: fabric.id,
        name: fabric.name,
        color: selectedColor.name,
        colorGradient: selectedColor.gradient,
        pricePerMeter: fabric.pricePerMeter,
        quantity: formData.fabricQuantity,
        subtotal: fabricCost,
      },
      customization: {
        style: formData.style,
        styleName: styleOptionsMap[formData.style] || formData.style,
        buttonType: formData.buttonType,
        buttonTypeName:
          buttonTypeOptionsMap[formData.buttonType] || formData.buttonType,
      },
      measurements: formData.measurements,
      pricing: {
        fabricCost,
        tailoringCost,
        totalCost,
      },
      status: "pending" as OrderStatus,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    return {
      orderId: docRef.id,
      orderNumber,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Create a fabric-only order (no tailoring service)
export const createFabricOnlyOrder = async (
  formData: FabricOnlyOrderData
): Promise<{ orderId: string; orderNumber: string }> => {
  try {
    const fabric = getFabricById(formData.fabric);

    if (!fabric) {
      throw new Error("Invalid fabric selection");
    }

    const selectedColor = fabric.colors[formData.selectedFabricColorIndex];
    const fabricCost = fabric.pricePerMeter * formData.fabricQuantity;
    const orderNumber = generateOrderNumber();

    const orderData = {
      orderNumber,
      timestamp: Timestamp.now(),
      orderType: "fabric-only", // Identifier for fabric-only orders
      customer: {
        name: formData.address.name,
        phone: formData.address.phone,
      },
      deliveryAddress: formData.address,
      service: {
        id: "fabric-only",
        name: "Fabric Only",
        price: 0,
      },
      fabric: {
        id: fabric.id,
        name: fabric.name,
        color: selectedColor.name,
        colorGradient: selectedColor.gradient,
        pricePerMeter: fabric.pricePerMeter,
        quantity: formData.fabricQuantity,
        subtotal: fabricCost,
      },
      customization: {
        style: "N/A",
        styleName: "N/A",
        buttonType: "N/A",
        buttonTypeName: "N/A",
      },
      measurements: {
        chest: "",
        waist: "",
        shoulder: "",
        length: "",
        sleeve: "",
      },
      pricing: {
        fabricCost,
        tailoringCost: 0,
        totalCost: fabricCost,
      },
      status: "pending" as OrderStatus,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    return {
      orderId: docRef.id,
      orderNumber,
    };
  } catch (error) {
    console.error("Error creating fabric-only order:", error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatus = async (
  status: OrderStatus
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};

// Get single order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order;
    }

    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const allOrders = await getAllOrders();

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      confirmed: allOrders.filter((o) => o.status === "confirmed").length,
      inProgress: allOrders.filter((o) => o.status === "in_progress").length,
      readyForDelivery: allOrders.filter((o) => o.status === "ready_for_delivery").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      totalRevenue: allOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.pricing.totalCost, 0),
    };

    return stats;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};
