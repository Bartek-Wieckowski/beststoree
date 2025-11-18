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
    cy.getAvailableProductCard().click();
    cy.url().should("include", "/product/");
    cy.getByTestId("add-to-cart-button").should("be.visible");
    cy.getByTestId("add-to-cart-button").click();
    cy.get('[role="status"]', { timeout: 5000 })
      .should("exist")
      .should("be.visible");
  });
});
