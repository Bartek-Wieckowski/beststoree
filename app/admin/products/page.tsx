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
            {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.products}
          </h1>
          {searchText && (
            <div>
              {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.filteredBy}{" "}
              <i>&quot;{searchText}&quot;</i>{" "}
              <Link
                href={ROUTES.ADMIN_PRODUCTS}
                data-testid="remove-filter-button"
              >
                <Button variant="outline" size="sm">
                  {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.removeFilter}
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default" data-testid="create-product-button">
          <Link href={ROUTES.ADMIN_PRODUCTS_CREATE}>
            {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.createProduct}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.id}</TableHead>
            <TableHead>{CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.name}</TableHead>
            <TableHead className="text-right">
              {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.price}
            </TableHead>
            <TableHead>{CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.category}</TableHead>
            <TableHead>{CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.stock}</TableHead>
            <TableHead>{CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.rating}</TableHead>
            <TableHead className="w-[100px]">
              {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.actions}
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
                {product.category?.name || "N/A"}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={ROUTES.ADMIN_PRODUCTS_EDIT(product.id)}>
                    {CONTENT_PAGE.ADMIN_PRODUCTS_PAGE.editProduct}
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
