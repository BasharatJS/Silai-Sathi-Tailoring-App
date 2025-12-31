// Product Types and Interfaces

export type ProductCategory = "Janamaz" | "Topi" | "Atar" | "Leather Shocks" | string;

export type ProductSize = {
  size: string; // For shoes: "7", "8", "9", "10", etc.
  stock: number;
};

export type ProductColor = {
  name: string;
  colorCode: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  salePrice?: number; // Discounted price (optional)
  description: string;
  stock: number; // Total stock
  image: string; // Image URL
  available: boolean;

  // Optional fields based on category
  colors?: ProductColor[]; // For items with color variants
  sizes?: ProductSize[]; // Only for Leather Shocks
  quantityMl?: number; // Only for Atar (perfume) - e.g., 50ml, 100ml

  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
};

// Sample initial products data
export const sampleProducts: Omit<Product, "id">[] = [
  // Janamaz
  {
    name: "Premium Prayer Mat",
    category: "Janamaz",
    price: 799,
    salePrice: 649,
    description: "Soft and comfortable prayer mat with beautiful Islamic patterns",
    stock: 25,
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=500",
    available: true,
    colors: [
      { name: "Green", colorCode: "#22C55E" },
      { name: "Blue", colorCode: "#3B82F6" },
      { name: "Maroon", colorCode: "#991B1B" },
    ],
  },
  {
    name: "Velvet Prayer Mat",
    category: "Janamaz",
    price: 1299,
    salePrice: 999,
    description: "Luxurious velvet prayer mat with embroidered details",
    stock: 15,
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=500",
    available: true,
    colors: [
      { name: "Royal Blue", colorCode: "#1E40AF" },
      { name: "Burgundy", colorCode: "#7C2D12" },
    ],
  },

  // Topi
  {
    name: "Traditional Prayer Cap",
    category: "Topi",
    price: 149,
    salePrice: 99,
    description: "Classic white prayer cap made from breathable cotton",
    stock: 50,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    available: true,
    colors: [
      { name: "White", colorCode: "#FFFFFF" },
      { name: "Cream", colorCode: "#FEF3C7" },
    ],
  },
  {
    name: "Embroidered Topi",
    category: "Topi",
    price: 299,
    salePrice: 249,
    description: "Beautiful embroidered prayer cap with intricate designs",
    stock: 30,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    available: true,
    colors: [
      { name: "White", colorCode: "#FFFFFF" },
      { name: "Gold", colorCode: "#FCD34D" },
    ],
  },

  // Atar
  {
    name: "Musk Al Tahara",
    category: "Atar",
    price: 499,
    description: "Premium Arabian perfume oil - long lasting fragrance",
    stock: 40,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
    available: true,
    quantityMl: 12,
  },
  {
    name: "Oudh Al Khaleeji",
    category: "Atar",
    price: 899,
    salePrice: 749,
    description: "Luxurious oud-based perfume oil from the Gulf region",
    stock: 20,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
    available: true,
    quantityMl: 20,
  },

  // Leather Shocks
  {
    name: "Classic Leather Sandals",
    category: "Leather Shocks",
    price: 1499,
    salePrice: 1299,
    description: "Handcrafted leather sandals - perfect for prayer and casual wear",
    stock: 35,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500",
    available: true,
    colors: [
      { name: "Brown", colorCode: "#92400E" },
      { name: "Black", colorCode: "#000000" },
    ],
    sizes: [
      { size: "7", stock: 5 },
      { size: "8", stock: 8 },
      { size: "9", stock: 10 },
      { size: "10", stock: 7 },
      { size: "11", stock: 5 },
    ],
  },
  {
    name: "Premium Leather Shocks",
    category: "Leather Shocks",
    price: 2499,
    salePrice: 1999,
    description: "Premium quality leather formal shocks with superior comfort",
    stock: 25,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500",
    available: true,
    colors: [
      { name: "Brown", colorCode: "#92400E" },
      { name: "Black", colorCode: "#000000" },
      { name: "Tan", colorCode: "#D97706" },
    ],
    sizes: [
      { size: "7", stock: 3 },
      { size: "8", stock: 5 },
      { size: "9", stock: 8 },
      { size: "10", stock: 6 },
      { size: "11", stock: 3 },
    ],
  },
];

// Helper function to get product by ID (will be replaced by Firebase)
export const getProductById = (id: string): Product | undefined => {
  // This will be replaced by Firebase service
  return undefined;
};
