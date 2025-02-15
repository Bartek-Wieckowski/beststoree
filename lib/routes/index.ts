const ROUTES = {
    HOME: '/',  
    CART: '/cart',
    SIGN_IN: '/sign-in',
    PRODUCT: (slug: string) => `/product/${slug}`,
}

export default ROUTES;