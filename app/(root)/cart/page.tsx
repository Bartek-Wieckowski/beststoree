import { getMyCart } from "@/lib/actions/cart.actions";
import CartTable from "./CartTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getMyCart();
  return (
    <div className="wrapper">
      <CartTable cart={cart} />
    </div>
  );
}
