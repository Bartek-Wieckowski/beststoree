const ROUTES = {
  HOME: "/",
  CART: "/cart",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PRODUCT: (slug: string) => `/product/${slug}`,
  SHIPPING_ADDRESS: "/shipping-address",
  PAYMENT_METHOD: "/payment-method",
  PLACE_ORDER: "/place-order",
  ORDER: (id: string) => `/order/${id}`,
};

export default ROUTES;
