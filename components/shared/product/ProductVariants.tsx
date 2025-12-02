"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getColorValue } from "@/lib/constants/colors";

type ProductVariantsProps = {
  sizes: string[];
  colors: string[];
  selectedSize: string | null;
  selectedColor: string | null;
  onSizeChange: (size: string | null) => void;
  onColorChange: (color: string | null) => void;
};

export default function ProductVariants({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: ProductVariantsProps) {
  const hasSizes = sizes.length > 0;
  const hasColors = colors.length > 0;

  if (!hasSizes && !hasColors) {
    return null;
  }

  return (
    <div className="space-y-4">
      {hasSizes && (
        <div>
          <Label htmlFor="size-select">Size</Label>
          <Select
            value={selectedSize || ""}
            onValueChange={(value) => onSizeChange(value || null)}
          >
            <SelectTrigger id="size-select" className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {hasColors && (
        <div>
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => {
              const colorValue = getColorValue(color);
              const isSelected = selectedColor === color;
              const isHexColor = colorValue.startsWith("#");

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onColorChange(isSelected ? null : color)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  )}
                  title={color}
                >
                  {isHexColor && (
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: colorValue }}
                    />
                  )}
                  <span className="text-sm font-medium">{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

