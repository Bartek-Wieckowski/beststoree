import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMyCart } from "@/lib/actions/cart.actions";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import UserButton from "./UserButton";
import WishlistButton from "./WishlistButton";
import ComparisonButton from "./ComparisonButton";
import MobileMenuSheet from "./MobileMenuSheet";

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
      <nav className="hidden md:flex w-full max-w-xs gap-3 relative">
        <div className="relative ">
          <ModeToggle modal={false} />
        </div>
        <div className="relative ">
          <WishlistButton modal={false} />
        </div>
        <div className="relative ">
          <ComparisonButton modal={false} />
        </div>
        <div className="relative overflow-visible">
          <Button
            asChild
            variant="ghost"
            size="icon"
            data-testid="cart-button"
            className="relative overflow-visible outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
          >
            <Link href={ROUTES.CART} className="relative overflow-visible">
              <ShoppingCart />
              <span className="sr-only">
                {CONTENT_PAGE.COMPONENT.HEADER.cart}
              </span>
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs z-20"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
        <div className="relative ">
          <UserButton modal={false} />
        </div>
      </nav>
      <nav className="md:hidden">
        <MobileMenuSheet cartItemsCount={cartItemsCount} />
      </nav>
    </div>
  );
}
