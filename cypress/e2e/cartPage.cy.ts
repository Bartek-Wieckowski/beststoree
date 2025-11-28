describe("Cart Operations", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");
    cy.visit("/");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  it("should add product to cart and update quantity", () => {
    cy.getAvailableProductCard().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-button"]').click();
    
    // Wait for cart page to load and table to appear
    cy.url().should("include", "/cart");
    cy.get("table", { timeout: 10000 }).should("be.visible").should("contain", "Quantity");
    
    cy.get('[data-testid="increase-quantity"]').click();
    cy.get('[data-testid="quantity"]').should("contain", "2");
  });

  describe("Checkout Process", () => {
    beforeEach(() => {
      cy.getAvailableProductCard().click();
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.visit("/cart");
      
      // Wait for cart page to load and verify items are in cart
      cy.url().should("include", "/cart");
      cy.get("table", { timeout: 10000 }).should("be.visible");
    });

    it("should redirect to login when user is not authenticated", () => {
      cy.get('[data-testid="checkout-button"]', { timeout: 10000 }).should("be.visible").click();
      cy.url().should("include", "/sign-in");
    });

    it("should redirect to shipping address when user is authenticated", () => {
      // Verify cart has items before checkout
      cy.get("table").should("contain", "Quantity");
      cy.get('[data-testid="checkout-button"]').should("be.visible");

      // Get sessionCartId cookie before checkout
      cy.getCookie("sessionCartId")
        .should("exist")
        .then((cookie) => {
          const sessionCartId = cookie?.value;
          if (!sessionCartId) {
            throw new Error("sessionCartId cookie not found");
          }

          // Create user before checkout
          cy.task("db:createUser");

          // Click checkout button - should redirect to sign-in
          cy.get('[data-testid="checkout-button"]').click();
          cy.url().should("include", "/sign-in");

          // Verify sessionCartId cookie is still present
          cy.getCookie("sessionCartId")
            .should("exist")
            .and("have.property", "value", sessionCartId);

          // Login
          cy.get('input[name="email"]')
            .clear()
            .type("testCypressUser@example.com");
          cy.get('input[name="password"]').clear().type("123456");
          cy.getByTestId("sign-in-button").click();

          // Wait for redirect and cart merge to complete
          // After login, cart should be merged and user should be redirected to shipping-address
          cy.url({ timeout: 10000 }).should("include", "/shipping-address");
        });
    });
  });
});
