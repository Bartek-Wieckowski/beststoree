import sampleData from '@/db/sample-data';
import ProductList from '@/components/shared/product/ProductList';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
// }

export default async function HomePage() {
  return (
    <>
      <ProductList data={sampleData.products} title="Newest Arrivals" limit={4} />
    </>
  );
}
