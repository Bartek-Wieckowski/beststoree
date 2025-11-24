import ProductList from "@/components/shared/product/ProductList";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/ProductCarousel";
import ViewAllProductsButton from "@/components/ViewAllProductsButton";
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
// }

export default async function HomePage() {
  const products = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={products} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
    </>
  );
}
