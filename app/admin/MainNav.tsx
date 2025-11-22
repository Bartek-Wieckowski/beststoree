"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import ROUTES from "@/lib/routes";

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
    title: "Orders",
    href: ROUTES.ADMIN_ORDERS,
  },
  {
    title: "Users",
    href: ROUTES.ADMIN_USERS,
  },
];

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
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
  );
}
