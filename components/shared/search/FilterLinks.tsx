"use client";

import Link from "next/link";
import CONTENT_PAGE from "@/lib/content-page";
import { DrawerClose } from "@/components/ui/drawer";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Price = {
  name: string;
  value: string;
};

type FilterLinksProps = {
  categories: Category[];
  prices: Price[];
  ratings: number[];
  category: string;
  price: string;
  rating: string;
  q: string;
  sort: string;
  page: string;
  isMobile?: boolean;
};

export default function FilterLinks({
  categories,
  prices,
  ratings,
  category,
  price,
  rating,
  q,
  sort,
  page,
  isMobile = false,
}: FilterLinksProps) {
  const buildFilterUrl = ({
    c,
    p,
    r,
  }: {
    c?: string;
    p?: string;
    r?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const LinkWrapper = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    if (isMobile) {
      return (
        <DrawerClose asChild>
          <Link href={href}>{children}</Link>
        </DrawerClose>
      );
    }
    return <Link href={href}>{children}</Link>;
  };

  return (
    <div className="filter-links">
      {/* Category Links */}
      <div className="text-xl mb-2 mt-3">
        {CONTENT_PAGE.PAGE.SEARCH.department}
      </div>
      <div>
        <ul className="space-y-1">
          <li>
            <LinkWrapper href={buildFilterUrl({ c: CONTENT_PAGE.GLOBAL.all })}>
              <span
                className={`${
                  (category === CONTENT_PAGE.GLOBAL.all || category === "") &&
                  "font-bold"
                }`}
              >
                {CONTENT_PAGE.GLOBAL.any}
              </span>
            </LinkWrapper>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <LinkWrapper href={buildFilterUrl({ c: cat.slug })}>
                <span className={`${category === cat.slug && "font-bold"}`}>
                  {cat.name}
                </span>
              </LinkWrapper>
            </li>
          ))}
        </ul>
      </div>
      {/* Price Links */}
      <div className="text-xl mb-2 mt-8">{CONTENT_PAGE.PAGE.SEARCH.price}</div>
      <div>
        <ul className="space-y-1">
          <li>
            <LinkWrapper href={buildFilterUrl({ p: CONTENT_PAGE.GLOBAL.all })}>
              <span
                className={`${price === CONTENT_PAGE.GLOBAL.all && "font-bold"}`}
              >
                {CONTENT_PAGE.GLOBAL.any}
              </span>
            </LinkWrapper>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <LinkWrapper href={buildFilterUrl({ p: p.value })}>
                <span className={`${price === p.value && "font-bold"}`}>
                  {p.name}
                </span>
              </LinkWrapper>
            </li>
          ))}
        </ul>
      </div>
      {/* Rating Links */}
      <div className="text-xl mb-2 mt-8">
        {CONTENT_PAGE.PAGE.SEARCH.customerRatings}
      </div>
      <div>
        <ul className="space-y-1">
          <li>
            <LinkWrapper href={buildFilterUrl({ r: CONTENT_PAGE.GLOBAL.all })}>
              <span
                className={`${rating === CONTENT_PAGE.GLOBAL.all && "font-bold"}`}
              >
                {CONTENT_PAGE.GLOBAL.any}
              </span>
            </LinkWrapper>
          </li>
          {ratings.map((r) => (
            <li key={r}>
              <LinkWrapper href={buildFilterUrl({ r: `${r}` })}>
                <span className={`${rating === r.toString() && "font-bold"}`}>
                  {`${r} ${CONTENT_PAGE.PAGE.SEARCH.starsAndUp}`}
                </span>
              </LinkWrapper>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
