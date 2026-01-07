"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/productData";
import { Fabric } from "@/lib/fabricData";

export type CartItemType = "product" | "fabric";

export interface CartItem {
  type: CartItemType;
  product?: Product;
  fabric?: Fabric;
  quantity: number;
  selectedSize?: string;
  selectedColorIndex?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, selectedSize?: string, selectedColorIndex?: number) => void;
  addFabricToCart: (fabric: Fabric, quantity: number, selectedColorIndex?: number) => void;
  removeFromCart: (itemId: string, type: CartItemType, selectedSize?: string, selectedColorIndex?: number) => void;
  updateQuantity: (itemId: string, type: CartItemType, quantity: number, selectedSize?: string, selectedColorIndex?: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity: number,
    selectedSize?: string,
    selectedColorIndex?: number
  ) => {
    setCart((prevCart) => {
      // Check if item already exists in cart (matching product ID and size)
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.type === "product" &&
          item.product?.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColorIndex === selectedColorIndex
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            type: "product" as CartItemType,
            product,
            quantity,
            selectedSize,
            selectedColorIndex,
          },
        ];
      }
    });
  };

  const addFabricToCart = (
    fabric: Fabric,
    quantity: number,
    selectedColorIndex?: number
  ) => {
    setCart((prevCart) => {
      // Check if fabric already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.type === "fabric" &&
          item.fabric?.id === fabric.id &&
          item.selectedColorIndex === selectedColorIndex
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new fabric item
        return [
          ...prevCart,
          {
            type: "fabric" as CartItemType,
            fabric,
            quantity,
            selectedColorIndex,
          },
        ];
      }
    });
  };

  const removeFromCart = (
    itemId: string,
    type: CartItemType,
    selectedSize?: string,
    selectedColorIndex?: number
  ) => {
    setCart((prevCart) =>
      prevCart.filter((item) => {
        if (item.type !== type) return true;

        if (type === "product") {
          return !(
            item.product?.id === itemId &&
            item.selectedSize === selectedSize &&
            item.selectedColorIndex === selectedColorIndex
          );
        } else {
          // fabric
          return !(
            item.fabric?.id === itemId &&
            item.selectedColorIndex === selectedColorIndex
          );
        }
      })
    );
  };

  const updateQuantity = (
    itemId: string,
    type: CartItemType,
    quantity: number,
    selectedSize?: string,
    selectedColorIndex?: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(itemId, type, selectedSize, selectedColorIndex);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.type !== type) return item;

        if (type === "product") {
          if (
            item.product?.id === itemId &&
            item.selectedSize === selectedSize &&
            item.selectedColorIndex === selectedColorIndex
          ) {
            return { ...item, quantity };
          }
        } else {
          // fabric
          if (
            item.fabric?.id === itemId &&
            item.selectedColorIndex === selectedColorIndex
          ) {
            return { ...item, quantity };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === "product" && item.product) {
        const price = item.product.salePrice || item.product.price;
        return total + price * item.quantity;
      } else if (item.type === "fabric" && item.fabric) {
        // For fabrics, quantity represents meters
        return total + item.fabric.pricePerMeter * item.quantity;
      }
      return total;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addFabricToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
