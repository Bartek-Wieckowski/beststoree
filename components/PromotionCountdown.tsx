"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import { Promotion } from "@/types";
import { formatCurrency, getProductPrice } from "@/lib/utils";
import { X, Tag, Info } from "lucide-react";
import ProductRating from "@/components/shared/product/ProductRating";

// Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

export default function PromotionCountdown({
  promotion,
}: {
  promotion?: Promotion | null;
}) {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const mobileInfoRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // If no promotion, don't set up timer
    if (!promotion || !promotion.endDate) {
      return;
    }

    const endDateString =
      typeof promotion.endDate === "string"
        ? promotion.endDate
        : promotion.endDate.toISOString();
    const targetDate = new Date(endDateString);

    // Calculate initial time on client
    setTime(calculateTimeRemaining(targetDate));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(targetDate);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [promotion]);

  // Close mobile info popup when clicking outside
  useEffect(() => {
    if (!showMobileInfo) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;

      // Check if click is outside both the popup and the info button
      if (
        mobileInfoRef.current &&
        !mobileInfoRef.current.contains(target) &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(target)
      ) {
        setShowMobileInfo(false);
      }
    };

    // Add event listener with a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMobileInfo]);

  // If no promotion, don't show the component
  if (!promotion || !promotion.endDate) {
    return null;
  }

  const product = promotion.product;
  const effectivePrice = getProductPrice({
    price: product.price,
    promotion: promotion.isEnabled
      ? {
          discountPercentage: promotion.discountPercentage,
          endDate: promotion.endDate,
          isEnabled: promotion.isEnabled,
        }
      : null,
  });
  const hasActivePromotion =
    promotion.isEnabled &&
    new Date(promotion.endDate) >= new Date() &&
    Number(promotion.discountPercentage) > 0;

  if (!time) {
    return null;
  }

  // If countdown has ended, don't show
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return null;
  }

  if (!isVisible) {
    // Show button to reveal on mobile
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 md:right-6 z-50 md:hidden">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          className="rounded-full w-12 h-12 p-0 shadow-lg relative"
          variant="default"
        >
          <Tag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 text-[0.625rem] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
            %
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 md:right-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main fixed button with image and countdown */}
      <div className="relative flex flex-col gap-2 justify-center">
        {/* Hide button for mobile */}
        <button
          onClick={() => setIsVisible(false)}
          className="md:hidden absolute -top-2 -right-2 z-10 rounded-full bg-destructive text-destructive-foreground p-1 shadow-lg hover:bg-destructive/90 transition-colors"
          aria-label={CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.hidePromotion}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Info button for mobile - above X button */}
        <button
          ref={infoButtonRef}
          onClick={() => setShowMobileInfo(!showMobileInfo)}
          className="md:hidden absolute -top-14 -right-[0.65rem] rounded-full bg-primary text-primary-foreground p-1.5 shadow-lg hover:bg-primary/90 transition-colors z-10"
          aria-label={
            CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.showProductInfo
          }
        >
          <Info className="h-4 w-4" />
        </button>

        {/* Product image thumbnail */}
        <Link
          href={ROUTES.PRODUCT(product.slug)}
          className="block relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-lg border-2 border-primary hover:scale-105 transition-transform mx-auto"
        >
          <Image
            src={product.images[0] || "/images/promo.jpg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </Link>

        {/* Timer in one row as miniatures */}
        <div className="flex gap-1">
          <TimeBox label="D" value={time.days} />
          <TimeBox label="H" value={time.hours} />
          <TimeBox label="Min" value={time.minutes} />
          <TimeBox label="Sec" value={time.seconds} />
        </div>

        {/* Mobile info popup */}
        {showMobileInfo && (
          <div
            ref={mobileInfoRef}
            className="md:hidden absolute right-0 top-full mt-2 w-64 bg-card border rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-20"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold">
                  {CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.dealOfTheMonth}
                </h3>
                <button
                  onClick={() => setShowMobileInfo(false)}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                  aria-label={CONTENT_PAGE.GLOBAL.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Product name */}
              <p className="text-base font-semibold text-foreground">
                {product.name}
              </p>
              {/* Price and rating */}
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                  {hasActivePromotion && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(Number(product.price))}
                    </span>
                  )}
                  <span className="font-semibold text-primary">
                    {formatCurrency(effectivePrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ProductRating value={Number(product.rating)} />
                  <span className="text-sm">
                    {Number(product.rating).toFixed(1)} ({product.numReviews}{" "}
                    {CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.reviews})
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button asChild size="sm" className="w-full">
                  <Link href={ROUTES.PRODUCT(product.slug)}>
                    {CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.viewProducts}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hover popup - desktop only */}
        {isHovered && (
          <div className="hidden md:block absolute right-full mr-4 top-0 w-64 md:w-72 bg-card border rounded-lg shadow-xl p-4 md:p-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg md:text-xl font-bold">
                {CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.dealOfTheMonth}
              </h3>
              {/* Product name */}
              <p className="text-base font-semibold text-foreground">
                {product.name}
              </p>
              {/* Price and rating */}
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                  {hasActivePromotion && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(Number(product.price))}
                    </span>
                  )}
                  <span className="font-semibold text-primary">
                    {formatCurrency(effectivePrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ProductRating value={Number(product.rating)} />
                  <span className="text-sm">
                    {Number(product.rating).toFixed(1)} ({product.numReviews}{" "}
                    {CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.reviews})
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button asChild size="sm" className="w-full">
                  <Link href={ROUTES.PRODUCT(product.slug)}>
                    {CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.viewProducts}
                  </Link>
                </Button>
              </div>
            </div>
            {/* Arrow pointing to the button */}
            <div className="absolute right-0 top-1/2 translate-y-[-50%] translate-x-full">
              <div className="w-0 h-0 border-t-[0.5rem] border-t-transparent border-b-[0.5rem] border-b-transparent border-l-[0.5rem] border-l-card"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const TimeBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex-1 min-w-0 bg-muted rounded-md p-1.5 md:p-2 text-center border border-border">
    <p className="text-xs md:text-sm font-bold leading-tight">{value}</p>
    <p className="text-[0.5rem] md:text-[0.625rem] mt-0.5 text-muted-foreground leading-tight whitespace-nowrap">
      {label}
    </p>
  </div>
);
