describe("Shipping Address Form", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");

    cy.task("db:createUser");

    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressUser@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.url().should("not.include", "/sign-in");
    cy.url().should("include", "/");
    cy.getByTestId("user-button").should("be.visible");
    cy.getAvailableProductCard().click();
    cy.get('[data-testid="add-to-cart-button"]').click();

    cy.visit("/cart");
    
    // Wait for cart page to load and verify checkout button is available
    cy.url().should("include", "/cart");
    cy.get("table", { timeout: 10000 }).should("be.visible");
    cy.get('[data-testid="checkout-button"]', { timeout: 10000 }).should("be.visible").click();

    cy.url().should("include", "/shipping-address");
  });

  afterEach(() => {
    cy.task("db:cleanup");
  });

  describe("updateUserAddress function tests", () => {
    it("should successfully update user address with valid data", () => {
      cy.get('input[name="fullName"]').clear().type("Jan Kowalski");
      cy.get('input[name="streetAddress"]').clear().type("ul. Testowa 123");
      cy.get('input[name="city"]').clear().type("Warszawa");
      cy.get('input[name="postalCode"]').clear().type("00-001");
      cy.get('input[name="country"]').clear().type("Polska");

      cy.get('[data-testid="continue-button"]').should("not.be.disabled");

      cy.get('[data-testid="continue-button"]').click();

      cy.url().should("include", "/payment-method");
    });

    it("should show validation errors for empty required fields", () => {
      cy.get('[data-testid="continue-button"]').click();

      cy.url().should("include", "/shipping-address");

      cy.contains("Required").should("be.visible");
    });

    it("should preserve form data during navigation", () => {
      cy.get('input[name="fullName"]').clear().type("Jan Kowalski");
      cy.get('input[name="streetAddress"]').clear().type("ul. Testowa 123");
      cy.get('input[name="city"]').clear().type("Warszawa");
      cy.get('input[name="postalCode"]').clear().type("00-001");
      cy.get('input[name="country"]').clear().type("Polska");

      cy.get('[data-testid="continue-button"]').should("not.be.disabled");

      cy.get('[data-testid="continue-button"]').click();

      cy.url().should("include", "/payment-method");

      cy.visit("/shipping-address");

      cy.get('input[name="fullName"]').should("have.value", "Jan Kowalski");
    });
  });
});
