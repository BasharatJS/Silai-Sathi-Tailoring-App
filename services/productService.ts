import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, ProductCategory } from "@/lib/productData";

const PRODUCTS_COLLECTION = "products";

/**
 * Create a new product
 */
export const createProduct = async (
  productData: Omit<Product, "id">
): Promise<string> => {
  try {
    // Remove undefined values to prevent Firestore errors
    const cleanedData: any = {};
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    });

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...cleanedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  category: ProductCategory
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error getting products by category:", error);
    throw error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

/**
 * Update a product
 */
export const updateProduct = async (
  productId: string,
  productData: Omit<Product, "id">
): Promise<void> => {
  try {
    // Remove undefined values to prevent Firestore errors
    const cleanedData: any = {};
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    });

    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Update product stock
 */
export const updateProductStock = async (
  productId: string,
  newStock: number
): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      stock: newStock,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
};

/**
 * Update size-specific stock for products with sizes (like shoes)
 */
export const updateSizeStock = async (
  productId: string,
  sizeIndex: number,
  newStock: number
): Promise<void> => {
  try {
    const product = await getProductById(productId);
    if (!product || !product.sizes) {
      throw new Error("Product not found or does not have sizes");
    }

    const updatedSizes = [...product.sizes];
    updatedSizes[sizeIndex].stock = newStock;

    // Calculate total stock
    const totalStock = updatedSizes.reduce(
      (sum, size) => sum + size.stock,
      0
    );

    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      sizes: updatedSizes,
      stock: totalStock,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating size stock:", error);
    throw error;
  }
};
