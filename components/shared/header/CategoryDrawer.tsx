import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/category.actions";
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
            {CONTENT_PAGE.COMPONENT.CATEGORY_DRAWER.selectCategory}
          </DrawerTitle>
          <div className="space-y-1 mt-4">
            {categories.map((category) => (
              <Button
                variant="ghost"
                className="w-full justify-start"
                key={category.id}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={ROUTES.CATEGORY(category.slug)}>
                    {category.name} ({category._count.products})
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
