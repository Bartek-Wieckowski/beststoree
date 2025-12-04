"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import ModeToggle from "./header/ModeToggle";
import WishlistButton from "./header/WishlistButton";
import ComparisonButton from "./header/ComparisonButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { useSession } from "next-auth/react";

type BottomMobileBarProps = {
  cartItemsCount: number;
};

function MobileUserButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button asChild variant="ghost" size="icon" className="h-10 w-10">
        <Link href={ROUTES.SIGN_IN}>
          <UserIcon className="h-5 w-5" />
          <span className="sr-only">{CONTENT_PAGE.GLOBAL.signIn}</span>
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-visible rounded-full flex items-center justify-center bg-gray-200 dark:text-stone-900 dark:hover:text-white h-10 w-10 outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
        >
          {firstInitial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium leading-none">
              {session.user?.name}
            </div>
            <div className="text-sm text-muted-foreground leading-none">
              {session.user?.email}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem>
          <Link href={ROUTES.USER_PROFILE} className="w-full">
            {CONTENT_PAGE.COMPONENT.USER_BUTTON.userProfile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={ROUTES.USER_ORDERS} className="w-full">
            {CONTENT_PAGE.COMPONENT.USER_BUTTON.orderHistory}
          </Link>
        </DropdownMenuItem>

        {session?.user?.role === "admin" && (
          <DropdownMenuItem>
            <Link href={ROUTES.ADMIN_OVERVIEW} className="w-full">
              {CONTENT_PAGE.COMPONENT.USER_BUTTON.admin}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="p-0 mb-1">
          <form action={signOutUser} className="w-full">
            <Button
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
            >
              {CONTENT_PAGE.COMPONENT.USER_BUTTON.signOut}
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function BottomMobileBar({
  cartItemsCount,
}: BottomMobileBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around h-16 px-2">
        <ModeToggle />
        <WishlistButton />
        <ComparisonButton />
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
        <MobileUserButton />
      </div>
    </div>
  );
}
