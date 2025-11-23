import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import ROUTES from "@/lib/routes";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import CONTENT_PAGE from "@/lib/content-page";

export default async function CategoryDrawer() {
  const categories = await getAllCategories();

  return (
    <Drawer direction="left" data-testid="category-drawer">
      <DrawerTrigger asChild>
        <Button variant="outline" data-testid="category-drawer-trigger">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="h-full max-w-sm"
        data-testid="category-drawer-content"
      >
        <DrawerHeader>
          <DrawerTitle>
            {CONTENT_PAGE.CATEGORY_DRAWER.selectCategory}
          </DrawerTitle>
          <div className="space-y-1 mt-4">
            {categories.map((x) => (
              <Button
                variant="ghost"
                className="w-full justify-start"
                key={x.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={ROUTES.CATEGORY(x.category)}>
                    {x.category} ({x._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
