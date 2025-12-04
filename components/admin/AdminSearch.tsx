"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes(ROUTES.ADMIN_ORDERS)
    ? ROUTES.ADMIN_ORDERS
    : pathname.includes(ROUTES.ADMIN_USERS)
      ? ROUTES.ADMIN_USERS
      : ROUTES.ADMIN_PRODUCTS;

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder={CONTENT_PAGE.GLOBAL.search}
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">
        {CONTENT_PAGE.GLOBAL.search}
      </button>
    </form>
  );
};

export default AdminSearch;
