import ProductPrice from "@/components/shared/product/ProductPrice";
import CONTENT_PAGE from "@/lib/content-page";
import ProductImages from "@/components/shared/product/ProductImages";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductVariantSelector from "@/components/shared/product/ProductVariantSelector";
import { getMyCart } from "@/lib/actions/cart.actions";
import ReviewList from "./ReviewList";
import { auth } from "@/auth";
import ProductRating from "@/components/shared/product/ProductRating";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Images - left column on desktop */}
          <div>
            <ProductImages images={product.images} />
          </div>

          {/* Right column - Product Info + Purchase Card */}
          <div className="flex flex-col gap-6">
            {/* Product Info */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <span data-testid="product-brand">{product.brand}</span>{" "}
                {product.category?.name || ""}
              </p>
              <h1 className="h3-bold" data-testid="product-name">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <ProductRating value={Number(product.rating)} />
                <p className="text-sm text-muted-foreground">
                  {product.numReviews}{" "}
                  {CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.reviews}
                </p>
              </div>
              <div>
                <ProductPrice
                  value={Number(product.price)}
                  className="rounded-full bg-green-100 text-green-700 px-5 py-2 inline-block"
                />
              </div>
            </div>

            {/* Purchase Card */}
            <Card className="lg:sticky lg:top-4">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {CONTENT_PAGE.GLOBAL.price}
                  </span>
                  <ProductPrice value={Number(product.price)} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {CONTENT_PAGE.GLOBAL.status}
                  </span>
                  <div>
                    {product.stock > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {CONTENT_PAGE.GLOBAL.inStock}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        {CONTENT_PAGE.GLOBAL.outOfStock}
                      </Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <ProductVariantSelector product={product} cart={cart} />
                )}
              </CardContent>
            </Card>

            {/* Description - below purchase card */}
            <div className="pt-4 border-t">
              <h2 className="font-semibold mb-2">
                {CONTENT_PAGE.GLOBAL.description}
              </h2>
              <p
                className="text-muted-foreground"
                data-testid="product-description"
              >
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">
          {CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.customerReviews}
        </h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
}
