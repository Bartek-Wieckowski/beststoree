import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ROUTES from '@/lib/routes';
import CONTENT_PAGE from '@/lib/content-page';
import ModeToggle from './ModeToggle';
import Link from 'next/link';

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
        <Button asChild data-testid="sign-in-button">
          <Link href={ROUTES.SIGN_IN}>
            <UserIcon /> {CONTENT_PAGE.HEADER.signIn}
          </Link>
        </Button>
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
            {/* <UserButton /> */}
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
