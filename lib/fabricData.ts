export type FabricColor = {
  name: string;
  gradient: string;
  colorCode: string;
};

export type Fabric = {
  id: string;
  name: string;
  category: "Cotton" | "Silk" | "Linen" | "Premium Blend";
  price: number;
  pricePerMeter: number;
  image?: string;
  gradient: string;
  description: string;
  available: boolean;
  colors: FabricColor[];
};

export const fabrics: Fabric[] = [
  // Cotton
  {
    id: "cotton-1",
    name: "Premium Cotton",
    category: "Cotton",
    price: 450,
    pricePerMeter: 450,
    gradient: "from-gray-50 to-white",
    description: "Soft and breathable premium cotton fabric",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "cotton-2",
    name: "Cotton Classic",
    category: "Cotton",
    price: 420,
    pricePerMeter: 420,
    gradient: "from-amber-50 to-orange-50",
    description: "Classic cotton for everyday wear",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "cotton-3",
    name: "Organic Cotton",
    category: "Cotton",
    price: 550,
    pricePerMeter: 550,
    gradient: "from-gray-50 to-white",
    description: "100% organic cotton, eco-friendly",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "cotton-4",
    name: "Cotton Premium",
    category: "Cotton",
    price: 480,
    pricePerMeter: 480,
    gradient: "from-blue-100 to-blue-200",
    description: "Premium quality cotton fabric",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },

  // Silk
  {
    id: "silk-1",
    name: "Royal Silk",
    category: "Silk",
    price: 1500,
    pricePerMeter: 1500,
    gradient: "from-gray-50 to-white",
    description: "Luxurious silk with rich texture",
    available: true,
   colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "silk-2",
    name: "Silk Blend",
    category: "Silk",
    price: 850,
    pricePerMeter: 850,
    gradient: "from-purple-100 to-pink-200",
    description: "Premium silk blend",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "silk-3",
    name: "Pure Silk",
    category: "Silk",
    price: 1800,
    pricePerMeter: 1800,
    gradient: "from-pink-100 to-rose-200",
    description: "Pure silk in elegant finish",
    available: true,
   colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "silk-4",
    name: "Silk Premium",
    category: "Silk",
    price: 1200,
    pricePerMeter: 1200,
    gradient: "from-indigo-100 to-purple-200",
    description: "Premium quality silk fabric",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },

  // Linen
  {
    id: "linen-1",
    name: "Pure Linen",
    category: "Linen",
    price: 650,
    pricePerMeter: 650,
    gradient: "from-gray-50 to-white",
    description: "Natural linen, perfect for summer",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "linen-2",
    name: "Linen Classic",
    category: "Linen",
    price: 700,
    pricePerMeter: 700,
    gradient: "from-amber-50 to-orange-50",
    description: "Elegant linen fabric",
    available: true,
   colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "linen-3",
    name: "Linen Premium",
    category: "Linen",
    price: 680,
    pricePerMeter: 680,
    gradient: "from-gray-200 to-gray-300",
    description: "Modern premium linen",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "linen-4",
    name: "Linen Royal",
    category: "Linen",
    price: 720,
    pricePerMeter: 720,
    gradient: "from-green-100 to-emerald-200",
    description: "Stylish royal linen",
    available: true,
   colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },

  // Premium Blend
  {
    id: "blend-1",
    name: "Designer Blend",
    category: "Premium Blend",
    price: 1200,
    pricePerMeter: 1200,
    gradient: "from-orange-100 to-yellow-200",
    description: "Exclusive designer blend",
    available: true,
   colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "blend-2",
    name: "Luxury Blend",
    category: "Premium Blend",
    price: 1800,
    pricePerMeter: 1800,
    gradient: "from-amber-100 to-orange-200",
    description: "Premium luxury blend",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "blend-3",
    name: "Premium Blend",
    category: "Premium Blend",
    price: 1500,
    pricePerMeter: 1500,
    gradient: "from-gray-200 to-gray-300",
    description: "Sophisticated premium blend",
    available: true,
    colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
  {
    id: "blend-4",
    name: "Royal Blend",
    category: "Premium Blend",
    price: 2000,
    pricePerMeter: 2000,
    gradient: "from-orange-200 to-red-200",
    description: "Royal premium blend",
    available: true,
   colors: [
      { name: "White", gradient: "from-gray-50 to-white", colorCode: "#FFFFFF" },
      { name: "Cream", gradient: "from-amber-50 to-orange-50", colorCode: "#FFF8DC" },
      { name: "Blue", gradient: "from-blue-100 to-blue-200", colorCode: "#93C5FD" },
      { name: "Chocolate", gradient: "from-amber-700 to-amber-900", colorCode: "#92400E" },
      { name: "Grey", gradient: "from-gray-300 to-gray-400", colorCode: "#9CA3AF" },
    ],
  },
];

export const getFabricsByCategory = (category: string) => {
  return fabrics.filter((fabric) => fabric.category === category);
};

export const getFabricById = (id: string) => {
  return fabrics.find((fabric) => fabric.id === id);
};
