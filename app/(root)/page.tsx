import ProductList from "@/components/shared/product/ProductList";
import {
  getFeaturedProducts,
  getLatestProducts,
  getAllProductsForHome,
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

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategoriesWithProducts();
  const totalProductsCount = await getTotalProductsCount();
  const allProducts = await getAllProductsForHome();
  const promotion = await getPromotion();
  const cart = await getMyCart();

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
          title="Newest Arrivals"
          limit={4}
          cart={cart}
        />
        <ProductList data={allProducts} title="All Products" cart={cart} />
        <IconBoxes />
      </section>
      <PromotionCountdown promotion={promotion} />
    </>
  );
}
