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
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Order, OrderStatus, OrderFormData, FabricOnlyOrderData } from "@/types/order";
import { getFabricById } from "@/services/fabricService";

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
  stitching: { name: "Stitching Only", price: 500 },
};

// Kurta style options mapping
const kurtaStyleOptionsMap: { [key: string]: string } = {
  "kurta-without-pocket": "Without Pocket",
  "kurta-with-pocket": "With Pocket",
};

// Pyjama style options mapping
const pyjamaStyleOptionsMap: { [key: string]: string } = {
  "pyjama-left-zipper": "Left Pocket with Zipper",
  "pyjama-right-zipper": "Right Pocket with Zipper",
  "pyjama-center-zipper": "Center Zipper",
  "pyjama-no-pockets": "No Pockets",
};

// Upload button image to Firebase Storage
const uploadButtonImage = async (
  base64Image: string,
  orderNumber: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `button-images/${orderNumber}.jpg`);
    await uploadString(storageRef, base64Image, "data_url");
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading button image:", error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (
  formData: OrderFormData
): Promise<{ orderId: string; orderNumber: string }> => {
  try {
    const service = serviceOptionsMap[formData.service];

    if (!service) {
      throw new Error("Invalid service selection");
    }

    // For stitching service, fabric is optional (customer brings own fabric)
    const isStitchingOnly = formData.service === "stitching";
    let fabric = null;
    let selectedColor = null;
    let fabricCost = 0;

    if (!isStitchingOnly) {
      fabric = await getFabricById(formData.fabric);
      if (!fabric) {
        throw new Error("Invalid fabric selection");
      }
      selectedColor = fabric.colors[formData.selectedFabricColorIndex];
      fabricCost = fabric.pricePerMeter * formData.fabricQuantity;
    }

    const tailoringCost = service.price;
    const totalCost = fabricCost + tailoringCost;

    const orderNumber = generateOrderNumber();

    // Build customization object
    const customization: any = {};
    if (formData.kurtaStyle) {
      customization.kurtaStyle = formData.kurtaStyle;
      customization.kurtaStyleName = kurtaStyleOptionsMap[formData.kurtaStyle] || formData.kurtaStyle;
    }
    if (formData.pyjamaStyle) {
      customization.pyjamaStyle = formData.pyjamaStyle;
      customization.pyjamaStyleName = pyjamaStyleOptionsMap[formData.pyjamaStyle] || formData.pyjamaStyle;
    }
    // Upload button image to Firebase Storage if provided
    if (formData.buttonImage) {
      try {
        const buttonImageUrl = await uploadButtonImage(formData.buttonImage, orderNumber);
        customization.hasButtonImage = true;
        customization.buttonImageUrl = buttonImageUrl;
        customization.buttonImageNote = "Custom button image uploaded by customer";
      } catch (error) {
        console.error("Failed to upload button image:", error);
        customization.hasButtonImage = true;
        customization.buttonImageNote = "Button image upload failed";
      }
    }

    // Build measurements object
    const cleanedMeasurements: any = {};
    const kurtaMeasurements: any = {};
    if (formData.measurements.kurta.chest) kurtaMeasurements.chest = formData.measurements.kurta.chest;
    if (formData.measurements.kurta.waist) kurtaMeasurements.waist = formData.measurements.kurta.waist;
    if (formData.measurements.kurta.shoulder) kurtaMeasurements.shoulder = formData.measurements.kurta.shoulder;
    if (formData.measurements.kurta.length) kurtaMeasurements.length = formData.measurements.kurta.length;
    if (formData.measurements.kurta.sleeve) kurtaMeasurements.sleeve = formData.measurements.kurta.sleeve;

    const pyjamaMeasurements: any = {};
    if (formData.measurements.pyjama.waist) pyjamaMeasurements.waist = formData.measurements.pyjama.waist;
    if (formData.measurements.pyjama.length) pyjamaMeasurements.length = formData.measurements.pyjama.length;
    if (formData.measurements.pyjama.thigh) pyjamaMeasurements.thigh = formData.measurements.pyjama.thigh;
    if (formData.measurements.pyjama.bottom) pyjamaMeasurements.bottom = formData.measurements.pyjama.bottom;

    if (Object.keys(kurtaMeasurements).length > 0) {
      cleanedMeasurements.kurta = kurtaMeasurements;
    }
    if (Object.keys(pyjamaMeasurements).length > 0) {
      cleanedMeasurements.pyjama = pyjamaMeasurements;
    }

    const orderData: any = {
      orderNumber,
      timestamp: Timestamp.now(),
      customer: {
        name: formData.address.name,
        phone: formData.address.phone,
        uid: formData.customerUid, // Save customer UID for reliable tracking
      },
      deliveryAddress: formData.address,
      service: {
        id: formData.service,
        name: service.name,
        price: service.price,
      },
      pricing: {
        fabricCost,
        tailoringCost,
        totalCost,
      },
      paymentMethod: formData.paymentMethod || "cod", // Save payment method (default COD)
      status: "pending" as OrderStatus,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Only add customization if it has data
    if (Object.keys(customization).length > 0) {
      orderData.customization = customization;
    }

    // Only add measurements if it has data
    if (Object.keys(cleanedMeasurements).length > 0) {
      orderData.measurements = cleanedMeasurements;
    }

    // Only add fabric data if not stitching only
    if (!isStitchingOnly && fabric && selectedColor) {
      orderData.fabric = {
        id: fabric.id,
        name: fabric.name,
        color: selectedColor.name,
        colorGradient: selectedColor.gradient,
        pricePerMeter: fabric.pricePerMeter,
        quantity: formData.fabricQuantity,
        subtotal: fabricCost,
      };
    } else {
      // For stitching only, use placeholder fabric data
      orderData.fabric = {
        id: "customer-fabric",
        name: "Customer's Own Fabric",
        color: "N/A",
        colorGradient: "from-gray-100 to-gray-200",
        pricePerMeter: 0,
        quantity: 0,
        subtotal: 0,
      };
    }

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
    const fabric = await getFabricById(formData.fabric);

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
        uid: formData.customerUid, // Save customer UID for reliable tracking
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
      paymentMethod: formData.paymentMethod || "cod", // Save payment method (default COD)
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

// Get orders by customer UID (most reliable method)
export const getOrdersByCustomerUid = async (
  customerUid: string
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("customer.uid", "==", customerUid),
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
    console.error("Error fetching orders by customer UID:", error);
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
