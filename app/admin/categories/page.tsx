import Link from "next/link";
import {
  getAllCategories,
  deleteCategory,
} from "@/lib/actions/category.actions";
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
import CONTENT_PAGE from "@/lib/content-page";

function CategoryIcon({ iconName }: { iconName: string | null }) {
  if (!iconName) return null;

  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[iconName];

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
        <h1 className="h2-bold">
          {CONTENT_PAGE.PAGE.ADMIN_CATEGORIES.categories}
        </h1>
        <Button asChild variant="default" data-testid="create-category-button">
          <Link href={ROUTES.ADMIN_CATEGORIES_CREATE}>
            {CONTENT_PAGE.PAGE.ADMIN_CATEGORIES.createCategory}
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.name}</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.slug}</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.icon}</TableHead>
            <TableHead>{CONTENT_PAGE.GLOBAL.products}</TableHead>
            <TableHead className="w-[100px]">
              {CONTENT_PAGE.GLOBAL.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {CONTENT_PAGE.GLOBAL.noCategoriesFound}
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
                      {CONTENT_PAGE.GLOBAL.edit}
                    </Link>
                  </Button>
                  <DeleteDialog id={category.id} action={deleteCategory} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
