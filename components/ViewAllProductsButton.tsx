import CONTENT_PAGE from "@/lib/content-page";
import { Button } from "./ui/button";
import Link from "next/link";
import ROUTES from "@/lib/routes";

export default function ViewAllProductsButton() {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link href={ROUTES.SEARCH}>
          {CONTENT_PAGE.BUTTON.viewAllProductsButton}
        </Link>
      </Button>
    </div>
  );
}
