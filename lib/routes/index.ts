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
  USER_PROFILE: "/user/profile",
  USER_ORDERS: "/user/orders",
  ADMIN_OVERVIEW: "/admin/overview",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  UNAUTHORIZED: "/unauthorized",
};

export default ROUTES;
