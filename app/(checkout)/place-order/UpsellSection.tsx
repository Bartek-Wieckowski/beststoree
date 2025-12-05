"use client";

import { Upsell, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { useToast } from "@/hooks/use-toast";
import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import ROUTES from "@/lib/routes";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import CONTENT_PAGE from "@/lib/content-page";

const UPSELL_DISMISSED_KEY = "upsell_dismissed";

export default function UpsellSection({ upsell }: { upsell: Upsell }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if upsell was already dismissed
    const dismissed = localStorage.getItem(UPSELL_DISMISSED_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleAddUpsellToCart = () => {
    const product = upsell.product;
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      qty: 1,
      image: product.images[0] || "",
      price: product.price.toString(),
      size: null,
      color: null,
    };

    startTransition(async () => {
      const res = await addItemToCart(cartItem);
      if (res.success) {
        toast({
          description: res.message as string,
        });
        // Save to localStorage that upsell was handled (added to cart)
        localStorage.setItem(UPSELL_DISMISSED_KEY, "true");
        setOpen(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      }
    });
  };

  const handleDismiss = () => {
    // Save to localStorage that upsell was dismissed
    localStorage.setItem(UPSELL_DISMISSED_KEY, "true");
    setOpen(false);
  };

  const product = upsell.product;
  const productImage =
    product.images && product.images.length > 0 ? product.images[0] : "";

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // User closed modal (clicked outside or pressed ESC)
      handleDismiss();
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {CONTENT_PAGE.COMPONENT.UPSELL_SECTION.specialOffer}
          </DialogTitle>
          <DialogDescription>
            {CONTENT_PAGE.COMPONENT.UPSELL_SECTION.addToOrderDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            {productImage && (
              <Link
                href={ROUTES.PRODUCT(product.slug)}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={productImage}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="rounded-md object-cover"
                />
              </Link>
            )}
            <div className="flex-1">
              <Link
                href={ROUTES.PRODUCT(product.slug)}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-semibold hover:underline text-lg mb-2">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-3">
                {product.description.substring(0, 150)}...
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xl">
                  {formatCurrency(product.price.toString())}
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isPending}
            className="flex-1"
          >
            {CONTENT_PAGE.COMPONENT.UPSELL_SECTION.noThanks}
          </Button>
          <Button
            onClick={handleAddUpsellToCart}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                {CONTENT_PAGE.COMPONENT.UPSELL_SECTION.adding}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {CONTENT_PAGE.COMPONENT.UPSELL_SECTION.addToOrder}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
