import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ROUTES from '@/lib/routes';
import CONTENT_PAGE from '@/lib/content-page';

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link
            href={ROUTES.HOME}
            className="flex-start ml-4"
            data-testid="logo-link"
          >
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={40}
              height={40}
              priority
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="space-x-2">
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
        </div>
      </div>
    </header>
  );
}
