import { create } from "zustand";
import { Order, OrderStatus } from "@/types/order";

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
    ),
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearOrders: () => set({ orders: [], error: null }),
}));
