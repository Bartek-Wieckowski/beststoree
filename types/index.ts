import { z } from "zod";
import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
} from "@/lib/validators";

export type FormattedError =
  | {
      fieldErrors?: Record<string, string[]>;
    }
  | {
      prismaError: { code: string; message: string };
    }
  | {
      generalError: string;
    }
  | { message: string };

type ActionResponse = {
  success: boolean;
  fieldErrors: Record<string, string[]> | null;
  message: string;
  generalError: string | null;
  prismaError: { code: string; message: string } | null;
};

export type SignUpActionResponse = ActionResponse & {
  inputs: {
    name: string;
    email: string;
  };
};

export type SignInActionResponse = ActionResponse & {
  inputs: {
    email: string;
  };
};

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type TestCypressUser = {
  id: string;
  email: string;
  name: string;
};
