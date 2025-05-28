"use server";

import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hash } from "../encrypt";
import { prisma } from "../prisma";
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
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
