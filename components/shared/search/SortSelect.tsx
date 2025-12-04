"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CONTENT_PAGE from "@/lib/content-page";

const sortOptions = [
  { label: CONTENT_PAGE.PAGE.SEARCH.newest, value: "newest" },
  { label: CONTENT_PAGE.PAGE.SEARCH.lowest, value: "lowest" },
  { label: CONTENT_PAGE.PAGE.SEARCH.highest, value: "highest" },
  { label: CONTENT_PAGE.PAGE.SEARCH.rating, value: "rating" },
];

type SortSelectProps = {
  currentSort: string;
  q: string;
  category: string;
  price: string;
  rating: string;
  page: string;
};

export default function SortSelect({
  currentSort,
  q,
  category,
  price,
  rating,
  page,
}: SortSelectProps) {
  const router = useRouter();

  const normalizedCurrentSort = currentSort.toLowerCase();

  const handleSortChange = (value: string) => {
    const params = { q, category, price, rating, sort: value, page };
    const url = `/search?${new URLSearchParams(params).toString()}`;
    router.push(url);
  };

  return (
    <div className="flex items-center gap-2">
      <span>{CONTENT_PAGE.PAGE.SEARCH.sortBy}</span>
      <Select value={normalizedCurrentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[15rem]">
          <SelectValue placeholder="Select sort order" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
