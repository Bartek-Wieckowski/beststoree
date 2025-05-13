import { describe, it, expect } from "vitest";
import {
  convertToPlanObject,
  formatError,
  formatNumberWithDecimals,
  round2,
} from "../../lib/utils";
import { signInFormSchema, signUpFormSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

describe("convertToPlanObject", () => {
  it("should convert an object to a plan object and back", () => {
    const input = { name: "Test", value: 42 };
    const result = convertToPlanObject(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("should handle arrays", () => {
    const input = [1, 2, 3];
    const result = convertToPlanObject(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("should handle nested objects", () => {
    const input = { user: { name: "Alice", age: 30 } };
    const result = convertToPlanObject(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });
});

describe("formatNumberWithDecimals", () => {
  it("should format a number with two decimal places", () => {
    const result = formatNumberWithDecimals(123.45);
    expect(result).toBe("123.45");
  });

  it("should format a number with no decimal places", () => {
    const result = formatNumberWithDecimals(123);
    expect(result).toBe("123.00");
  });
});

describe("formatError", () => {
  it("should format SignIn form (email) ZodError correctly", () => {
    const result = signInFormSchema.safeParse({
      email: "invalid",
      password: "123567",
    });

    if (result.success) return;
    const formattedError = formatError(result.error);

    if ("fieldErrors" in formattedError) {
      expect(formattedError.fieldErrors).toHaveProperty("email");
      expect(formattedError.fieldErrors?.email).toContain(
        "Invalid email address",
      );
    }
  });
  it("should format SignIn form (password) ZodError correctly", () => {
    const result = signInFormSchema.safeParse({
      email: "invalid@gmail.com",
      password: "123",
    });

    if (result.success) return;
    const formattedError = formatError(result.error);

    if ("fieldErrors" in formattedError) {
      expect(formattedError.fieldErrors).toHaveProperty("password");

      expect(formattedError.fieldErrors?.password).toContain(
        "Password must be at least 6 characters",
      );
    }
  });

  it("should format SignUp form ZodError correctly", () => {
    const result = signUpFormSchema.safeParse({
      name: "a",
      email: "invalid",
      password: "123",
      confirmPassword: "456",
    });

    if (result.success) return;
    const formattedError = formatError(result.error);

    if ("fieldErrors" in formattedError) {
      expect(formattedError.fieldErrors).toHaveProperty("name");
      expect(formattedError.fieldErrors?.name).toContain(
        "Name must be at least 3 characters",
      );

      expect(formattedError.fieldErrors).toHaveProperty("email");
      expect(formattedError.fieldErrors?.email).toContain(
        "Invalid email address",
      );

      expect(formattedError.fieldErrors).toHaveProperty("password");
      expect(formattedError.fieldErrors?.password).toContain(
        "Password must be at least 6 characters",
      );

      expect(formattedError.fieldErrors).toHaveProperty("confirmPassword");
      expect(formattedError.fieldErrors?.confirmPassword).toContain(
        "Passwords don't match",
      );
    }
  });

  it("should format PrismaClientKnownRequestError correctly", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError("Test error", {
      code: "P2002",
      clientVersion: "4.0.0",
    });

    const formattedError = formatError(prismaError);

    if ("prismaError" in formattedError) {
      expect(formattedError.prismaError).toEqual({
        code: "P2002",
        message: "Invalid registration details. Please try again.",
      });
    }
  });

  it("should format AuthError for CredentialsSignin correctly", () => {
    const authError = new AuthError("CredentialsSignin");

    const formattedError = formatError(authError);

    expect(formattedError).toEqual({
      generalError: "Invalid credentials",
    });
  });

  it("should format standard Error correctly", () => {
    const error = new Error("Sample error message");

    const formattedError = formatError(error);

    expect(formattedError).toEqual({
      generalError: "Sample error message",
    });
  });

  it("should format unknown error type correctly", () => {
    const unknownError = { message: "unknown error" };

    const formattedError = formatError(unknownError);

    expect(formattedError).toEqual({
      generalError: JSON.stringify(unknownError),
    });
  });
});

describe("round2", () => {
  it("should return number with two decimales", () => {
    const dummyNumber = 12345.6789;
    const dummyNumberString = "12345.6789";

    const result1 = round2(dummyNumber);
    const result2 = round2(dummyNumberString);

    expect(result1).toBe(12345.68);
    expect(result2).toBe(12345.68);
  });

  it("should throw error if value is not number or string", () => {
    const dummyData = true;

    expect(() => round2(dummyData)).toThrowError(
      "Value is not a number or string",
    );
  });
});
