"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ROUTES from "@/lib/routes";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Grid3x3 } from "lucide-react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

const SLIDER_THRESHOLD = 10;

type CategoryListProps = {
  categories: Category[];
  totalProductsCount?: number;
};

// Funkcja do renderowania ikony
function CategoryIcon({ iconName }: { iconName: string | null }) {
  if (!iconName) return null;

  // Sprawdź czy ikona istnieje w lucide-react
  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[iconName];

  if (IconComponent) {
    return <IconComponent className="h-6 w-6" />;
  }

  // Jeśli nie ma ikony w lucide-react, możesz zwrócić domyślną ikonę lub obrazek
  return null;
}

export default function CategoryList({
  categories,
  totalProductsCount,
}: CategoryListProps) {
  const totalCategories = categories.length + 1; // +1 for "All" category
  const shouldUseSlider = totalCategories > SLIDER_THRESHOLD;

  // Create "All" category item
  const allCategory = {
    id: "all",
    name: "All",
    slug: "all",
    icon: "Grid3x3",
    _count: {
      products: totalProductsCount || 0,
    },
  };

  return (
    <div className="w-full mb-8 wrapper">
      <Carousel
        className="w-full"
        opts={{
          align: "center",
          loop: shouldUseSlider,
          skipSnaps: false,
        }}
      >
        <CarouselContent
          className={cn(
            "flex flex-wrap gap-4 justify-center",
            shouldUseSlider ? "-ml-2 md:-ml-4" : ""
          )}
        >
          {/* All Category */}
          <CarouselItem className="pl-2 md:pl-4 basis-auto">
            <Link
              href={ROUTES.CATEGORY("all")}
              className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[120px]"
            >
              <Grid3x3 className="h-6 w-6" />
              <span className="mt-2 text-sm font-medium text-center">
                {allCategory.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                ({allCategory._count.products})
              </span>
            </Link>
          </CarouselItem>
          {categories.map((category) => (
            <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
              <Link
                href={ROUTES.CATEGORY(category.slug)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[120px]"
              >
                {category.icon && <CategoryIcon iconName={category.icon} />}
                <span className="mt-2 text-sm font-medium text-center">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  ({category._count.products})
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {shouldUseSlider && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative right-0 top-0 translate-x-0 translate-y-0" />
          </div>
        )}
      </Carousel>
    </div>
  );
}
