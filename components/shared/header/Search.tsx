import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <form action={ROUTES.SEARCH} method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          name="q"
          type="text"
          placeholder={CONTENT_PAGE.GLOBAL.search}
          className="md:w-[6.25rem] lg:w-[18.75rem]"
        />
        <Button className="block md:hidden">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
}
