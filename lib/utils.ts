import { FormattedError } from "@/types";
import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { AuthError } from "next-auth";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlanObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
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
