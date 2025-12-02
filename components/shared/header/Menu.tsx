import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMyCart } from "@/lib/actions/cart.actions";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import UserButton from "./UserButton";
import Search from "./Search";

export default async function Menu() {
  let cartItemsCount = 0;
  try {
    const cart = await getMyCart();
    cartItemsCount = cart?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  } catch {
    cartItemsCount = 0;
  }

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost" data-testid="cart-button">
          <Link href={ROUTES.CART} className="relative">
            <ShoppingCart />
            <span className="sr-only">{CONTENT_PAGE.HEADER.cart}</span>
            {cartItemsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet data-testid="sheet-menu">
          <SheetTrigger
            className="align-middle"
            data-testid="sheet-menu-trigger"
          >
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>{CONTENT_PAGE.MENU.menu}</SheetTitle>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href={ROUTES.CART} className="relative">
                  <ShoppingCart />
                  <span className="sr-only">{CONTENT_PAGE.HEADER.cart}</span>
                  {cartItemsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <UserButton />
            </div>
            <Search />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
