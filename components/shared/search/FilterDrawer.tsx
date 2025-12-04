"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CONTENT_PAGE from "@/lib/content-page";
import { FilterIcon } from "lucide-react";
import { ReactNode, cloneElement, isValidElement, ReactElement } from "react";

type FilterDrawerProps = {
  children: ReactNode;
};

type FilterLinksProps = {
  isMobile?: boolean;
  [key: string]: unknown;
};

export default function FilterDrawer({ children }: FilterDrawerProps) {
  const mobileChildren = isValidElement(children)
    ? cloneElement(children as ReactElement<FilterLinksProps>, {
        isMobile: true,
      })
    : children;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          <FilterIcon className="mr-2 h-4 w-4" />
          {CONTENT_PAGE.GLOBAL.filters}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{CONTENT_PAGE.GLOBAL.filters}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[70vh] overflow-y-auto">
          {mobileChildren}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
