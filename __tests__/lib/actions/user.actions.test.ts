import {
  deleteUser,
  getAllUsers,
  getUserById,
  signInWithCredentials,
  signOutUser,
  signUpUser,
  updateProfile,
  updateUser,
} from "@/lib/actions/user.actions";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import sampleData from "@/db/sample-data";
import { revalidatePath } from "next/cache";
import ROUTES from "@/lib/routes";
import { getMyCart } from "@/lib/actions/cart.actions";

vi.mock("next/dist/client/components/redirect-error", () => ({
  isRedirectError: vi.fn(),
}));

vi.mock("@/lib/actions/cart.actions", () => ({
  getMyCart: vi.fn(),
}));

describe("User Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signInWithCredentials()", () => {
    it("should sign in a user with valid credentials", async () => {
      const formData = new FormData();
      formData.set("email", "test@example.com");
      formData.set("password", "password");

      vi.mocked(signIn).mockResolvedValue(undefined);

      const result = await signInWithCredentials(null, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
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
      formData.set("email", "test@example.com");
      formData.set("password", "wrong_password");

      vi.mocked(signIn).mockRejectedValue(new Error("Invalid credentials"));
      vi.mocked(isRedirectError).mockReturnValue(false);

      const result = await signInWithCredentials(null, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "wrong_password",
      });
      expect(result).toEqual({
        success: false,
        message: "",
        fieldErrors: null,
        generalError: "Invalid credentials",
        prismaError: null,
        inputs: { email: "test@example.com" },
      });
    });

    it("should throw redirect error when it occurs", async () => {
      const formData = new FormData();
      formData.set("email", "test@example.com");
      formData.set("password", "password");

      const redirectError = new Error("Redirect error");

      vi.mocked(signIn).mockRejectedValue(redirectError);
      vi.mocked(isRedirectError).mockReturnValue(true);

      await expect(signInWithCredentials(null, formData)).rejects.toThrow(
        redirectError
      );

      expect(isRedirectError).toHaveBeenCalledWith(redirectError);
    });
  });

  describe("signUpUser()", () => {
    it("should sign up a user with valid credentials", async () => {
      const formData = new FormData();
      formData.set("name", "test");
      formData.set("email", "test@example.com");
      formData.set("password", "password");
      formData.set("confirmPassword", "password");

      vi.mocked(signIn).mockResolvedValue(undefined);

      const result = await signInWithCredentials(null, formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
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
      formData.set("email", "test@example.com");
      formData.set("password", "password");
      formData.set("confirmPassword", "password");

      vi.mocked(signIn).mockRejectedValue(new Error("Redirect error"));
      vi.mocked(isRedirectError).mockReturnValue(true);

      await expect(signUpUser(null, formData)).rejects.toThrow(
        new Error("Redirect error")
      );
    });
  });

  describe("signOutUser()", () => {
    it("should sign out a user and delete cart", async () => {
      const mockCart = {
        id: "cart-123",
        items: [],
        itemsPrice: "0",
        totalPrice: "0",
        shippingPrice: "0",
        taxPrice: "0",
      };

      (getMyCart as Mock).mockResolvedValue(mockCart);
      (prisma.cart.delete as Mock).mockResolvedValue(mockCart);
      (signOut as Mock).mockResolvedValue(undefined);

      await signOutUser();

      expect(getMyCart).toHaveBeenCalled();
      expect(prisma.cart.delete).toHaveBeenCalledWith({
        where: { id: mockCart.id },
      });
      expect(signOut).toHaveBeenCalled();
    });
  });

  describe("getUserById()", () => {
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

      (prisma.user.findFirst as Mock).mockResolvedValue(mockUser);

      const result = await getUserById("user-123");

      expect(prisma.user.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw error when user is not found", async () => {
      (prisma.user.findFirst as Mock).mockResolvedValue(null);

      await expect(getUserById("non-existent-id")).rejects.toThrow(
        "User not found"
      );

      expect(prisma.user.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });
    });
  });

  describe("updateProfile()", () => {
    it("should update a user's profile", async () => {
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

      (auth as Mock).mockResolvedValue({
        user: { id: "user-123" },
      } as Session);
      (prisma.user.findFirst as Mock).mockResolvedValue(mockUser);
      (prisma.user.update as Mock).mockResolvedValue({
        ...mockUser,
        name: "test",
      });

      const result = await updateProfile({
        name: "test",
        email: "test@example.com",
      });

      expect(result).toEqual({
        success: true,
        message: "User updated successfully",
      });
    });

    it("should return error when user is not found", async () => {
      (auth as Mock).mockResolvedValue({
        user: { id: "user-123" },
      } as Session);
      (prisma.user.findFirst as Mock).mockResolvedValue(null);

      const result = await updateProfile({
        name: "test",
        email: "test@example.com",
      });

      expect(result).toEqual({
        success: false,
        message: { generalError: "User not found" },
      });
    });
  });

  describe("getAllUsers()", () => {
    it("should return all users with pagination", async () => {
      const users = sampleData.users;
      const prismaUsers = users.map((user, index) => ({
        id: `user-${index + 1}`,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        image: null,
        address: {},
        emailVerified: null,
        paymentMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const limit = 10;
      const totalCount = users.length;
      const expectedTotalPages = Math.ceil(totalCount / limit);

      (prisma.user.findMany as Mock).mockResolvedValue(prismaUsers);
      (prisma.user.count as Mock).mockResolvedValue(totalCount);

      const result = await getAllUsers({
        query: "",
        page: 1,
        limit,
      });

      // Verify Prisma calls
      expect(prisma.user.findMany as Mock).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: 0,
      });
      expect(prisma.user.count as Mock).toHaveBeenCalled();

      // Verify result
      expect(result).toEqual({
        data: prismaUsers,
        totalPages: expectedTotalPages,
      });
    });

    it("should filter users by query", async () => {
      const filteredUsers = [
        {
          id: "user-1",
          name: "John",
          email: "admin@example.com",
          password: "123456",
          role: "admin",
          image: null,
          address: {},
          emailVerified: null,
          paymentMethod: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.user.findMany as Mock).mockResolvedValue(filteredUsers);
      (prisma.user.count as Mock).mockResolvedValue(1);

      const result = await getAllUsers({
        query: "John",
        page: 1,
        limit: 10,
      });

      expect(prisma.user.findMany as Mock).toHaveBeenCalledWith({
        where: {
          name: {
            contains: "John",
            mode: "insensitive",
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        skip: 0,
      });

      expect(result.data).toEqual(filteredUsers);
    });

    it("should handle pagination correctly", async () => {
      const limit = 2;
      const page = 2;

      (prisma.user.findMany as Mock).mockResolvedValue([]);
      (prisma.user.count as Mock).mockResolvedValue(5);

      await getAllUsers({
        query: "",
        page,
        limit,
      });

      expect(prisma.user.findMany as Mock).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit, // should be 2
      });
    });

    it("should handle query 'all' as empty filter", async () => {
      (prisma.user.findMany as Mock).mockResolvedValue([]);
      (prisma.user.count as Mock).mockResolvedValue(0);

      await getAllUsers({
        query: "all",
        page: 1,
        limit: 10,
      });

      expect(prisma.user.findMany as Mock).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        take: 10,
        skip: 0,
      });
    });
  });

  describe("deleteUser()", () => {
    it("should delete user successfully", async () => {
      const userId = "user-123";
      const deletedUser = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        password: null,
        image: null,
        address: {},
        emailVerified: null,
        role: "user",
        paymentMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.delete as Mock).mockResolvedValue(deletedUser);

      const result = await deleteUser(userId);

      expect(prisma.user.delete as Mock).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(revalidatePath).toHaveBeenCalledWith(ROUTES.ADMIN_USERS);
      expect(result).toEqual({
        success: true,
        message: "User deleted successfully",
      });
    });

    it("should return error when deletion fails", async () => {
      const userId = "user-123";
      const dbError = new Error("Database error");
      (prisma.user.delete as Mock).mockRejectedValue(dbError);

      const result = await deleteUser(userId);

      expect(prisma.user.delete as Mock).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe("updateUser()", () => {
    it("should update a user successfully", async () => {
      const userId = "user-123";
      const updatedUser = {
        id: userId,
        name: "First User Name",
        email: "test@example.com",
        password: null,
        image: null,
        address: {},
        emailVerified: null,
        role: "admin",
        paymentMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.update as Mock).mockResolvedValue(updatedUser);

      const result = await updateUser({
        id: userId,
        name: "Updated User",
        email: "test@example.com",
        role: "user",
      });

      // Funkcja aktualizuje tylko name i role (nie email)
      expect(prisma.user.update as Mock).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: "Updated User",
          role: "user",
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith(ROUTES.ADMIN_USERS);
      expect(result).toEqual({
        success: true,
        message: "User updated successfully",
      });
    });

    it("should return error when update fails", async () => {
      const userId = "user-123";
      const dbError = new Error("Database error");
      (prisma.user.update as Mock).mockRejectedValue(dbError);

      const result = await updateUser({
        id: userId,
        name: "Updated User",
        email: "test@example.com",
        role: "admin",
      });

      expect(prisma.user.update as Mock).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          name: "Updated User",
          role: "admin",
        },
      });
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
