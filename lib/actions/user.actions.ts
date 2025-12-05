"use server";

import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { compare, hash } from "../encrypt";
import { prisma } from "../prisma";
import {
  changePasswordSchema,
  paymentMethodSchema,
  resetPasswordSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../validators";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import z from "zod";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { getMyCart } from "./cart.actions";
import { cookies } from "next/headers";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {
      success: true,
      message: "Signed in successfully",
      fieldErrors: null,
      generalError: null,
      prismaError: null,
      inputs: {},
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    const formattedError = formatError(error);

    return {
      success: false,
      message: "",
      fieldErrors:
        "fieldErrors" in formattedError ? formattedError.fieldErrors : null,
      generalError:
        "generalError" in formattedError ? formattedError.generalError : null,
      prismaError:
        "prismaError" in formattedError ? formattedError.prismaError : null,
      inputs: { email: formData.get("email") },
    };
  }
}

export async function signOutUser() {
  const currentCart = await getMyCart();
  if (currentCart) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  }
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassowrd = user.password;

    user.password = await hash(user.password);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassowrd,
    });

    return {
      success: true,
      message: "User registered successfully",
      fieldErrors: null,
      generalError: null,
      prismaError: null,
      inputs: {},
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    const formattedError = formatError(error);

    return {
      success: false,
      message: "",
      fieldErrors:
        "fieldErrors" in formattedError ? formattedError.fieldErrors : null,
      generalError:
        "generalError" in formattedError ? formattedError.generalError : null,
      prismaError:
        "prismaError" in formattedError ? formattedError.prismaError : null,
      inputs: {
        name: formData.get("name"),
        email: formData.get("email"),
      },
    };
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath(ROUTES.ADMIN_USERS);

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    let errorMessage: string;

    if ("generalError" in formattedError) {
      errorMessage = formattedError.generalError;
    } else if ("prismaError" in formattedError) {
      errorMessage = formattedError.prismaError.message;
    } else if ("message" in formattedError) {
      errorMessage = formattedError.message;
    } else if ("fieldErrors" in formattedError && formattedError.fieldErrors) {
      errorMessage = Object.values(formattedError.fieldErrors)
        .flat()
        .join(", ");
    } else {
      errorMessage = "An error occurred";
    }

    return { success: false, message: errorMessage };
  }
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath(ROUTES.ADMIN_USERS);

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function changePassword(
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    if (!currentUser.password) {
      return {
        success: false,
        message: "User does not have a password set",
      };
    }

    const validatedData = changePasswordSchema.parse(data);

    const isCurrentPasswordValid = await compare(
      validatedData.currentPassword,
      currentUser.password as string
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    const hashedNewPassword = await hash(validatedData.newPassword);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: hashedNewPassword },
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    let errorMessage: string;

    if ("generalError" in formattedError) {
      errorMessage = formattedError.generalError;
    } else if ("prismaError" in formattedError) {
      errorMessage = formattedError.prismaError.message;
    } else if ("message" in formattedError) {
      errorMessage = formattedError.message;
    } else if ("fieldErrors" in formattedError && formattedError.fieldErrors) {
      errorMessage = Object.values(formattedError.fieldErrors)
        .flat()
        .join(", ");
    } else {
      errorMessage = "An error occurred";
    }

    return { success: false, message: errorMessage };
  }
}

export async function resetUserPassword(
  userId: string,
  data: z.infer<typeof resetPasswordSchema>
) {
  try {
    const validatedData = resetPasswordSchema.parse(data);

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    const hashedNewPassword = await hash(validatedData.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    revalidatePath(ROUTES.ADMIN_USERS);

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    let errorMessage: string;

    if ("generalError" in formattedError) {
      errorMessage = formattedError.generalError;
    } else if ("prismaError" in formattedError) {
      errorMessage = formattedError.prismaError.message;
    } else if ("message" in formattedError) {
      errorMessage = formattedError.message;
    } else if ("fieldErrors" in formattedError && formattedError.fieldErrors) {
      errorMessage = Object.values(formattedError.fieldErrors)
        .flat()
        .join(", ");
    } else {
      errorMessage = "An error occurred";
    }

    return { success: false, message: errorMessage };
  }
}

export async function deleteMyAccount() {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const currentCart = await getMyCart();
    if (currentCart) {
      await prisma.cart.delete({ where: { id: currentCart.id } });
    }

    await prisma.user.delete({ where: { id: currentUser.id } });

    // Clear sessionCartId cookie before signing out
    const cookiesObject = await cookies();
    const sessionCartIdCookie = cookiesObject.get("sessionCartId");
    if (sessionCartIdCookie) {
      cookiesObject.delete("sessionCartId");
    }

    await signOut();

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    const formattedError = formatError(error);
    let errorMessage: string;

    if ("generalError" in formattedError) {
      errorMessage = formattedError.generalError;
    } else if ("prismaError" in formattedError) {
      errorMessage = formattedError.prismaError.message;
    } else if ("message" in formattedError) {
      errorMessage = formattedError.message;
    } else if ("fieldErrors" in formattedError && formattedError.fieldErrors) {
      errorMessage = Object.values(formattedError.fieldErrors)
        .flat()
        .join(", ");
    } else {
      errorMessage = "An error occurred";
    }

    return { success: false, message: errorMessage };
  }
}
