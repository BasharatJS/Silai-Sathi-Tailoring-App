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
  style: string;
  styleName: string;
  buttonType: string;
  buttonTypeName: string;
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
  };
  deliveryAddress: OrderAddress;
  service: OrderService;
  fabric: OrderFabric;
  customization: OrderCustomization;
  measurements: OrderMeasurements;
  pricing: OrderPricing;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFormData {
  service: string;
  fabric: string;
  fabricQuantity: number;
  selectedFabricColorIndex: number;
  style: string;
  buttonType: string;
  measurements: OrderMeasurements;
  address: OrderAddress;
}

export interface FabricOnlyOrderData {
  fabric: string;
  fabricQuantity: number;
  selectedFabricColorIndex: number;
  address: OrderAddress;
}
