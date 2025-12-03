"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWishlist } from "@/hooks/use-wishlist";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";

type WishlistButtonProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function WishlistButton({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: WishlistButtonProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { wishlist, isLoaded, removeFromWishlist, count } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      description: `${productName} removed from wishlist`,
    });
  };

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          data-mobile-wishlist-button
          className="relative overflow-visible outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
          onMouseEnter={() => {
            if (!isTouchDevice) setOpen(true);
          }}
          onMouseLeave={() => {
            if (!isTouchDevice) {
              setOpen(false);
              // Remove focus after mouse leaves to prevent outline
              setTimeout(() => {
                buttonRef.current?.blur();
              }, 0);
            }
          }}
        >
          <Heart className="h-5 w-5" />
          <span className="sr-only">{CONTENT_PAGE.HEADER.wishlist}</span>
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -left-2 md:left-auto md:-right-2 h-5 w-5 flex items-center justify-center p-0 text-xs z-20"
            >
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] max-w-80 sm:w-80"
        align="end"
        sideOffset={4}
        onMouseEnter={() => {
          if (!isTouchDevice) setOpen(true);
        }}
        onMouseLeave={() => {
          if (!isTouchDevice) setOpen(false);
        }}
      >
        <DropdownMenuLabel>{CONTENT_PAGE.WISHLIST.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!Array.isArray(wishlist) || wishlist.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p className="mb-2">{CONTENT_PAGE.WISHLIST.empty}</p>
            {pathname !== ROUTES.HOME && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(ROUTES.HOME)}
              >
                {CONTENT_PAGE.WISHLIST.goShopping}
              </Button>
            )}
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {Array.isArray(wishlist) &&
              wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-2 hover:bg-accent rounded-sm"
                >
                  <Link
                    href={ROUTES.PRODUCT(item.slug)}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.productId, item.name);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">
                      {CONTENT_PAGE.WISHLIST.remove}
                    </span>
                  </Button>
                </div>
              ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
