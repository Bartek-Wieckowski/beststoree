import ProductPrice from '@/components/shared/product/ProductPrice';
import CONTENT_PAGE from '@/lib/content-page';
import ProductImages from '@/components/shared/product/ProductImages';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                <span data-testid="product-brand">{product.brand}</span> {product.category}
              </p>
              <h1 className="h3-bold" data-testid="product-name">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews}{' '}
                {CONTENT_PAGE.PRODUCT_DETAILS.reviews}
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
                  <div className="flex-center">
                    <Button className="w-full">
                      {CONTENT_PAGE.PRODUCT_DETAILS.addToCart}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
