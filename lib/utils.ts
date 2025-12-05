import { FormattedError } from "@/types";
import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { AuthError } from "next-auth";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import qs from "query-string";
import { NUMBER_FORMATTER } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function dateToLocalDateTimeString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function localDateTimeStringToDate(value: string): Date {
  if (!value) return new Date();
  // datetime-local format: YYYY-MM-DDTHH:mm
  // Create date in local timezone
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

export function formatNumberWithDecimals(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

export function formatError(error: unknown): FormattedError {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
      const field = err.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });

    return { fieldErrors };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // const field = Array.isArray(error.meta?.target)
      //   ? error.meta.target[0]
      //   : 'unknown_field';

      return {
        prismaError: {
          code: error.code,
          message: "Invalid registration details. Please try again.",
          // message: `${
          //   field.charAt(0).toUpperCase() + field.slice(1)
          // } already exists`,
        },
      };
    }
  }

  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin":
        return {
          generalError: "Invalid credentials",
        };

      default:
        return {
          generalError: "Something went wrong",
        };
    }
  }

  return {
    generalError:
      error instanceof Error ? error.message : JSON.stringify(error),
  };
}

export function formatErrorMessage(formattedError: FormattedError): string {
  if ("generalError" in formattedError) {
    return formattedError.generalError;
  } else if ("prismaError" in formattedError) {
    return formattedError.prismaError.message;
  } else if ("message" in formattedError) {
    return formattedError.message;
  } else if ("fieldErrors" in formattedError && formattedError.fieldErrors) {
    return Object.values(formattedError.fieldErrors).flat().join(", ");
  } else {
    return "An error occurred";
  }
}

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function formatId(id: string) {
  return `..${id.slice(id.length - 6)}`;
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}

export function calculatePromotionalPrice(
  originalPrice: number | string,
  discountPercentage: number | string
): number {
  const price =
    typeof originalPrice === "string" ? Number(originalPrice) : originalPrice;
  const discount =
    typeof discountPercentage === "string"
      ? Number(discountPercentage)
      : discountPercentage;

  if (discount <= 0) {
    return price;
  }

  const discountAmount = (price * discount) / 100;
  const promotionalPrice = price - discountAmount;

  return round2(promotionalPrice);
}

export function getProductPrice(product: {
  price: number | string;
  promotion?: {
    discountPercentage: number | string;
    endDate: Date | string;
    isEnabled: boolean;
  } | null;
}): number {
  const originalPrice =
    typeof product.price === "string" ? Number(product.price) : product.price;

  if (!product.promotion || !product.promotion.isEnabled) {
    return originalPrice;
  }

  const endDate =
    typeof product.promotion.endDate === "string"
      ? new Date(product.promotion.endDate)
      : product.promotion.endDate;

  // Check if promotion is still active
  if (endDate < new Date()) {
    return originalPrice;
  }

  return calculatePromotionalPrice(
    originalPrice,
    product.promotion.discountPercentage
  );
}
