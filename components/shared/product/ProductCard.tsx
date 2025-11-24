import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import ProductPrice from "./ProductPrice";
import { Product } from "@/types";
import ProductRating from "./ProductRating";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm" data-testid="product-card">
      <CardHeader className="p-0 items-center">
        <Link href={ROUTES.PRODUCT(product.slug)}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <Link href={ROUTES.PRODUCT(product.slug)}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          {/* <p data-testid="product-rating">{product.rating} Stars</p>
           */}
          <ProductRating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">
              {CONTENT_PAGE.PRODUCT_CARD.outOfStock}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
