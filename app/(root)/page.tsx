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
import { getAllCategories } from "@/lib/actions/category.actions";
import { getTotalProductsCount } from "@/lib/actions/product.actions";

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const categories = await getAllCategories();
  const totalProductsCount = await getTotalProductsCount();
  const allProducts = await getAllProductsForHome();
  const promotion = await getPromotion();

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
      <div className="wrapper">
        <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      </div>
      <div className="px-4 grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-8 my-10">
        <div className="lg:col-span-3">
          <ProductList data={allProducts} title="All Products" />
        </div>
        <aside className="xl:col-span-1">
          <PromotionCountdown promotion={promotion} />
        </aside>
      </div>
      <IconBoxes />
    </>
  );
}
