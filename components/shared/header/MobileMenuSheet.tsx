"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "./ModeToggle";
import Search from "./Search";
import WishlistButton from "./WishlistButton";
import ComparisonButton from "./ComparisonButton";

type MobileMenuSheetProps = {
  cartItemsCount: number;
};

export default function MobileMenuSheet({
  cartItemsCount,
}: MobileMenuSheetProps) {
  const [open, setOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close other dropdowns when opening a new one
  const handleThemeClick = () => {
    setWishlistOpen(false);
    setComparisonOpen(false);
    setThemeOpen(true);
  };

  const handleWishlistClick = () => {
    setThemeOpen(false);
    setComparisonOpen(false);
    setWishlistOpen(true);
  };

  const handleComparisonClick = () => {
    setThemeOpen(false);
    setWishlistOpen(false);
    setComparisonOpen(true);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} data-testid="sheet-menu">
      <SheetTrigger className="align-middle" data-testid="sheet-menu-trigger">
        <EllipsisVertical />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-start">
        <SheetTitle>{CONTENT_PAGE.MENU.menu}</SheetTitle>
        <div className="flex flex-col gap-4 w-full mt-4">
          <div
            onClick={handleThemeClick}
            className="flex items-center gap-3 w-full text-left hover:bg-accent rounded-sm p-2 -ml-2 cursor-pointer"
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ModeToggle open={themeOpen} onOpenChange={setThemeOpen} />
            </div>
            <span className="text-sm">
              {CONTENT_PAGE.MODE_TOGGLE.appearance}
            </span>
          </div>
          <div
            onClick={handleWishlistClick}
            className="flex items-center gap-3 w-full text-left hover:bg-accent rounded-sm p-2 -ml-2 cursor-pointer"
          >
            <div onClick={(e) => e.stopPropagation()}>
              <WishlistButton
                open={wishlistOpen}
                onOpenChange={setWishlistOpen}
              />
            </div>
            <span className="text-sm">{CONTENT_PAGE.HEADER.wishlist}</span>
          </div>
          <div
            onClick={handleComparisonClick}
            className="flex items-center gap-3 w-full text-left hover:bg-accent rounded-sm p-2 -ml-2 cursor-pointer"
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ComparisonButton
                open={comparisonOpen}
                onOpenChange={setComparisonOpen}
              />
            </div>
            <span className="text-sm">{CONTENT_PAGE.HEADER.comparison}</span>
          </div>
          <Link
            href={ROUTES.CART}
            className="flex items-center gap-3 w-full text-left hover:bg-accent rounded-sm p-2 -ml-2"
          >
            <div className="relative">
              <Button asChild variant="ghost" size="icon">
                <div className="relative">
                  <ShoppingCart />
                  <span className="sr-only">{CONTENT_PAGE.HEADER.cart}</span>
                  {cartItemsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -left-2 md:-right-2 md:-left-auto h-5 w-5 flex items-center justify-center p-0 text-xs z-10"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </div>
              </Button>
            </div>
            <span className="text-sm">{CONTENT_PAGE.HEADER.cart}</span>
          </Link>
        </div>
        <div className="mt-6 w-full">
          <Search />
        </div>
        <SheetDescription></SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
