import { z } from "zod";
import { formatNumberWithDecimals } from "./utils";
import { PAYMENT_METHODS } from "./constants";
import CONTENT_PAGE from "./content-page";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimals(Number(value))),
    CONTENT_PAGE.GLOBAL.priceDecimalPlaces
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, CONTENT_PAGE.GLOBAL.nameMinLength),
  slug: z.string().min(3, CONTENT_PAGE.GLOBAL.slugMinLength),
  categoryId: z.string().min(1, CONTENT_PAGE.GLOBAL.categoryRequired),
  brand: z.string().min(3, CONTENT_PAGE.GLOBAL.brandMinLength),
  description: z.string().min(3, CONTENT_PAGE.GLOBAL.descriptionMinLength),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, CONTENT_PAGE.GLOBAL.productImageRequired),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  hasVariants: z.boolean().default(false),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
});

export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, CONTENT_PAGE.GLOBAL.idRequired),
  imagesToBeDeleted: z.array(z.string()).optional(),
  bannerToBeDeleted: z.string().nullable().optional(),
});

export const signInFormSchema = z.object({
  email: z.string().email(CONTENT_PAGE.GLOBAL.invalidEmail),
  password: z.string().min(6, CONTENT_PAGE.GLOBAL.passwordMinLength),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, CONTENT_PAGE.GLOBAL.nameMinLength),
    email: z.string().email(CONTENT_PAGE.GLOBAL.invalidEmail),
    password: z.string().min(6, CONTENT_PAGE.GLOBAL.passwordMinLength),
    confirmPassword: z
      .string()
      .min(6, CONTENT_PAGE.GLOBAL.confirmPasswordMinLength),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: CONTENT_PAGE.GLOBAL.passwordsDontMatch,
    path: ["confirmPassword"],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, CONTENT_PAGE.GLOBAL.productRequired),
  name: z.string().min(1, CONTENT_PAGE.GLOBAL.nameRequired),
  slug: z.string().min(1, CONTENT_PAGE.GLOBAL.slugRequired),
  qty: z.number().int().nonnegative(CONTENT_PAGE.GLOBAL.quantityPositive),
  image: z.string().min(1, CONTENT_PAGE.GLOBAL.imageRequired),
  price: currency,
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, CONTENT_PAGE.GLOBAL.sessionCartIdRequired),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, CONTENT_PAGE.GLOBAL.nameMinLength),
  streetAddress: z.string().min(3, CONTENT_PAGE.GLOBAL.addressMinLength),
  city: z.string().min(3, CONTENT_PAGE.GLOBAL.cityMinLength),
  postalCode: z.string().min(3, CONTENT_PAGE.GLOBAL.postalCodeMinLength),
  country: z.string().min(3, CONTENT_PAGE.GLOBAL.countryMinLength),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, CONTENT_PAGE.GLOBAL.paymentMethodRequired),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: CONTENT_PAGE.GLOBAL.invalidPaymentMethod,
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, CONTENT_PAGE.GLOBAL.userRequired),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: CONTENT_PAGE.GLOBAL.invalidPaymentMethod,
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, CONTENT_PAGE.GLOBAL.nameMinLength),
  email: z.string().min(3, CONTENT_PAGE.GLOBAL.emailMinLength),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, CONTENT_PAGE.GLOBAL.idRequired),
  role: z.string().min(1, CONTENT_PAGE.GLOBAL.roleRequired),
});

export const insertReviewSchema = z.object({
  title: z.string().min(3, CONTENT_PAGE.GLOBAL.titleMinLength),
  description: z.string().min(3, CONTENT_PAGE.GLOBAL.descriptionMinLength),
  productId: z.string().min(1, CONTENT_PAGE.GLOBAL.productRequired),
  userId: z.string().min(1, CONTENT_PAGE.GLOBAL.userRequired),
  rating: z.coerce
    .number()
    .int()
    .min(1, CONTENT_PAGE.GLOBAL.ratingMin)
    .max(5, CONTENT_PAGE.GLOBAL.ratingMax),
});

export const insertCategorySchema = z.object({
  name: z.string().min(3, CONTENT_PAGE.GLOBAL.nameMinLength),
  slug: z.string().min(3, CONTENT_PAGE.GLOBAL.slugMinLength),
  icon: z.string().optional().nullable(),
});

export const updateCategorySchema = insertCategorySchema.extend({
  id: z.string().min(1, CONTENT_PAGE.GLOBAL.idRequired),
});

export const insertPromotionSchema = z.object({
  productId: z.string().min(1, CONTENT_PAGE.GLOBAL.productRequired),
  endDate: z.coerce.date({
    required_error: CONTENT_PAGE.GLOBAL.promotionEndDateRequired,
  }),
  discountPercentage: z.coerce
    .number()
    .min(0, CONTENT_PAGE.COMPONENT.PROMOTION_FORM.discountMinValue)
    .max(100, CONTENT_PAGE.COMPONENT.PROMOTION_FORM.discountMaxValue),
  isEnabled: z.boolean().default(true),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, CONTENT_PAGE.GLOBAL.passwordMinLength),
    newPassword: z.string().min(6, CONTENT_PAGE.GLOBAL.passwordMinLength),
    confirmPassword: z
      .string()
      .min(6, CONTENT_PAGE.GLOBAL.confirmPasswordMinLength),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: CONTENT_PAGE.GLOBAL.passwordsDontMatch,
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, CONTENT_PAGE.GLOBAL.passwordMinLength),
    confirmPassword: z
      .string()
      .min(6, CONTENT_PAGE.GLOBAL.confirmPasswordMinLength),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: CONTENT_PAGE.GLOBAL.passwordsDontMatch,
    path: ["confirmPassword"],
  });
