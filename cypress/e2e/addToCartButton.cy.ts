describe("Add To Cart Button", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  it("should show success toast when item is added to cart", () => {
    cy.visit("/");

    // Wait for product cards to load
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Click on available product card and wait for redirect
    cy.getAvailableProductCard().click();

    // Wait for redirect to product page with increased timeout for CI
    cy.url({ timeout: 15000 }).should("include", "/product/");

    // Wait for page to fully load and button to be visible
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 10000 })
      .should("be.visible")
      .click();

    // Wait for toast to appear
    cy.get('[role="status"]', { timeout: 10000 })
      .should("exist")
      .should("be.visible");
  });
});
