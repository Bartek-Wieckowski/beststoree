describe("Admin Orders Page", () => {
  let testOrderId: string;
  let testProductId: string;

  beforeEach(() => {
    cy.clearCookies();
    cy.task("db:reset");
    cy.task("db:seed");

    // Create admin user and test order
    cy.task<{ id: string; email: string; name: string }>(
      "db:createAdminUser"
    ).then((adminUser) => {
      // Create test order with test product
      cy.task<{ orderId: string; productId: string }>(
        "db:createTestOrder",
        adminUser.id
      ).then((orderData) => {
        testOrderId = orderData.orderId;
        testProductId = orderData.productId;

        // Login as admin
        cy.visit("/sign-in");
        cy.get('input[name="email"]')
          .clear()
          .type("testCypressAdmin@example.com");
        cy.get('input[name="password"]').clear().type("123456");
        cy.getByTestId("sign-in-button").click();
        cy.url().should("not.include", "/sign-in");
        cy.url().should("include", "/");
        cy.getByTestId("user-button").should("be.visible");

        // Navigate directly to order details page
        cy.visit(`/order/${testOrderId}`);
      });
    });
  });

  afterEach(() => {
    // Clean up test order and product
    if (testOrderId) {
      cy.task("db:deleteTestOrder", testOrderId);
    }
    if (testProductId) {
      cy.task("db:deleteTestProduct", testProductId);
    }
    cy.task("db:cleanup");
  });

  it("should allow admin to mark Cash On Delivery order as paid and delivered", () => {
    cy.url().should("include", `/order/${testOrderId}`);
    cy.url().should("not.include", "/sign-in");

    cy.contains("Order").should("be.visible");
    cy.contains("Payment Method").should("be.visible");
    cy.contains("CashOnDelivery").should("be.visible");

    // Verify order is initially not paid
    cy.get('[data-testid="not-paid-badge"]').should("be.visible");
    cy.get('[data-testid="not-paid-badge"]').should("contain", "Not paid");
    cy.get('[data-testid="paid-badge"]').should("not.exist");

    // Verify "Mark As Paid" button is visible for admin
    cy.getByTestId("mark-as-paid-button")
      .should("be.visible")
      .should("contain", "Mark As Paid");

    // Click "Mark As Paid" button
    cy.getByTestId("mark-as-paid-button").click();

    // Wait for the update to complete and page to refresh/update
    cy.get('[data-testid="paid-badge"]', { timeout: 5000 })
      .should("be.visible")
      .should("contain", "Paid at");

    // Verify "Not paid" badge is gone
    cy.get('[data-testid="not-paid-badge"]').should("not.exist");

    // Verify "Mark As Delivered" button is now visible
    cy.getByTestId("mark-as-delivered-button")
      .should("be.visible")
      .should("contain", "Mark As Delivered");

    // Verify order is not delivered yet
    cy.contains("Not Delivered").should("be.visible");

    // Click "Mark As Delivered" button
    cy.getByTestId("mark-as-delivered-button").click();

    // Wait for the update to complete
    cy.contains("Delivered at", { timeout: 5000 }).should("be.visible");

    // Verify "Not Delivered" badge is gone
    cy.contains("Not Delivered").should("not.exist");

    // Verify both badges show correct status
    cy.get('[data-testid="paid-badge"]')
      .should("be.visible")
      .should("contain", "Paid at");

    cy.contains("Delivered at").should("be.visible");

    // Verify buttons are no longer visible after order is completed
    cy.getByTestId("mark-as-paid-button").should("not.exist");
    cy.getByTestId("mark-as-delivered-button").should("not.exist");
  });
});
