"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2, Upload } from "lucide-react";
import {
  Product,
  ProductCategory,
  ProductColor,
  ProductSize,
} from "@/lib/productData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddEditProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, "id">) => Promise<void>;
}

const categories: ProductCategory[] = [
  "Janamaz",
  "Topi",
  "Atar",
  "Leather Shocks",
];

const defaultColor: ProductColor = {
  name: "",
  colorCode: "#FFFFFF",
};

const defaultSize: ProductSize = {
  size: "",
  stock: 0,
};

export default function AddEditProductModal({
  product,
  onClose,
  onSave,
}: AddEditProductModalProps) {
  // Check if product category is a custom one (not in predefined list)
  const isCustomCategory = product?.category && !categories.includes(product.category as any);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || ("Janamaz" as ProductCategory),
    price: product?.price || 0,
    salePrice: product?.salePrice || undefined,
    description: product?.description || "",
    stock: product?.stock || 0,
    image: product?.image || "",
    available: product?.available ?? true,
    quantityMl: product?.quantityMl || undefined,
  });

  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors || [{ ...defaultColor }]
  );

  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.sizes || [{ ...defaultSize }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorSection, setShowColorSection] = useState(
    (product?.colors && product.colors.length > 0) || false
  );
  const [showSizeSection, setShowSizeSection] = useState(
    formData.category === "Leather Shocks"
  );
  const [showCustomCategory, setShowCustomCategory] = useState(isCustomCategory);
  const [customCategory, setCustomCategory] = useState(isCustomCategory ? product?.category || "" : "");

  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setCustomCategory("");
    } else {
      setShowCustomCategory(false);
      setFormData({ ...formData, category: value as ProductCategory });

      // Show/hide size section based on category
      setShowSizeSection(value === "Leather Shocks");

      // Show quantityMl input for Atar
      if (value === "Atar" && !formData.quantityMl) {
        setFormData({ ...formData, category: value as ProductCategory, quantityMl: 12 });
      }
    }
  };

  // Handle custom category change
  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value);
    setFormData({ ...formData, category: value as ProductCategory });
  };

  // Color management
  const handleAddColor = () => {
    setColors([...colors, { ...defaultColor }]);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleColorChange = (
    index: number,
    field: keyof ProductColor,
    value: string
  ) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  // Size management
  const handleAddSize = () => {
    setSizes([...sizes, { ...defaultSize }]);
  };

  const handleRemoveSize = (index: number) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  const handleSizeChange = (
    index: number,
    field: keyof ProductSize,
    value: string | number
  ) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate total stock for products with sizes
      let totalStock = formData.stock;
      if (showSizeSection && sizes.length > 0) {
        totalStock = sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
      }

      const productData: Omit<Product, "id"> = {
        ...formData,
        stock: totalStock,
        colors: showColorSection && colors[0].name ? colors : undefined,
        sizes: showSizeSection && sizes[0].size ? sizes : undefined,
      };

      await onSave(productData);
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-navy to-charcoal text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Premium Prayer Mat"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={showCustomCategory ? "custom" : formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="w-full mt-2 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gold focus:outline-none bg-white text-charcoal font-medium cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="custom">Other (Custom)</option>
              </select>

              {/* Custom Category Input */}
              {showCustomCategory && (
                <Input
                  type="text"
                  value={customCategory}
                  onChange={(e) => handleCustomCategoryChange(e.target.value)}
                  placeholder="Enter custom category name"
                  required
                  className="mt-2"
                />
              )}
            </div>
          </div>

          {/* Price Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                placeholder="799"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="salePrice">Sale Price (₹)</Label>
              <Input
                id="salePrice"
                type="number"
                min="0"
                step="1"
                value={formData.salePrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salePrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="649"
                className="mt-2"
              />
            </div>

            {!showSizeSection && (
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  required
                  placeholder="25"
                  className="mt-2"
                />
              </div>
            )}

            {formData.category === "Atar" && (
              <div>
                <Label htmlFor="quantityMl">Quantity (ml) *</Label>
                <Input
                  id="quantityMl"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.quantityMl || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantityMl: Number(e.target.value),
                    })
                  }
                  required
                  placeholder="12"
                  className="mt-2"
                />
              </div>
            )}
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image">Image URL *</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                required
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
                />
              )}
            </div>
            <p className="text-xs text-charcoal/60 mt-1">
              Use Unsplash or any image URL
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Describe the product..."
              rows={3}
              className="w-full mt-2 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-gold focus:outline-none resize-none"
            />
          </div>

          {/* Available Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold cursor-pointer"
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available for purchase
            </Label>
          </div>

          {/* Color Variants Section */}
          {formData.category !== "Atar" && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-navy">
                    Color Variants
                  </h3>
                  <p className="text-sm text-charcoal/60">
                    Add different color options (optional)
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowColorSection(!showColorSection)}
                  variant="outline"
                  size="sm"
                >
                  {showColorSection ? "Remove Colors" : "Add Colors"}
                </Button>
              </div>

              {showColorSection && (
                <>
                  <Button
                    type="button"
                    onClick={handleAddColor}
                    variant="outline"
                    size="sm"
                    className="mb-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>

                  <div className="space-y-4">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <Label htmlFor={`color-name-${index}`}>
                            Color Name *
                          </Label>
                          <Input
                            id={`color-name-${index}`}
                            type="text"
                            value={color.name}
                            onChange={(e) =>
                              handleColorChange(index, "name", e.target.value)
                            }
                            required
                            placeholder="Green"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`color-code-${index}`}>
                            Color Code *
                          </Label>
                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              id={`color-code-${index}`}
                              type="color"
                              value={color.colorCode}
                              onChange={(e) =>
                                handleColorChange(
                                  index,
                                  "colorCode",
                                  e.target.value
                                )
                              }
                              className="w-12 h-10 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={color.colorCode}
                              onChange={(e) =>
                                handleColorChange(
                                  index,
                                  "colorCode",
                                  e.target.value
                                )
                              }
                              placeholder="#FFFFFF"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="flex items-end">
                          {colors.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => handleRemoveColor(index)}
                              variant="outline"
                              size="sm"
                              className="w-full text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Size Section (Only for Leather Shoes) */}
          {showSizeSection && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-navy">
                    Size & Stock
                  </h3>
                  <p className="text-sm text-charcoal/60">
                    Add different sizes with individual stock
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleAddSize}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Size
                </Button>
              </div>

              <div className="space-y-4">
                {sizes.map((size, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <Label htmlFor={`size-${index}`}>Size *</Label>
                      <Input
                        id={`size-${index}`}
                        type="text"
                        value={size.size}
                        onChange={(e) =>
                          handleSizeChange(index, "size", e.target.value)
                        }
                        required
                        placeholder="7, 8, 9..."
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`size-stock-${index}`}>Stock *</Label>
                      <Input
                        id={`size-stock-${index}`}
                        type="number"
                        min="0"
                        value={size.stock}
                        onChange={(e) =>
                          handleSizeChange(index, "stock", Number(e.target.value))
                        }
                        required
                        placeholder="10"
                        className="mt-2"
                      />
                    </div>

                    <div className="flex items-end">
                      {sizes.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-navy hover:bg-gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : product ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
