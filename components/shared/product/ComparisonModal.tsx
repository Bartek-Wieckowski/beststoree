"use client";

import { ComparisonItem } from "@/hooks/use-comparison";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type ComparisonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: ComparisonItem[];
};

export default function ComparisonModal({
  open,
  onOpenChange,
  products,
}: ComparisonModalProps) {
  if (!products || products.length === 0) return null;

  const comparisonFields: Array<{
    label: string;
    getValue: (product: ComparisonItem) => ReactNode;
  }> = [
    {
      label: CONTENT_PAGE.COMPARISON.name,
      getValue: (product: ComparisonItem) => product.name,
    },
    {
      label: CONTENT_PAGE.COMPARISON.price,
      getValue: (product: ComparisonItem) =>
        `$${Number(product.price).toFixed(2)}`,
    },
    {
      label: CONTENT_PAGE.COMPARISON.brand,
      getValue: (product: ComparisonItem) => product.brand,
    },
    {
      label: CONTENT_PAGE.COMPARISON.rating,
      getValue: (product: ComparisonItem) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{Number(product.rating).toFixed(1)}</span>
        </div>
      ),
    },
    {
      label: CONTENT_PAGE.COMPARISON.stock,
      getValue: (product: ComparisonItem) => (
        <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      ),
    },
    {
      label: CONTENT_PAGE.COMPARISON.category,
      getValue: (product: ComparisonItem) => product.categoryName || "N/A",
    },
    {
      label: CONTENT_PAGE.COMPARISON.description,
      getValue: (product: ComparisonItem) => (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{CONTENT_PAGE.COMPARISON.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-background border-b p-3 sm:p-4 text-left font-semibold min-w-[120px] sm:min-w-[150px]">
                    Feature
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.productId}
                      className="border-b p-3 sm:p-4 text-center font-semibold min-w-[180px] sm:min-w-[200px] align-top"
                    >
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <Link
                          href={ROUTES.PRODUCT(product.slug)}
                          className="relative w-24 h-24 sm:w-32 sm:h-32 block"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </Link>
                        <Link
                          href={ROUTES.PRODUCT(product.slug)}
                          className="font-medium hover:underline text-xs sm:text-sm text-center"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field, index) => (
                  <tr
                    key={field.label}
                    className={index % 2 === 0 ? "bg-muted/50" : ""}
                  >
                    <td className="sticky left-0 z-10 bg-background border-b p-3 sm:p-4 font-medium text-sm sm:text-base">
                      {field.label}
                    </td>
                    {products.map((product) => (
                      <td
                        key={product.productId}
                        className="border-b p-3 sm:p-4 text-center align-middle text-sm sm:text-base"
                      >
                        {field.getValue(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 pb-6 px-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
