"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import { Promotion } from "@/types";

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

  // If no promotion, don't show the component
  if (!promotion || !promotion.endDate) {
    return null;
  }

  const product = promotion.product;

  if (!time) {
    return (
      <section className="sticky top-4 bg-card border rounded-lg p-4 md:p-6">
        <div className="flex flex-col gap-2 justify-center text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
            {CONTENT_PAGE.DEAL_COUNTDOWN.loadingCountdown}
          </h3>
        </div>
      </section>
    );
  }

  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="sticky top-4 bg-card border rounded-lg p-4 md:p-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:text-left">
              {CONTENT_PAGE.DEAL_COUNTDOWN.dealHasEnded}
            </h3>
            <p className="text-sm md:text-base text-center md:text-left text-muted-foreground">
              {CONTENT_PAGE.DEAL_COUNTDOWN.dealHasEndedDescription}
            </p>
          </div>
          <div className="flex justify-center md:justify-start mt-2">
            <Button asChild className="w-full md:w-auto">
              <Link href={ROUTES.SEARCH}>
                {CONTENT_PAGE.DEAL_COUNTDOWN.viewProducts}
              </Link>
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Link href={ROUTES.PRODUCT(product.slug)} className="block">
              <Image
                src={product.images[0] || "/images/promo.jpg"}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover rounded-md w-full h-auto"
              />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sticky top-4 bg-card border rounded-lg p-4 md:p-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-col gap-2 md:gap-3">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:text-left">
            {CONTENT_PAGE.DEAL_COUNTDOWN.dealOfTheMonth}
          </h3>
          <p className="text-base md:text-lg font-semibold text-center md:text-left">
            {product.name}
          </p>
          <p className="text-sm md:text-base text-center md:text-left text-muted-foreground">
            {CONTENT_PAGE.DEAL_COUNTDOWN.dealOfTheMonthDescription}
          </p>
        </div>
        <ul className="grid grid-cols-4 gap-2 md:gap-3 mt-2">
          <StatBox label={CONTENT_PAGE.DEAL_COUNTDOWN.days} value={time.days} />
          <StatBox
            label={CONTENT_PAGE.DEAL_COUNTDOWN.hours}
            value={time.hours}
          />
          <StatBox
            label={CONTENT_PAGE.DEAL_COUNTDOWN.minutes}
            value={time.minutes}
          />
          <StatBox
            label={CONTENT_PAGE.DEAL_COUNTDOWN.seconds}
            value={time.seconds}
          />
        </ul>
        <div className="flex justify-center md:justify-start mt-3 md:mt-4">
          <Button asChild className="w-full md:w-auto">
            <Link href={ROUTES.PRODUCT(product.slug)}>
              {CONTENT_PAGE.DEAL_COUNTDOWN.viewProducts}
            </Link>
          </Button>
        </div>
        <div className="flex justify-center mt-4">
          <Link href={ROUTES.PRODUCT(product.slug)} className="block">
            <Image
              src={product.images[0] || "/images/promo.jpg"}
              alt={product.name}
              width={300}
              height={200}
              className="object-cover rounded-md w-full h-auto"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-2 md:p-3 lg:p-4 w-full text-center bg-muted rounded-md">
    <p className="text-xl md:text-2xl lg:text-3xl font-bold">{value}</p>
    <p className="text-xs md:text-sm mt-1 text-muted-foreground">{label}</p>
  </li>
);
