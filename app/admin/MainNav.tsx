"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import ROUTES from "@/lib/routes";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CONTENT_PAGE from "@/lib/content-page";

const links = [
  {
    title: "Overview",
    href: ROUTES.ADMIN_OVERVIEW,
  },
  {
    title: "Products",
    href: ROUTES.ADMIN_PRODUCTS,
  },
  {
    title: "Categories",
    href: ROUTES.ADMIN_CATEGORIES,
  },
  {
    title: "Orders",
    href: ROUTES.ADMIN_ORDERS,
  },
  {
    title: "Users",
    href: ROUTES.ADMIN_USERS,
  },
  {
    title: "Promotion",
    href: ROUTES.ADMIN_PROMOTION,
  },
  {
    title: "Presell",
    href: ROUTES.ADMIN_PRESELL,
  },
  {
    title: "Upsell",
    href: ROUTES.ADMIN_UPSELL,
  },
  {
    title: "Coupons",
    href: ROUTES.ADMIN_COUPONS,
  },
];

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Navigation - hidden below 1500px */}
      <nav
        className={cn(
          "hidden nav-desktop:flex items-center space-x-4 lg:space-x-6",
          className
        )}
        {...props}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.includes(item.href) ? "" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation - visible below 1500px */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="nav-desktop:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.openMenu}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.adminMenu}
            </SheetTitle>
            <SheetDescription>
              {CONTENT_PAGE.PAGE.ADMIN_OVERVIEW.navigationMenu}
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  pathname.includes(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
