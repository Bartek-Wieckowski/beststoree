const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "bestStoree";
const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern ecommerce platfrom";
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};

const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export {
  APP_NAME,
  APP_DESCRIPTION,
  SERVER_URL,
  LATEST_PRODUCTS_LIMIT,
  signInDefaultValues,
  signUpDefaultValues,
  shippingAddressDefaultValues,
  PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
};
