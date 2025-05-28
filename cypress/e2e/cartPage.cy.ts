describe("Cart Operations", () => {
  beforeEach(() => {
    cy.task("db:reset");
    cy.task("db:seed");
    cy.visit("/");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  it("should add product to cart and update quantity", () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-button"]').click();
    cy.get("table").should("contain", "Quantity");
    cy.get('[data-testid="increase-quantity"]').click();
    cy.get('[data-testid="quantity"]').should("contain", "2");
  });

  describe("Checkout Process", () => {
    beforeEach(() => {
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="add-to-cart-button"]').click();
      cy.visit("/cart");
    });

    it("should redirect to login when user is not authenticated", () => {
      cy.get('[data-testid="checkout-button"]').click();
      cy.url().should("include", "/sign-in");
    });

    it("should redirect to shipping address when user is authenticated", () => {
      cy.get('[data-testid="checkout-button"]').click();
      cy.login(); // custom command for authentication

      cy.get('input[name="email"]').clear().type("testCypressUser@example.com");
      cy.get('input[name="password"]').clear().type("123456");
      cy.getByTestId("sign-in-button").click();

      cy.url().should("include", "/shipping-address");
    });
  });
});
