"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/lib/routes";

export default function ProductCarousel({ data }: { data: Product[] }) {
  return (
    <div className="wrapper">
      <Carousel
        className="w-full mb-12"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 10000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {data
            .filter((product) => product.banner && product.banner.trim() !== "")
            .map((product: Product) => (
              <CarouselItem key={product.id}>
                <Link href={ROUTES.PRODUCT(product.slug)}>
                  <div className="relative mx-auto h-[21.875rem]">
                    <Image
                      src={product.banner!}
                      alt={product.name}
                      height="0"
                      width="0"
                      sizes="100vw"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end justify-center">
                      <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                        {product.name}
                      </h2>
                    </div>
                  </div>
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
  );
}
