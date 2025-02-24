import ProductList from '@/components/shared/product/ProductList';
import { getLatestProducts } from '@/lib/actions/product.actions';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
// }

export default async function HomePage() {
  const products = await getLatestProducts();
  
  return (
    <>
      <ProductList data={products} title="Newest Arrivals" limit={4} />
    </>
  );
}
