"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { Fabric, FabricColor } from "@/lib/fabricData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddEditFabricModalProps {
  fabric?: Fabric | null;
  onClose: () => void;
  onSave: (fabricData: Omit<Fabric, "id">) => Promise<void>;
}

const categories = ["Cotton", "Silk", "Linen", "Premium Blend"] as const;

const defaultColor: FabricColor = {
  name: "",
  colorCode: "#FFFFFF",
};

export default function AddEditFabricModal({
  fabric,
  onClose,
  onSave,
}: AddEditFabricModalProps) {
  const [formData, setFormData] = useState({
    name: fabric?.name || "",
    category: fabric?.category || "Cotton",
    pricePerMeter: fabric?.pricePerMeter || 0,
    description: fabric?.description || "",
    available: fabric?.available ?? true,
  });

  const [colors, setColors] = useState<FabricColor[]>(
    fabric?.colors || [{ ...defaultColor }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    field: keyof FabricColor,
    value: string
  ) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        price: formData.pricePerMeter,
        colors,
      } as Omit<Fabric, "id">);
      onClose();
    } catch (error) {
      console.error("Error saving fabric:", error);
      alert("Failed to save fabric. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-navy">
            {fabric ? "Edit Fabric" : "Add New Fabric"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Fabric Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="e.g., Premium Cotton"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as typeof categories[number],
                  })
                }
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price per Meter (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={formData.pricePerMeter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerMeter: Number(e.target.value),
                })
              }
              required
              placeholder="450"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Describe the fabric..."
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className="w-4 h-4 text-navy rounded focus:ring-gold"
            />
            <Label htmlFor="available" className="cursor-pointer">
              Available for purchase
            </Label>
          </div>

          {/* Colors Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">Color Variants</h3>
              <Button
                type="button"
                onClick={handleAddColor}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Color
              </Button>
            </div>

            <div className="space-y-4">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <Label htmlFor={`color-name-${index}`}>Color Name *</Label>
                    <Input
                      id={`color-name-${index}`}
                      type="text"
                      value={color.name}
                      onChange={(e) =>
                        handleColorChange(index, "name", e.target.value)
                      }
                      required
                      placeholder="White"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`color-code-${index}`}>Color Code *</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id={`color-code-${index}`}
                        type="color"
                        value={color.colorCode}
                        onChange={(e) =>
                          handleColorChange(index, "colorCode", e.target.value)
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={color.colorCode}
                        onChange={(e) =>
                          handleColorChange(index, "colorCode", e.target.value)
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
          </div>

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
              {isSubmitting
                ? "Saving..."
                : fabric
                ? "Update Fabric"
                : "Add Fabric"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
