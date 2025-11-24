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

const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};

const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export {
  APP_NAME,
  APP_DESCRIPTION,
  SERVER_URL,
  LATEST_PRODUCTS_LIMIT,
  signInDefaultValues,
  signUpDefaultValues,
  shippingAddressDefaultValues,
  productDefaultValues,
  reviewFormDefaultValues,
  PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
  PAGE_SIZE,
  NUMBER_FORMATTER,
  USER_ROLES,
};
