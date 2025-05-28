import {
  getUserById,
  signInWithCredentials,
  signOutUser,
  signUpUser,
} from "@/lib/actions/user.actions";
import { describe, expect, it, vi } from "vitest";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prismaMock } from "@/__tests__/mocks/prisma.mock";

vi.mock("next/dist/client/components/redirect-error", () => ({
  isRedirectError: vi.fn(),
}));

describe("User Actions", () => {
  describe("signInWithCredentials", () => {
    it("should sign in a user with valid credentials", async () => {
      const formData = new FormData();
      formData.set("email", "test@test.com");
      formData.set("password", "password");

      vi.mocked(signIn).mockResolvedValue(undefined);

      const result = await signInWithCredentials(null, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@test.com",
        password: "password",
      });
      expect(result).toEqual({
        success: true,
        message: "Signed in successfully",
        fieldErrors: null,
        generalError: null,
        prismaError: null,
        inputs: {},
      });
    });

    it("should return error when credentials are invalid", async () => {
      const formData = new FormData();
      formData.set("email", "test@test.com");
      formData.set("password", "wrong_password");

      vi.mocked(signIn).mockRejectedValue(new Error("Invalid credentials"));
      vi.mocked(isRedirectError).mockReturnValue(false);

      const result = await signInWithCredentials(null, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@test.com",
        password: "wrong_password",
      });
      expect(result).toEqual({
        success: false,
        message: "",
        fieldErrors: null,
        generalError: "Invalid credentials",
        prismaError: null,
        inputs: { email: "test@test.com" },
      });
    });

    it("should throw redirect error when it occurs", async () => {
      const formData = new FormData();
      formData.set("email", "test@test.com");
      formData.set("password", "password");

      const redirectError = new Error("Redirect error");

      vi.mocked(signIn).mockRejectedValue(redirectError);
      vi.mocked(isRedirectError).mockReturnValue(true);

      await expect(signInWithCredentials(null, formData)).rejects.toThrow(
        redirectError,
      );

      expect(isRedirectError).toHaveBeenCalledWith(redirectError);
    });
  });

  describe("signUpUser", () => {
    it("should sign up a user with valid credentials", async () => {
      const formData = new FormData();
      formData.set("name", "test");
      formData.set("email", "test@test.com");
      formData.set("password", "password");
      formData.set("confirmPassword", "password");

      vi.mocked(signIn).mockResolvedValue(undefined);

      const result = await signInWithCredentials(null, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@test.com",
        password: "password",
      });
      expect(result).toEqual({
        success: true,
        message: "Signed in successfully",
        fieldErrors: null,
        generalError: null,
        prismaError: null,
        inputs: {},
      });
    });

    it("should throw redirect error when it occurs", async () => {
      const formData = new FormData();
      formData.set("name", "test");
      formData.set("email", "test@test.com");
      formData.set("password", "password");
      formData.set("confirmPassword", "password");

      vi.mocked(signIn).mockRejectedValue(new Error("Redirect error"));
      vi.mocked(isRedirectError).mockReturnValue(true);

      await expect(signUpUser(null, formData)).rejects.toThrow(
        new Error("Redirect error"),
      );
    });
  });

  describe("signOutUser", () => {
    it("should sign out a user", async () => {
      await signOutUser();

      expect(signOut).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return user when provided with a valid ID", async () => {
      const mockUser = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        password: "hashed-password",
        image: null,
        address: {},
        emailVerified: null,
        role: "user",
        paymentMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      const result = await getUserById("user-123");

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user is not found", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(getUserById("non-existent-id")).rejects.toThrow(
        "User not found",
      );

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });
    });
  });
});
