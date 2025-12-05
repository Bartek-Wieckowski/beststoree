import Header from "@/components/shared/header/Header";
import Footer from "@/components/Footer";
import BottomMobileBar from "@/components/shared/BottomMobileBar";
import { getMyCart } from "@/lib/actions/cart.actions";
import UserButton from "@/components/shared/header/UserButton";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cartItemsCount = 0;
  try {
    const cart = await getMyCart();
    cartItemsCount = cart?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  } catch {
    cartItemsCount = 0;
  }

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="flex-1 wrapper pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomMobileBar
        cartItemsCount={cartItemsCount}
        userButton={<UserButton />}
      />
    </div>
  );
}
