"use client";

import CONTENT_PAGE from "@/lib/content-page";
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import ROUTES from "@/lib/routes";
import { useTransition } from "react";

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart;
  item: CartItem;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [isAddPending, startAddTransition] = useTransition();
  const [isRemovePending, startRemoveTransition] = useTransition();

  const handleAddToCart = async () => {
    startAddTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast({
          description: res.message as string,
          variant: "destructive",
        });
        return;
      }

      toast({
        description: res.message as string,
        action: (
          <ToastAction
            className=""
            altText="Go To Cart"
            onClick={() => router.push(ROUTES.CART)}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startRemoveTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message as string,
      });

      return;
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isRemovePending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isAddPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      data-testid="add-to-cart-button"
      onClick={handleAddToCart}
    >
      {isAddPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}{" "}
      {CONTENT_PAGE.PRODUCT_DETAILS.addToCart}
    </Button>
  );
}
