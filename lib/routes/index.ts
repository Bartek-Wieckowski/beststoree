const ROUTES = {
    HOME: '/',  
    CART: '/cart',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    PRODUCT: (slug: string) => `/product/${slug}`,
}

export default ROUTES;