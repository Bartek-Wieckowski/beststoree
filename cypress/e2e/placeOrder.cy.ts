describe("Place Order Flow", () => {
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
      cy.get('input[name="email"]')
        .clear()
        .type("testCypressUser@example.com");
      cy.get('input[name="password"]').clear().type("123456");
      cy.getByTestId("sign-in-button").click();
      cy.url().should("not.include", "/sign-in");
      cy.url().should("include", "/");
      cy.getByTestId("user-button").should("be.visible");

      // Use test product instead of random product
      cy.getProductCardByName(product.name).click();
      cy.get('[data-testid="add-to-cart-button"]').click();

      cy.visit("/cart");
      
      // Wait for cart page to load and verify checkout button is available
      cy.url().should("include", "/cart");
      cy.get("table", { timeout: 10000 }).should("be.visible");
      cy.get('[data-testid="checkout-button"]', { timeout: 10000 }).should("be.visible").click();

      cy.url().should("include", "/shipping-address");

      cy.get('input[name="fullName"]').clear().type("Jan Kowalski");
      cy.get('input[name="streetAddress"]').clear().type("ul. Testowa 123");
      cy.get('input[name="city"]').clear().type("Warszawa");
      cy.get('input[name="postalCode"]').clear().type("00-001");
      cy.get('input[name="country"]').clear().type("Polska");
      cy.get('[data-testid="continue-button"]').click();

      cy.url().should("include", "/payment-method");
    });
  });

  afterEach(() => {
    // Clean up test product if it was created
    if (testProductId) {
      cy.task("db:deleteTestProduct", testProductId);
    }
    cy.task("db:cleanup");
  });

  describe("PayPal Payment Method Flow", () => {
    it("should complete place order flow with PayPal and show PayPal gateway", () => {
      cy.visit("/payment-method");
      cy.url().should("include", "/payment-method");
      cy.get('[data-testid="payment-method-paypal"]').click();
      cy.get('[data-testid="continue-payment-button"]').click();

      cy.url().should("include", "/place-order");
      cy.contains("Place Order").should("be.visible");
      cy.contains("Shipping Address").should("be.visible");
      cy.contains("Payment Method").should("be.visible");
      cy.contains("Order Items").should("be.visible");
      cy.contains("PayPal").should("be.visible");

      cy.get('[data-testid="place-order-button"]').should("be.visible").click();

      // Verify redirect to order page
      cy.url().should("match", /\/order\/[a-zA-Z0-9-]+/);

      // Verify order page content
      cy.contains("Order").should("be.visible");
      cy.contains("Payment Method").should("be.visible");
      cy.contains("PayPal").should("be.visible");
      cy.contains("Not paid").should("be.visible");

      // Verify PayPal payment container is visible
      cy.get('[data-testid="paypal-payment-container"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");

      // Verify PayPal buttons are visible (PayPal renders in iframe)
      // PayPal buttons are rendered in an iframe, so we check for the iframe
      // Wait for PayPal to load - it may show "Loading PayPal..." first
      cy.contains(/Loading PayPal|PayPal/, { timeout: 10000 }).should("exist");

      // Check for PayPal iframe (PayPal buttons render in an iframe)
      cy.get(
        "iframe[src*='paypal'], iframe[title*='PayPal'], iframe[id*='paypal']",
        { timeout: 10000 }
      )
        .should("exist")
        .should("be.visible");
    });
  });

  describe("CashOnDelivery Payment Method Flow", () => {
    it("should complete place order flow with CashOnDelivery and redirect to order page", () => {
      cy.visit("/payment-method");
      cy.url().should("include", "/payment-method");
      cy.url().should("not.include", "/sign-in");
      cy.get('[data-testid="payment-method-cashondelivery"]').click();
      cy.get('[data-testid="continue-payment-button"]').click();

      // Verify place-order page is visible
      cy.url().should("include", "/place-order");
      cy.contains("Place Order").should("be.visible");
      cy.contains("Shipping Address").should("be.visible");
      cy.contains("Payment Method").should("be.visible");
      cy.contains("Order Items").should("be.visible");
      cy.contains("CashOnDelivery").should("be.visible");

      // Click place order button
      cy.get('[data-testid="place-order-button"]').should("be.visible").click();

      // Wait for order creation and redirect to order page
      // Increased timeout as order creation may take time
      cy.url({ timeout: 15000 }).should("match", /\/order\/[a-zA-Z0-9-]+/);

      // Verify order page content
      cy.contains("Order").should("be.visible");
      cy.contains("Payment Method").should("be.visible");
      cy.contains("CashOnDelivery").should("be.visible");
      cy.contains("Not paid").should("be.visible");

      // Verify PayPal payment container is NOT visible for CashOnDelivery
      cy.get('[data-testid="paypal-payment-container"]').should("not.exist");

      // Verify PayPal buttons are NOT visible for CashOnDelivery
      // PayPal buttons should not be rendered when payment method is CashOnDelivery
      // Wait a bit to ensure PayPal would have loaded if it was going to
      cy.wait(2000);

      // Verify no PayPal iframe exists
      cy.get("body").then(($body) => {
        // For CashOnDelivery, PayPal buttons should not be present
        const paypalIframes = $body.find(
          'iframe[src*="paypal"], iframe[title*="PayPal"]'
        ).length;
        expect(paypalIframes).to.equal(0);
      });

      // Verify no PayPal loading state
      cy.contains("Loading PayPal").should("not.exist");
    });
  });
});
