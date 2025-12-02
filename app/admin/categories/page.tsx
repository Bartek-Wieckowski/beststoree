import Link from "next/link";
import { getAllCategories, deleteCategory } from "@/lib/actions/category.actions";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "@/components/DeleteDialog";
import { requireAdmin } from "@/lib/admin-guard";
import ROUTES from "@/lib/routes";
import * as LucideIcons from "lucide-react";

function CategoryIcon({ iconName }: { iconName: string | null }) {
  if (!iconName) return null;

  const IconComponent = (LucideIcons as Record<string, any>)[iconName];

  if (IconComponent) {
    return <IconComponent className="h-4 w-4" />;
  }

  return null;
}

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await getAllCategories();

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Categories</h1>
        <Button asChild variant="default" data-testid="create-category-button">
          <Link href={ROUTES.ADMIN_CATEGORIES_CREATE}>Create Category</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{formatId(category.id)}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  {category.icon ? (
                    <CategoryIcon iconName={category.icon} />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.ADMIN_CATEGORIES_EDIT(category.id)}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteDialog
                    id={category.id}
                    action={deleteCategory}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

