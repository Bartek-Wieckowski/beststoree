describe("Order Details Page - PayPal Payment", () => {
  let orderId: string;
  let testProductId: string;

  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");

    cy.task("db:createUser");

    // Create test product for this test
    cy.task<{ id: string; slug: string; name: string }>(
      "db:createTestProduct"
    ).then((product) => {
      testProductId = product.id;

      cy.visit("/sign-in");
      cy.get('input[name="email"]').clear().type("testCypressUser@example.com");
      cy.get('input[name="password"]').clear().type("123456");
      cy.getByTestId("sign-in-button").click();
      cy.url().should("not.include", "/sign-in");
      cy.url().should("include", "/");
      cy.getByTestId("user-button").should("be.visible");

      // Use test product instead of random product
      cy.getProductCardByName(product.name).click();
      cy.get('[data-testid="add-to-cart-button"]').click();

      cy.visit("/cart");
      cy.get('[data-testid="checkout-button"]').click();

      cy.url().should("include", "/shipping-address");

      cy.get('input[name="fullName"]').clear().type("Jan Kowalski");
      cy.get('input[name="streetAddress"]').clear().type("ul. Testowa 123");
      cy.get('input[name="city"]').clear().type("Warszawa");
      cy.get('input[name="postalCode"]').clear().type("00-001");
      cy.get('input[name="country"]').clear().type("Polska");
      cy.get('[data-testid="continue-button"]').click();

      cy.url().should("include", "/payment-method");

      cy.get('[data-testid="payment-method-paypal"]').click();
      cy.get('[data-testid="continue-payment-button"]').click();

      cy.url().should("include", "/place-order");

      cy.get('[data-testid="place-order-button"]').click();

      cy.url()
        .should("match", /\/order\/([a-zA-Z0-9-]+)/)
        .then((url) => {
          const match = url.match(/\/order\/([a-zA-Z0-9-]+)/);
          if (match) {
            orderId = match[1];
          }
        });
    });
  });

  afterEach(() => {
    // Clean up test product if it was created
    if (testProductId) {
      cy.task("db:deleteTestProduct", testProductId);
    }
    cy.task("db:cleanup");
  });

  it("should display order as not paid initially", () => {
    cy.url().should("match", /\/order\/[a-zA-Z0-9-]+/);
    cy.url().should("not.include", "/sign-in");

    cy.contains("Order").should("be.visible");
    cy.contains("Payment Method").should("be.visible");
    cy.contains("PayPal").should("be.visible");

    cy.get('[data-testid="not-paid-badge"]').should("be.visible");
    cy.get('[data-testid="not-paid-badge"]').should("contain", "Not paid");

    cy.get('[data-testid="paid-badge"]').should("not.exist");

    cy.get('[data-testid="paypal-payment-container"]').should("be.visible");
  });

  it("should display paid date after successful PayPal payment", () => {
    cy.url().should("match", /\/order\/[a-zA-Z0-9-]+/);
    cy.url().should("not.include", "/sign-in");

    cy.get('[data-testid="not-paid-badge"]').should("be.visible");

    cy.task("db:updateOrderToPaid", orderId).then((result) => {
      expect(result).to.have.property("success", true);
    });

    cy.reload();

    cy.get('[data-testid="paid-badge"]', { timeout: 5000 })
      .should("be.visible")
      .should("contain", "Paid at");

    cy.get('[data-testid="not-paid-badge"]').should("not.exist");

    cy.get('[data-testid="paypal-payment-container"]').should("not.exist");

    cy.get('[data-testid="paid-badge"]').then(($badge) => {
      const badgeText = $badge.text();
      expect(badgeText).to.match(/Paid at .+/);
      expect(badgeText).to.include("Paid at");
    });
  });

  it("should show correct payment method and order details after payment", () => {
    cy.url().should("match", /\/order\/[a-zA-Z0-9-]+/);
    cy.url().should("not.include", "/sign-in");
    cy.task("db:updateOrderToPaid", orderId);

    cy.reload();

    cy.contains("Payment Method").should("be.visible");
    cy.contains("PayPal").should("be.visible");

    cy.get('[data-testid="paid-badge"]')
      .should("be.visible")
      .should("contain", "Paid at");

    cy.contains("Shipping Address").should("be.visible");
    cy.contains("Order Items").should("be.visible");
    cy.contains("Items").should("be.visible");
    cy.contains("Tax").should("be.visible");
    cy.contains("Shipping").should("be.visible");
    cy.contains("Total").should("be.visible");
  });
});
