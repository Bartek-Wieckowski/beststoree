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
  ADMIN_PRODUCTS_CREATE: "/admin/products/create",
  ADMIN_PRODUCTS_EDIT: (id: string) => `/admin/products/${id}`,
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_USERS_EDIT: (id: string) => `/admin/users/${id}`,
  UNAUTHORIZED: "/unauthorized",
  CATEGORY: (category: string) => `/search?category=${category}`,
};

export default ROUTES;
