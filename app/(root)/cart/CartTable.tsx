"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import {
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus, Trash2 } from "lucide-react";
import { Cart, CartItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">{CONTENT_PAGE.PAGE.CART.shoppingCart}</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          {CONTENT_PAGE.PAGE.CART.cartIsEmpty}{" "}
          <Link href={ROUTES.HOME}>{CONTENT_PAGE.GLOBAL.goShopping}</Link>
        </div>
      ) : (
        <div className="grid xl-custom:grid-cols-4 xl-custom:gap-6">
          <div className="overflow-x-auto xl-custom:col-span-3 space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{CONTENT_PAGE.GLOBAL.item}</TableHead>
                  <TableHead className="text-center">
                    {CONTENT_PAGE.GLOBAL.quantity}
                  </TableHead>
                  <TableHead className="text-right">
                    {CONTENT_PAGE.GLOBAL.price}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item, index) => (
                  <TableRow
                    key={`${item.productId}-${item.size || ""}-${item.color || ""}-${index}`}
                  >
                    <TableCell>
                      <Link
                        href={ROUTES.PRODUCT(item.slug)}
                        className="flex items-center"
                      >
                        {item.image && item.image.trim() !== "" && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        )}
                        <div className="px-2">
                          <span className="font-medium">{item.name}</span>
                          {(item.size || item.color) && (
                            <div className="text-xs text-muted-foreground">
                              {item.size && (
                                <span>
                                  {CONTENT_PAGE.GLOBAL.size} {item.size}
                                </span>
                              )}
                              {item.size && item.color && (
                                <span>{CONTENT_PAGE.GLOBAL.separator}</span>
                              )}
                              {item.color && (
                                <span>
                                  {CONTENT_PAGE.GLOBAL.color} {item.color}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <RemoveButton item={item} />
                      <span
                        data-testid="quantity"
                        className="min-w-[2ch] text-center"
                      >
                        {item.qty}
                      </span>
                      <AddButton item={item} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Clear All Cart Button */}
            <div className="flex justify-end pt-2">
              <ClearCartButton />
            </div>
          </div>

          {/* Order Summary Card */}
          <Card className="h-fit md:sticky md:top-4 mt-5 xl-custom:mt-0">
            <CardHeader>
              <CardTitle className="text-lg">
                {CONTENT_PAGE.GLOBAL.total}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {CONTENT_PAGE.GLOBAL.subtotal} (
                    {cart.items.reduce((a, c) => a + c.qty, 0)}{" "}
                    {cart.items.reduce((a, c) => a + c.qty, 0) === 1
                      ? CONTENT_PAGE.GLOBAL.item
                      : CONTENT_PAGE.GLOBAL.items}
                    )
                  </span>
                  <span className="font-medium">
                    {formatCurrency(cart.itemsPrice)}
                  </span>
                </div>
                {Number(cart.shippingPrice) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {CONTENT_PAGE.GLOBAL.shipping}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(cart.shippingPrice)}
                    </span>
                  </div>
                )}
                {Number(cart.taxPrice) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {CONTENT_PAGE.GLOBAL.tax}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(cart.taxPrice)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold">
                    {CONTENT_PAGE.GLOBAL.total}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(cart.totalPrice)}
                  </span>
                </div>
              </div>

              <Button
                data-testid="checkout-button"
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push(ROUTES.SHIPPING_ADDRESS))
                }
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                {CONTENT_PAGE.PAGE.CART.proceedToCheckout}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
function AddButton({ item }: { item: CartItem }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      data-testid="increase-quantity"
      disabled={isPending}
      variant="outline"
      size="icon"
      type="button"
      onClick={() =>
        startTransition(async () => {
          const res = await addItemToCart(item);

          if (!res.success) {
            toast({
              variant: "destructive",
              description: res.message as string,
            });
          }
        })
      }
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
    </Button>
  );
}

function RemoveButton({ item }: { item: CartItem }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      data-testid="decrease-quantity"
      disabled={isPending}
      variant="outline"
      size="icon"
      type="button"
      onClick={() =>
        startTransition(async () => {
          const res = await removeItemFromCart(
            item.productId,
            item.size,
            item.color
          );

          if (!res.success) {
            toast({
              variant: "destructive",
              description: res.message as string,
            });
          }
        })
      }
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Minus className="w-4 h-4" />
      )}
    </Button>
  );
}

function ClearCartButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await clearCart();
          if (res.success) {
            toast({
              description: res.message as string,
            });
            router.refresh();
          } else {
            toast({
              variant: "destructive",
              description: res.message as string,
            });
          }
        })
      }
      className="gap-2"
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      {CONTENT_PAGE.PAGE.CART.clearAllCart}
    </Button>
  );
}
