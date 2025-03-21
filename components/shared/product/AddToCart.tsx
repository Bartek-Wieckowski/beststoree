"use client";

import CONTENT_PAGE from "@/lib/content-page";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart } from "@/lib/actions/cart.actions";
import ROUTES from "@/lib/routes";

export default function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast({
        description: res.message as string,
        variant: "destructive",
      });
      return;
    }

    toast({
      description: `${item.name} added to cart successfully`,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go To Cart"
          onClick={() => router.push(ROUTES.CART)}
        >
          Go To Cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      data-testid="add-to-cart-button"
    >
      <Plus /> {CONTENT_PAGE.PRODUCT_DETAILS.addToCart}
    </Button>
  );
}
