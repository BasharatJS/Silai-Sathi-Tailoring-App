export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "ready_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderMeasurements {
  chest: string;
  waist: string;
  shoulder: string;
  length: string;
  sleeve: string;
}

export interface KurtaMeasurements {
  chest: string;
  waist: string;
  shoulder: string;
  length: string;
  sleeve: string;
}

export interface PyjamaMeasurements {
  waist: string;
  length: string;
  thigh: string;
  bottom: string;
}

export interface CombinedMeasurements {
  kurta: KurtaMeasurements;
  pyjama: PyjamaMeasurements;
}

export interface OrderAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderService {
  id: string;
  name: string;
  price: number;
}

export interface OrderFabric {
  id: string;
  name: string;
  color: string;
  colorGradient: string;
  pricePerMeter: number;
  quantity: number;
  subtotal: number;
}

export interface OrderCustomization {
  style?: string;
  styleName?: string;
  buttonType?: string;
  buttonTypeName?: string;
  kurtaStyle?: string;
  kurtaStyleName?: string;
  pyjamaStyle?: string;
  pyjamaStyleName?: string;
  hasButtonImage?: boolean;
  buttonImageNote?: string;
  buttonImageUrl?: string;
}

export interface OrderPricing {
  fabricCost: number;
  tailoringCost: number;
  totalCost: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  timestamp: Date;
  customer: {
    name: string;
    phone: string;
    uid?: string; // Customer Firebase UID for reliable order tracking
  };
  deliveryAddress: OrderAddress;
  service: OrderService;
  fabric: OrderFabric;
  customization?: OrderCustomization;
  measurements?: OrderMeasurements | CombinedMeasurements | any;
  pricing: OrderPricing;
  paymentMethod?: string; // Payment method (COD/UPI)
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFormData {
  service: string;
  fabric: string;
  fabricQuantity: number;
  selectedFabricColorIndex: number;
  kurtaStyle: string;
  pyjamaStyle: string;
  buttonImage: string;
  measurements: CombinedMeasurements;
  address: OrderAddress;
  customerUid?: string; // Customer Firebase UID
  paymentMethod?: "cod" | "upi"; // Payment method
}

export interface FabricOnlyOrderData {
  fabric: string;
  fabricQuantity: number;
  selectedFabricColorIndex: number;
  address: OrderAddress;
  customerUid?: string; // Customer Firebase UID
  paymentMethod?: "cod" | "upi"; // Payment method
}
