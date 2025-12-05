"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import ModeToggle from "./header/ModeToggle";
import WishlistButton from "./header/WishlistButton";
import ComparisonButton from "./header/ComparisonButton";

type BottomMobileBarProps = {
  cartItemsCount: number;
  userButton: React.ReactNode;
};

export default function BottomMobileBar({
  cartItemsCount,
  userButton,
}: BottomMobileBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around h-16 px-2">
        <ModeToggle />
        <WishlistButton modal={false} />
        <ComparisonButton modal={false} />
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="relative overflow-visible h-10 w-10 outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
        >
          <Link href={ROUTES.CART} className="relative overflow-visible">
            <ShoppingCart className="h-5 w-5" />
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
        {userButton}
      </div>
    </div>
  );
}
