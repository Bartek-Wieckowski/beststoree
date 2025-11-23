import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/lib/routes";
import Menu from "./Menu";
import CategoryDrawer from "./CategoryDrawer";
import Search from "./Search";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link
            href={ROUTES.HOME}
            className="flex-start ml-4"
            data-testid="logo-link"
          >
            <Image
              src="/images/logo.png"
              alt={`${APP_NAME} logo`}
              width={40}
              height={40}
              priority
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
}
