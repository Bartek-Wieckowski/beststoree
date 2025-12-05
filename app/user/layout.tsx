import Menu from "@/components/shared/header/Menu";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./MainNav";
import ROUTES from "@/lib/routes";
import BottomMobileBar from "@/components/shared/BottomMobileBar";
import { getMyCart } from "@/lib/actions/cart.actions";
import UserButton from "@/components/shared/header/UserButton";

export default async function UserLayout({
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
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href={ROUTES.HOME} className="w-22">
              <Image
                src="/images/logo.png"
                height={48}
                width={48}
                alt={APP_NAME}
              />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              <Menu />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto pb-20 md:pb-8">
          {children}
        </div>
      </div>
      <BottomMobileBar
        cartItemsCount={cartItemsCount}
        userButton={<UserButton />}
      />
    </>
  );
}
