import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { ShippingAddress } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import PlaceOrderForm from "./PlaceOrderForm";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Place Order",
};

export default async function PlaceOrderPage() {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect(ROUTES.CART);
  if (!user.address) redirect(ROUTES.SHIPPING_ADDRESS);
  if (!user.paymentMethod) redirect(ROUTES.PAYMENT_METHOD);

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">
        {CONTENT_PAGE.PLACE_ORDER_PAGE.placeOrder}
      </h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">
                {CONTENT_PAGE.PLACE_ORDER_PAGE.shippingAddress}
              </h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{" "}
                {userAddress.postalCode}, {userAddress.country}{" "}
              </p>
              <div className="mt-3">
                <Link href={ROUTES.SHIPPING_ADDRESS}>
                  <Button variant="outline">
                    {CONTENT_PAGE.PLACE_ORDER_PAGE.edit}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">
                {CONTENT_PAGE.PLACE_ORDER_PAGE.paymentMethod}
              </h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href={ROUTES.PAYMENT_METHOD}>
                  <Button variant="outline">
                    {CONTENT_PAGE.PLACE_ORDER_PAGE.edit}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">
                {CONTENT_PAGE.PLACE_ORDER_PAGE.orderItems}
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{CONTENT_PAGE.PLACE_ORDER_PAGE.item}</TableHead>
                    <TableHead>
                      {CONTENT_PAGE.PLACE_ORDER_PAGE.quantity}
                    </TableHead>
                    <TableHead className="text-right">
                      {CONTENT_PAGE.PLACE_ORDER_PAGE.price}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={ROUTES.PRODUCT(item.slug)}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.PLACE_ORDER_PAGE.items}</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.PLACE_ORDER_PAGE.tax}</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.PLACE_ORDER_PAGE.shipping}</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{CONTENT_PAGE.PLACE_ORDER_PAGE.total}</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
