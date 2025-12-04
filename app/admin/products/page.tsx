import Link from "next/link";
import { getAllProducts, deleteProduct } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import DeleteDialog from "@/components/DeleteDialog";
import { requireAdmin } from "@/lib/admin-guard";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  await requireAdmin();

  const searchParamsData = await searchParams;

  const page = Number(searchParamsData.page) || 1;
  const searchText = searchParamsData.query || "";
  const category = searchParamsData.category || "";

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">
            {CONTENT_PAGE.PAGE.ADMIN_PRODUCTS.products}
          </h1>
          {searchText && (
            <div>
              {CONTENT_PAGE.GLOBAL.filteredBy} <i>&quot;{searchText}&quot;</i>{" "}
              <Link
                href={ROUTES.ADMIN_PRODUCTS}
                data-testid="remove-filter-button"
              >
                <Button variant="outline" size="sm">
                  {CONTENT_PAGE.GLOBAL.removeFilter}
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default" data-testid="create-product-button">
          <Link href={ROUTES.ADMIN_PRODUCTS_CREATE}>
            {CONTENT_PAGE.PAGE.ADMIN_PRODUCTS.createProduct}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{CONTENT_PAGE.GLOBAL.id}</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.name}</TableHead>
            <TableHead className="text-right">
              {CONTENT_PAGE.GLOBAL.price}
            </TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.category}</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.stock}</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.rating}</TableHead>
            <TableHead className="w-[100px]">
              {CONTENT_PAGE.GLOBAL.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>
                {product.category?.name || CONTENT_PAGE.GLOBAL.notAvailable}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={ROUTES.ADMIN_PRODUCTS_EDIT(product.id)}>
                    {CONTENT_PAGE.GLOBAL.edit}
                  </Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
}
