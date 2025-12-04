import ProductCard from "@/components/shared/product/ProductCard";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import Link from "next/link";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import SortSelect from "@/components/shared/search/SortSelect";
import FilterDrawer from "@/components/shared/search/FilterDrawer";
import FilterLinks from "@/components/shared/search/FilterLinks";

const prices = [
  {
    name: `${CONTENT_PAGE.GLOBAL.currencySymbol}1 to ${CONTENT_PAGE.GLOBAL.currencySymbol}50`,
    value: "1-50",
  },
  {
    name: `${CONTENT_PAGE.GLOBAL.currencySymbol}51 to ${CONTENT_PAGE.GLOBAL.currencySymbol}100`,
    value: "51-100",
  },
  {
    name: `${CONTENT_PAGE.GLOBAL.currencySymbol}101 to ${CONTENT_PAGE.GLOBAL.currencySymbol}200`,
    value: "101-200",
  },
  {
    name: `${CONTENT_PAGE.GLOBAL.currencySymbol}201 to ${CONTENT_PAGE.GLOBAL.currencySymbol}500`,
    value: "201-500",
  },
  {
    name: `${CONTENT_PAGE.GLOBAL.currencySymbol}501 to ${CONTENT_PAGE.GLOBAL.currencySymbol}1000`,
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    q = CONTENT_PAGE.GLOBAL.all,
    category = CONTENT_PAGE.GLOBAL.all,
    price = CONTENT_PAGE.GLOBAL.all,
    rating = CONTENT_PAGE.GLOBAL.all,
    sort = CONTENT_PAGE.PAGE.SEARCH.newest.toLowerCase(),
    page = "1",
  } = await searchParams;

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();
  const cart = await getMyCart();

  return (
    <>
      {/* Mobile filter button - outside grid */}
      <div className="md:hidden mb-4">
        <FilterDrawer>
          <FilterLinks
            categories={categories}
            prices={prices}
            ratings={ratings}
            category={category}
            price={price}
            rating={rating}
            q={q}
            sort={sort}
            page={page}
            isMobile={true}
          />
        </FilterDrawer>
      </div>
      <div className="grid md:grid-cols-5 md:gap-5">
        {/* Desktop filters - inside grid */}
        <div className="hidden md:block">
          <FilterLinks
            categories={categories}
            prices={prices}
            ratings={ratings}
            category={category}
            price={price}
            rating={rating}
            q={q}
            sort={sort}
            page={page}
            isMobile={false}
          />
        </div>
        <div className="md:col-span-4 space-y-4">
          <div className="flex-between flex-col md:flex-row my-4">
            <div className="flex items-center">
              {q !== CONTENT_PAGE.GLOBAL.all &&
                q !== "" &&
                `${CONTENT_PAGE.PAGE.SEARCH.query} ${q}`}
              {category !== CONTENT_PAGE.GLOBAL.all &&
                category !== "" &&
                ` ${CONTENT_PAGE.PAGE.SEARCH.category} ${category}`}
              {price !== CONTENT_PAGE.GLOBAL.all &&
                ` ${CONTENT_PAGE.PAGE.SEARCH.price} ${price}`}
              {rating !== CONTENT_PAGE.GLOBAL.all &&
                ` ${CONTENT_PAGE.PAGE.SEARCH.ratingLabel} ${rating} ${CONTENT_PAGE.PAGE.SEARCH.starsAndUp}`}
              &nbsp;
              {(q !== CONTENT_PAGE.GLOBAL.all && q !== "") ||
              (category !== CONTENT_PAGE.GLOBAL.all && category !== "") ||
              rating !== CONTENT_PAGE.GLOBAL.all ||
              price !== CONTENT_PAGE.GLOBAL.all ? (
                <Button variant={"link"} asChild>
                  <Link href={ROUTES.SEARCH}>{CONTENT_PAGE.GLOBAL.clear}</Link>
                </Button>
              ) : null}
            </div>
            <SortSelect
              currentSort={sort}
              q={q}
              category={category}
              price={price}
              rating={rating}
              page={page}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.data.length === 0 && (
              <div>{CONTENT_PAGE.GLOBAL.noProductsFound}</div>
            )}
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} cart={cart} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
