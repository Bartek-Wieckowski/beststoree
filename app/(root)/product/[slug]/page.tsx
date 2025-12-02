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
    <div className="wrapper">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                <span data-testid="product-brand">{product.brand}</span>{" "}
                {product.category?.name || ""}
              </p>
              <h1 className="h3-bold" data-testid="product-name">
                {product.name}
              </h1>
              {/* <p>
                {product.rating} of {product.numReviews}{" "}
                {CONTENT_PAGE.PRODUCT_DETAILS.reviews}
              </p> */}
              <ProductRating value={Number(product.rating)} />
              <p>
                {product.numReviews} {CONTENT_PAGE.PRODUCT_DETAILS.reviews}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <h2 className="font-semibold">
                {CONTENT_PAGE.PRODUCT_DETAILS.description}
              </h2>
              <p data-testid="product-description">{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>{CONTENT_PAGE.PRODUCT_DETAILS.price}</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>{CONTENT_PAGE.PRODUCT_DETAILS.status}</div>
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant="outline">
                        {CONTENT_PAGE.PRODUCT_CARD.inStock}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        {CONTENT_PAGE.PRODUCT_CARD.outOfStock}
                      </Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <ProductVariantSelector product={product} cart={cart} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">
          {CONTENT_PAGE.PRODUCT_DETAILS.customerReviews}
        </h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </div>
  );
}
