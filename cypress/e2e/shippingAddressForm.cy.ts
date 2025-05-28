describe("Shipping Address Form", () => {
  beforeEach(() => {
    cy.task("db:reset");
    cy.task("db:seed");

    cy.login();

    cy.visit("/sign-in");
    cy.get('input[name="email"]').clear().type("testCypressUser@example.com");
    cy.get('input[name="password"]').clear().type("123456");
    cy.getByTestId("sign-in-button").click();
    cy.visit("/");
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-button"]').click();

    cy.visit("/cart");
    cy.get('[data-testid="checkout-button"]').click();

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
