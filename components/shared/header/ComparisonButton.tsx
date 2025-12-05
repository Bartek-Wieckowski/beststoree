"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useComparison } from "@/hooks/use-comparison";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { Scale, Trash2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import ComparisonModal from "@/components/shared/product/ComparisonModal";

type ComparisonButtonProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
};

export default function ComparisonButton({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  modal: controlledModal,
}: ComparisonButtonProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const [modalOpen, setModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { comparison, isLoaded, removeFromComparison, clearComparison, count } =
    useComparison();
  const { toast } = useToast();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleRemove = (productId: string, productName: string) => {
    removeFromComparison(productId);
    toast({
      description: `${productName} ${CONTENT_PAGE.GLOBAL.removedFromComparison}`,
    });
  };

  const handleClear = () => {
    clearComparison();
    toast({
      description: CONTENT_PAGE.COMPONENT.COMPARISON.comparisonCleared,
    });
  };

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Scale className="h-5 w-5" />
      </Button>
    );
  }

  const modal = controlledModal !== undefined ? controlledModal : isTouchDevice;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={modal}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          data-mobile-comparison-button
          className="relative overflow-visible outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
          onMouseEnter={() => {
            if (!isTouchDevice) setOpen(true);
          }}
          onMouseLeave={() => {
            if (!isTouchDevice) {
              setOpen(false);
              // Remove focus after mouse leaves to prevent outline
              setTimeout(() => {
                buttonRef.current?.blur();
              }, 0);
            }
          }}
        >
          <Scale className="h-5 w-5" />
          <span className="sr-only">
            {CONTENT_PAGE.COMPONENT.HEADER.comparison}
          </span>
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -left-2 md:left-auto md:-right-2 h-5 w-5 flex items-center justify-center p-0 text-xs z-20"
            >
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] max-w-96 sm:w-96 max-h-[31.25rem] overflow-x-hidden"
        align="end"
        sideOffset={4}
        onMouseEnter={() => {
          if (!isTouchDevice) setOpen(true);
        }}
        onMouseLeave={() => {
          if (!isTouchDevice) setOpen(false);
        }}
      >
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="p-0">
            {CONTENT_PAGE.COMPONENT.COMPARISON.title}
          </DropdownMenuLabel>
          {count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              {CONTENT_PAGE.COMPONENT.COMPARISON.clearComparison}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {!Array.isArray(comparison) || comparison.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>{CONTENT_PAGE.COMPONENT.COMPARISON.empty}</p>
            <p className="mt-2 text-xs">
              {CONTENT_PAGE.COMPONENT.COMPARISON.addProducts}
            </p>
          </div>
        ) : (
          <div className="max-h-[25rem] overflow-y-auto overflow-x-hidden">
            {Array.isArray(comparison) &&
              comparison.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-2 hover:bg-accent rounded-sm min-w-0"
                >
                  <Link
                    href={ROUTES.PRODUCT(item.slug)}
                    className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CONTENT_PAGE.GLOBAL.currencySymbol}
                        {Number(item.price).toFixed(2)}
                      </p>
                      {item.categoryName && (
                        <p className="text-xs text-muted-foreground">
                          {item.categoryName}
                        </p>
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.productId, item.name);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">
                      {CONTENT_PAGE.GLOBAL.remove}
                    </span>
                  </Button>
                </div>
              ))}
            {comparison.length > 1 && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      setModalOpen(true);
                    }}
                  >
                    {CONTENT_PAGE.COMPONENT.COMPARISON.compareProducts}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DropdownMenuContent>
      <ComparisonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        products={comparison}
      />
    </DropdownMenu>
  );
}
