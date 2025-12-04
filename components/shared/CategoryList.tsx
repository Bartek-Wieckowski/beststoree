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
import CONTENT_PAGE from "@/lib/content-page";

const SLIDER_THRESHOLD = 10;

type CategoryListProps = {
  categories: Category[];
  totalProductsCount?: number;
};

function CategoryIcon({ iconName }: { iconName: string | null }) {
  if (!iconName) return null;

  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[iconName];

  if (IconComponent) {
    return <IconComponent className="h-6 w-6" />;
  }

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
    name: CONTENT_PAGE.GLOBAL.all,
    slug: "all",
    icon: "Grid3x3",
    _count: {
      products: totalProductsCount || 0,
    },
  };

  return (
    <div className="w-full mb-8 ">
      {/* Mobile: Always slider in one line */}
      <div className="md:hidden">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-2">
            {/* All Category */}
            <CarouselItem className="pl-2 basis-auto">
              <Link
                href={ROUTES.CATEGORY("all")}
                className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[7.5rem]"
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
              <CarouselItem key={category.id} className="pl-2 basis-auto">
                <Link
                  href={ROUTES.CATEGORY(category.slug)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[7.5rem]"
                >
                  {category.icon && <CategoryIcon iconName={category.icon} />}
                  <span className="mt-2 text-sm font-medium text-center">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    ({category._count?.products ?? 0})
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center items-center gap-4 mt-4">
            <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative right-0 top-0 translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>

      {/* Desktop: Carousel or Grid based on count */}
      <div className="hidden md:block">
        {shouldUseSlider ? (
          <Carousel
            className="w-full"
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-4 flex flex-wrap gap-4 justify-center">
              {/* All Category */}
              <CarouselItem className="pl-4 basis-auto">
                <Link
                  href={ROUTES.CATEGORY("all")}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[7.5rem]"
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
                <CarouselItem key={category.id} className="pl-4 basis-auto">
                  <Link
                    href={ROUTES.CATEGORY(category.slug)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[7.5rem]"
                  >
                    {category.icon && <CategoryIcon iconName={category.icon} />}
                    <span className="mt-2 text-sm font-medium text-center">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      ({category._count?.products ?? 0})
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center gap-4 mt-4">
              <CarouselPrevious className="relative left-0 top-0 translate-x-0 translate-y-0" />
              <CarouselNext className="relative right-0 top-0 translate-x-0 translate-y-0" />
            </div>
          </Carousel>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {/* All Category */}
            <Link
              href={ROUTES.CATEGORY("all")}
              className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[7.5rem]"
            >
              <Grid3x3 className="h-6 w-6" />
              <span className="mt-2 text-sm font-medium text-center">
                {allCategory.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                ({allCategory._count.products})
              </span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={ROUTES.CATEGORY(category.slug)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-accent transition-colors min-w-[7.5rem]"
              >
                {category.icon && <CategoryIcon iconName={category.icon} />}
                <span className="mt-2 text-sm font-medium text-center">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  ({category._count?.products ?? 0})
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
