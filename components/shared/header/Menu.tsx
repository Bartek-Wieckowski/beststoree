import { Button } from "@/components/ui/button";
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
import ModeToggle from "./ModeToggle";
import UserButton from "./UserButton";

export default function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost" data-testid="cart-button">
          <Link href={ROUTES.CART}>
            <ShoppingCart /> {CONTENT_PAGE.HEADER.cart}
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
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href={ROUTES.CART}>
                <ShoppingCart /> {CONTENT_PAGE.HEADER.cart}
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
