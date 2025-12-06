import ProductList from "@/components/shared/product/ProductList";
import {
  getFeaturedProducts,
  getLatestProducts,
  getProductsByCategorySlug,
} from "@/lib/actions/product.actions";
import { getPromotion } from "@/lib/actions/promotion.actions";
import ProductCarousel from "@/components/shared/product/ProductCarousel";
import { Metadata } from "next";
import IconBoxes from "@/components/IconBoxes";
import PromotionCountdown from "@/components/PromotionCountdown";
import CategoryList from "@/components/shared/CategoryList";
import { getCategoriesWithProducts } from "@/lib/actions/category.actions";
import { getTotalProductsCount } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import CONTENT_PAGE from "@/lib/content-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/lib/routes";

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategoriesWithProducts();
  const totalProductsCount = await getTotalProductsCount();
  const promotion = await getPromotion();
  const cart = await getMyCart();

  // Fetch products for each category
  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => {
      const products = await getProductsByCategorySlug(category.slug, 4);
      return {
        ...category,
        products,
      };
    })
  );

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      {categories.length > 0 && (
        <CategoryList
          categories={categories}
          totalProductsCount={totalProductsCount}
        />
      )}
      <section className="flex flex-col gap-20">
        <ProductList
          data={latestProducts}
          title={CONTENT_PAGE.PAGE.HOME.newestArrivals}
          limit={4}
          cart={cart}
        />

        {categoriesWithProducts.map((category) => {
          if (category.products.length === 0) return null;
          return (
            <div key={category.id}>
              <ProductList
                data={category.products}
                title={category.name}
                limit={4}
                cart={cart}
              />
              <div className="flex justify-center items-center mt-6">
                <Button asChild variant="outline">
                  <Link href={ROUTES.CATEGORY(category.slug)}>
                    {CONTENT_PAGE.COMPONENT.BUTTON.showAll}
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}

        <IconBoxes />
      </section>
      <PromotionCountdown promotion={promotion} />
    </>
  );
}
